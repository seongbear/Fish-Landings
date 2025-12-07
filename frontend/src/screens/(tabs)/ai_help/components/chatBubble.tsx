import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { User, Bot } from "lucide-react-native";

interface ChatBubbleProps {
    text: string;
    time: string;
    isUser: boolean;
}

export default function ChatBubble({ text, time, isUser }: ChatBubbleProps ) {
    return (
        <View style={[styles.container, isUser ? styles.userRow : styles.botRow]}>
            
            {/* Avatar */}
            {!isUser && (
                <View style={styles.avatarContainer}>
                    <Bot size={26} color="#1e40af" />
                </View>
            )}

            {/* Bubble */}
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.msgText, { color: isUser ? "white" : "#4b5563" }]}>{text}</Text>
                <Text style={[styles.time, { color: isUser ? "white" : "#4b5563" }]}>{time}</Text>
            </View>

            {/* User avatar */}
            {isUser && (
                <View style={styles.avatarContainer}>
                    <User size={26} color="#4b5563" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginVertical: 8,
    },

    botRow: {
        justifyContent: "flex-start",
    },

    userRow: {
        justifyContent: "flex-end",
    },

    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 6,
    },

    bubble: {
        maxWidth: "80%",
        padding: 14,
        borderRadius: 16,
    },

    botBubble: {
        backgroundColor: "#ffffff",
        borderBottomLeftRadius: 4,
    },

    userBubble: {
        backgroundColor: "#2563eb",
        borderBottomRightRadius: 4,
    },

    msgText: {
        color: "#000",
        fontSize: 15,
    },

    time: {
        fontSize: 11,
        marginTop: 6,
        textAlign: "right",
    },
});
