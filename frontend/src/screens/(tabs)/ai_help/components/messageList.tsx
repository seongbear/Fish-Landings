import React, { useRef, useEffect } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import ChatBubble from "./chatBubble";

interface Message {
    text: string;
    time: string;
    isUser: boolean;
}

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    const flatListRef = useRef<any>(null);

    useEffect(() => {
        if (messages.length > 0) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
            return () => clearTimeout(timer); 
        }
    }, [messages]);

    return (
        <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()} 
            renderItem={({ item }) => (
                <ChatBubble
                    text={item.text}
                    time={item.time}
                    isUser={item.isUser}
                />
            )}
            style={styles.container}            
            contentContainerStyle={styles.contentContainer}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eaf3ff", 
    },
    contentContainer: {
        padding: 12,
        paddingBottom: 80, 
    },
});