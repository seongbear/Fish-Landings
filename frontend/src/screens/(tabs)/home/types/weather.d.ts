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
