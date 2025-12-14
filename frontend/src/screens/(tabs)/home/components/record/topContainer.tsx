import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

interface HomePageTopContainerProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    gradientColors: string[];
    chevonRightColor?: string;
    onPress?: () => void;
}

export default function HomePageTopContainer({
    icon,
    title,
    description,
    gradientColors,
    chevonRightColor = '#000000',
    onPress,
}: HomePageTopContainerProps) {
    return (
        <TouchableOpacity style={styles.outerContainer} >
            <LinearGradient
                colors={gradientColors as any}
                start={{ x: 0.35, y: 0.35}}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
            >
                <View style={[styles.innerContainer, {borderColor: gradientColors[1], borderWidth: 1}]}>
                    <View style={styles.header}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {icon}
                            <Text style={styles.titleText}>{title}</Text>
                        </View>
                        <ChevronRight size={16} color={chevonRightColor} />
                        
                    </View>

                    <Text style={styles.descriptionText}>{description}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradientContainer: {
        borderRadius: 16,
        padding: 1, 
    },
    innerContainer: {
        backgroundColor: 'rgba(255,255,255,0.15)', 
        paddingHorizontal: 10,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    titleText: {
        fontWeight: '500',
        fontSize: 12,
        color: '#000000', 
        marginLeft: 5,
    },
    descriptionText: {
        fontSize: 22,
        color: '#000000',
        fontWeight: '600',
    },
});
