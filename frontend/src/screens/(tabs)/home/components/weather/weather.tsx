import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Wind, Droplets, Eye, Waves, Sunrise, Sunset } from 'lucide-react-native';

// Custom Components & Hooks
import { WeatherBox } from './weatherBox';
import { WeatherIcon } from './weatherIcon';
import { useWeather } from '../../hooks/useWeather';
import { getFishingCondition } from '../../hooks/getFishingCondition';
import { getCurrentLocation } from '../../../../../utils/getCurrentLocation';
import toAMPM from '../../../../../utils/toAMPM';

interface CurrentWeather {
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

export const Weather: React.FC = () => {
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    getCurrentLocation().then(setLocation);
  }, []);

  // Only fetch weather if we have coordinates, otherwise default to 0
  const { weather, loading } = useWeather(
    location?.latitude || 0,
    location?.longitude || 0
  );

  // Prepare Data using useMemo to avoid re-calculating on every render
  const currentWeather: CurrentWeather = useMemo(() => ({
    temp: weather?.temperature || 0,
    condition: weather?.condition || '--',
    windSpeed: weather?.windSpeed || 0,
    humidity: weather?.humidity || 0,
    visibility: weather?.visibility || 0,
    waveHeight: weather?.waveHeight || 0,
    uvIndex: weather?.uvIndex || 0,
    sunrise: weather?.sunrise ? toAMPM(String(weather.sunrise)) : '--:--',
    sunset: weather?.sunset ? toAMPM(String(weather.sunset)) : '--:--',
    code: weather?.code ?? 3,
  }), [weather]);

  const fishingCondition = useMemo(() => getFishingCondition({
    windSpeed: currentWeather.windSpeed,
    visibility: currentWeather.visibility,
    waveHeight: currentWeather.waveHeight,
  }), [currentWeather]);

  const handlePress = () => {
    console.log("Navigating to detailed weather forecast...");
  };

  if (loading || !weather) {
    return (
      <View style={[styles.weatherContainer, styles.centerContent]}>
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  return (
    <View style={styles.weatherContainer}>
      
      {/* --- Current Weather Section --- */}
      <View style={styles.currentWeatherHeader}>
        <View style={styles.headerRow}>
          
          {/* Location & Temp */}
          <View style={styles.headerInfoColumn}>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={16} color="#fff" />
              <Text style={styles.locationText}>{location?.city || 'Unknown'}</Text>
            </View>
            
            <Text style={styles.tempText}>{currentWeather.temp}°C</Text>
            <Text style={styles.conditionText}>{currentWeather.condition}</Text>
            
            <View style={[styles.fishingBadge, { backgroundColor: fishingCondition.color }]}>
              <Ionicons name="ellipse" size={12} color="white" />
              <Text style={styles.fishingText}> {fishingCondition.label} for Fishing</Text>
            </View>
          </View>

          {/* Weather Icon */}
          <WeatherIcon code={currentWeather.code} size={100} color="#fff" />
        </View>
      </View>

      {/* --- Weather Grid Details --- */}
      <View style={styles.statsContainer}>
        <WeatherBox icon={Wind} label="Wind" value={`${currentWeather.windSpeed}`} measurement="km/h" />
        <WeatherBox icon={Droplets} label="Humidity" value={`${currentWeather.humidity}`} measurement="%" />
        <WeatherBox icon={Eye} label="Visibility" value={`${currentWeather.visibility}`} measurement="km" />
        <WeatherBox icon={Waves} label="Wave Height" value={`${currentWeather.waveHeight}`} measurement="m" />
      </View>

      {/* --- Sun Times Section --- */}
      <View style={styles.sunSection}>
        {/* Sunrise */}
        <View style={styles.sunItem}>
          <View style={styles.sunIconCircle}>
            <Sunrise color="#f59e0b" size={24} />
          </View>
          <View>
            <Text style={styles.sunLabel}>Sunrise</Text>
            <Text style={styles.sunTime}>{currentWeather.sunrise}</Text>
          </View>
        </View>

        <View style={styles.verticalDivider} />

        {/* Sunset */}
        <View style={styles.sunItem}>
          <View style={styles.sunIconCircle}>
            <Sunset color="#f59e0b" size={24} />
          </View>
          <View>
            <Text style={styles.sunLabel}>Sunset</Text>
            <Text style={styles.sunTime}>{currentWeather.sunset}</Text>
          </View>
        </View>
      </View>

      <View style={styles.horizontalDivider} />

      {/* --- Footer Action --- */}
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Text style={styles.expandText}>View 5-day forecast {'>'}</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    marginTop: 16,
    backgroundColor: '#f5f8fa',
    borderRadius: 12,
    // Removed fixed height to allow content to grow naturally
    overflow: 'hidden', // Ensures child borders don't overflow rounded corners
  },
  centerContent: {
    height: 200, // Fixed height only for loading state
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: 14,
  },
  
  // Header
  currentWeatherHeader: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfoColumn: {
    flexDirection: 'column',
    flex: 1, // Allows text to take available space
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  tempText: {
    color: '#fff',
    fontSize: 48, // Slightly larger for emphasis
    fontWeight: '700',
  },
  conditionText: {
    color: '#e0f2fe', // Lighter blue-white
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  
  // Fishing Badge
  fishingBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start', // Prevents full width
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  fishingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Stats Grid
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed from space-evenly for better edge alignment
    marginTop: 16,
    paddingHorizontal: 16,
  },

  // Sun Section
  sunSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#faf8de', // Warm background
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sunIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#faebde', // Darker warm accent
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunLabel: {
    fontWeight: '400',
    fontSize: 12,
    color: '#6b7280',
  },
  sunTime: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1f2937',
  },
  
  // Dividers
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#d1d5db',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 20,
    marginBottom: 12,
    marginHorizontal: 16,
  },

  // Footer
  expandText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 16,
  },
});