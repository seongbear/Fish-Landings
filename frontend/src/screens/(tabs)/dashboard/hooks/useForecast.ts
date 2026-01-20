import { useState } from 'react';
import { Alert } from 'react-native';
import { 
  postForecastLandings, 
  postSHAPExplain, 
  postLLMExplain, 
  postFeedback
} from '../../../../api/landingsApi';
import { FeedbackData, ForecastPayload, PlotAnalysisData } from '../types/landings'; 

// 1. Interfaces
export interface ExplanationData {
  base_value: number;
  drivers: PlotAnalysisData[];
  waterfall: string; 
  force: string;    
}

export const useForecast = () => {
    // Typed State
    let docId: string | undefined;
    const [loading, setLoading] = useState<boolean>(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [explanation, setExplanation] = useState<ExplanationData | null>(null);
    const [llmExplanation, setLlmExplanation] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    // 1. Reality Check State
    const [accuracy, setAccuracy] = useState<'GOOD' | 'OK' | 'BAD' | null>(null);
    const [actualCatch, setActualCatch] = useState<string>('');
    // 2. Trust & Usefulness State
    const [isUseful, setIsUseful] = useState<boolean | null>(null);
    const [trust, setTrust] = useState<'HIGH' | 'MEDIUM' | 'LOW' | null>(null);
    // 3. Optional Comment
    const [comment, setComment] = useState('')
    // 4. Feedback Comments
    const [feedbackComments, setFeedbackComments] = useState<string>();
    const [statusModal, setStatusModal] = useState({
        visible: false,
        type: 'success' as 'success' | 'error',
        message: ''
    });
    
    // Validation Helper
    const validateInputs = (data: Partial<ForecastPayload>): string | null => {
        if (!data.species) return "Please select a Species.";
        if (!data.state) return "Please select a State.";
        if (!data.gear_type) return "Please select a Gear Type.";
        
        if (data.month !== undefined && (data.month < 1 || data.month > 12)) return "Month must be between 1 and 12.";
        if (data.year !== undefined && (data.year < 2000 || data.year > 2050)) return "Year must be valid (2000-2050).";
        
        // Malaysia Specific Checks
        if (data.humidity !== undefined && (data.humidity < 40 || data.humidity > 100)) return "Humidity is unrealistic (expect 40-100%).";
        if (data.wind_speed !== undefined && (data.wind_speed < 0 || data.wind_speed > 150)) return "Wind Speed must be between 0 and 150 km/h.";
        if (data.uv_index !== undefined && (data.uv_index < 0 || data.uv_index > 15)) return "UV Index must be between 0 and 15.";
        if (data.temperature !== undefined && (data.temperature < 18 || data.temperature > 42)) return "Temperature is unrealistic (18°C - 42°C).";
        if (data.pressure !== undefined && (data.pressure < 990 || data.pressure > 1020)) return "Pressure is unrealistic (990-1020 hPa).";
        
        if (data.dew_point !== undefined) {
             if (data.dew_point < 15 || data.dew_point > 35) return "Dew Point is unrealistic.";
             if (data.temperature !== undefined && data.dew_point > data.temperature) return "Dew Point cannot be higher than Temperature.";
        }
        return null;
    };

    // Generate Forecast Function
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
                if (!isNaN(parsedValue)) payload[key] = parsedValue;
            });

            // --- B. Validation ---
            const validationError = validateInputs(payload);
            if (validationError) throw new Error(validationError); 
            const finalPayload = payload as ForecastPayload;

            // --- C. Step 1: PREDICT (Get Value + DocID) ---
            // We await this FIRST because we need the docId for the next steps
            const forecastResult = await postForecastLandings(finalPayload);
            
            // Validate Result
            if (!forecastResult || typeof forecastResult.prediction !== 'number') {
                throw new Error("Invalid prediction result from server.");
            }

            const finalValue = forecastResult.prediction;
            docId = forecastResult.docId; // 
            setPrediction(finalValue); // Update UI immediately

            // --- D. Step 2: EXPLAIN (Update Doc with SHAP) ---
            // Now we pass the docId so the explanation is saved to the same document
            const explanationData = await postSHAPExplain(finalPayload, docId);

            if (explanationData) {
                setExplanation({
                    base_value: explanationData.base_value,
                    drivers: explanationData.drivers || [], 
                    waterfall: explanationData.waterfall || "",
                    force: explanationData.force || "",
                });

                // --- E. Step 3: LLM REPORT (Update Doc with Text) ---
                if (explanationData.plot_analysis_data) {
                    const llmResult = await postLLMExplain(
                        finalValue,
                        explanationData.plot_analysis_data,
                        finalPayload,
                        docId 
                    );
                    setLlmExplanation(llmResult);
                }
            }

        } catch (err: any) {
            console.error("Forecast Execution Failed:", err);
            
            let userMessage = "An unexpected error occurred.";
            if (err.message?.includes("422")) userMessage = "Invalid Data: Please check your input fields.";
            else if (err.message?.includes("Network request failed")) userMessage = "Connection Error: Please check your internet.";
            else if (err.message) userMessage = err.message;

            setError(userMessage);
            Alert.alert("Forecast Failed", userMessage);
            
        } finally {
            setLoading(false);
        }
    };

    const submitFeedback = async (data: FeedbackData) => {
        if (docId) {
            await postFeedback(data, docId);
        } else {
            console.error("No docId provided for feedback submission.");
        }
    };

    // Reset Forecast
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
        docId,
        generateForecast,
        resetForecast,
        accuracy,
        setAccuracy,
        actualCatch,
        setActualCatch,
        isUseful,
        setIsUseful,
        trust,
        setTrust,
        comment,
        setComment,
        feedbackComments,
        setFeedbackComments,
        setStatusModal,
        statusModal,
        submitFeedback
    };
};