import { Text, View } from 'react-native';
import HomePageTopContainer from './topContainer';
import React from 'react';

export default function TodayRecord() {
    const handlePress = () => {
        console.log("Card pressed!");
    };
    return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        {/* Blue Card - Today's Catch */}
        <View style={{ width: '48%' }}>
            <HomePageTopContainer
                icon={<Text style={{ color: 'white', fontSize: 16 }}>🐟</Text>}
                title="Today's Catch"
                description="15.5 kg"
                gradientColors={['transparent', '#a3d2edff']}
                chevonRightColor='#2c6cf6ff'
                onPress={handlePress} 
            />
        </View>

        {/* Green Card - Total Catch */}
        <View style={{ width: '48%' }}>
            <HomePageTopContainer
                icon={<Text style={{ color: 'white', fontSize: 16 }}>📈</Text>}
                title="Total Catch"
                description="1,250 kg"
                gradientColors={['transparent', '#8fe899ff']}
                chevonRightColor='#34c759ff'
                onPress={handlePress}
            />
        </View>
</View>
    )
}