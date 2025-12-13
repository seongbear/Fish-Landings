import { Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { CommonCardProps } from '../type/achievement';
import { useUserProfile } from '../hooks/useUserProfile';
import AchievementCard from './achievementCard';

export default function Achievements() {    
    const { profile, loading } = useUserProfile();

    const AchievementsData: CommonCardProps[] = [
        { icon: '🎣', title: 'First Catch', achieved: profile?.achievements?.first_catch || false },
        { icon: '🏆', title: '100kg Club', achieved: profile?.achievements?.milestone_100kg || false },
        { icon: '🔥', title: 'Week Streak', achieved: profile?.achievements?.week_streak || false },
        { icon: '🦈', title: 'Big Hunter', achieved: profile?.achievements?.big_game_hunter || false },
        { icon: '🌅', title: 'Early Bird', achieved: profile?.achievements?.early_bird || false },
        { icon: '🤝', title: 'Helper', achieved: profile?.achievements?.community_helper || false },
        { icon: '🎯', title: 'Forecaster', achieved: profile?.achievements?.weather_watcher || false},
        { icon: '👑', title: 'Master', achieved: profile?.achievements?.master_fisher || false },
    ];

    const achievedCount = AchievementsData.filter(a => a.achieved).length;
    const totalCount = AchievementsData.length;
    // Prevent NaN if totalCount is 0
    const progressPercent = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

    if (loading && !profile) {
        return (
            <View style={[styles.container, { alignItems: 'center', padding: 20 }]}>
                 <ActivityIndicator size="small" color="#D97706" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.titleRow}>
                        <View style={styles.iconBg}>
                            <Trophy size={18} color="#D97706" />
                        </View>
                        <Text style={styles.headerText}>Achievements</Text>
                    </View>
                    
                    {/* Badge Count */}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{achievedCount}/{totalCount}</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
            </View>

            {/* Grid x 4 */}
            <View style={styles.gridContainer}>
                {AchievementsData.map((achievement, index) => (
                    <AchievementCard 
                        key={index} 
                        title={achievement.title} 
                        icon={achievement.icon}
                        achieved={achievement.achieved}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 20, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 10,
    },
    
    // Header
    header: {
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBg: {
        backgroundColor: '#FFFBEB', // Light Amber
        padding: 8,
        borderRadius: 12,
        marginRight: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    badge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4B5563',
    },

    // Progress Bar
    progressBarBg: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#F59E0B', // Amber
        borderRadius: 3,
    },
    // Grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});