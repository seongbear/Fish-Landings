import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, ActivityIndicator 
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Filter, X, TrendingUp, Fish, MapPin, Thermometer, Anchor, Calendar, Wind, Droplets 
} from 'lucide-react-native';
// Adjust imports to your project structure
import { LandingData } from '../types/landings';
import { useLandingsData } from '../hooks/useLandings';
import { FilterModal } from '../components/FilterModal';
import { NoData } from '../components/NoData';
import { Header } from '../components/Header';
import { EnvironmentalAvg } from '../components/EnvironmentalAvg';

const { width } = Dimensions.get('window');

export default function DashboardPage() {
  // --- Filter State ---
  const [filters, setFilters] = useState({
    state: 'All',
    year: 'All',
    species: 'All',
    gear: 'All'
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [fetchAll, setFetchAll] = useState(false);

  // --- Load Data ---
  const { landings, loading, error } = useLandingsData(filters, fetchAll); 
  const RAW_DATA = Array.isArray(landings) ? landings : [];

  // --- Analytics Engine ---
  const analytics = useMemo(() => {
    if (RAW_DATA.length === 0) {
      return { 
        totalLandings: 0, 
        avgTemp: 0, 
        avgWind: 0, 
        avgHumid: 0, 
        trendData: [], 
        speciesData: [], 
        gearData: [], 
        envData: [], 
        seasonalityData: [] 
      };
    }

    // 1. Filter Data
    const filtered = RAW_DATA.filter(d => {
      return (filters.state === 'All' || d.state === filters.state) &&
             (filters.year === 'All' || d.year.toString() === filters.year) &&
             (filters.species === 'All' || d.species === filters.species) &&
             (filters.gear === 'All' || d.gear_type === filters.gear);
    });

    const totalLandings = filtered.reduce((a, b) => a + b.landings, 0);
    const count = filtered.length || 1;

    // 2. Weather Averages
    // Fallback to 0 if fields are missing in data
    const avgTemp = filtered.reduce((a, b) => a + (b.temperature || 0), 0) / count;
    const avgWind = filtered.reduce((a, b) => a + (b.wind_speed || 0), 0) / count;
    const avgHumid = filtered.reduce((a, b) => a + (b.dew_point || 0), 0) / count;

    // 3. Monthly Trend (Line Chart)
    const monthlyCatch = new Array(12).fill(0);
    filtered.forEach(d => { if(d.month >= 1 && d.month <= 12) monthlyCatch[d.month-1] += d.landings });
    const trendData = monthlyCatch.map((val, i) => ({
      value: val,
      label: ['J','F','M','A','M','J','J','A','S','O','N','D'][i],
      hideDataPoint: true
    }));

    // 4. Species Composition
    const speciesMap: Record<string, number> = {};
    filtered.forEach(d => speciesMap[d.species] = (speciesMap[d.species] || 0) + d.landings);
    const speciesData = Object.keys(speciesMap).map((key, i) => ({
      value: speciesMap[key],
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5],
      text: `${((speciesMap[key]/(totalLandings || 1))*100).toFixed(0)}%`,
      legend: key
    })).sort((a,b) => b.value - a.value).slice(0, 5);

    // 5. Gear Efficiency
    const gearMap: Record<string, number> = {};
    filtered.forEach(d => gearMap[d.gear_type] = (gearMap[d.gear_type] || 0) + d.landings);
    const gearData = Object.keys(gearMap).map(key => ({
      value: gearMap[key],
      label: key.split(' ')[0],
      frontColor: '#6366F1',
    })).sort((a,b) => b.value - a.value).slice(0, 5);

    // 6. Environmental Impact
    const tempBuckets = { '<27°C': 0, '27-28°C': 0, '>28°C': 0 };
    filtered.forEach(d => {
      if (d.temperature < 27) tempBuckets['<27°C'] += d.landings;
      else if (d.temperature <= 28) tempBuckets['27-28°C'] += d.landings;
      else tempBuckets['>28°C'] += d.landings;
    });
    const envData = Object.keys(tempBuckets).map(key => ({
      value: tempBuckets[key as keyof typeof tempBuckets],
      label: key,
      frontColor: key.includes('>28') ? '#F87171' : '#34D399',
    }));

    // 7. Seasonality
    const seasonalityData = monthlyCatch.map((val, i) => ({
      value: val,
      label: ['J','F','M','A','M','J','J','A','S','O','N','D'][i],
      frontColor: val === Math.max(...monthlyCatch) && val > 0 ? '#F59E0B' : '#CBD5E1',
    }));

    return { totalLandings, avgTemp, avgWind, avgHumid, trendData, speciesData, gearData, envData, seasonalityData };
  }, [filters, RAW_DATA]);

  // --- Helper for Unique Options ---
  const getOptions = (key: keyof LandingData) => {
    if (!RAW_DATA || RAW_DATA.length === 0) return ['All'];
    const values = RAW_DATA.map(d => d[key] ? d[key].toString() : "").filter(v => v !== "");
    return ['All', ...Array.from(new Set(values)).sort()];
  };

  // --- Loading / Error States ---
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 10, color: '#64748B' }}>Loading catch data...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#EF4444', fontWeight: '700' }}>Error loading data</Text>
        <Text style={{ color: '#64748B', marginTop: 6 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        {/* --- Header --- */}
        <Header setShowFilterModal={setShowFilterModal} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HERO TREND --- */}
        <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroLabel}>TOTAL LANDINGS</Text>
              <Text style={styles.heroValue}>{analytics.totalLandings.toFixed(1)} <Text style={styles.heroUnit}>tonnes</Text></Text>
            </View>
            <View style={styles.heroIcon}><TrendingUp size={24} color="#10B981" /></View>
          </View>
          <View style={styles.heroChart}>
            {analytics.trendData.length > 0 && (
              <LineChart
                data={analytics.trendData}
                curved
                thickness={3}
                color="#3B82F6"
                hideRules
                hideYAxisText
                hideAxesAndRules
                height={100}
                width={width - 80}
                startFillColor="rgba(59, 130, 246, 0.3)"
                endFillColor="rgba(59, 130, 246, 0.0)"
                startOpacity={1}
                endOpacity={0.1}
                areaChart
                initialSpacing={0}
              />
            )}
          </View>
        </LinearGradient>

        {/* --- ENVIRONMENTAL AVERAGES (Weather Metrics) --- */}
        <Text style={styles.sectionTitleSmall}>ENVIRONMENTAL AVERAGES</Text>
        <EnvironmentalAvg avgTemp={analytics.avgTemp} avgWind={analytics.avgWind} avgHumid={analytics.avgHumid} />

        {/* --- Active Filters Chips --- */}
        <View style={styles.activeFilters}>
          {Object.entries(filters).map(([key, val]) => val !== 'All' && (
            <View key={key} style={styles.filterChip}>
              <Text style={styles.filterChipText}>{val}</Text>
            </View>
          ))}
        </View>

        {/* --- Species Composition --- */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, {backgroundColor:'#EFF6FF'}]}><Fish size={18} color="#3B82F6"/></View>
            <Text style={styles.cardTitle}>Species Distribution</Text>
          </View>
          <View style={styles.rowBetween}>
            {analytics.speciesData.length > 0 ? (
              <PieChart
                data={analytics.speciesData}
                donut
                radius={70}
                innerRadius={45}
                textSize={10}
                textColor="white"
                fontWeight="bold"
                showText
              />
            ) : <NoData />}
            <View style={styles.legendContainer}>
              {analytics.speciesData.map((item, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.dot, {backgroundColor: item.color as string}]} />
                  <Text style={styles.legendText}>{item.legend}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* --- Gear Efficiency --- */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, {backgroundColor:'#EEF2FF'}]}><Anchor size={18} color="#6366F1"/></View>
            <Text style={styles.cardTitle}>Top Gear Types</Text>
          </View>
          {analytics.gearData.length > 0 ? (
            <BarChart
              data={analytics.gearData}
              barWidth={30}
              spacing={24}
              roundedTop
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{color:'#94A3B8', fontSize:10}}
              height={180}
              isAnimated
            />
          ) : <NoData />}
        </View>

        {/* --- Environmental Impact --- */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, {backgroundColor:'#ECFDF5'}]}><Thermometer size={18} color="#10B981"/></View>
            <Text style={styles.cardTitle}>Impact: Temp vs Catch</Text>
          </View>
          {analytics.envData.some(d => d.value > 0) ? (
            <BarChart
              data={analytics.envData}
              barWidth={50}
              spacing={40}
              roundedTop
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              height={150}
              isAnimated
              renderTooltip={(item: any) => (
                <View style={{backgroundColor:'black', padding:6, borderRadius:4}}>
                  <Text style={{color:'white'}}>{item.value.toFixed(1)}t</Text>
                </View>
              )}
            />
          ) : <NoData />}
        </View>

        {/* --- Seasonality --- */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, {backgroundColor:'#FFFBEB'}]}><Calendar size={18} color="#F59E0B"/></View>
            <Text style={styles.cardTitle}>Seasonality (Peak Months)</Text>
          </View>
          {analytics.seasonalityData.some(d => d.value > 0) ? (
            <BarChart
              data={analytics.seasonalityData}
              barWidth={18}
              spacing={10}
              roundedTop
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              height={150}
            />
          ) : <NoData />}
        </View>

        <View style={{height: 40}} />
      </ScrollView>

      {/* --- Filter Modal --- */}
      <FilterModal 
        showFilterModal={showFilterModal} 
        setShowFilterModal={setShowFilterModal} 
        filters={filters} 
        setFilters={setFilters} 
        getOptions={getOptions} 
        setFetchAll={setFetchAll} 
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  scrollContent: { padding: 20 },
  heroCard: { borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  heroLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  heroValue: { color: 'white', fontSize: 32, fontWeight: '800' },
  heroUnit: { fontSize: 16, fontWeight: '500', color: '#94A3B8' },
  heroIcon: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 12 },
  heroChart: { marginLeft: -10, marginBottom: -10 },
  
  // Weather Row
  sectionTitleSmall: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 12, marginLeft: 4 },

  activeFilters: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom: 16 },
  filterChip: { backgroundColor:'#E2E8F0', paddingHorizontal:10, paddingVertical:4, borderRadius:6 },
  filterChipText: { fontSize:11, color:'#475569', fontWeight:'600' },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  legendContainer: { gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 13, color: '#475569', fontWeight: '500' },
});