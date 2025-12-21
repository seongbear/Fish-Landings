import requests
import json
import time
import statistics

# Ensure your Flask server is running (python app.py)
BASE_URL = "http://127.0.0.1:5000"

# --- CONFIGURATION ---
# We define the endpoint for each test case to allow dynamic testing
test_cases = [
    # ==========================================
    # ROUTE 1: /forecast/predict
    # ==========================================
    {
        "id": "A1", "name": "Predict - Standard Trip (Happy Path)",
        "endpoint": "/forecast/predict",
        "payload": {
            "species": 12.0, "state": 13.0, "gear_type": 6.0,
            "year": 2025, "month": 6, "temperature": 30.0, "pressure": 1010.0,
            "dew_point": 25.0, "humidity": 75.0, "wind_speed": 15.0, "uv_index": 9.0
        },
        "expected": 200
    },
    {
        "id": "A2", "name": "Predict - Missing Required Field (State)",
        "endpoint": "/forecast/predict",
        "payload": {
            "species": 1.0, 
            # "state" MISSING
            "gear_type": 11.0, "year": 2025, "month": 5, "temperature": 28.5,
            "pressure": 1012.0, "dew_point": 24.0, "humidity": 80.0, "wind_speed": 15.0, "uv_index": 8.0
        },
        "expected": 422 
    },

    # ==========================================
    # ROUTE 2: /forecast/explain
    # ==========================================
    {
        "id": "B1", "name": "Explain - Standard Request (Happy Path)",
        "endpoint": "/forecast/explain",
        "payload": {
            "species": 12.0, "state": 13.0, "gear_type": 6.0,
            "year": 2025, "month": 6, "temperature": 30.0, "pressure": 1010.0,
            "dew_point": 25.0, "humidity": 75.0, "wind_speed": 15.0, "uv_index": 9.0
        },
        "expected": 200
    },
    {
        "id": "B2", "name": "Explain - Validation Error (Invalid Month)",
        "endpoint": "/forecast/explain",
        "payload": {
            "species": 12.0, "state": 13.0, "gear_type": 6.0,
            "year": 2025, "month": 13, # Invalid month
            "temperature": 30.0, "pressure": 1010.0, "dew_point": 25.0, "humidity": 75.0, "wind_speed": 15.0, "uv_index": 9.0
        },
        "expected": 422 
    },

    # ==========================================
    # ROUTE 3: /forecast/llm_explanation
    # ==========================================
    {
        "id": "C1", "name": "LLM - Generate Summary (Happy Path)",
        "endpoint": "/forecast/llm_explanation",
        "payload": {
            "prediction": 1500.5,
            # FIXED: Changed from list of strings to list of dicts
            "drivers": [
                {"feature": "Temperature", "impact": "High positive"}, 
                {"feature": "Wind Speed", "impact": "Low negative"},
                {"feature": "Seasonality", "impact": "Neutral"}
            ],
            "raw_input": {"SST": 30.5, "Wind": 12.0}
        },
        "expected": 200
    },
    {
        "id": "C2", "name": "LLM - Missing Prediction Value",
        "endpoint": "/forecast/llm_explanation",
        "payload": {
            # "prediction" MISSING
            "drivers": [{"feature": "Temperature", "impact": "High"}],
            "raw_input": {"SST": 30.5}
        },
        "expected": 400
    }
]

def run_functional_tests():
    print(f"\n🚀 STARTING FUNCTIONAL TESTS ({len(test_cases)} cases)")
    print("-" * 80)
    print(f"{'ID':<5} {'NAME':<45} {'ENDPOINT':<25} {'RESULT'}")
    print("-" * 80)
    
    passed = 0
    
    for test in test_cases:
        url = f"{BASE_URL}{test['endpoint']}"
        
        try:
            start = time.time()
            res = requests.post(url, json=test['payload'])
            duration = (time.time() - start) * 1000
            
            # Check status code
            status_match = (res.status_code == test['expected'])
            
            # Determine output symbol
            if status_match:
                passed += 1
                symbol = "✅ PASS"
                # If it's a 200 OK, try to extract a key metric for display
                details = ""
                if res.status_code == 200:
                    data = res.json()
                    if "predicted_landings" in data:
                        details = f"| Pred: {data['predicted_landings']:.1f}"
                    elif "top_3_drivers" in data:
                        details = f"| Drivers: {len(data['top_3_drivers'])}"
                    elif "explanation" in data:
                        # Truncate LLM text
                        details = f"| Text: {data['explanation'][:15]}..."
                else:
                    details = f"| Catch: {res.status_code}"
                
                print(f"{test['id']:<5} {test['name']:<45} {test['endpoint']:<25} {symbol} ({duration:.0f}ms) {details}")
            else:
                print(f"{test['id']:<5} {test['name']:<45} {test['endpoint']:<25} ❌ FAIL")
                print(f"      -> Expected {test['expected']}, Got {res.status_code}")
                print(f"      -> Response: {res.text[:100]}...")

        except Exception as e:
            print(f"{test['id']:<5} {test['name']:<45} {test['endpoint']:<25} ❌ ERROR: {e}")

    print("-" * 80)
    print(f"🏁 RESULT: {passed}/{len(test_cases)} Passed\n")

def run_stress_test(requests_count=50):
    """
    Stress tests only the Prediction endpoint as it is the most critical/high-volume.
    """
    target_endpoint = "/forecast/predict"
    print(f"⚡ STARTING STRESS TEST on {target_endpoint} ({requests_count} requests)")
    print("-" * 60)
    
    # Use the first valid payload found for the predict route
    valid_payload = next(t['payload'] for t in test_cases if t['endpoint'] == target_endpoint and t['expected'] == 200)
    
    latencies = []
    errors = 0

    start_total = time.time()

    for i in range(requests_count):
        try:
            req_start = time.time()
            res = requests.post(f"{BASE_URL}{target_endpoint}", json=valid_payload)
            latencies.append((time.time() - req_start) * 1000)
            
            if res.status_code != 200:
                errors += 1
                print("!", end="", flush=True) 
            else:
                print(".", end="", flush=True) 
                
        except Exception:
            errors += 1
            print("x", end="", flush=True)

    total_time = time.time() - start_total
    
    if latencies:
        avg_lat = statistics.mean(latencies)
        max_lat = max(latencies)
        min_lat = min(latencies)
    else:
        avg_lat = max_lat = min_lat = 0

    print("\n\n📊 STRESS TEST METRICS:")
    print(f"   - Total Time:    {total_time:.2f}s")
    print(f"   - Avg Latency:   {avg_lat:.2f}ms")
    print(f"   - Max Latency:   {max_lat:.2f}ms")
    print(f"   - Min Latency:   {min_lat:.2f}ms")
    print(f"   - Error Rate:    {errors}/{requests_count} ({errors/requests_count*100:.1f}%)")
    print("-" * 60)

if __name__ == "__main__":
    try:
        # Simple health check (hitting one route to see if connection is accepted)
        # We try the predict route with no data just to check connection (expecting 400 or 415, but connection success)
        requests.post(f"{BASE_URL}/forecast/predict", json={})
        
        run_functional_tests()
        
        # Uncomment to run stress test
        # run_stress_test(50) 
        
    except requests.exceptions.ConnectionError:
        print("\n❌ CRITICAL: Flask server is NOT running.")
        print(f"   Please run 'python app.py' in a separate terminal first.")
        print(f"   Targeting: {BASE_URL}\n")