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
  drivers: Array<[string, number]>;
  waterfall: string; 
  force: string;    
}

export const useForecast = () => {
    // 2. Typed State
    const [loading, setLoading] = useState<boolean>(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [explanation, setExplanation] = useState<ExplanationData | null>(null);
    const [llmExplanation, setLlmExplanation] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 3. Validation Helper (Prevents 422 Errors)
    const validateInputs = (data: Partial<ForecastPayload>): string | null => {
        if (!data.species) return "Please select a Species.";
        if (!data.state) return "Please select a State.";
        if (!data.gear_type) return "Please select a Gear Type.";
        
        // Logical checks
        if (data.month !== undefined && (data.month < 1 || data.month > 12)) {
            return "Month must be between 1 and 12.";
        }
        if (data.year !== undefined && (data.year < 1900 || data.year > 2100)) {
            return "Please enter a valid year.";
        }
        if (data.humidity !== undefined && (data.humidity < 0 || data.humidity > 100)) {
            return "Humidity must be between 0 and 100%.";
        }
        return null;
    };

    // 4. Generate Forecast Function
    const generateForecast = async (rawFormData: ForecastPayload) => {
        setLoading(true);
        setError(null);
        setPrediction(null);
        setExplanation(null);
        setLlmExplanation(null);

        try {
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

            // --- B. Frontend Validation ---
            const validationError = validateInputs(payload);
            if (validationError) {
                // Stop here. Don't hit the server.
                throw new Error(validationError); 
            }

            const finalPayload = payload as ForecastPayload;

            // --- C. Parallel API Calls ---
            // Note: If one fails (e.g., SHAP), both will throw. 
            const [predictedResponse, explanationData] = await Promise.all([
                postForecastLandings(finalPayload),
                postSHAPExplain(finalPayload)
            ]);

            // --- D. CRITICAL: Safe Response Parsing ---
            // This fixes: "predicted_landings field is missing or not a number"
            let finalValue: number;

            // Check if response is null/undefined first
            if (!predictedResponse) {
                throw new Error("Server returned an empty response.");
            }

            if (typeof predictedResponse === 'number') {
                finalValue = predictedResponse;
            } 
            else if (typeof predictedResponse === 'object' && 'predicted_landings' in predictedResponse) {
                // Safely cast and extract
                finalValue = Number((predictedResponse as any).predicted_landings);
            } 
            else {
                // Fallback attempt to parse, or throw error if completely unrecognized
                const parsed = parseFloat(String(predictedResponse));
                if (isNaN(parsed)) {
                    console.error("Invalid Response Structure:", predictedResponse);
                    throw new Error("Invalid response format: Missing 'predicted_landings'.");
                }
                finalValue = parsed;
            }

            // Check for NaN one last time (e.g. if 'predicted_landings' was "error")
            if (isNaN(finalValue)) {
                throw new Error("Prediction result was not a valid number.");
            }

            // --- E. Update State ---
            setPrediction(finalValue); 
            
            if (explanationData) {
                setExplanation({
                    base_value: explanationData.base_value,
                    drivers: explanationData.drivers || [], // Safety fallback
                    waterfall: explanationData.waterfall || "",
                    force: explanationData.force || "",
                });
            }

            // --- F. LLM Step (Sequential) ---
            // Only proceed if we have valid drivers
            if (explanationData && explanationData.drivers) {
                const formattedDrivers = explanationData.drivers.map((d: [string, number]) => ({
                    feature: d[0],
                    value: d[1]
                }));

                // Run in background (don't block UI if this fails?) 
                // Currently keeping it blocking to ensure consistency.
                const llmResult = await postLLMExplain(
                    finalValue,
                    formattedDrivers,
                    finalPayload
                );
                setLlmExplanation(llmResult);
            }

        } catch (err: any) {
            console.error("Forecast Execution Failed:", err);
            
            // --- G. Error Categorization ---
            let userMessage = "An unexpected error occurred.";

            // 1. Handling HTTP 422 (Validation from Server)
            if (err.message && err.message.includes("422")) {
                userMessage = "Invalid Data: Please check your input fields (State, Month, etc) and try again.";
            }
            // 2. Handling Connection Issues
            else if (err.message && (err.message.includes("Network request failed") || err.message.includes("timeout"))) {
                userMessage = "Connection Error: Please check your internet.";
            }
            // 3. Handling Custom Validation Errors
            else if (err.message) {
                userMessage = err.message;
            }

            setError(userMessage);
            Alert.alert("Forecast Failed", userMessage);
            
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
        llmExplanation,
        error,
        generateForecast,
        resetForecast
    };
};