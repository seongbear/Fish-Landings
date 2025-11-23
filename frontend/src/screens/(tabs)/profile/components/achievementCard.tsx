import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface CommonCardProps {
    icon: string;
    title: string;
    achieved: boolean;
}

export default function CommonCard({icon, title, achieved}: CommonCardProps) {
    return (
        <View style={[styles.container, { borderColor: achieved ? '#FACC15' :'#F3F4F6', backgroundColor: achieved ? '#fffceb' : '#F3F4F6' }]}>
            <View style={styles.header}>
                <Text style={{ fontSize: 25, marginBottom: 4 }}>{icon}</Text>
                <Text style={{ fontWeight: '400', fontSize:10, color: achieved ? 'black' : 'grey', textAlign: 'center', marginLeft: 4 }}>{title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
       width: '23%',            // fits 4 per row with spacing
        aspectRatio: 1,          // makes it a square
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FACC15',
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 16,
    },
    header:{
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',

    }
});