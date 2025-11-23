import { View } from 'react-native';
import HomePageTopContainer from './topContainer';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TodayRecord() {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <HomePageTopContainer 
                title="Today's Catch"
                description="15.5 kg"
                color="#3B82F6"
                icon={
                  <Ionicons name="fish" size={18} color="#3B82F6" />
                }
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <HomePageTopContainer 
                title="Total Catch"
                description="1,250 kg"
                color="#10B981"
                icon={
                  <Ionicons name="stats-chart" size={18} color="#10B981" />
                }
              />
            </View>
          </View>
          
    )
}