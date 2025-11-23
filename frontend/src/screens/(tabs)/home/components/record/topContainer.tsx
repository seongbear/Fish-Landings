import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface HomePageTopContainerProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    color?: string;
}

export default function HomePageTopContainer({icon, title, description, color}: HomePageTopContainerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {icon}
                <Text style={{ fontWeight: '400', fontSize: 12, color: color ?? '#000', textAlign: 'center', marginLeft: 4 }}>{title}</Text>
            </View>
            
            <Text style={{ fontSize: 20, color: 'black', fontWeight: '500', marginTop: 8 }}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 2,
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',

    }
});