import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X, MapPin, Calendar, Fish, Anchor } from 'lucide-react-native';
import { FilterSection } from './FilterSelection';

export const FilterModal = (
    { showFilterModal, setShowFilterModal, filters, setFilters, getOptions, setFetchAll }: any
) => {
    return (
        <Modal visible={showFilterModal} animationType="slide" transparent>
                <View style={styles.modalBackdrop}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Filter Analysis</Text>
                      <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                        <X size={24} color="#1E293B"/>
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={{maxHeight: 400}} showsVerticalScrollIndicator={false}>
                      <FilterSection label="State" icon={<MapPin size={14} color="#64748B"/>} options={getOptions('state')} selected={filters.state} onSelect={(val: any) => setFilters((prev: any) => ({...prev, state: val}))} />
                      <FilterSection label="Year" icon={<Calendar size={14} color="#64748B"/>} options={getOptions('year')} selected={filters.year} onSelect={(val: any) => setFilters((prev: any) => ({...prev, year: val}))} />
                      <FilterSection label="Species" icon={<Fish size={14} color="#64748B"/>} options={getOptions('species')} selected={filters.species} onSelect={(val: any) => setFilters((prev: any) => ({...prev, species: val}))} />
                      <FilterSection label="Gear Type" icon={<Anchor size={14} color="#64748B"/>} options={getOptions('gear_type')} selected={filters.gear} onSelect={(val: any) => setFilters((prev: any) => ({...prev, gear: val}))} />
                    </ScrollView>
                    <TouchableOpacity 
                      style={styles.applyBtn} 
                      onPress={() => {
                        setShowFilterModal(false);
                        setFetchAll(true);
                      }}
                    >
                      <Text style={styles.applyText}>Apply Filters</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', padding: 20 },
    modalContainer: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
    applyBtn: { backgroundColor: '#0F172A', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
    applyText: { color: 'white', fontWeight: '700', fontSize: 16 },
});