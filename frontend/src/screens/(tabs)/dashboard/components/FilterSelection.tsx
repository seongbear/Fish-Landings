import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

export const FilterSection = ({ label, icon, options, selected, onSelect }: any) => (
  <View style={{marginBottom: 20}}>
    <View style={{flexDirection:'row', alignItems:'center', gap:6, marginBottom:10}}>
      {icon}
      <Text style={{fontSize:13, fontWeight:'700', color:'#64748B', textTransform:'uppercase'}}>{label}</Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{flexDirection:'row', gap:8}}>
        {options.map((opt: string) => (
          <TouchableOpacity 
            key={opt} 
            style={[styles.chip, selected === opt && styles.chipActive]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
    chipActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
    chipText: { color: '#64748B', fontSize: 14 },
    chipTextActive: { color: '#3B82F6', fontWeight: '700' },
});