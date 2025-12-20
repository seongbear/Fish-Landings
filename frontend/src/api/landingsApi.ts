import { LandingData } from "../screens/(tabs)/dashboard/types/landings";
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
