from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from services.ml_service import MLModelService
from schemas import FisheryInput, PredictionResponse, ExplanationResponse
import logging
# Assuming generate_reply handles the actual API call to OpenAI/Gemini
import services.gemini_service as gemini_service
from prompt.explain_prompt import construct_fisherman_prompt

# Initialize Blueprint
forecast_bp = Blueprint("forecast_bp", __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- SERVICE INITIALIZATION ---
try:
    ml_service = MLModelService()
    logger.info("✅ ML Service initialized successfully.")
except Exception as e:
    logger.error(f"❌ Critical Error: Failed to initialize ML Service. {e}")
    ml_service = None

# --- HELPER: Pydantic Compatibility ---
def to_dict(pydantic_obj):
    if hasattr(pydantic_obj, 'model_dump'):
        return pydantic_obj.model_dump()
    return pydantic_obj.dict()


# --- ROUTES ---
@forecast_bp.route("/forecast/predict", methods=["POST"])
def predict_landings():
    if not ml_service:
        return jsonify({"error": "Service Unavailable: ML Model failed to load."}), 503
    try:
        input_data = request.get_json(silent=True)
        if not input_data:
            return jsonify({"error": "Invalid or missing JSON body"}), 400
        
        fishery_input = FisheryInput(**input_data)
        prediction = ml_service.predict(to_dict(fishery_input))
        
        response = PredictionResponse(predicted_landings=prediction, status="success")
        return jsonify(to_dict(response)), 200
    
    except ValidationError as ve:
        logger.warning(f"Validation Error: {ve}")
        return jsonify({"error": "Validation Error", "details": ve.errors()}), 422
    except ValueError as ve:
        logger.warning(f"Validation Error: {ve}")
        return jsonify({"error": "Validation Error", "details": str(ve)}), 422
    except Exception as e:
        logger.error(f"Prediction Error: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@forecast_bp.route("/forecast/explain", methods=["POST"])
def explain_prediction():
    if not ml_service:
        return jsonify({"error": "Service Unavailable: ML Model failed to load."}), 503
    try:
        input_data = request.get_json(silent=True)
        if not input_data:
            return jsonify({"error": "Invalid or missing JSON body"}), 400

        fishery_input = FisheryInput(**input_data)
        explanation = ml_service.explain(to_dict(fishery_input))
        
        response = ExplanationResponse(
            base_value=explanation['base_value'],
            top_3_drivers=explanation['top_3_drivers'],
            waterfall_plot=explanation['waterfall_plot'],
            force_plot=explanation['force_plot'],
            status="success"
        )
        return jsonify(to_dict(response)), 200

    except ValueError as ve:
        return jsonify({"error": "Validation Error", "details": str(ve)}), 422
    except KeyError as ke:
        return jsonify({"error": "Explanation Data Error", "details": str(ke)}), 500
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@forecast_bp.route("/forecast/llm_explanation", methods=["POST"])
def generate_llm_explanation():
    """
    Endpoint to generate a fisherman-friendly explanation using an LLM.
    """
    try:
        # 1. Parse Input
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid or missing JSON body"}), 400

        prediction = data.get("prediction")
        drivers = data.get("drivers", [])
        raw_input = data.get("raw_input", {}) 

        if prediction is None:
             return jsonify({"error": "Missing 'prediction' field"}), 400

        # 2. Construct the Prompt with ALL context
        # We call the helper function defined above
        prompt_text = construct_fisherman_prompt(prediction, drivers, raw_input)

        # 3. Call the LLM (using your imported function)
        llm_explanation = gemini_service.generate_reply(prompt_text)

        return jsonify({
            "explanation": llm_explanation,
            "status": "success"
        }), 200

    except Exception as e:
        logger.error(f"LLM Generation Error: {e}")
        return jsonify({"error": "Failed to generate AI explanation", "details": str(e)}), 500