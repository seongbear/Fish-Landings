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

export interface WeatherDataRaw {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    time: string[];
    relative_humidity_2m?: number[];
    visibility?: number[];
    wave_height?: number[];
  };
  daily?: {
    sunrise?: string[];
    sunset?: string[];
    uv_index_max?: number[];
    precipitation_sum?: number[];
    cloudcover_max?: number[];
  };
}

export interface CurrentWeather {
  temp: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  visibility: number;
  waveHeight: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  code: number;
}

// types/weather.ts
export interface ForecastItem {
  id: string;
  day: string;          // e.g., "Fri"
  date: string;         // e.g., "12 Dec"
  temp: string;         // e.g., "26°"
  icon: string;         // Lucide icon name: 'sun', 'cloud', 'rain', etc.
  wind: string;         // e.g., "12 km/h"
  windDir: string;      // e.g., "NE"
  wave: string;         // e.g., "0.5m"
  tide: string;         // e.g., "H 09:00" (Mocked if API doesn't provide)
  moon: string;         // e.g., "moon-full"
  windSpeed?: number;
  waveHeight?: number;
  visibility?: number;
  code?: number;
}