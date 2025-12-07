import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { ChevronLeft, Menu } from "lucide-react-native";

interface ChatHeaderProps {
    title: string;
    onBack?: () => void; 
    onMenuPress?: () => void; 
}

export default function ChatHeader({ title, onBack, onMenuPress }: ChatHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <TouchableOpacity onPress={onBack} style={styles.iconButton} disabled={!onBack}>
                    {onBack ? (
                        <ChevronLeft size={20} color="#1f2937" />
                    ) : (
                        <View style={{ width: 20 }} /> 
                    )}
                </TouchableOpacity>

                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>

                <TouchableOpacity onPress={onMenuPress} style={styles.iconButton} disabled={!onMenuPress}>
                    {onMenuPress ? (
                        <Menu size={20} color="#1f2937" />
                    ) : (
                        <View style={{ width: 20 }} /> 
                    )}
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff",
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    iconButton: {
        padding: 8, 
    },
    title: {
        fontSize: 18, 
        fontWeight: "600", 
        color: "#1f2937",
        flex: 1, 
        textAlign: 'center', 
        marginHorizontal: 10, 
    },
});
