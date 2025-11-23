import React from 'react';
import { ScrollView, StyleSheet, View,  KeyboardAvoidingView, Platform } from 'react-native';
import Background from '../../../../components/background';
import { Weather } from '../components/weather/weather';
import { Knowledge } from '../components/knowledge/knowledge';
import TodayRecord from '../components/record/todayRecod';
import CatchRecord from '../components/record/catchRecord';


interface HomePageProps {
  user: string;
}

export default function HomePage({ user }: HomePageProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
    >
       <Background>
        <ScrollView style={styles.container}>
          <View style={{  marginBottom: 32 }}>
            <TodayRecord />
            <Weather />
            <Knowledge />
            <CatchRecord />
          </View>
        </ScrollView>
      </Background> 
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
