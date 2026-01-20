import { ForecastPayload, LandingData, PlotAnalysisData, FeedbackData } from "../screens/(tabs)/dashboard/types/landings";
import { auth, firestore } from "../firebaseConfig";
import { collection, doc, serverTimestamp, updateDoc, addDoc } from "firebase/firestore";

const API_BASE_URL = process.env.API_BASE;

// Structure inputs for Firestore schema 
const formatInputForSchema = (payload: ForecastPayload) => {
  return {
    year: payload.year,
    month: payload.month,
    state: payload.state,
    species: payload.species,
    gear_type: payload.gear_type,
    weather: {
      temperature: payload.temperature,
      wind_speed: payload.wind_speed,
      humidity: payload.humidity,
      pressure: payload.pressure,
      uv_index: payload.uv_index,
      dew_point: payload.dew_point,
    }
  }
}

export const getLandingsData = async (
  filters?: Record<string, string>, 
  limitPerPage: number = 1000, // rows per page
  fetchAll: boolean = true       // whether to fetch all pages
): Promise<LandingData[]> => {

  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => { 
      if (v !== "All") params.append(k, v);
    });
  }

  if (!fetchAll) {
    params.append("limit", limitPerPage.toString());
    const res = await fetch(`${API_BASE_URL}/data/landings?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    return json.data as LandingData[];
  }

  // --- Fetch all pages ---
  let allData: LandingData[] = [];
  let page = 1;
  let fetchedCount = 0;

  while (true) {
    params.set("page", page.toString());
    params.set("limit", limitPerPage.toString());

    const res = await fetch(`${API_BASE_URL}/data/landings?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    const pageData = json.data as LandingData[];

    allData = [...allData, ...pageData];
    fetchedCount += pageData.length;

    // Stop if no more data
    if (fetchedCount >= json.total_count || pageData.length === 0) break;

    page += 1;
  }

  return allData;
};

export const postForecastLandings = async (payload: ForecastPayload): Promise<{ prediction: number, docId?: string}> =>{
  console.log("Posting forecast request...");
  console.log("Inputs:", payload);
  try{
    const response = await fetch(`${API_BASE_URL}/forecast/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    // 3. Optional: Runtime validation to ensure prediction actually exists
    if (typeof result.predicted_landings !== 'number') {
        throw new Error("Invalid response format: 'predicted_landings' field is missing or not a number");
    }

    console.log("Forecast prediction result:", result);

    let newDocId: string | undefined;
    try{
      if (auth.currentUser){
        const docRef = await addDoc(collection(firestore, "forecasts"), {
          usedId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          inputs: formatInputForSchema(payload),
          prediction: {
            landings: result.predicted_landings,
            unit: "tonnes",
            model_version: "v1"
          }
        });
        newDocId = docRef.id;
        console.log("New document created with ID:", newDocId);
      }
    } catch (error) {
      console.error("Error creating new document:", error);
      throw error;
    }
    return {
      prediction: result.predicted_landings,
      docId: newDocId
    };
  } catch (error) {
    console.error("Error posting forecast landings:", error);
    throw error;
  }
}

export const postSHAPExplain = async (payload: ForecastPayload, docId?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/forecast/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("SHAP explanation received");

    // Prepare the object we want to return to the UI immediately
    const uiReturnData = {
      base_value: result.base_value,
      drivers: result.top_3_drivers,
      waterfall: result.waterfall_plot,
      force: result.force_plot,
      plot_analysis_data: result.plot_analysis_data
    };
    
    // --- FIRESTORE UPDATE ---
    if (docId) {
      try {
        const forecastRef = doc(firestore, "forecasts", docId);

        await updateDoc(forecastRef, {
          explanation: {
            base_value: result.base_value,
            
            // 1. Structure the Top 3 Drivers for easy query/display later
            drivers: result.top_3_drivers.map((d: any) => ({
              feature: d.feature || d.name,   // Handle different naming conventions
              impact: d.shap_impact || d.value, 
              value: d.model_input_value || 0,
              direction: (d.shap_impact || d.value) > 0 ? "POSITIVE" : "NEGATIVE"
            })),

            // 2. Store the full analysis data (Array)
            plot_analysis_data: result.plot_analysis_data,

            // 3. Store the Base64 Images (String)
            // Note: Ensure these don't exceed Firestore's 1MB limit
            waterfall: result.waterfall_plot,
            force: result.force_plot
          }
        });
        console.log("Firestore updated with SHAP explanation (Images + Data).");

      } catch (fsError) {
        // Log error but don't block the UI
        console.error("Failed to update Firestore explanation:", fsError);
      }
    }
    // Return data for the UI
    return uiReturnData;

  } catch (error) {
    console.error("Error posting SHAP explain request:", error);
    throw error;
  }
}

export const postLLMExplain = async (
  prediction: number,
  drivers: Array<PlotAnalysisData> | Array<any>, 
  raw_input: ForecastPayload, 
  docId?: string
): Promise<string> => { 
  try {
    const response = await fetch(`${API_BASE_URL}/forecast/llm_explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prediction, drivers, raw_input }),
    });

    const text = await response.text();
    let explanationText = "";
    
    // 1. Parse Response
    try {
        const result = JSON.parse(text);
        if (!response.ok) {
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        console.log("LLM explanation result:", result.explanation);
        explanationText = result.explanation;
    } catch (e) {
        console.error("Server returned non-JSON response:", text); 
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
    }

    // 2. Update Firestore (Side Effect)
    // We wrap this in a separate block so it doesn't block the UI return
    if (docId && explanationText) {
      try {
        const forecastRef = doc(firestore, "forecasts", docId); // Use 'db' here
        
        await updateDoc(forecastRef, {
          report: {
            text: explanationText,
            status: "success",
            generatedAt: new Date().toISOString()
          }
        });
        console.log("Firestore updated with LLM Report.");
        
      } catch (fsError) {
        // Log error, but DO NOT throw. We still want to return the text to the user.
        console.error("Failed to update Firestore explanation:", fsError);

        // Optional: Try to mark as failed in DB, but don't break the UI
        try {
            const forecastRef = doc(firestore, "forecasts", docId);
            await updateDoc(forecastRef, {
                "report.status": "failed_save", // Update specific field
                "report.error": fsError instanceof Error ? fsError.message : "Unknown error"
            });
        } catch (_) {}
      }
    }

    // 3. CRITICAL FIX: Return the text here
    // This ensures the UI gets the data even if Firestore fails or docId is missing
    return explanationText;

  } catch (error) {
    console.error("Error posting LLM explain request:", error);
    throw error;
  }
}

export const postFeedback = async (payload: FeedbackData, docId?: string) => {
  if (docId){
    try {
      const forecastRef = doc(firestore, "forecasts", docId); // Use 'db' here
      await updateDoc(forecastRef, {
        feedback:{
          actualValue: payload.actualValue,
          accuracyRating: payload.accuracyRating,
          isUseful: payload.isUseful,
          trustLevel: payload.trustLevel,
          comment: payload.comment,
          feedbackComments: payload.feedbackComments
        }
      });
    } catch (error) {
      console.error("Error posting feedback request:", error);
      throw error;
    }
  }
}