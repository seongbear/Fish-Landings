import React from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from "react-native";

interface ForecastModalProps {
    visible: boolean;
    setModalVisible: (visible: boolean) => void;
    pickerOptions: Array<{ label: string; value: string | number }>;
    currentField: string;
    formData: { [key: string]: string | number };
    selectOption: (item: { label: string; value: string | number }) => void;
}

export const ForecastModal: React.FC<ForecastModalProps> = ({
    visible,
    setModalVisible,
    pickerOptions,
    currentField,
    formData,
    selectOption
}) => {
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Option</Text>
                    <FlatList
                      data={pickerOptions}
                      keyExtractor={(item) => item.value.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[
                              styles.modalItem, 
                              formData[currentField as keyof typeof formData] === item.value && styles.modalItemSelected
                            ]} 
                            onPress={() => selectOption(item)}
                          >
                          <Text style={[
                            styles.modalItemText,
                            formData[currentField as keyof typeof formData] === item.value && styles.modalItemTextSelected
                          ]}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity 
                      style={styles.closeButton} 
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    // Modal
    modalOverlay: { 
        flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'center', alignItems: 'center', padding: 20 
    },
    modalContent: { 
        backgroundColor: '#fff', width: '100%', maxHeight: '70%', 
        borderRadius: 16, padding: 20 
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
    modalItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    modalItemSelected: { backgroundColor: '#F0F8FF' },
    modalItemText: { fontSize: 16, color: '#333', textAlign: 'center' },
    modalItemTextSelected: { color: '#007AFF', fontWeight: 'bold' },
    closeButton: { marginTop: 15, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, alignItems: 'center' },
    closeButtonText: { color: '#555', fontWeight: '600' }
});