import { SCORING_CONFIG, WEATHER_SCORE_MODIFIERS } from "../../../../constants/weatherScoring";

// --- 1. Main Calculation Engine ---
export const calculateFishingScore = (
  weatherCode: number, 
  windSpeed: number, 
  waveHeight: number = 0,
  visibility: number = 10 // Default to clear (10km+) if unknown
): number => {
  
  // A. Safety Overrides (Immediate 0)
  // ----------------------------------------------------
  // Thunderstorms (95+), Hurricane winds (>40), or Dense Fog (<1km)
  const isThunderstorm = [95, 96, 99].includes(weatherCode);
  const isUnsafeWind = windSpeed > SCORING_CONFIG.WIND_UNSAFE;
  const isUnsafeVis = visibility < 1.0; 

  if (isThunderstorm || isUnsafeWind || isUnsafeVis) return 0;

  // B. Base Calculation
  // ----------------------------------------------------
  // Default base score (e.g. 60) + Weather Code Modifier (e.g. +10 for Overcast)
  let score = SCORING_CONFIG.BASE_SCORE + (WEATHER_SCORE_MODIFIERS[weatherCode] ?? -10);

  // C. Wind Adjustments
  // ----------------------------------------------------
  if (windSpeed < 5) {
     score -= 5; // Too calm (fish are spooky)
  } else if (windSpeed > SCORING_CONFIG.WIND_IDEAL_MAX) {
     // Progressive Penalty: -2.5 points per km/h over ideal
     const excess = windSpeed - SCORING_CONFIG.WIND_IDEAL_MAX;
     score -= (excess * SCORING_CONFIG.PENALTY_HIGH_WIND);
  } else {
     score += 10; // Bonus: Ideal "ripple" on water
  }

  // D. Wave Adjustments
  // ----------------------------------------------------
  if (waveHeight > 1.5) {
      score -= 20; // Uncomfortable fishing
  }

  // E. Visibility Adjustments (New)
  // ----------------------------------------------------
  if (visibility >= 1.0 && visibility <= 5.0) {
      // "Stealth Mode": Mist/Haze hides the angler/line. Excellent for fishing.
      score += 10; 
  } else if (visibility > 20) {
      // Crystal clear air often means high pressure/bright sun (slight negative)
      score -= 5; 
  }

  // F. Clamp Result (0 - 100)
  console.log(`Calculated Fishing Score: ${score}`);
  return Math.max(SCORING_CONFIG.MIN_SCORE, Math.min(SCORING_CONFIG.MAX_SCORE, Math.round(score)));
};

// --- 2. UI Helper Function ---
export function getFishingCondition({
  weatherCode,
  windSpeed,
  visibility,
  waveHeight,
}: {
  weatherCode: number;
  windSpeed: number;
  visibility: number;
  waveHeight: number;
}): { label: string; color: string; description: string; score: number } {

  // 1. Calculate the Score
  const score = calculateFishingScore(weatherCode, windSpeed, waveHeight, visibility);
  
  // 2. Map Score to UI Labels
  // We return the score object so the UI can use the number (e.g. for a gauge)
  
  // DANGEROUS / DO NOT FISH
  if (score === 0 || windSpeed >= 45 || waveHeight >= 2.5 || visibility < 1.0) {
    return { 
      score,
      label: 'Dangerous', 
      color: '#7F1D1D', // Dark Red
      description: 'High risk. Do not head out.' 
    };
  }
  
  // POOR (1-39)
  if (score < 40) {
    return { 
      score,
      label: 'Poor', 
      color: '#EF4444', // Red
      description: 'Conditions are uncomfortable or unproductive.' 
    };
  }

  // MODERATE (40-59)
  if (score < 60) {
    return { 
      score,
      label: 'Fair', 
      color: '#F59E0B', // Amber
      description: 'Fishable, but requires patience/skill.' 
    };
  }

  // GOOD (60-79)
  if (score < 80) {
    return { 
      score,
      label: 'Good', 
      color: '#10B981', // Green
      description: 'Solid conditions. Fish should be active.' 
    };
  }

  // EXCELLENT (80-100)
  return { 
    score,
    label: 'Excellent', 
    color: '#059669', // Emerald
    description: 'Prime bite time! Perfect visibility and cover.' 
  };
}