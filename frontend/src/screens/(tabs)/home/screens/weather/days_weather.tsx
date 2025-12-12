import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSun, 
  Wind, 
  Waves, 
  ArrowUp, 
  Moon, 
  CloudLightning,
  MapPin,
  CloudSnow
} from 'lucide-react-native';
// Adjust these imports to match your actual file structure
import Background from '../../../../../components/background'; 
import useForecastWeather from '../../hooks/useForecastWeather';
import { getActivityColor } from '../../hooks/helperFunction';
import { getCurrentLocation } from '../../../../../utils/getCurrentLocation';

const DaysWeather = () => {
    const [location, setLocation] = useState<any>(null);
    const [locationLoading, setLocationLoading] = useState(true);

    useEffect(() => {
        getCurrentLocation().then(location => {
            setLocation(location);
            setLocationLoading(false);
        });
    }, []);

    const locationCoords = location ? {
        latitude: location.latitude,
        longitude: location.longitude
    } : { latitude: 0, longitude: 0 };

    const locationName = location ? location.city : 'Unknown Location';

    const { forecastList, loading, error } = useForecastWeather(locationCoords.latitude, locationCoords.longitude);

    const isLoading = locationLoading || loading;

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

  // 4. Render Item for FlatList
  const renderItem = ({ item }: { item: typeof forecastList[0] }) => {
    const activityColors = getActivityColor(item.activityScore);

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
            <Text style={styles.marineText}> {item.wind} {item.windDir}</Text>
          </View>
          <View style={styles.marineRow}>
            {getIcon('waves', 14, '#94A3B8')}
            <Text style={styles.marineText}> {item.wave} Swell</Text>
          </View>
          <View style={styles.marineRow}>
            {getIcon('tide', 14, '#94A3B8')}
            {/* The hook returns 'tide' string, e.g. "H 09:00" */}
            <Text style={styles.marineText}> {item.tide}</Text>
          </View>
        </View>

        {/* Right: Fishing Score */}
        <View style={styles.scoreSection}>
          <LinearGradient
            colors={activityColors as any}
            start={{ x: 0.35, y: 0.35 }}
            end={{ x: 1, y: 1 }}
            style={styles.activityBadge}
          >
            <Text style={styles.scoreText}>{item.activityScore}%</Text>
            <Text style={styles.scoreLabel}>Active</Text>
          </LinearGradient>
          <View style={{ marginTop: 6 }}>
            {getIcon(item.moon, 16, '#64748B')}
          </View>
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

  // Handling Loading State
  if (isLoading) {
     return (
        <Background disableTopEdge={true}>
            <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        </Background>
     );
  }

  // 6. Handling Error State
  if (error) {
    return (
        <Background disableTopEdge={true}>
             <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{color: 'red'}}>Unable to load weather data.</Text>
            </View>
        </Background>
    );
  }

  return (
    <Background disableTopEdge={true}>
      <View style={styles.container}>
        <FlatList
          data={forecastList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
        />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 24,
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
    // Soft Shadow
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
  activityBadge: { width: 55, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  scoreText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  scoreLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 8, textTransform: 'uppercase', fontWeight: '600' }
});

export default DaysWeather;