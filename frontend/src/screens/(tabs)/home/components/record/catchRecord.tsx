import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { ChevronRight, Calendar, Plus, X, } from 'lucide-react-native';
import { CatchItem } from './catchItem';
import { RecordForm } from './recordForm';
import { useFishRecord } from '../../hooks/useFishRecord';
import { useNavigation } from '@react-navigation/native';

export default function CatchRecord() {
  const [modalVisible, setModalVisible] = useState(false);
  const catchRecords = useFishRecord().catchRecords;
  const navigation = useNavigation<any>();


  const onSeeAll = () => {
    navigation.navigate('CatchHistory');
  };

  return (
    <View style={styles.container}>

      {/* 2. Catch List Card */}
      <View style={styles.card}>
        {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBg}>
            <Calendar size={18} color="#D97706" />
          </View>
          <Text style={styles.headerText}>Recent Catches</Text>
        </View>
        
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>History</Text>
            <ChevronRight size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
        {catchRecords.slice(0, 3).map((record, index) => (
           <View key={record.date.toString()}>
              <CatchItem {...record} />
           </View>
        ))}
      </View>

      {/* 3. Primary Action Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={20} color="white" />
        <Text style={styles.addButtonText}>Log New Catch</Text>
      </TouchableOpacity>

      {/* --- MODAL FORM --- */}
      <RecordForm 
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 20,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4, 
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    backgroundColor: '#FFFBEB', // Light Amber
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 2,
  },

  // List Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },

  // Main Action Button
  addButton: {
    backgroundColor: '#3B82F6', // Blue-500
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});