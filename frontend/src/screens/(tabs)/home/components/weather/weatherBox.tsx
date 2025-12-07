import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface WeatherBoxProps {
    icon?: React.ComponentType<any>;
    label: string;
    value: string;
    measurement: string;
}

export function WeatherBox({ icon: Icon, label, value, measurement }: WeatherBoxProps) {
    return (
        <View style={styles.container}>
            {Icon && <Icon color="#3B82F6" size={24} style={styles.icon} />}     
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.measurement}>{measurement}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,                 
        marginHorizontal: 4,     
        paddingVertical: 12,     
        paddingHorizontal: 4,
        minHeight: 100,          
        backgroundColor: '#ebf0f5',
        borderRadius: 12,
        alignItems: 'center',    
        justifyContent: 'center',
        // Shadow for Android
        elevation: 2,
        // Shadow for iOS (Consistency)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    icon: {
        marginBottom: 4,
    },
    label: {
        fontWeight: '400',
        fontSize: 10,
        color: '#6b7280', 
        textAlign: 'center',
        marginBottom: 2,
    },
    value: {
        fontWeight: '700',
        fontSize: 16,
        color: '#111827', 
        textAlign: 'center',
    },
    measurement: {
        fontWeight: '400',
        fontSize: 11,
        color: '#6b7280', 
        textAlign: 'center',
    }
});