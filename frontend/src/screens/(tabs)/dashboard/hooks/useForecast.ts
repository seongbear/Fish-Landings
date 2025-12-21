import { useState } from 'react';
import { Alert } from 'react-native';
// Adjust these import paths to match your project structure
import { postForecastLandings, postSHAPExplain } from '../../../../api/landingsApi';
import { ForecastPayload } from '../types/landings'; 

// 1. Define Interface for Explanation Data
export interface ExplanationData {
  base_value: number;
  drivers: Array<[string, number]>; // Tuple: [feature_name, shap_value]
  waterfall: string; // Base64 string
  force: string;     // Base64 string
}

export const useForecast = () => {
    // 2. Typed State
    const [loading, setLoading] = useState<boolean>(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [explanation, setExplanation] = useState<ExplanationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 3. Generate Forecast Function
    const generateForecast = async (rawFormData: ForecastPayload) => {
        setLoading(true);
        setError(null);
        setPrediction(null);
        setExplanation(null);

        // --- A. Payload Preparation ---
        // We iterate over the input to ensure everything is a valid number.
        // This handles cases where input might still be strings or contain partial data.
        const payload: Partial<ForecastPayload> = {};

        (Object.keys(rawFormData) as Array<keyof ForecastPayload>).forEach((key) => {
            const rawValue = rawFormData[key];

            // Skip empty strings, undefined, or null
            if (String(rawValue).trim() === '' || rawValue === undefined || rawValue === null) return;

            // Safely parse to number
            const parsedValue = parseFloat(String(rawValue));

            if (!isNaN(parsedValue)) {
                payload[key] = parsedValue;
            }
        });

        try {
            // --- B. API Calls ---
            const finalPayload = payload as ForecastPayload;

            // Run requests in parallel for better performance
            const [predictedResponse, explanationData] = await Promise.all([
                postForecastLandings(finalPayload),
                postSHAPExplain(finalPayload)
            ]);

            // --- C. CRITICAL FIX: Response Handling ---
            // This block prevents "NaN" errors by handling both Number and Object responses.
            let finalValue: number;

            if (typeof predictedResponse === 'number') {
                // Case 1: API returned just a number (e.g., 0.78)
                finalValue = predictedResponse;
            } 
            else if (
                typeof predictedResponse === 'object' && 
                predictedResponse !== null && 
                'predicted_landings' in predictedResponse
            ) {
                // Case 2: API returned an object (e.g., { "predicted_landings": 0.78, "status": "success" })
                // We extract the specific field we need.
                finalValue = (predictedResponse as any).predicted_landings;
            } 
            else {
                // Case 3: Fallback (parse string if necessary)
                finalValue = parseFloat(String(predictedResponse));
            }

            // --- D. Update State ---
            setPrediction(finalValue); 
            
            setExplanation({
                base_value: explanationData.base_value,
                drivers: explanationData.drivers,
                waterfall: explanationData.waterfall,
                force: explanationData.force,
            });

        } catch (err: unknown) {
            console.error("Forecast Error:", err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            
            setError(errorMessage);
            Alert.alert("Forecast Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetForecast = () => {
        setPrediction(null);
        setExplanation(null);
        setError(null);
    };

    return {
        loading,
        prediction,
        explanation,
        error,
        generateForecast,
        resetForecast
    };
};