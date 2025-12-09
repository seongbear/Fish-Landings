import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle
} from 'react-native';
import { ChevronDown, Check, Filter } from 'lucide-react-native';

interface FilterDropdownProps {
  label: string;            
  data: string[];           
  selected: string;         
  onSelect: (item: string) => void;
  containerStyle?: StyleProp<ViewStyle>; // Added for flexibility
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  data, 
  selected, 
  onSelect,
  containerStyle 
}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setVisible(false);
  };

  const isFilterActive = selected && selected !== 'All';
  const buttonLabel = isFilterActive ? selected : label;

  // Memoize renderItem to prevent re-creation on every render
  const renderItem = useCallback(({ item }: { item: string }) => {
    const isSelected = item === selected;
    return (
      <TouchableOpacity 
        style={[styles.item, isSelected && styles.itemSelected]} 
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
          {item}
        </Text>
        {isSelected && <Check size={18} color="#2563eb" />}
      </TouchableOpacity>
    );
  }, [selected]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity 
        style={[styles.button, isFilterActive && styles.buttonActive]} 
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Filter by ${label}, current selection is ${buttonLabel}`}
      >
        <View style={styles.buttonContent}>
           <Filter size={16} color={isFilterActive ? "#2563eb" : "#4b5563"} />
           <Text style={[styles.buttonText, isFilterActive && styles.buttonTextActive]}>
             {buttonLabel}
           </Text>
        </View>
        <ChevronDown size={16} color={isFilterActive ? "#2563eb" : "#9ca3af"} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            {/* Inner Touchable prevents closing when clicking the list itself */}
            <TouchableWithoutFeedback>
              <View style={styles.dropdownContainer}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Select {label}</Text>
                </View>
                
                <FlatList
                  data={data}
                  keyExtractor={(item) => item}
                  renderItem={renderItem}
                  style={styles.list}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'flex-end', // Default alignment
  },
  // Button Styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 14, // Slightly larger touch area
    paddingVertical: 10,
    borderRadius: 24,      // Rounder pill shape
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 130,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonActive: {
    borderColor: '#2563eb', 
    backgroundColor: '#eff6ff',
  },
  buttonContent: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginRight: 12 
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  buttonTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Slightly darker for better focus
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: '85%', // Slightly wider
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 0, // Let header/list handle padding
    overflow: 'hidden', // Ensures list doesn't bleed out corners
    // Stronger shadow for the modal
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  
  // List Styles
  list: {
    maxHeight: 300,
  },
  listContent: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  itemSelected: {
    backgroundColor: '#f0f9ff',
  },
  itemText: {
    fontSize: 16,
    color: '#374151',
  },
  itemTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
});