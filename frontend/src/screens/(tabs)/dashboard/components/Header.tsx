import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Filter } from "lucide-react-native";

export const Header = (
    { setShowFilterModal }: { setShowFilterModal: (val: boolean) => void }
) => {
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Fisheries Analytics</Text>
          <Text style={styles.headerSubtitle}>Deep Dive National Analysis</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterModal(true)}>
          <Filter size={20} color="white" />
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
    headerSubtitle: { fontSize: 13, color: '#64748B' },
    filterBtn: { backgroundColor: '#0F172A', padding: 10, borderRadius: 12 },
});
