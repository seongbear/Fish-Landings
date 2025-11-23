import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronRight, Calendar, Plus, Cat } from 'lucide-react-native';
import { CatchItem } from './catchItem';


interface CatchRecordProps {
    id: string;
    species: string;
    location: string;
    date: string;
    weight: number;
}

const mockCatchRecords: CatchRecordProps[] = [
    { id: '1', species: 'Salmon', location: 'North Bay', date: '2024-06-10', weight: 4.5 },
    { id: '2', species: 'Tuna', location: 'East Harbor', date: '2024-06-12', weight: 7.2 },
    { id: '3', species: 'Trout', location: 'Lakeview', date: '2024-06-15', weight: 2.3 },
    { id: '4', species: 'Sardine', location: 'South Bay', date: '2024-06-18', weight: 1.1 },
];

export default function CatchRecord() {
  const [expanded, setExpanded] = useState(false);
  const [weight, setWeight] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');

  const onPressToggle = () => setExpanded(!expanded);

  const onSave = () => {
    console.log('Saved new catch record:', { weight, species, location });
    setWeight('');
    setSpecies('');
    setLocation('');
    setExpanded(false);
  };

    const onPress = () => {
        console.log('Navigate to detailed catch records screen');
    }

  return (
    <View style={{ marginTop: 16 }}>
         {/* Record New Catch Button */}
        <TouchableOpacity style={styles.buttonStyle} onPress={onPressToggle}>
          <Plus size={22} color="white" />
          <Text style={styles.buttonText}>Record New Catch</Text>
        </TouchableOpacity>

        {/* Add New Catch Form */}
        {expanded && (
          <View style={styles.catchRecordContainer}>
            <Text style={styles.formTitle}>New Catch Record</Text>

            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              placeholder="Enter weight"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />

            <Text style={styles.label}>Fish Species</Text>
            <TextInput
              placeholder="e.g., Salmon, Tuna"
              placeholderTextColor="#999"
              style={styles.input}
              value={species}
              onChangeText={setSpecies}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              placeholder="e.g., North Bay"
              placeholderTextColor="#999"
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <TouchableOpacity style={[styles.formButton, { backgroundColor: '#4A90E2' }]} onPress={onSave}>
                <Text style={{ color: 'white', fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.formButton, { backgroundColor: '#e3e4e5ff' }]} onPress={onPressToggle}>
                <Text style={{ color: 'black', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Recent Catches */}
        <View style={styles.catchRecordContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Calendar size={20} color="#4A90E2" />
              <Text style={styles.headerText}>Recent Catches</Text>
            </View>
            <TouchableOpacity onPress={onPress}>
              <ChevronRight size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          {/* Render recent catches from mockCatchRecords */}
        {mockCatchRecords.slice(0, 3).map(record => (
            <CatchItem key={record.id} {...record} />
        ))}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  catchRecordContainer: {
    marginTop: 16,
    backgroundColor: '#f5f8fa',
    borderRadius: 12,
    padding: 16,
  },
  buttonStyle: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    color: 'gray',
  },
  formButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '45%',
    paddingVertical: 10,
  },
  formTitle: {
    fontWeight: '500',
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
  },
});
