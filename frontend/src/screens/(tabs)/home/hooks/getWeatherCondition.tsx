import { useEffect, useState } from "react";

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: string;
  waveHeight: number;
  sunrise: string;
  sunset: string;
  uvIndex?: number;
  precipitation?: number;
  cloudCover?: number;
  code: number;
  fishing: boolean;
}

export function useWeather(lat: number, lon: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Main weather API
        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m,visibility&current_weather=true&daily=sunrise,sunset,uv_index_max,precipitation_sum,cloudcover_max&timezone=auto`;
        // Marine API (wave height)
        const marineURL = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto`;
        
        const [weatherRes, marineRes] = await Promise.all([
          fetch(weatherURL),
          fetch(marineURL),
        ]);

        const weatherData = await weatherRes.json();
        const marineData = await marineRes.json();

        // Map weather code → text
        const conditionMap: Record<number, string> = {
          0: "Clear",
          1: "Mainly Clear",
          2: "Partly Cloudy",
          3: "Cloudy",
          45: "Fog",
          48: "Deep Fog",
          51: "Light Drizzle",
          53: "Moderate Drizzle",
          55: "Dense Drizzle",
          56: "Freezing Drizzle",
          61: "Slight Rain",
          63: "Moderate Rain",
          65: "Heavy Rain",
          66: "Freezing Rain",
          67: "Heavy Freezing Rain",
          71: "Slight Snow",
          73: "Moderate Snow",
          75: "Heavy Snow",
          77: "Snow Grains",
          80: "Rain Showers",
          81: "Moderate Rain Showers",
          82: "Violent Rain Showers",
          85: "Snow Showers",
          86: "Heavy Snow Showers",
          95: "Thunderstorm",
          96: "Thunderstorm with slight hail",
          99: "Thunderstorm with heavy hail",
        };

        const code = weatherData.current_weather?.weathercode ?? 0;

        // Find closest hourly index
        const currentTime = new Date(weatherData.current_weather.time).getTime();
        const hourlyTimes = weatherData.hourly.time.map((t: string) =>
          new Date(t).getTime()
        );
        let closestHourIndex = 0;
        let minDiff = Infinity;
        hourlyTimes.forEach((time: number, index: number) => {
          const diff = Math.abs(time - currentTime);
          if (diff < minDiff) {
            minDiff = diff;
            closestHourIndex = index;
          }
        });

        const humidity = weatherData.hourly.relative_humidity_2m?.[closestHourIndex] ?? 0;
        const visibility = (weatherData.hourly.visibility?.[closestHourIndex] ?? 0) / 1000;
        const windSpeed = weatherData.current_weather?.windspeed ?? 0;
        const waveHeight = marineData.hourly?.wave_height?.[0] ?? 0;

        // Determine if great for fishing
        const fishing = 
          visibility > 3 &&
          windSpeed < 20 &&
          !["Heavy Rain", "Thunderstorm", "Violent Rain Showers"].includes(conditionMap[code] || "");

        setWeather({
          temperature: weatherData.current_weather?.temperature ?? 0,
          humidity,
          windSpeed,
          visibility,
          condition: conditionMap[code] || "Unknown",
          waveHeight,
          sunrise: weatherData.daily?.sunrise?.[0] ?? "",
          sunset: weatherData.daily?.sunset?.[0] ?? "",
          uvIndex: weatherData.daily?.uv_index_max?.[0],
          precipitation: weatherData.daily?.precipitation_sum?.[0],
          cloudCover: weatherData.daily?.cloudcover_max?.[0],
          code,
          fishing,
        });

        setLoading(false);
      } catch (err) {
        console.error("Weather fetch error", err);
        setLoading(false);
      }
    }

    load();
  }, [lat, lon]);
  return { weather, loading };
}
