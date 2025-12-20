import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Thermometer, Wind, Droplets } from "lucide-react-native"

const { width } = require("react-native").Dimensions.get('window');

export const EnvironmentalAvg = ({
    avgTemp,
    avgWind,
    avgHumid
}: {
    avgTemp: number;
    avgWind: number;
    avgHumid: number;
}) => {
    return (
        <View style={styles.weatherRow}>
            {/* Temp Card */}
            <LinearGradient colors={['#F97316', '#EA580C']} style={styles.weatherCard}>
                <View style={styles.weatherIconBox}><Thermometer size={18} color="white" /></View>
                <Text style={styles.weatherValue}>{avgTemp.toFixed(1)}°C</Text>
                <Text style={styles.weatherLabel}>Avg Temp</Text>
            </LinearGradient>

            {/* Wind Card */}
            <LinearGradient colors={['#64748B', '#475569']} style={styles.weatherCard}>
                <View style={styles.weatherIconBox}><Wind size={18} color="white" /></View>
                <Text style={styles.weatherValue}>{avgWind.toFixed(1)} <Text style={{fontSize:10}}>km/h</Text></Text>
                <Text style={styles.weatherLabel}>Avg Wind</Text>
            </LinearGradient>

            {/* Humidity Card */}
            <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.weatherCard}>
                <View style={styles.weatherIconBox}><Droplets size={18} color="white" /></View>
                <Text style={styles.weatherValue}>{avgHumid.toFixed(0)}%</Text>
                <Text style={styles.weatherLabel}>Humidity</Text>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    // Weather Row
    sectionTitleSmall: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 12, marginLeft: 4 },
    weatherRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    weatherCard: { width: (width - 60) / 3, padding: 12, borderRadius: 16, alignItems: 'center', justifyContent: 'center', height: 100 },
    weatherIconBox: { marginBottom: 8, opacity: 0.9 },
    weatherValue: { color: 'white', fontSize: 18, fontWeight: '800' },
    weatherLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '600' },
});