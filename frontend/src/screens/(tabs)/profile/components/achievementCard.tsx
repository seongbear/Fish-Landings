import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Lock } from 'lucide-react-native';

interface CommonCardProps {
    icon: string;
    title: string;
    achieved: boolean;
}

export default function AchievementCard({ icon, title, achieved }: CommonCardProps) {
    return (
        <View style={[
            styles.container, 
            achieved ? styles.achievedContainer : styles.lockedContainer
        ]}>
            {/* Icon Area */}
            <View style={styles.iconWrapper}>
                <Text style={[styles.emoji, !achieved && styles.grayscale]}>
                    {icon}
                </Text>
                
                {/* Lock Overlay for unachieved items */}
                {!achieved && (
                    <View style={styles.lockOverlay}>
                        <Lock size={12} color="#9CA3AF" />
                    </View>
                )}
            </View>

            {/* Title */}
            <Text 
                numberOfLines={2} 
                style={[styles.title, achieved ? styles.achievedText : styles.lockedText]}
            >
                {title}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '23%', // Fits 4 per row
        aspectRatio: 0.85, // Slightly taller than wide to accommodate text
        borderRadius: 12,
        marginBottom: 12,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // State: Achieved
    achievedContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F59E0B', // Amber-500
        // Soft Shadow
        shadowColor: "#F59E0B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    // State: Locked
    lockedContainer: {
        backgroundColor: '#F3F4F6', // Slate-100
        borderWidth: 1.5,
        borderColor: '#E5E7EB', // Slate-200
        borderStyle: 'dashed', // Implies "Empty Slot"
    },
    
    // Icon Styling
    iconWrapper: {
        marginBottom: 8,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 28,
    },
    grayscale: {
        opacity: 0.3,
    },
    lockOverlay: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 2,
    },

    // Text Styling
    title: {
        fontSize: 10,
        textAlign: 'center',
        lineHeight: 12,
        paddingHorizontal: 2,
    },
    achievedText: {
        color: '#1F2937', // Slate-800
        fontWeight: '600',
    },
    lockedText: {
        color: '#9CA3AF', // Slate-400
        fontWeight: '400',
    }
});