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
            {Icon ? <Icon color="#3B82F6" size={24} /> : null}
            <Text style={{ fontWeight: '400', fontSize: 10, color: 'grey', textAlign: 'center', marginTop: 4 }}>{label}</Text>
            <Text style={{ fontWeight: '600', fontSize: 16, color: 'black', textAlign: 'center' }}>{value}</Text>
            <Text style={{ fontWeight: '400', fontSize: 12, color: 'grey', textAlign: 'center' }}>{measurement}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                   
    marginHorizontal: 4,       
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#ebf0f5',
    borderRadius: 10,          
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    elevation: 2,
  }
});
