import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Cloud, Sun, CloudRain, CloudSun, Wind, Waves, ArrowUp, Moon, CloudLightning, MapPin, CloudSnow } from 'lucide-react-native';
import Background from '../../../../../components/background'; 
import  { getActivityColor, useForecastWeather } from '../../hooks/useForecastWeather'; 
import { getCurrentLocation } from '../../../../../utils/getCurrentLocation'; 
import { ForecastItem } from '../../types/weather'; 
import { calculateFishingScore } from '../../hooks/getFishingCondition';

export default function DaysWeather() {
    const [location, setLocation] = useState<any>(null);
    const [locationLoading, setLocationLoading] = useState(true);

    // 1. Get Location on Mount
    useEffect(() => {
        getCurrentLocation().then(loc => {
            setLocation(loc);
            setLocationLoading(false);
        }).catch(() => {
            setLocationLoading(false); // Stop loading even if fail
        });
    }, []);

  // 2. Prepare Coords (Guard against null)
  const lat = location?.latitude || 0;
  const lon = location?.longitude || 0;
  const locationName = location?.city || 'Locating...';

  // 3. Fetch Data (Hook handles the 0,0 check internally)
  const { forecastList, loading, error } = useForecastWeather(lat, lon);
  const isLoading = locationLoading || (loading && forecastList.length === 0);

  // --- Icon Helper ---
  const getIcon = (name: string, size = 20, color = '#000') => {
    const props = { size, color };
    switch (name) {
        case 'sun': return <Sun {...props} />;
        case 'cloud': return <Cloud {...props} />;
        case 'rain': return <CloudRain {...props} />;
        case 'partly-cloudy': return <CloudSun {...props} />;
        case 'storm': return <CloudLightning {...props} />;
        case 'cloud-snow': return <CloudSnow {...props} />;
        case 'wind': return <Wind {...props} />;
        case 'waves': return <Waves {...props} />;
        case 'tide': return <ArrowUp {...props} />;
        case 'moon': return <Moon {...props} />;
        default: return <Cloud {...props} />;
    }
  };

  // --- Render Item ---
  const renderItem = ({ item }: { item: ForecastItem }) => {
    // Get distinct colors based on score   
    const score = calculateFishingScore(item.code || 0, item.windSpeed || 0, item.waveHeight || 0, item.visibility || 0); 
    const colors = getActivityColor(score);

    return (
      <View style={styles.cardContainer}>
        {/* Left: Date & Basic Weather */}
        <View style={styles.dateSection}>
          <Text style={styles.dayText}>{item.day}</Text>
          <Text style={styles.dateSubText}>{item.date}</Text>
          <View style={styles.basicWeather}>
            {getIcon(item.icon, 20, '#64748B')}
            <Text style={styles.tempText}>{item.temp}</Text>
          </View>
        </View>

        {/* Center: Marine Details */}
        <View style={styles.marineSection}>
          <View style={styles.marineRow}>
            {getIcon('wind', 14, '#94A3B8')}
            <Text style={styles.marineText}> {item.wind}{item.windDir}</Text>
          </View>
          <View style={styles.marineRow}>
            {getIcon('waves', 14, '#94A3B8')}
            <Text style={styles.marineText}> {item.wave} Swell</Text>
          </View>
          <View style={styles.marineRow}>
            {getIcon('tide', 14, '#94A3B8')}
            <Text style={styles.marineText}> {item.tide}</Text>
          </View>
        </View>

        {/* Right: Fishing Score */}
        <View style={styles.scoreSection}>
          <LinearGradient
            colors={colors} // Pass the string array directly
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activityBadge}
          >
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </LinearGradient>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.headerTitle}>5-Day Forecast</Text>
      <View style={styles.locationRow}>
        <MapPin size={14} color="#3B82F6" />
        <Text style={styles.locationText}>{locationName}</Text>
      </View>
    </View>
  );

  // --- Loading State ---
  if (isLoading) {
      return (
         <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
         </View>
      );
  }

  // --- Error State ---
  if (error) {
    return (
        <View style={styles.centerContainer}>
             <Text style={{color: '#EF4444'}}>Unable to load weather data.</Text>
        </View>
    );
  }

  // --- Success State ---
  return (
    <Background disableTopEdge={true}>
      <View style={styles.container}>
          <FlatList
            data={forecastList}
            keyExtractor={(item) => item.date} 
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
         />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F8FAFC'
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateSection: { width: '25%', justifyContent: 'center' },
  dayText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  dateSubText: { fontSize: 12, color: '#94A3B8', marginBottom: 6 },
  basicWeather: { flexDirection: 'row', alignItems: 'center' },
  tempText: { fontSize: 16, fontWeight: '600', color: '#334155', marginLeft: 6 },
  marineSection: { flex: 1, paddingHorizontal: 12, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F1F5F9', justifyContent: 'center' },
  marineRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  marineText: { fontSize: 12, color: '#475569', marginLeft: 6, fontWeight: '500' },
  scoreSection: { width: '20%', alignItems: 'center', justifyContent: 'center' },
  activityBadge: { width: 55, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scoreText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  scoreLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 9, textTransform: 'uppercase', fontWeight: '600' }
});
