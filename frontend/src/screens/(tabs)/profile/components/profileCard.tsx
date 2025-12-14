import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Change to 'react-native-linear-gradient' if using CLI
import { MapPin, SquarePen, User } from 'lucide-react-native';
import { getCurrentLocation } from '../../../../utils/getCurrentLocation';
import { useUserProfile } from '../hooks/useUserProfile';

export default function ProfileCard() {
  const { profile, loading } = useUserProfile();
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    getCurrentLocation().then(setLocation).catch(() => {});
  }, []);

  // Helper for the "Skeleton" loading view
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

  return (
    <LinearGradient
      // Deep Blue to Ocean Cyan Gradient
      colors={['#1E40AF', '#3B82F6']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardContainer}
    >
      <View style={styles.topRow}>
        {/* Profile Image with Border */}
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

          {/* ID Badge (Pill Shape) */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeLabel}>ID: </Text>
            <Text style={styles.badgeText} numberOfLines={1} ellipsizeMode="middle">
               {profile.id.substring(0, 12)}...
            </Text>
          </View>
        </View>

        {/* Edit Button (Glass effect) */}
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => console.log('Edit Profile')}
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

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 24,
        width: '100%',
        padding: 20,
        // Shadow for depth
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
    
    // Image Styles
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

    // Info Section
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

    // ID Badge
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
        fontFamily: 'monospace', // Monospace looks better for IDs
    },

    // Edit Button
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)', // Glass effect
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },

    // Footer
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