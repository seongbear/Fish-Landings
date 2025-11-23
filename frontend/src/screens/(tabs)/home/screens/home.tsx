import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Background from '../../../../components/background';
import { Weather } from '../components/weather';


interface HomePageProps {
  user: string;
}

export default function HomePage({ user }: HomePageProps) {
  return (
    <Background>
      <ScrollView style={styles.container}>
        <Weather />
        
      </ScrollView>
    </Background>   
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
