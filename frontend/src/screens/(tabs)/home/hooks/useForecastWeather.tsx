import { useEffect, useState } from "react";
import { ForecastItem } from "../types/weather";
import { fetchFiveDayForecast } from "../../../../api/weatherApi";
import { getCurrentLocation } from "../../../../utils/getCurrentLocation";

const useForecastWeather = (lat: number, lon: number) => {
    const [forecastList, setForecastList] = useState<ForecastItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // --- Main Fetch Logic ---
    useEffect(() => {
        let isMounted = true;

        async function loadForecast() {
            setLoading(true);
            setError(null);

            try {
                // The API now handles all formatting (icons, dates, wind direction) internally.
                const processedData = await fetchFiveDayForecast(lat, lon);
                
                if (isMounted) {
                    setForecastList(processedData || []);
                }

            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Unknown error");
                    console.error("Hook Error:", err);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadForecast();

        return () => { isMounted = false; };
    }, [lat, lon]); 
    

    // Return the state so the UI can use it
    return { forecastList, loading, error };
};

export default useForecastWeather;