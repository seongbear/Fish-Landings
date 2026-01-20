from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from services.ml_service import MLModelService
from schemas import FisheryInput, PredictionResponse
import logging
# import services.gemini_service as gemini_service
import services.openai_service as openai_service
# from prompt.explain_prompt import construct_fisherman_prompt
from prompt.explain_pompt_v2 import construct_fisherman_prompt_v2

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
        logger.warning(f"Value Error: {ve}")
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
        
        # 1. Get Explanation from ML Service
        # This returns: {'base_value', 'plot_analysis_data', 'waterfall_plot', 'force_plot'}
        explanation = ml_service.explain(to_dict(fishery_input))
        
        # 2. Extract Data for UI
        # 'plot_analysis_data' is the sorted list of factors (Positive & Negative)
        all_drivers = explanation.get('plot_analysis_data', [])
        
        # Slice top 3 for the dashboard cards
        top_3 = all_drivers[:3] if all_drivers else []

        # 3. Construct Response
        # We assume ExplanationResponse schema has a field for 'plot_data' or 'drivers'
        # If your schema is strict, you might need to update schemas.py to accept 'plot_analysis_data'
        response_data = {
            "base_value": explanation['base_value'],
            "top_3_drivers": top_3, 
            "waterfall_plot": explanation['waterfall_plot'],
            "force_plot": explanation['force_plot'],
            "plot_analysis_data": all_drivers, # <--- SEND THIS TO FRONTEND (Needed for LLM)
            "status": "success"
        }
        
        return jsonify(response_data), 200

    except ValueError as ve:
        return jsonify({"error": "Validation Error", "details": str(ve)}), 422
    except KeyError as ke:
        return jsonify({"error": f"Missing Data Field: {str(ke)}", "details": "ML Service output incomplete."}), 500
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


@forecast_bp.route("/forecast/llm_explanation", methods=["POST"])
def generate_llm_explanation():
    """
    Endpoint to generate a fisherman-friendly explanation using an LLM.
    Expects 'drivers' to contain the 'plot_analysis_data' list.
    """
    try:
        # 1. Parse Input
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid or missing JSON body"}), 400

        prediction = data.get("prediction")
        # 'drivers' here should be the 'plot_analysis_data' list we sent in /explain
        drivers = data.get("drivers", []) 
        raw_input = data.get("raw_input", {}) 

        if prediction is None:
             return jsonify({"error": "Missing 'prediction' field"}), 400

        # 2. Construct the Prompt with ALL context
        # This uses the UPDATED construct_fisherman_prompt that handles the list logic
        prompt_text = construct_fisherman_prompt_v2(prediction, drivers, raw_input)

        # 3. Call the LLM
        llm_explanation = openai_service.generate_reply(prompt_text)

        return jsonify({
            "explanation": llm_explanation,
            "status": "success"
        }), 200

    except Exception as e:
        logger.error(f"LLM Generation Error: {e}")
        return jsonify({"error": "Failed to generate AI explanation", "details": str(e)}), 500