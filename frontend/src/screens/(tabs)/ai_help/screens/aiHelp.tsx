import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import MessageList from "../components/messageList";
import ChatInput from "../components/chatInput";
import ChatHeader from "../components/chatHeader";
import Background from "../../../../components/background";
import ChatDrawer from "../components/chatDrawer"; 
import { Plus } from "lucide-react-native";  
import useChatHook from "../hooks/useChatHook";

export default function AIHelpPage() {
    const chatHook = useChatHook();

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} 
            >
                <View style={styles.screen}>
                    <Background>
                        <ChatHeader 
                            title={chatHook.currentSession?.title || "AI Help"} 
                            onMenuPress={() => chatHook.setIsDrawerOpen(true)}
                        />
                        
                        <View style={styles.messageListContainer}>
                            <MessageList messages={chatHook.currentSession?.messages || []} />
                        </View>

                        <ChatInput 
                            message={chatHook.message}
                            setMessage={chatHook.setMessage}
                            onSend={chatHook.handleSend}
                        />
                    </Background>
                </View>
            </KeyboardAvoidingView>

            {/* Chat Drawer */}
            <ChatDrawer 
                isOpen={chatHook.isDrawerOpen} 
                onClose={() => chatHook.setIsDrawerOpen(false)}
                position="right"
            >
                {/* Drawer Header: New Chat Button */}
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Chat Sessions</Text>
                    <TouchableOpacity onPress={chatHook.createNewSession} style={styles.newChatButton}>
                        <Plus size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* List of Sessions */}
                {chatHook.sessions.map((session) => {
                    const lastMessageTime = session.messages.length > 0
                        ? session.messages[session.messages.length - 1].time
                        : "";

                    return (
                        <TouchableOpacity
                            key={session.id}
                            style={[
                                styles.sessionItem,
                                session.id === chatHook.currentSessionId && styles.activeSession,
                            ]}
                            onPress={() => chatHook.handleSelectSession(session.id)}
                        >
                            <Text 
                                style={[
                                    styles.sessionTitle,
                                    session.id === chatHook.currentSessionId && styles.activeSessionTitle,
                                ]} 
                                numberOfLines={1}
                            >
                                {session.title}
                            </Text>
                            <Text style={styles.sessionTime}>{lastMessageTime}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ChatDrawer>
        </>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#eaf3ff",
    },
    messageListContainer: {
        flex: 1, 
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    drawerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    newChatButton: {
        backgroundColor: '#2563eb',
        padding: 8,
        borderRadius: 20,
    },
    sessionItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activeSession: {
        backgroundColor: '#e8f0ff', 
        borderRadius: 8,
    },
    sessionTitle: {
        fontSize: 15,
        color: '#1f2937',
        fontWeight: '500',
        flexShrink: 1,
        marginRight: 10,
    },
    activeSessionTitle: {
        fontWeight: 'bold',
        color: '#2563eb', 
    },
    sessionTime: {
        fontSize: 12,
        color: '#6b7280',
    },
});
