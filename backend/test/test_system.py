import requests
import json
import time

# Ensure your Flask server is running (python app.py) before running this script!
BASE_URL = "http://127.0.0.1:5000"

test_cases = [
    # --- HAPPY PATHS ---
    {
        "id": "A", "name": "Standard Trip (East Coast)",
        "payload": {
            "species": 12.0, "state": 13.0, "gear_type": 6.0,
            "year": 2025, "month": 6, "temperature": 30.0, "pressure": 1010.0,
            "dew_point": 25.0, "humidity": 75.0, "wind_speed": 15.0, "uv_index": 9.0
        },
        "expected": 200
    },
    # --- BOUNDARY ---
    {
        "id": "B", "name": "Extreme Storm (Wind 80km/h)",
        "payload": {
            "species": 12.0, "state": 13.0, "gear_type": 6.0,
            "year": 2025, "month": 11, "temperature": 27.0, "pressure": 990.0,
            "dew_point": 26.0, "humidity": 95.0, "wind_speed": 80.0, "uv_index": 2.0
        },
        "expected": 200
    },
    # --- EDGE CASE ---
    {
        "id": "C", "name": "Unknown Categories (-2)",
        "payload": {
            "species": -2.0, "state": -2.0, "gear_type": -2.0,
            "year": 2025, "month": 1, "temperature": 28.0, "pressure": 1010.0,
            "dew_point": 24.0, "humidity": 80.0, "wind_speed": 10.0, "uv_index": 5.0
        },
        "expected": 200
    },
    # --- NEGATIVE ---
    {
        "id": "D", "name": "Missing Required Field",
        "payload": {
            "species": 1.0, 
            # "state" MISSING
            "gear_type": 11.0, "year": 2025, "month": 5, "temperature": 28.5,
            "pressure": 1012.0, "dew_point": 24.0, "humidity": 80.0, "wind_speed": 15.0, "uv_index": 8.0
        },
        "expected": 422
    }
]

def run_tests():
    print(f"🚀 STARTING SYSTEM TESTS ({len(test_cases)} cases)\n")
    for test in test_cases:
        print(f"🔹 [{test['id']}] {test['name']}...", end=" ")
        
        try:
            start = time.time()
            res = requests.post(f"{BASE_URL}/forecast/predict", json=test['payload'])
            duration = (time.time() - start) * 1000
            
            if res.status_code == test['expected']:
                val = res.json().get('predicted_landings', 'N/A')
                print(f"✅ PASS ({duration:.0f}ms) | Forecast: {val}")
            else:
                print(f"❌ FAIL! Got {res.status_code}, expected {test['expected']}")
                print(f"   Error: {res.text}")
                
        except Exception as e:
            print(f"❌ ERROR: Is server running? {e}")

if __name__ == "__main__":
    run_tests()