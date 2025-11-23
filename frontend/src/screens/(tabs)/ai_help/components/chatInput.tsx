import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Send } from "lucide-react-native";

interface ChatInputProps {
    message: string;
    setMessage: (message: string) => void;
    onSend: () => void;
}

export default function ChatInput({ message, setMessage, onSend }: ChatInputProps) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Ask me anything about fishing..."
                value={message}
                onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                <Send size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
    },

    input: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 10,
    },

    sendButton: {
        height: 46,
        width: 46,
        borderRadius: 23,
        backgroundColor: "#2563eb",
        justifyContent: "center",
        alignItems: "center",
    },
});
