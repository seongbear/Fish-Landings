import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const ForecastInput = (
    label: string, 
    key: string, 
    placeholder: string,
    formData: { [key: string]: string | number },
    handleInputChange: (key: string, value: string) => void
) => {
    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={String(formData[key as keyof typeof formData])}
                onChangeText={(val) => handleInputChange(key, val)}
                placeholder={placeholder}
                keyboardType="numeric"
                placeholderTextColor="#aaa"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    label: { fontSize: 12, color: '#666', marginBottom: 4, fontWeight: '600' },
    input: {
        backgroundColor: '#F7F9FC', borderWidth: 1, borderColor: '#E4E9F2',
        borderRadius: 8, paddingHorizontal: 12, height: 44, color: '#333'
    },
    inputWrapper: { width: '48%', marginBottom: 12 },
});