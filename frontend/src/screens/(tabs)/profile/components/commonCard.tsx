import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface CommonCardProps {
    icon: React.ReactNode;
    title: string;
    description: string | number;
    color: string;
}

export default function CommonCard({ icon, title, description, color }: CommonCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* Icon Container with dynamic background color (15% opacity) */}
                <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                    {icon}
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            
            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                {description}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        height: 110, // Fixed height for alignment
        justifyContent: 'space-between',
        // Modern Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280', // Gray-500
        flex: 1, 
    },
    value: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827', // Gray-900
        letterSpacing: 0.5,
    },
});