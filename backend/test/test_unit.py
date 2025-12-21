import unittest
from unittest.mock import MagicMock, patch
import pandas as pd
import numpy as np  # <--- Added numpy
import sys
import os

# Add parent directory to path so we can import 'services'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.ml_service import MLModelService

class TestMLServiceUnit(unittest.TestCase):

    @patch('services.ml_service.joblib.load') 
    def setUp(self, mock_load):
        # 1. Initialize Service (mock artifacts)
        # We start the service, which calls _load_ml_artifacts internally
        self.service = MLModelService()
        
        # 2. Mock the internal components
        self.service.model = MagicMock()
        self.service.scaler_features = MagicMock()
        self.service.scaler_target = MagicMock()
        self.service.explainer = MagicMock()
        
        # --- CRITICAL FIX START ---
        # Configure the scaler transform to return a REAL numpy array, not a Mock
        # We use side_effect to simply return the input data as a numpy array, 
        # mimicking an "Identity" scaler (it doesn't change values, just format).
        def mock_transform(data):
            # Ensure we return a 2D array which is what sklearn scalers return
            if isinstance(data, pd.DataFrame):
                return data.to_numpy()
            return np.array(data)
            
        self.service.scaler_features.transform.side_effect = mock_transform
        # --- CRITICAL FIX END ---

        # 3. Define behavior: Model expects 11 features
        self.service.model_expected_features = [
            'species', 'state', 'gear_type', 'year', 'month',
            'temperature', 'pressure', 'dew_point', 'humidity', 
            'wind_speed', 'wind_chill'
        ]
        
        # 4. Define behavior: Scaler expects 6 weather features
        self.service.scaler_features.feature_names_in_ = [
            'temperature', 'pressure', 'dew_point', 
            'humidity', 'wind_speed', 'wind_chill'
        ]

    def test_prepare_data_missing_column(self):
        """Test if _prepare_data automatically adds missing columns (wind_chill)."""
        input_data = {
            'species': 4.0, 'state': 7.0, 'gear_type': 11.0,
            'year': 2025, 'month': 5, 'temperature': 30.0
            # wind_chill is intentionally missing
        }
        
        df_result = self.service._prepare_data(input_data)
        
        self.assertIn('wind_chill', df_result.columns)
        self.assertEqual(df_result['wind_chill'][0], 30.0)
        print("✅ Unit Test: Missing column auto-fill logic works.\n")

    def test_predict_clipping(self):
        """Test if predict() clips negative numbers to 0."""
        # Mock model returning negative value
        self.service.model.predict.return_value = np.array([-5.0]) # Return numpy array
        self.service.scaler_target.inverse_transform.return_value = np.array([[-100.0]])
        
        input_data = {'species': 4.0} 
        result = self.service.predict(input_data)
        
        self.assertEqual(result, 0.0)
        print("✅ Unit Test: Negative prediction clipping works.\n")
        
    def test_column_ordering_enforcement(self):
        """
        CRITICAL: Test that the final DataFrame columns are in the EXACT order 
        the model expects, regardless of input order.
        """
        # Input keys are jumbled
        input_data = {
            'year': 2025, 'species': 4.0, 'wind_speed': 15.0, 
            'state': 7.0, 'temperature': 30.0
        }
        
        df_result = self.service._prepare_data(input_data)
        
        # Check if the columns match the model's expected list exactly
        self.assertEqual(list(df_result.columns), self.service.model_expected_features)
        print("✅ Unit Test: Column ordering is strictly enforced.\n")

    def test_scaler_isolation(self):
        """
        Test that only weather columns are sent to the scaler, 
        and categorical columns (species, state) are untouched.
        """
        input_data = {
            'species': 4.0, 'state': 7.0, 
            'temperature': 30.0, 'wind_speed': 10.0
        }
        
        # Run preparation
        self.service._prepare_data(input_data)
        
        # Retrieve the argument passed to transform()
        # call_args[0][0] gets the first positional argument (the dataframe)
        args, _ = self.service.scaler_features.transform.call_args
        df_passed_to_scaler = args[0]
        
        # Assertions
        passed_cols = list(df_passed_to_scaler.columns)
        self.assertIn('temperature', passed_cols)
        self.assertNotIn('species', passed_cols) # Categorical shouldn't be scaled!
        print("✅ Unit Test: Scaler only receives weather features.\n")

    def test_wind_chill_fallback_logic(self):
        """Test the specific fallback chain for wind_chill."""
        
        # Case 1: wind_chill provided -> use it
        df1 = self.service._prepare_data({'wind_chill': 25.0})
        self.assertEqual(df1['wind_chill'][0], 25.0)

        # Case 2: wind_chill missing, temp provided -> use temp
        df2 = self.service._prepare_data({'temperature': 30.0})
        self.assertEqual(df2['wind_chill'][0], 30.0)

        # Case 3: Both missing -> default to 0.0
        df3 = self.service._prepare_data({'species': 1.0})
        self.assertEqual(df3['wind_chill'][0], 0.0)
        
        print("✅ Unit Test: Wind chill fallback logic (Input -> Temp -> 0) works.\n")

    def test_predict_error_handling(self):
        """Test if the service gracefully re-raises internal model errors."""
        # Simulate the model crashing internally
        self.service.model.predict.side_effect = ValueError("Model Corrupted")
        
        input_data = {'species': 1.0}
        
        with self.assertRaises(ValueError) as context:
            self.service.predict(input_data)
        
        self.assertTrue("Model Corrupted" in str(context.exception))
        print("✅ Unit Test: Internal model errors are raised correctly.\n")

if __name__ == '__main__':
    unittest.main()