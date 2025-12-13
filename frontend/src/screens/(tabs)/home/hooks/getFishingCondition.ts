// Helper function to determine fishing conditions
export function getFishingCondition({
  windSpeed,
  visibility,
  waveHeight,
}: {
  windSpeed: number;
  visibility: number;
  waveHeight: number;
}): { label: string; color: string } {
  if (windSpeed <= 20 && visibility >= 5 && waveHeight <= 2) {
    return { label: 'Great', color: '#29de18' }; // Green
  } else if (windSpeed <= 30 && visibility >= 3 && waveHeight <= 3) {
    return { label: 'Moderate', color: '#f59e0b' }; // Orange
  } else {
    return { label: 'Poor', color: '#ef4444' }; // Red
  }
}

export const calculateFishingScore = (
  weatherCode: number, 
  windSpeed: number, 
  waveHeight: number = 0
): number => {
    // Start with a base neutral score
    let score = 70;

    // Weather Condition Penalties
    // Thunderstorms (Codes 95, 96, 99) -> Heavy penalty
    if ([95, 96, 99].includes(weatherCode)) {
      score -= 40;
    } 
    // General Rain/Snow (Codes > 50 usually indicate precipitation) -> Moderate penalty
    else if (weatherCode > 50) {
      score -= 20;
    }

    // Wind Speed Penalties (Crucial for casting and boat stability)
    if (windSpeed > 25) {
      score -= 30; // Too windy
    } else if (windSpeed > 15) {
      score -= 10; // Choppy
    } else {
      score += 10; // Light wind is ideal
    }

    // Wave Height Penalties (Optional, but recommended for marine apps)
    if (waveHeight > 2.0) {
      score -= 30; // Dangerous swell
    } else if (waveHeight > 1.2) {
      score -= 15; // Uncomfortable
    }

    // Clamp the result between 0 and 100
    return Math.max(0, Math.min(100, score));
};