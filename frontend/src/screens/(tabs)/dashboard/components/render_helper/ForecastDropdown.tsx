import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const ForecastDropdown = (
    label: string, 
    key: string, 
    dataset: Array<{ label: string; value: string | number }>,
    formData: { [key: string]: string | number },
    openPicker: (field: string, options: Array<{ label: string; value: string }>) => void
) => {
    const getLabel = (value: string, dataset: Array<{ label: string; value: string | number }>) => {
        const item = dataset.find((d) => d.value === value || d.value.toString() === value);
        return item ? item.label : value;
    };

        return (
            <View style={styles.dropdownWrapper}>
                <Text style={styles.label}>{label}</Text>
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openPicker(key, dataset as Array<{ label: string; value: string }>)}
                >
                    <Text style={styles.dropdownText} numberOfLines={1}>
                    {getLabel(String(formData[key as keyof typeof formData]), dataset as Array<{ label: string; value: string | number }>)}
                    </Text>
                    <Text style={styles.arrow}>▼</Text>
                </TouchableOpacity>
            </View>
        );
}

const styles = StyleSheet.create({
    dropdownWrapper: { marginBottom: 12 },
    label: { fontSize: 12, color: '#666', marginBottom: 4, fontWeight: '600' },
    dropdown: {
        backgroundColor: '#F7F9FC', borderWidth: 1, borderColor: '#E4E9F2',
        borderRadius: 8, height: 44, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12
    },
    dropdownText: { fontSize: 14, color: '#333', flex: 1 },
    arrow: { fontSize: 12, color: '#999' },
});