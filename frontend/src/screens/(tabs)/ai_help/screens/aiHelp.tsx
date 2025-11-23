import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import MessageList from "../components/messageList";
import ChatInput from "../components/chatInput";
import ChatHeader from "../components/chatHeader";
import Background from "../../../../components/background";
import ChatDrawer from "../components/chatDrawer"; 
import { Plus } from "lucide-react-native";  

const generateId = (): string => 'session-' + Math.random().toString(36).substring(2, 9);

export default function AIHelpPage() {
    const [sessions, setSessions] = useState([{ 
        id: "session1", 
        title: "Bass Lure Inquiry", 
        messages: [
            { text: "Hello! I'm your AI fishing assistant...", time: "12:10 am", isUser: false },
            { text: "hi, what's a good lure for bass in cloudy weather?", time: "12:18 am", isUser: true },
        ]
    }]);

    const [currentSessionId, setCurrentSessionId] = useState(sessions[0].id);
    const [message, setMessage] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (!currentSession) return <View style={styles.screen}><Text>Error: Session not found.</Text></View>;      

    const handleSend = () => {
        if (!message.trim() || !currentSession) return;
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
        const newMessage = { text: message, time: timeString, isUser: true };

        setSessions(prevSessions => 
            prevSessions.map(session => 
                session.id === currentSessionId
                    ? { ...session, messages: [...session.messages, newMessage] }
                    : session
            )
        );
        setMessage("");
    };

    const handleSelectSession = (sessionId: string) => {
        setCurrentSessionId(sessionId);
        setIsDrawerOpen(false); 
    };

    const createNewSession = () => {
        const newSessionId = generateId();
        const newSession = {
            id: newSessionId,
            title: "New Chat Session",
            messages: [{ text: "New conversation started. How can I assist you?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(), isUser: false }],
        };

        setSessions(prevSessions => [newSession, ...prevSessions]);
        setCurrentSessionId(newSessionId);
        setIsDrawerOpen(false);
    };

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
                            title={currentSession.title} 
                            onMenuPress={() => setIsDrawerOpen(true)}
                        />
                        
                        <View style={styles.messageListContainer}>
                            <MessageList messages={currentSession.messages} />
                        </View>

                        <ChatInput 
                            message={message}
                            setMessage={setMessage}
                            onSend={handleSend}
                        />
                    </Background>
                </View>
            </KeyboardAvoidingView>

            {/* Chat Drawer */}
            <ChatDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                position="right"
            >
                {/* Drawer Header: New Chat Button */}
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Chat Sessions</Text>
                    <TouchableOpacity onPress={createNewSession} style={styles.newChatButton}>
                        <Plus size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* List of Sessions */}
                {sessions.map((session) => (
                    <TouchableOpacity
                        key={session.id}
                        style={[
                            styles.sessionItem,
                            session.id === currentSessionId && styles.activeSession,
                        ]}
                        onPress={() => handleSelectSession(session.id)}
                    >
                        <Text 
                            style={[
                                styles.sessionTitle,
                                session.id === currentSessionId && styles.activeSessionTitle,
                            ]} 
                            numberOfLines={1}
                        >
                            {session.title}
                        </Text>
                        <Text style={styles.sessionTime}>{session.messages[0]?.time || ''}</Text>
                    </TouchableOpacity>
                ))}
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
    }
});
