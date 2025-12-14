// Maps WMO code -> Score adjustment (e.g., +10 or -30)
export const WEATHER_SCORE_MODIFIERS: Record<number, number> = {
  // Clear Sky / Low Cloud (Bright sun can spook fish)
  0: -5,   // Clear sky (Too bright)
  1: 0,    // Mainly clear (Neutral)
  2: 5,    // Partly cloudy (Good visibility but some cover)
  3: 15,   // Overcast (Excellent! Fish feel safe)

  // Fog (Good cover, but dangerous navigation)
  45: 5,   // Fog
  48: 0,   // Depositing rime fog

  // Drizzle (Often excellent for fishing)
  51: 10,  // Light Drizzle (Breaks surface tension)
  53: 5,   // Moderate Drizzle
  55: 0,   // Dense Drizzle (Getting wet/uncomfortable)
  56: -5,  // Freezing Drizzle
  57: -10, // Dense Freezing Drizzle

  // Rain
  61: 5,   // Slight Rain (Good)
  63: -10, // Moderate Rain (Comfort issue)
  65: -20, // Heavy Rain (Muddy water, bad visibility)
  66: -25, // Freezing Rain
  67: -35, // Heavy Freezing Rain

  // Snow (Can be good, but cold)
  71: 0,   // Slight Snow
  73: -10, // Moderate Snow
  75: -20, // Heavy Snow
  77: -5,  // Snow Grains

  // Showers (Unstable pressure)
  80: -5,  // Slight Rain Showers
  81: -15, // Moderate Rain Showers
  82: -30, // Violent Rain Showers

  // Snow Showers
  85: -15, // Slight Snow Showers
  86: -25, // Heavy Snow Showers

  // Thunderstorms (DANGER)
  95: -100, // Thunderstorm (Safety First!)
  96: -100, // Thunderstorm + Slight Hail
  99: -100, // Thunderstorm + Heavy Hail
};

export const SCORING_CONFIG = {
  BASE_SCORE: 65, // Start slightly higher since we have specific penalties now
  MAX_SCORE: 100,
  MIN_SCORE: 0,
  WIND_IDEAL_MAX: 15,
  WIND_UNSAFE: 40,
  PENALTY_HIGH_WIND: 2.5,
};