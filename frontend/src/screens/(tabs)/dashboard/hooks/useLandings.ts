import { useState, useEffect } from "react";
import { LandingData } from "../types/landings";
import { getLandingsData } from "../../../../api/landingsApi";

export const useLandingsData = (filters?: Record<string, string>, fetchAll = false) => {
  const [landings, setLandings] = useState<LandingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (fetchAll) {
          // Fetch all pages using pagination logic
          const allData = await getLandingsData(filters, 1000, true); // 1000 rows per page
          if (isMounted) setLandings(allData);
        } else {
          // Fetch only first N rows for performance
          const data = await getLandingsData(filters, 200, false); 
          if (isMounted) setLandings(data);
        }

      } catch (e: any) {
        if (isMounted) setError(e.message || "Unknown error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [filters, fetchAll]);

  return { landings, loading, error };
};
