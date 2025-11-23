import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Platform, Text, TouchableOpacity } from 'react-native';
import Background from '../../../../components/background';
import ProfileCard from '../components/profileCard';
import CommonCard from '../components/commonCard';
import { Fish, ChartSpline, Trophy, Calendar, Settings } from 'lucide-react-native';
import Achievements from '../components/achievements';
import RecentActivity from '../components/recentActivity';

interface CommonCardProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    color?: string;
}

const commonCardInfo: CommonCardProps[] = [
  {
    icon: <Fish size={16} color="#3B82F6" />,
    title: "Total Catches",
    description: "1,250",
    color: "#3B82F6",
  },
  {
    icon: <ChartSpline size={16} color="#10B981" />,
    title: "Total Weight",
    description: "3,450 kg",
    color: "#10B981",
  },
  {
    icon: <Trophy size={16} color="#b314c4" />,
    title: "Best Catch",
    description: "45.2 kg",
    color: "#b314c4",
  },
  {
    icon: <Calendar size={16} color="#F59E0B" />,
    title: "Days Active",
    description: "120",
    color: "#F59E0B",
  }
]

export default function ProfilePage() {
  const settingPressed = () => {
    // Navigate to settings page
    console.log('Settings button pressed');
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
    >
      <Background >
        <ScrollView>
            <View style={styles.container}>
              <ProfileCard />
              {/* 2 x 2 grid view */}
              <View style={styles.grid}>     
                  {commonCardInfo.slice(0,4).map((item, index) => (
                    <View style={styles.gridItem}> 
                    <CommonCard 
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      color={item.color}
                    />
                    </View>
                  ))}
              </View>
              <Achievements />
              <RecentActivity />
              <TouchableOpacity onPress={settingPressed} style={styles.settingButton}>
                <Settings size={20} color="black" style={{ marginRight: 8 }} />
                <Text style={styles.settingText}>Settings</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
     borderRadius: 8,
  },
  settingButton:{
    marginTop: 20, 
    backgroundColor: 'white', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    flexDirection: 'row', 
    alignItems: 'center',
    width: '100%', 
    justifyContent: 'center',
    elevation: 4,
  },
  settingText:{
    color: 'black',
    fontWeight: '500',
    fontSize: 16,
  }
});
