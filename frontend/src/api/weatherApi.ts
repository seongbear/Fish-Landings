import { ForecastItem, WeatherData, WeatherDataRaw } from "../screens/(tabs)/home/types/weather";
import { CONDITION_MAP } from "../constants/conditionMap";
import { calculateFishingScore } from "../screens/(tabs)/home/hooks/getFishingCondition";
import { formatForecastDate, getCalculatedTide, getIconName, getSafeWaveHeight, getWindDirection } from "../screens/(tabs)/home/hooks/useForecastWeather";

const conditionMap = CONDITION_MAP

export async function fetchWeatherData(lat: number, lon: number) {
  try {
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m,visibility&current_weather=true&daily=sunrise,sunset,uv_index_max,precipitation_sum,cloudcover_max&timezone=auto`;
    const marineURL = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto`;

    const [weatherRes, marineRes] = await Promise.all([
      fetch(weatherURL),
      fetch(marineURL),
    ]);

    const weatherData: WeatherDataRaw = await weatherRes.json();
    const marineData: any = await marineRes.json();

    // Map weather code → text
    const code = weatherData.current_weather?.weathercode ?? 0;

    // Find closest hourly index
    const currentTime = new Date(weatherData.current_weather.time).getTime();
    const hourlyTimes = weatherData.hourly.time.map((t) => new Date(t).getTime());

    let closestHourIndex = 0;
    let minDiff = Infinity;
    hourlyTimes.forEach((time, index) => {
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

    const result: WeatherData = {
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
    };

    return result;
  } catch (err) {
    console.error("Weather API error:", err);
    return null;
  }
}

export async function fetchFiveDayForecast(lat: number, lon: number): Promise<ForecastItem[] | null> {
  try {
    // A. Construct URLs
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,windspeed_10m_max,winddirection_10m_dominant&hourly=visibility&timezone=auto&forecast_days=5`;
    
    // Marine API often returns null for inland coords, but we request it anyway
    const marineURL = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&daily=wave_height_max&timezone=auto&forecast_days=5`;

    // B. Parallel Fetching
    const [weatherRes, marineRes] = await Promise.all([
      fetch(weatherURL),
      fetch(marineURL)
    ]);

    // C. Data Parsing
    const weatherData = await weatherRes.json();
    const marineData = await marineRes.json();

    if (!weatherData.daily || !weatherData.hourly) {
        throw new Error("Incomplete weather data received");
    }

    // D. Map Data to Forecast Items
    const forecastList: ForecastItem[] = weatherData.daily.time.map((time: string, index: number) => {
        
        // 1. Extract Weather Stats
        const code = weatherData.daily.weathercode[index];
        const maxTemp = Math.round(weatherData.daily.temperature_2m_max[index]);
        const windSpeed = Math.round(weatherData.daily.windspeed_10m_max[index]);
        const windDirDeg = weatherData.daily.winddirection_10m_dominant[index];

        // 2. Extract Visibility (Noon Value = Index * 24 + 12)
        // Midnight visibility (Index * 24) is often foggy; Noon is better for fishing scores.
        const noonIndex = (index * 24) + 12;
        const rawVis = weatherData.hourly.visibility ? weatherData.hourly.visibility[noonIndex] : 10000;
        const visibility = rawVis / 1000; // Convert Meters to KM

        // 3. Extract Marine Stats (With Inland Fallback)
        // Check if marineData.daily exists (it might be missing entirely for inland)
        const rawWave = marineData.daily?.wave_height_max ? marineData.daily.wave_height_max[index] : null;
        const waveHeight = getSafeWaveHeight(rawWave);

        // 4. Format Date
        const { day, dateStr } = formatForecastDate(time);

        // 5. Return Clean Object
        return {
            id: index.toString(),
            day,
            date: dateStr,
            temp: `${maxTemp}°`,
            icon: getIconName(code),
            wind: `${windSpeed} km/h`,
            windDir: getWindDirection(windDirDeg),
            wave: `${waveHeight.toFixed(1)}m`,
            tide: getCalculatedTide(index),
            moon: "moon", // You can hook up a moon phase calculator here later
            code: code,
            windSpeed: windSpeed,
            waveHeight: waveHeight,
            visibility: visibility,
        };
    });

    return forecastList;

  } catch (err) {
    console.error("Forecast API error:", err);
    return null;
  }
}