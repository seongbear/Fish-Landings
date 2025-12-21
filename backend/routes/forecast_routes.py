from flask import Blueprint, request, jsonify
from services.ml_service import MLModelService
from schemas import FisheryInput, PredictionResponse, ExplanationResponse
import logging

# Initialize Blueprint
forecast_bp = Blueprint("forecast_bp", __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- SERVICE INITIALIZATION (Singleton Pattern) ---
# We initialize this once when the file is imported.
try:
    ml_service = MLModelService()
    logger.info("✅ ML Service initialized successfully.")
except Exception as e:
    logger.error(f"❌ Critical Error: Failed to initialize ML Service. {e}")
    ml_service = None

# --- HELPER: Pydantic Compatibility ---
def to_dict(pydantic_obj):
    """Safe conversion for both Pydantic V1 (.dict) and V2 (.model_dump)"""
    if hasattr(pydantic_obj, 'model_dump'):
        return pydantic_obj.model_dump()
    return pydantic_obj.dict()

# --- ROUTES ---

@forecast_bp.route("/forecast/predict", methods=["POST"])
def predict_landings():
    """
    Endpoint to predict fishery landings.
    """
    # 1. Circuit Breaker: Check if ML service is loaded
    if not ml_service:
        return jsonify({"error": "Service Unavailable: ML Model failed to load."}), 503

    try:
        # 2. Parse JSON (silent=True returns None instead of crashing on bad JSON)
        input_data = request.get_json(silent=True)
        if not input_data:
            return jsonify({"error": "Invalid or missing JSON body"}), 400

        # 3. Validate Input using Schema
        # This will raise ValueError if required fields are missing
        fishery_input = FisheryInput(**input_data)
        
        # 4. Predict
        # Convert Pydantic object to Python dict for the service
        prediction = ml_service.predict(to_dict(fishery_input))
        
        # 5. Return Response
        response = PredictionResponse(
            predicted_landings=prediction,
            status="success"
        )
        return jsonify(to_dict(response)), 200

    except ValueError as ve:
        logger.warning(f"Validation Error: {ve}")
        return jsonify({"error": "Validation Error", "details": str(ve)}), 422
    except Exception as e:
        logger.error(f"Prediction Error: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


@forecast_bp.route("/forecast/explain", methods=["POST"])
def explain_prediction():
    """
    Endpoint to explain the prediction (SHAP values).
    """
    # 1. Circuit Breaker
    if not ml_service:
        return jsonify({"error": "Service Unavailable: ML Model failed to load."}), 503

    try:
        # 2. Parse JSON
        input_data = request.get_json(silent=True)
        if not input_data:
            return jsonify({"error": "Invalid or missing JSON body"}), 400

        # 3. Validate Input
        fishery_input = FisheryInput(**input_data)
        
        # 4. Generate Explanation
        # The service now returns a Dictionary (not a tuple)
        explanation = ml_service.explain(to_dict(fishery_input))
        
        # 5. Format Response
        # We access the dictionary keys provided by the updated ml_service
        response = ExplanationResponse(
            base_value=explanation['base_value'],
            top_3_drivers=explanation['top_3_drivers'],
            waterfall_plot=explanation['waterfall_plot'],
            force_plot=explanation['force_plot'],
            status="success"
        )
        return jsonify(to_dict(response)), 200

    except ValueError as ve:
        logger.warning(f"Validation Error: {ve}")
        return jsonify({"error": "Validation Error", "details": str(ve)}), 422
    except KeyError as ke:
        logger.error(f"Data Error: Missing key in explanation result: {ke}")
        return jsonify({"error": "Explanation Data Error", "details": str(ke)}), 500
    except Exception as e:
        logger.error(f"Explanation Error: {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500