import { useState } from 'react';
import { Alert } from 'react-native';
import { 
  postForecastLandings, 
  postSHAPExplain, 
  postLLMExplain 
} from '../../../../api/landingsApi';
import { ForecastPayload } from '../types/landings'; 

// 1. Interfaces
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
    const [llmExplanation, setLlmExplanation] = useState<string | null>(null); // NEW STATE
    const [error, setError] = useState<string | null>(null);

    // 3. Generate Forecast Function
    const generateForecast = async (rawFormData: ForecastPayload) => {
        setLoading(true);
        setError(null);
        setPrediction(null);
        setExplanation(null);
        setLlmExplanation(null);

        // --- A. Payload Preparation ---
        const payload: Partial<ForecastPayload> = {};

        (Object.keys(rawFormData) as Array<keyof ForecastPayload>).forEach((key) => {
            const rawValue = rawFormData[key];
            if (String(rawValue).trim() === '' || rawValue === undefined || rawValue === null) return;
            const parsedValue = parseFloat(String(rawValue));
            if (!isNaN(parsedValue)) {
                payload[key] = parsedValue;
            }
        });

        try {
            // --- B. Step 1: Get Prediction & Math Explanation (Parallel) ---
            const finalPayload = payload as ForecastPayload;

            const [predictedResponse, explanationData] = await Promise.all([
                postForecastLandings(finalPayload),
                postSHAPExplain(finalPayload)
            ]);

            // --- C. Handle Prediction Response ---
            let finalValue: number;

            if (typeof predictedResponse === 'number') {
                finalValue = predictedResponse;
            } else if (
                typeof predictedResponse === 'object' && 
                predictedResponse !== null && 
                'predicted_landings' in predictedResponse
            ) {
                finalValue = (predictedResponse as any).predicted_landings;
            } else {
                finalValue = parseFloat(String(predictedResponse));
            }

            // Update Core State
            setPrediction(finalValue); 
            setExplanation({
                base_value: explanationData.base_value,
                drivers: explanationData.drivers,
                waterfall: explanationData.waterfall,
                force: explanationData.force,
            });

            // --- D. Step 2: Get LLM Explanation (Sequential) ---
            // We do this AFTER getting the data, because the LLM needs the results.
            
            // Transform SHAP tuples [name, val] -> objects {feature, value} for backend
            const formattedDrivers = explanationData.drivers.map((d: [string, number]) => ({
                feature: d[0],
                value: d[1]
            }));

            const llmResult = await postLLMExplain(
                finalValue,
                formattedDrivers,
                finalPayload
            );

            setLlmExplanation(llmResult);

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
        setLlmExplanation(null);
        setError(null);
    };

    return {
        loading,
        prediction,
        explanation,
        llmExplanation, // Export new state
        error,
        generateForecast,
        resetForecast
    };
};