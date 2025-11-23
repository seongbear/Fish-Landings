import { Award } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AchievementCard from './achievementCard';

interface CommonCardProps {
    icon: string;
    title: string;
    achieved: boolean;
}

const AchievementsData: CommonCardProps[] = [
    {
        icon: '🎣',
        title: 'First Catch',
        achieved: true,
    },
    {
        icon: '🏆',
        title: '100kg Milestone',
        achieved: true,
    },
    {
        icon: '🔥',
        title: 'Week Streak',
        achieved: true,
    },
    {
        icon: '🦈',
        title: 'Big Game Hunter',
        achieved: true,
    },
    {
        icon: '🌅',
        title: 'Early Bird',
        achieved: true,
    },
    {
        icon: '🤝',
        title: 'Community Helper',
        achieved: true,
    },
    {
        icon: '🎯',
        title: 'Weather Watcher',
        achieved: false,
    },
    {
        icon: '👑',
        title: 'Master Fisher',
        achieved: false,
    },
]

export default function Achievements() {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={{flexDirection: 'row'}}>
                <Award size={20} color="#c47514" />
                <Text style={styles.headerText}>Achievements</Text>
            </View>
            <Text style={{ fontWeight: '400', fontSize: 14, color: 'grey', textAlign: 'center' }}>
                {AchievementsData.filter(a => a.achieved).length}/{AchievementsData.length}
            </Text>
        </View>

       {/* Grid  x 4 */}
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
        borderRadius: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
        marginLeft: 4,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});