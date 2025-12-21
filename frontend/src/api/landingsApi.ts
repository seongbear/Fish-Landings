import { ForecastPayload, LandingData } from "../screens/(tabs)/dashboard/types/landings";
import { useAppStore } from "../store/store";

const API_BASE_URL = process.env.API_BASE;

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

export const postForecastLandings = async (payload: ForecastPayload): Promise<number> =>{
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
    return result.predicted_landings;
  } catch (error) {
    console.error("Error posting forecast landings:", error);
    throw error;
  }
}

export const postSHAPExplain = async (payload: ForecastPayload) =>{
  try{
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

    console.log("SHAP explanation result:", result.base_value, result.top_3_drivers);
    // Return the specific fields we need for the UI
    return {
      base_value: result.base_value,
      drivers: result.top_3_drivers,
      waterfall: result.waterfall_plot, // Base64 string
      force: result.force_plot          // Base64 string
    };

  } catch (error) {
    console.error("Error posting SHAP explain request:", error);
    throw error;
  }
}

export const postLLMExplain = async (
  prediction: number,
  drivers: Array<[string, number]>,
  raw_input: ForecastPayload
) => {
  try {
    // ✅ FIX: Correct spelling from "llm_explaination" to "llm_explanation"
    const response = await fetch(`${API_BASE_URL}/forecast/llm_explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure specific keys match what Python expects
      body: JSON.stringify({ prediction, drivers, raw_input }),
    });

    // Error handling wrapper to catch non-JSON responses (like 404/500 HTML pages)
    const text = await response.text();
    try {
        const result = JSON.parse(text);
        if (!response.ok) {
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        console.log("LLM explanation result:", result.explanation);
        return result.explanation;
    } catch (e) {
        // This prints the actual HTML if the server crashes, helping you debug
        console.error("Server returned non-JSON response:", text); 
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    console.error("Error posting LLM explain request:", error);
    throw error;
  }
}