import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Platform, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Background from '../../../../components/background';
import ProfileCard from '../components/profileCard';
import CommonCard from '../components/commonCard';
import { Fish, ChartSpline, Trophy, Calendar, Settings, ChevronRight } from 'lucide-react-native';
import Achievements from '../components/achievements';
import { useFishStats } from '../hooks/useFishStats';
import { useNavigation } from '@react-navigation/native';

export default function ProfilePage() {
    const navigation = useNavigation<any>();
    const { stats } = useFishStats(); 

    const settingPressed = () => {
        navigation.navigate('Settings');
    };

    // Define data dynamically based on stats
    const cardData = [
        {
            icon: <Fish size={18} color="#3B82F6" />,
            title: "Total Catches",
            description: stats.totalCatches ?? 0,
            color: "#3B82F6",
        },
        {
            icon: <ChartSpline size={18} color="#10B981" />,
            title: "Total Weight",
            description: `${stats.totalWeight ?? 0} kg`,
            color: "#10B981",
        },
        {
            icon: <Trophy size={18} color="#8B5CF6" />,
            title: "Best Catch",
            description: `${stats.bestCatch ?? 0} kg`,
            color: "#8B5CF6",
        },
        {
            icon: <Calendar size={18} color="#F59E0B" />,
            title: "Days Active",
            description: stats.daysActive ?? 0,
            color: "#F59E0B",
        }
    ];

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Background>
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        
                        {/* Profile Header */}
                        <ProfileCard />

                        {/* Stats Grid */}
                        <View style={styles.grid}>
                            {cardData.map((item, index) => (
                                <View style={styles.gridItem} key={index}>
                                    <CommonCard
                                        icon={item.icon}
                                        title={item.title}
                                        description={item.description}
                                        color={item.color}
                                    />
                                </View>
                            ))}
                        </View>

                        {/* 3. Achievements Section */}
                        <View style={styles.sectionSpacer}>
                            <Achievements />
                        </View>

                        {/* 4. Settings Button */}
                        <TouchableOpacity 
                            onPress={settingPressed} 
                            style={styles.settingButton}
                            activeOpacity={0.8}
                        >
                            <View style={styles.settingContent}>
                                <View style={styles.settingIconBox}>
                                    <Settings size={20} color="#4B5563" />
                                </View>
                                <Text style={styles.settingText}>Settings</Text>
                            </View>
                            <ChevronRight size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </Background>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    
    // Grid Styles
    sectionHeader: {
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    grid: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10, // Modern spacing (check React Native version, fallback to margins if needed)
    },
    gridItem: {
        width: '48%', // Ensures 2 columns
        marginBottom: 4, // subtle spacing for shadows
    },
    sectionSpacer: {
        marginTop: 16,
    },

    // Settings Button Styles
    settingButton: {
        marginTop: 15,
        backgroundColor: '#ffffff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    settingContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIconBox: {
        backgroundColor: '#F3F4F6',
        padding: 8,
        borderRadius: 10,
        marginRight: 12,
    },
    settingText: {
        color: '#1F2937',
        fontWeight: '600',
        fontSize: 16,
    },
});