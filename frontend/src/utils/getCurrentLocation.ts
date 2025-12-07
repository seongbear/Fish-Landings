import * as Location from 'expo-location';

interface CurrentLocation {
  latitude: number;
  longitude: number;
  name?: string;       // e.g., city or street
  city?: string;       // added city
  region?: string;     // e.g., state or district
  country?: string;
}

export async function getCurrentLocation(): Promise<CurrentLocation | { error: string }> {
  try {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { error: 'Location permission denied' };
    }

    // Get current coordinates
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const { latitude, longitude } = location.coords;

    // Reverse geocode to get human-readable location
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });

    return {
      latitude,
      longitude,
      name: address.name || address.street || '',
      city: address.city || '',
      region: address.region || '',
      country: address.country || '',
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
