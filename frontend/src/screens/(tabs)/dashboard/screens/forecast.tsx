import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Background from '../../../../components/background';

export const Forecast = () => {
    const [formData, setFormData] = useState({
        species: '1.0',
        state: '6.0',
        gear_type: '11.0',
        year: '2025',
        month: '5',
        temperature: '28.5',
        pressure: '1012',
        dew_point: '24.0',
        humidity: '80',
        wind_speed: '15',
        uv_index: '8'
    });

    return (
        <Background disableTopEdge={true}>
            <View style={styles.container}>
                
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        paddingHorizontal: 20,
    },
});
