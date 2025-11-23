import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CatchItemProps {
  species: string;
  location: string;
  weight: number;
  date: string;
}

export const CatchItem: React.FC<CatchItemProps> = ({ species, location, weight, date }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.species}>{species}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.weight}>{weight} kg</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f0ff', // light blue
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderLeftColor: '#4A90E2',
    borderLeftWidth: 5,
  },
  left: {},
  species: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  right: {},
  weight: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007bff', // blue color
  },
});
