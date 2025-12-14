import { useEffect, useState } from "react";
import { ForecastItem } from "../types/weather";
import { fetchFiveDayForecast } from "../../../../api/weatherApi";

// --- Helper Functions ---
export const getIconName = (code: number): string => {
    if (code === 0) return 'sun';
    if (code >= 1 && code <= 3) return 'cloud';
    if ([45, 48].includes(code)) return 'cloud';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'cloud-snow';
    if ([95, 96, 99].includes(code)) return 'storm';
    return 'cloud';
};

export const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
};

export const formatForecastDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' }); 
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return { day, dateStr };
};
    
export const getActivityColor = (score: number): [string, string] => {
    // 1. Excellent (80 - 100) -> Emerald
    if (score >= 80) {
        return ['#059669', '#064E3B']; // Emerald-600, Emerald-900
    }
    
    // 2. Good (60 - 79) -> Green
    if (score >= 60) {
        return ['#10B981', '#047857']; // Emerald-500, Emerald-700
    }
    
    // 3. Fair / Moderate (40 - 59) -> Amber (Orange)
    if (score >= 40) {
        return ['#F59E0B', '#B45309']; // Amber-500, Amber-700
    }
    
    // 4. Poor (15 - 39) -> Red
    if (score >= 15) {
        return ['#EF4444', '#B91C1C']; // Red-500, Red-700
    }
    
    // 5. Dangerous (< 15) -> Dark Red
    return ['#7F1D1D', '#450A0A']; // Red-900, Red-950
};

export const getCalculatedTide = (dayIndex: number) => {
    const startHour = 9; // Start at 9:00 AM
    const minutesPerDay = 50; 
    
    const totalMinutes = (startHour * 60) + (dayIndex * minutesPerDay);
    const hours = Math.floor(totalMinutes / 60) % 24; // Keep within 24h
    const mins = totalMinutes % 60;
    
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `H ${hours}:${formattedMins}`;
};

export const getSafeWaveHeight = (rawHeight: number | null | undefined): number => {
    if (typeof rawHeight === 'number' && rawHeight > 0) return rawHeight;
    // Fallback: Random calm swell (0.2m - 0.5m)
    return parseFloat((0.2 + Math.random() * 0.3).toFixed(2));
};

export const useForecastWeather = (lat: number, lon: number) => {
    const [forecastList, setForecastList] = useState<ForecastItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- Main Fetch Logic ---
    useEffect(() => {
        // 1. Guard Clause: Stop execution if coordinates are invalid (0, 0, or undefined)
        if (!lat || !lon) {
            // Keep loading true if you want to wait for location, 
            // OR set it false if you want to show an empty state.
            // Usually, we wait for location.
            return; 
        }

        let isMounted = true;

        async function loadForecast() {
            setLoading(true);
            setError(null);

            try {
                const processedData = await fetchFiveDayForecast(lat, lon);
                
                if (isMounted) {
                    if (processedData) {
                        setForecastList(processedData);
                    } else {
                        // 2. Handle the "null" return from the API function
                        setError("Failed to retrieve weather data.");
                    }
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
