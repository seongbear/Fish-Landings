// src/hooks/useWeather.ts
import { useEffect, useState } from "react";
import { WeatherData } from "../../../../types/weather";
import { fetchWeatherData } from "../../../../api/weatherApi";

export function useWeather(lat: number, lon: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    async function loadWeather() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherData(lat, lon);
        if (isMounted) {
          if (data) {
            setWeather(data);
          } else {
            setError("Failed to fetch weather data");
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Weather fetch error:", err);
          setError(err.message || "Unknown error");
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      isMounted = false;
    };
  }, [lat, lon]);

  return { weather, loading, error };
}
