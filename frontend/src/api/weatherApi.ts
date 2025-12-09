import { WeatherData, WeatherDataRaw } from "../screens/(tabs)/home/types/weather";
import { CONDITION_MAP } from "../constants/conditionMap";

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