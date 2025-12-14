import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const SettingRow = ({ icon, label, rightElement, onPress, isLast }: any) => (
    <TouchableOpacity 
      style={[styles.row, isLast && styles.rowLast]} 
      onPress={onPress} 
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
    // Rows
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16 },
    rowLast: { borderBottomWidth: 0 },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconContainer: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    rowLabel: { fontSize: 16, color: '#1F2937', fontWeight: '500' },
    valueText: { fontSize: 14, color: '#6B7280' },
});