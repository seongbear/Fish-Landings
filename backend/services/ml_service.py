import joblib 
import pandas as pd
import shap 
import io
import base64
import os 
import matplotlib.pyplot as plt

ARTIFACT_PATH = 'model_artifacts/'

class MLModelService:
    def __init__(self):
        self.model = None
        self.scaler_features = None
        self.scaler_target = None
        self.explainer = None
        self.model_expected_features = []
        
        self._load_ml_artifacts()
    
    def _load_ml_artifacts(self):
        print("Loading ML artifacts...")
        try:
            self.model = joblib.load(os.path.join(ARTIFACT_PATH, 'lgbm_fisheries_model.pkl'))
            self.scaler_features = joblib.load(os.path.join(ARTIFACT_PATH, 'scaler_features.pkl'))
            self.scaler_target = joblib.load(os.path.join(ARTIFACT_PATH, 'scaler_target.pkl'))
            self.explainer = joblib.load(os.path.join(ARTIFACT_PATH, 'shap_explainer.pkl'))
            
            # 1. Get the exact list of 11 features the model expects
            if hasattr(self.model, 'booster_'):
                self.model_expected_features = self.model.booster_.feature_name()
            elif hasattr(self.model, 'feature_name_'):
                self.model_expected_features = self.model.feature_name_
            
            print(f"[INFO] Model expects {len(self.model_expected_features)} features: {self.model_expected_features}")

        except Exception as e:
            print(f"[ERROR] Error loading ML artifacts: {e}")
            raise

    def _prepare_data(self, input_data: dict) -> pd.DataFrame:
        """
        Prepares data by scaling ONLY numerical cols and keeping categorical cols.
        """
        # 1. Create DataFrame from input
        df = pd.DataFrame([input_data])
        
        # 2. Ensure all 11 expected columns exist (fill missing with 0)
        # This handles the 'wind_chill' issue or any missing categorical input
        for col in self.model_expected_features:
            if col not in df.columns:
                # Special handling: if wind_chill is missing, copy temperature
                if col == 'wind_chill' and 'temperature' in df.columns:
                    df[col] = df['temperature']
                else:
                    df[col] = 0.0

        # 3. Apply Scaling (ONLY to the columns the scaler knows about)
        # The scaler likely only knows about the 6 weather columns.
        # We must NOT overwrite the whole dataframe, just the specific columns.
        if hasattr(self.scaler_features, 'feature_names_in_'):
            scaler_cols = self.scaler_features.feature_names_in_
            
            # Check if these columns exist in df before scaling
            valid_scaler_cols = [c for c in scaler_cols if c in df.columns]
            
            if valid_scaler_cols:
                # Transform only the valid scaler columns
                df[valid_scaler_cols] = self.scaler_features.transform(df[valid_scaler_cols])
        
        # 4. CRITICAL FIX: Return DataFrame with ALL 11 columns in the correct order
        # Previous errors happened because non-scaled columns were being dropped.
        return df[self.model_expected_features]

    def predict(self, input_data: dict):
        try:
            df_model = self._prepare_data(input_data)
            pred_scaled = self.model.predict(df_model)[0]
            pred_final = self.scaler_target.inverse_transform([[pred_scaled]])[0][0]
            return max(0.0, float(pred_final))
        except Exception as e:
            print(f"Prediction Error: {e}")
            raise e
    
    def explain(self, input_data: dict):
        try:
            df_model = self._prepare_data(input_data)
            shap_values = self.explainer(df_model)

            # Waterfall Plot
            plt.figure(figsize=(10, 6), dpi=100)
            shap.plots.waterfall(shap_values[0], show=False)
            buf_waterfall = io.BytesIO()
            plt.savefig(buf_waterfall, format="png", bbox_inches='tight')
            plt.close()
            buf_waterfall.seek(0)
            waterfall_str = base64.b64encode(buf_waterfall.read()).decode('utf-8')

            # Force Plot
            plt.figure(figsize=(12, 4), dpi=100)
            shap.force_plot(
                shap_values[0].base_values, 
                shap_values[0].values, 
                df_model,
                matplotlib=True,
                show=False
            )
            buf_force = io.BytesIO()
            plt.savefig(buf_force, format="png", bbox_inches='tight')
            plt.close()
            buf_force.seek(0)
            force_str = base64.b64encode(buf_force.read()).decode('utf-8')

            # Top Drivers
            feature_names = df_model.columns.tolist()
            values = shap_values.values[0]
            contributions = sorted(zip(feature_names, values), key=lambda x: abs(x[1]), reverse=True)
            
            return {
                'base_value': float(shap_values.base_values[0]),
                'top_3_drivers': contributions[:3],
                'waterfall_plot': waterfall_str,
                'force_plot': force_str
            }
        except Exception as e:
            print(f"Explanation Error: {e}")
            raise e