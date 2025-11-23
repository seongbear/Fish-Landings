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
