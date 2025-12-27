import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { MapPin, SquarePen, User } from 'lucide-react-native';
import { getCurrentLocation } from '../../../../utils/getCurrentLocation';
import { useUserProfile } from '../hooks/useUserProfile';
import { useNavigation } from '@react-navigation/native';

export default function ProfileCard() {
  // 1. ALL HOOKS MUST BE DECLARED HERE (Top Level)
  const { profile, loading } = useUserProfile();
  const [location, setLocation] = useState<any>(null);
  
  // MOVED UP: Call useNavigation before any return statements
  const navigation = useNavigation<any>(); 

  useEffect(() => {
    getCurrentLocation().then(setLocation).catch(() => {});
  }, []);

  // 2. NOW you can have conditional returns
  if (loading) {
    return (
      <View style={[styles.cardContainer, styles.skeletonContainer]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!profile) return null;

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : new Date().getFullYear();

  const handleEditPress = () => {
    navigation.navigate('EditProfile');
  }

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardContainer}
    >
      <View style={styles.topRow}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: profile.imageUrl || 'https://img.freepik.com/premium-vector/cute-cartoon-fish-cute-little-fish_1057-117676.jpg?w=360',
            }}
            style={styles.profileImage}
          />
        </View>

        {/* Text Info */}
        <View style={styles.infoColumn}>
          <Text style={styles.name} numberOfLines={1}>{profile.name}</Text>
          
          <View style={styles.locationRow}>
            <MapPin size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.locationText}>
              {location?.city ? `${location.city}, ${location.region || ''}` : 'Unknown Location'}
            </Text>
          </View>

          {/* ID Badge */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeLabel}>ID: </Text>
            <Text style={styles.badgeText} numberOfLines={1} ellipsizeMode="middle">
               Fish-{profile.id.substring(0, 6)}
            </Text>
          </View>
        </View>

        {/* Edit Button */}
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEditPress}
        >
          <SquarePen size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Footer Divider */}
      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <User size={14} color="rgba(255,255,255,0.7)" />
        <Text style={styles.footerText}>
           Member since {memberSince}
        </Text>
      </View>

    </LinearGradient>
  );
}

// ... styles remain the same ...
const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 24,
        width: '100%',
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    skeletonContainer: {
        backgroundColor: '#3B82F6',
        height: 180, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)',
        backgroundColor: '#f1f5f9'
    },
    infoColumn: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        marginLeft: 4,
        fontWeight: '500',
    },
    badgeContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    badgeLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '600',
    },
    badgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 16,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.8,
    },
    footerText: {
        color: 'white',
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '500',
    }
});