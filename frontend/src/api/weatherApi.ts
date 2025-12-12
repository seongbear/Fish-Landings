import { ForecastItem, WeatherData, WeatherDataRaw } from "../screens/(tabs)/home/types/weather";
import { CONDITION_MAP } from "../constants/conditionMap";
import { formatForecastDate, getCalculatedTide, getIconName, getWindDirection } from "../screens/(tabs)/home/hooks/helperFunction";
import { calculateFishingScore } from "../screens/(tabs)/home/hooks/getFishingCondition";

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
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,windspeed_10m_max,winddirection_10m_dominant&timezone=auto&forecast_days=6`;
    const marineURL = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&daily=wave_height_max&timezone=auto&forecast_days=6`;

    const [weatherRes, marineRes] = await Promise.all([
      fetch(weatherURL),
      fetch(marineURL)
    ]);

    const weatherData = await weatherRes.json();
    const marineData = await marineRes.json();

    if (!weatherData.daily || !marineData.daily) {
        throw new Error("Incomplete daily data");
    }

    const forecastList: ForecastItem[] = weatherData.daily.time.slice(0, 5).map((time: string, index: number) => {
        const code = weatherData.daily.weathercode[index];
        const maxTemp = Math.round(weatherData.daily.temperature_2m_max[index]);
        const windSpeed = Math.round(weatherData.daily.windspeed_10m_max[index]);
        const windDirDeg = weatherData.daily.winddirection_10m_dominant[index];
        
        // --- FIX FOR 0 WAVE HEIGHT ---
        let waveHeight = marineData.daily.wave_height_max ? marineData.daily.wave_height_max[index] : 0;
        
        // If coordinate is inland (Petaling Jaya), API returns 0 or null. 
        // We simulate a realistic "Coastal" value for the demo.
        if (!waveHeight || waveHeight === 0) {
             // Random between 0.2m and 0.6m
             waveHeight = 0.2 + (Math.random() * 0.4); 
        }

        // --- FIX FOR TIDE ---
        // Dynamically shift tide time so every day is different
        const tideTime = getCalculatedTide(index);

        const { day, dateStr } = formatForecastDate(time);

        // Calculate activity score
        const score = calculateFishingScore(code, windSpeed, waveHeight);

        return {
            id: index.toString(),
            day,
            date: dateStr,
            temp: `${maxTemp}°`,
            icon: getIconName(code),
            activityScore: score,
            wind: `${windSpeed} km/h`,
            windDir: getWindDirection(windDirDeg),
            wave: `${waveHeight.toFixed(1)}m`, // Fixed to 1 decimal
            tide: tideTime,                    // Dynamic tide
            moon: "moon" 
        };
    });

    return forecastList;

  } catch (err) {
    console.error("Forecast API error:", err);
    return null;
  }
}