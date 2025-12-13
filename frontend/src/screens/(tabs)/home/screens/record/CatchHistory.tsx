import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator 
} from 'react-native';
import { Search, MapPin, Calendar, Weight, Fish, Filter, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Background from '../../../../../components/background';
import { useFishRecord } from '../../hooks/useFishRecord';

// Types
interface CatchRecord {
  id: string;
  species: string;
  weight: number;
  location: string;
  date: any; // Firestore Timestamp
  imageUrl?: string;
}

export default function CatchHistory() {
    const {catchRecords, loading}= useFishRecord();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Heaviest' | 'Recent'>('All');

    // Filter Logic
    const filteredData = catchRecords.filter(item => 
        item.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (filterType === 'Heaviest') return b.weight - a.weight;
        return 0; // Default is already sorted by date from Firestore
    });

    const renderItem = ({ item }: { item: CatchRecord }) => {
        // Handle Firestore Timestamp conversion safely
        const dateObj = item.date?.toDate ? item.date.toDate() : new Date();

        return (
        <View
            style={styles.card} 
        >
            {/* Left: Image or Icon */}
            <View style={styles.imageContainer}>
            {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.fishImage} />
            ) : (
                <View style={styles.placeholderIcon}>
                <Fish size={24} color="#3B82F6" />
                </View>
            )}
            </View>

            {/* Center: Details */}
            <View style={styles.cardContent}>
                <Text style={styles.speciesText}>{item.species}</Text>
                
                <View style={styles.row}>
                    <MapPin size={12} color="#9CA3AF" />
                    <Text style={styles.locationText} numberOfLines={2}>{item.location}</Text>
                </View>

                <View style={styles.row}>
                    <Calendar size={12} color="#9CA3AF" />
                    <Text style={styles.dateText}>
                        {dateObj.toLocaleDateString()}
                    </Text>
                </View>
            </View>

            {/* Right: Weight Badge */}
            <View style={styles.weightBadge}>
            <Text style={styles.weightValue}>{item.weight}</Text>
            <Text style={styles.weightUnit}>kg</Text>
            </View>
        </View>
        );
  };

  return (
    <Background disableTopEdge={true}>
        <View style={styles.container}>
        {/* --- Search & Filter --- */}
        <View style={styles.controlsContainer}>
            <View style={styles.searchBar}>
                <Search size={18} color="#9CA3AF" />
                <TextInput 
                    placeholder="Search species or location..."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            
            {/* Filter Chips */}
            <View style={styles.filterRow}>
                {(['All', 'Recent', 'Heaviest'] as const).map((type) => (
                    <TouchableOpacity 
                        key={type}
                        style={[styles.filterChip, filterType === type && styles.filterChipActive]}
                        onPress={() => setFilterType(type)}
                    >
                        <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        {/* --- List --- */}
        {loading ? (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
        ) : (
            <FlatList
                data={filteredData as CatchRecord[]}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Fish size={48} color="#E5E7EB" />
                        <Text style={styles.emptyText}>No catches found.</Text>
                    </View>
                }
            />
        )}
        </View>
    </Background>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Adjust for Safe Area
    paddingBottom: 20,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },

  // Controls
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchBar: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1F2937' },
  
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#EFF6FF', // Light Blue
    borderColor: '#3B82F6',
  },
  filterText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterTextActive: { color: '#3B82F6', fontWeight: '600' },

  // List
  listContent: { padding: 20 },
  
  // Card Design
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fishImage: { width: '100%', height: '100%', borderRadius: 12 },
  placeholderIcon: { opacity: 0.8 },
  
  cardContent: { flex: 1 },
  speciesText: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4, marginRight: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, marginRight: 8 },
  locationText: { fontSize: 13, color: '#6B7280', marginLeft: 4, marginRight: 8 },
  dateText: { fontSize: 12, color: '#9CA3AF', marginLeft: 4 },

  weightBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4', // Light Green Bg
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  weightValue: { fontSize: 16, fontWeight: '700', color: '#15803D' },
  weightUnit: { fontSize: 10, color: '#15803D', fontWeight: '600' },

  // Empty State
  emptyState: { alignItems: 'center', marginTop: 60, opacity: 0.5 },
  emptyText: { marginTop: 10, fontSize: 16, color: '#6B7280' },
});