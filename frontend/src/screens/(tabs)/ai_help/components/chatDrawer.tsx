import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ChatDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    // Controls which side the drawer opens from (default is 'right')
    position?: 'left' | 'right'; 
}

export default function ChatDrawer({ isOpen, onClose, children, position = 'right' }: ChatDrawerProps) {
    // Determine the placement styles based on the position prop
    const drawerPositionStyle = position === 'right' 
        ? styles.rightPosition 
        : styles.leftPosition;

    return (
        <Modal
            animationType="fade" 
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose} // Handles Android back button
        >
            <View style={styles.modalOverlay}>
                {/* 1. Background Touchable to close the drawer (takes up the opposite side) */}
                <TouchableOpacity
                    style={styles.touchableArea}
                    onPress={onClose}
                />

                {/* 2. Drawer Content View */}
                <View style={[styles.drawerContainer, drawerPositionStyle]}>
                    <SafeAreaView style={styles.safeArea}>
                        
                        {/* Drawer Header (Fixed at the top) */}
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Sessions</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        
                        {/* Drawer Body Content (Scrollable and dynamic) */}
                        <ScrollView style={styles.body}>
                            {children}
                        </ScrollView>

                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    );
}

const DRAWER_WIDTH = width * 0.75; 

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    touchableArea: {
        flex: 1,
    },
    drawerContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
    },
    rightPosition: {
        right: 0, // Slides in from the right
    },
    leftPosition: {
        left: 0, // Slides in from the left
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    closeButton: {
        padding: 4, 
    },
    body: {
        flex: 1,
        padding: 20,
    },
});