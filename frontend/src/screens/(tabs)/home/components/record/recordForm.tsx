import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, TextInput, 
  Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, 
  Keyboard, ActivityIndicator, FlatList,
  StatusBar
} from 'react-native';
import { X, Fish, MapPin, Weight, LocateFixed, ChevronDown, Save, Anchor } from 'lucide-react-native';
import { useRecordForm } from '../../hooks/useRecordForm';
import { useFishSpecies } from '../../hooks/useFishSpecies';
import { SaveFishRecord } from '../../types/fish';
import { StatusModal } from '../../../../../components/status_modal';
import { useFishRecord } from '../../hooks/useFishRecord';

interface RecordFormProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RecordForm: React.FC<RecordFormProps> = ({
  modalVisible,
  setModalVisible,
}) => {
    // State to control the Success/Fail popup
    const {
        weight,
        setWeight,
        species,
        setSpecies,
        setShowSpeciesDropdown,
        handleSpeciesChange,
        locationName,
        setLocationName,
        coords,
        setCoords,
        isLocating,
        showSpeciesDropdown,
        filteredSpecies,
        selectSpecies,
        handleGetCurrentLocation,
        // Status
        statusVisible,
        setStatusVisible,
        statusType,
        setStatusType,
        // Gear Type Dropdown
        gear,
        setGear,
        showGearDropdown,
        setShowGearDropdown,
        filteredGear,
        setFilteredGear,
        selectGear,
        handleGearChange,
    } = useRecordForm();

    const { addFishRecord } = useFishSpecies();
    const { reload } = useFishRecord();

    const handleStatusClose = () => {
        setStatusVisible(false); // Hide the popup
        // Reset form fields
        setWeight('');
        setSpecies('');
        setLocationName('');
        setCoords(null);
        setShowSpeciesDropdown(false);
        setModalVisible(false); // Close the form modal
        // Reload the catch records list
        reload();
    };


    const onSave = async () => {
        // 1. Prepare Data
        const record: SaveFishRecord = {
            weight: parseFloat(weight),
            species: species,
            gearType: gear,
            location: locationName,
            lng: coords?.lng,
            lat: coords?.lat,
        };

        console.log('Saving Record:', record);

        // Ensure addFishRecord returns a boolean!
        const success = await addFishRecord(record);

        // Update State to show the Modal
        if (success) {
            setStatusType('success');
            setStatusVisible(true);
        } else {
            setStatusType('error');
            setStatusVisible(true);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalKeyboardContainer}
                    >
                        <View style={styles.modalContent}>
                            {/* Modal Header */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>New Catch Record</Text>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(false) 
                                    setShowSpeciesDropdown(false);
                                }}>
                                    <X size={24} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={styles.modalSubtitle}>Fill in the details of your latest catch.</Text>
            
                            {/* --- Weight Input --- */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Weight (kg)</Text>
                                <View style={styles.inputWrapper}>
                                    <Weight size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="0.0"
                                        placeholderTextColor="#9CA3AF"
                                        style={styles.input}
                                        keyboardType="numeric"
                                        value={weight}
                                        onChangeText={setWeight}
                                    />
                                </View>
                            </View>
            

                            {/* --- SPECIES INPUT --- */}
                            <View style={[styles.inputGroup, { zIndex: 10 }]}>
                                <Text style={styles.label}>Fish Species</Text>
                                <View style={styles.inputWrapper}>
                                    <Fish size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Type to search..."
                                        placeholderTextColor="#9CA3AF"
                                        style={styles.input}
                                        value={species}
                                        onChangeText={handleSpeciesChange}
                                        onFocus={() => setShowSpeciesDropdown(true)}
                                    />
                                    <TouchableOpacity onPress={() => setShowSpeciesDropdown(!showSpeciesDropdown)}>
                                        <ChevronDown size={16} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>

                                {/* DROPDOWN LIST */}
                                {showSpeciesDropdown && (
                                    <View style={styles.dropdownContainer}>
                                        <FlatList
                                            data={filteredSpecies}
                                            keyExtractor={(item) => item.name}
                                            nestedScrollEnabled={true} 
                                            keyboardShouldPersistTaps="handled"
                                            style={{ maxHeight: 150 }} 
                                            renderItem={({ item }) => (
                                                <TouchableOpacity 
                                                    style={styles.dropdownItem}
                                                    onPress={() => selectSpecies(item.name)}
                                                >
                                                    <Text style={styles.dropdownText}>{item.name}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                )}
                            </View>

                            {/* --- Catch Method INPUT --- */}
                            <View style={[styles.inputGroup, { zIndex: 9 }]}>
                                <Text style={styles.label}>Catch Method</Text>
                                <View style={styles.inputWrapper}>
                                    <Anchor size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Type to search..."
                                        placeholderTextColor="#9CA3AF"
                                        style={styles.input}
                                        value={gear}
                                        onChangeText={handleGearChange}
                                        onFocus={() => setShowGearDropdown(true)}
                                    />
                                    <TouchableOpacity onPress={() => setShowGearDropdown(!showGearDropdown)}>
                                        <ChevronDown size={16} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>

                                {/* Method Dropdown */}
                                {showGearDropdown && (
                                    <View style={styles.dropdownContainer}>
                                        <FlatList
                                            data={filteredGear}
                                            keyExtractor={(item) => item.name}
                                            nestedScrollEnabled={true}
                                            keyboardShouldPersistTaps="handled"
                                            style={{ maxHeight: 150 }}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity 
                                                    style={styles.dropdownItem}
                                                    onPress={() => selectGear(item.name)}
                                                >
                                                    <Text style={styles.dropdownText}>{item.name}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                )}
                            </View>
            
                            {/* --- Location Input --- */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Location</Text>
                                <View style={styles.inputWrapper}>
                                    <MapPin size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Tap icon to locate..."
                                        placeholderTextColor="#9CA3AF"
                                        style={styles.input}
                                        value={locationName}
                                        onChangeText={setLocationName} // Allow manual edit too
                                    />
                                    
                                    {/* Location Button inside Input */}
                                    <TouchableOpacity 
                                        onPress={handleGetCurrentLocation} 
                                        style={styles.locationBtn}
                                        disabled={isLocating}
                                    >
                                        {isLocating ? (
                                            <ActivityIndicator size="small" color="#3B82F6" />
                                        ) : (
                                            <LocateFixed size={20} color={coords ? "#10B981" : "#3B82F6"} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {/* Helper text showing Lat/Lon if available */}
                                {coords && (
                                    <Text style={styles.coordsText}>
                                        GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                                    </Text>
                                )}
                            </View>

                            {/* --- Catch Method Input --- */}
                            
            
                            {/* Action Buttons */}
                            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                                <Text style={styles.saveButtonText}>Save Record</Text>
                            </TouchableOpacity>
                        </View>

                        <StatusModal 
                            visible={statusVisible}
                            type={statusType}
                            message={statusType === 'success' 
                                ? "Your catch has been recorded in the journal." 
                                : "Something went wrong. Please check your connection."
                            }
                            onClose={handleStatusClose}
                        />

                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalKeyboardContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },

  // Form Inputs
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  // New Styles for Location
  locationBtn: {
    padding: 8,
    marginLeft: 4,
  },
  coordsText: {
    fontSize: 11,
    color: '#10B981', // Green to show success
    marginTop: 4,
    marginLeft: 4,
  },
    // Dropdown Styles
  dropdownContainer: {
        position: 'absolute',
        top: '100%', 
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 4,
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        maxHeight: 150,
        zIndex: 999, // Ensure it floats on top
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownText: {
        fontSize: 14,
        color: '#374151',
    },

  // Modal Button
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});