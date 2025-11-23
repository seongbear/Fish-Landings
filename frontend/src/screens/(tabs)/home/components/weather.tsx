import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cloud, Wind, Droplets, Eye, Waves, Sunrise, Sunset } from 'lucide-react-native';
import { WeatherBox } from './weatherBox';
import { useWeather } from '../hooks/getWeatherCondition';
import toAMPM from '../../../../utilities/helper/toAMPM';
import { getCurrentLocation } from '../../../../utilities/helper/getCurrentLocation';
import { WeatherIcon } from './weatherIcon';
import { getFishingCondition } from '../hooks/getFishingCondition';

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
  const [location, setLocation] = useState<any>(null);  useEffect(() => {
    getCurrentLocation().then(setLocation);
  }, []);

  const { weather, loading } = useWeather(location?.latitude || 37.774929 , location?.longitude || -122.419416 );
  const currentWeather: CurrentWeather = {
    temp: weather?.temperature || 20,
    condition: weather?.condition || 'Partly Cloudy',
    windSpeed: weather?.windSpeed || 15,
    humidity: weather?.humidity || 65,
    visibility: weather?.visibility || 10,
    waveHeight: weather?.waveHeight || 1.2,
    uvIndex: weather?.uvIndex || 5,
    sunrise: toAMPM(String(weather?.sunrise ?? '')) || '6:15 AM',
    sunset: toAMPM(String(weather?.sunset ?? '')) || '7:45 PM',
    code: weather ? weather.code : 3,
  };

  const fishingCondition = getFishingCondition({
    windSpeed: currentWeather.windSpeed,
    visibility: currentWeather.visibility,
    waveHeight: currentWeather.waveHeight,
  });

  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.weatherContainer}>
      {/* Current Weather Section */}
      <View style={styles.currentWeather}>
          <View style={{flexDirection: 'row'}}>
            {/* Current Weather Location */}
            <View style={{flexDirection: 'column'}}>
              <View style={styles.currentLocation}>
                <Ionicons name="location-sharp" size={16} color="#fff" />
                <Text style={styles.currentLocationText}>{location?.city || 'San Francisco'}</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 40, fontWeight: '600', }}>{currentWeather.temp}°C</Text>
              <Text style={{ color: '#fff', fontSize: 16, marginBottom: 10 }}>{currentWeather.condition}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, width: 140, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: fishingCondition.color, paddingHorizontal: 12, paddingVertical: 6,}}>
                <Ionicons name="ellipse" size={12} color="white"/>  
                <Text style={{ color: '#fff', fontSize: 12, marginLeft: 6}}>{fishingCondition.label} for Fishing</Text>
              </View>
            </View>

            {/* Icon */}
            <WeatherIcon code={weather?.code || 0} size={100} color="#fff" />
          </View>     
      </View>

      {/* Weather Detail Section */}
      <View style={styles.weatherDetailSection}>
        <WeatherBox icon={Wind} label="Wind" value={`${currentWeather.windSpeed}`} measurement="km/h" />
        <WeatherBox icon={Droplets} label="Humidity" value={`${currentWeather.humidity}`} measurement="%" />
        <WeatherBox icon={Eye} label="Visibility" value={`${currentWeather.visibility}`} measurement="km" />
        <WeatherBox icon={Waves} label="Wave Height" value={`${currentWeather.waveHeight}`} measurement="m" />          
      </View>

      {/* Sunset and Sunrise Section */}
      <View style={styles.sunSection}>
        {/* Sunrise */}
        <View style={styles.sunItem}>
          <View style={styles.sunCircle}>
            <Sunrise color="#f59e0b" size={24} />
          </View>
          <View style={{flexDirection: 'column'}}>
              <Text style={styles.sunLabel}>Sunrise</Text>
              <Text style={styles.sunTime}>{currentWeather.sunrise}</Text>
          </View>

        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Sunset */}
        <View style={styles.sunItem}>
          <View style={styles.sunCircle}>
            <Sunset color="#f59e0b" size={24} />
          </View>
          <View style={{flexDirection: 'column'}}>
              <Text style={styles.sunLabel}>Sunset</Text>
              <Text style={styles.sunTime}>{currentWeather.sunset}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 0.5, backgroundColor: '#d1d5db', marginVertical: 16 }} />

      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.expandText}>
          View 5-day forecast {'>'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    marginTop: 16,
    backgroundColor: '#f5f8fa',
    borderRadius: 12,
    height: 435,
  },
  currentWeather: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,    
  },
  currentLocation:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentLocationText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '400', 
    marginLeft: 4,
  },
  weatherDetailSection:{ 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    marginTop: 10, 
    paddingHorizontal: 5 
  },
  sunSection:{ 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    marginTop: 15, 
    paddingHorizontal: 5, 
    marginHorizontal: 10,
    backgroundColor: '#faf8de',
    borderRadius: 10,
    paddingVertical: 10,
  },
  sunCircle: {
    width: 40,              // diameter of the circle
    height: 40,
    borderRadius: 20,       // half of width/height for perfect circle
    backgroundColor: '#faebde', // semi-transparent yellow
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sunLabel: {
    fontWeight: '400',
    fontSize: 12,
    color: 'grey',
  },
  sunTime:{
    fontWeight: '600',
    fontSize: 14,
    color: 'black',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#d1d5db', // light gray
    marginHorizontal: 12,
  },
  expandText: {
    fontWeight: '400',
    fontSize: 15,
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 12,
  },
});
