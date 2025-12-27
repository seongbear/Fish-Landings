import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Background from '../../../components/background';

export default function SplashScreen() {
    return (
        <Background>
             <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../../assets/logo.png')} style={styles.logoImage} />
                </View>
                <Text style={styles.appName}>FisheriesCast</Text>
                <Text style={styles.tagline}>Your daily forecast companion</Text>
                <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 160,
        height: 160,
        borderRadius: 90, 
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        elevation: 15, // Android shadow
        shadowColor: '#4A90E2', // iOS shadow color
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    logoImage: { 
        width: '100%', 
        height: '100%', 
        resizeMode: 'contain',
        borderRadius: 100, 
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937', 
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: '#6B7280', 
        marginBottom: 40,
    },
    loader: {
        marginTop: 20
    },
});