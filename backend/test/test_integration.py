import pytest
import json
import sys
import os

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import the 'app' variable from your backend/app.py
from app import app as flask_app 

@pytest.fixture
def client():
    # Configure Flask for testing mode
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as client:
        yield client

# --- 1. PREDICTION ENDPOINT TESTS ---
def test_predict_endpoint_success(client):
    """Test a valid prediction request (Happy Path)."""
    payload = {
        "species": 4.0, "state": 7.0, "gear_type": 14.0,
        "year": 2025, "month": 5, "temperature": 28.5,
        "pressure": 1012.0, "dew_point": 24.0, "humidity": 80.0,
        "wind_speed": 15.0, "uv_index": 8.0
    }
    response = client.post('/forecast/predict', json=payload)
    data = response.get_json()

    assert response.status_code == 200
    assert "predicted_landings" in data
    assert isinstance(data['predicted_landings'], float)
    print("\n✅ Integration Test: /predict returns 200 OK.")

def test_predict_with_optional_field(client):
    """Test including the optional 'wind_chill' field."""
    payload = {
        "species": 4.0, "state": 7.0, "gear_type": 14.0,
        "year": 2025, "month": 5, "temperature": 28.5,
        "pressure": 1012.0, "dew_point": 24.0, "humidity": 80.0,
        "wind_speed": 15.0, "uv_index": 8.0,
        "wind_chill": 26.5  # <--- Explicitly provided
    }
    response = client.post('/forecast/predict', json=payload)
    assert response.status_code == 200
    print("✅ Integration Test: Optional field 'wind_chill' accepted.")

def test_predict_validation_error(client):
    """Test request with missing required fields."""
    payload = { "state": 7.0 } # Missing almost everything
    response = client.post('/forecast/predict', json=payload)
    
    assert response.status_code == 422
    assert "Validation Error" in response.get_json()['error']
    print("✅ Integration Test: Validation catches missing fields.")

def test_predict_invalid_types(client):
    """Test request with wrong data types (String instead of Float)."""
    payload = {
        "species": "NOT_A_NUMBER", # <--- Invalid
        "state": 7.0, "gear_type": 14.0,
        "year": 2025, "month": 5, "temperature": 28.5,
        "pressure": 1012.0, "dew_point": 24.0, "humidity": 80.0,
        "wind_speed": 15.0, "uv_index": 8.0
    }
    response = client.post('/forecast/predict', json=payload)
    
    assert response.status_code == 422
    assert "Validation Error" in response.get_json()['error']
    print("✅ Integration Test: Pydantic catches type mismatches.")

# --- 2. EXPLANATION ENDPOINT TESTS ---
def test_explain_endpoint_success(client):
    """Test the SHAP explanation endpoint."""
    payload = {
        "species": 4.0, "state": 7.0, "gear_type": 14.0,
        "year": 2025, "month": 5, "temperature": 28.5,
        "pressure": 1012.0, "dew_point": 24.0, "humidity": 80.0,
        "wind_speed": 15.0, "uv_index": 8.0
    }
    response = client.post('/forecast/explain', json=payload)
    data = response.get_json()

    assert response.status_code == 200
    assert "base_value" in data
    assert "top_3_drivers" in data
    assert "waterfall_plot" in data
    assert "force_plot" in data
    
    # Check if we actually got Base64 strings back
    assert len(data['waterfall_plot']) > 100
    assert len(data['force_plot']) > 100
    
    print("✅ Integration Test: /explain returns SHAP data and images.")

# --- 3. HTTP PROTOCOL TESTS ---
def test_method_not_allowed(client):
    """Test using GET on a POST-only endpoint."""
    response = client.get('/forecast/predict') # GET request
    assert response.status_code == 405 # Method Not Allowed
    print("✅ Integration Test: GET method correctly blocked on POST route.")

def test_empty_payload(client):
    """Test sending an empty JSON object."""
    response = client.post('/forecast/predict', json={})
    assert response.status_code == 400 # Or 422 depending on implementation
    print("✅ Integration Test: Empty payload handled gracefully.")