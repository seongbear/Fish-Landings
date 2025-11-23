import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { MapPin, SquarePen } from 'lucide-react-native';
import { getCurrentLocation } from '../../../../utilities/helper/getCurrentLocation';

export default function ProfileCard() {
    const uri = 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=60';
    const [location, setLocation] = useState<any>(null);  useEffect(() => {
        getCurrentLocation().then(setLocation);
      }, []);
    return (
        <View style={styles.cardContainer}>
            <View style={styles.rowBetween}>
                <View style={styles.profileRow}>
                    <Image source={{ uri }} style={styles.profileImage} />

                    <View style={styles.details}>
                        <Text style={styles.name}>John Doe</Text>

                        <View style={styles.locationRow}>
                            <MapPin size={14} color="white" />
                            <Text style={styles.locationText}>
                                {location?.city || ''}
                            </Text>
                        </View>

                        <View style={styles.uidBox}>
                            <Text style={styles.uidText}>12345678</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={() => console.log('Edit Profile')}>
                    <SquarePen size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Text style={styles.fishermanText}>Member since 2020</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#3B82F6',
        borderRadius: 16,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
        elevation: 4,
    },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
    profileRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center' },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        resizeMode: 'cover',
        backgroundColor: '#e5e7eb'
    },
    details: { marginLeft: 15 },
    name: { color: 'white', fontSize: 20, fontWeight: '700' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    locationText: { color: 'white', fontSize: 14, marginLeft: 6 },

    uidBox: {
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        alignItems: 'center',
        marginTop: 10
    },
    uidText: { color: 'white', fontSize: 14 },
    fishermanText: {
        color: 'white',
        fontSize: 14,
        marginTop: 25,
        fontWeight: '400',
        marginBottom: 10
    }
});
