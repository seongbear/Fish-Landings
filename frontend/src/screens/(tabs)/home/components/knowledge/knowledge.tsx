import { Book, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

interface KnowledgeProps {
    id: number;
    image: any; // Image source
    title: string;
    description: string;
}

const mockKnowledgeData: KnowledgeProps[] = [
    {
        id: 1,
        image: { uri: 'https://worldoceanreview.com/wp-content/uploads/2013/02/wor2_k5b-s116_5-13_fischereimethoden_stellnetz.jpg' },
        title: "Fishing Techniques",
        description: "Learn about various fishing techniques to improve your catch rate."
    },
    {
        id: 2,
        image: { uri: 'https://img.freepik.com/free-vector/set-icons-with-sea-river-fishes-with-inscriptions-white-isolated_1284-26638.jpg?semt=ais_hybrid&w=740&q=80' },
        title: "Fish Species",
        description: "Get to know different fish species and their habitats."
    },
    {
        id: 3,
        image: { uri: 'https://smoothmovesseats.com/wp-content/uploads/2025/07/H2OOnTheGo-378563-Rod-Ocean-Sunset-blogbanner1.jpg' },
        title: "Weather Patterns",
        description: "Understand weather patterns and how they affect fishing."
    },
    {
        id: 4,
        image: { uri: 'https://images.squarespace-cdn.com/content/v1/60a43bf842d7b601064a8828/40d0c768-a05b-4400-833d-54515d5cd949/types+of+gears.jpg' },
        title: "Gear Guide",
        description: "A comprehensive guide to fishing gear and equipment."
    }
];

export const Knowledge: React.FC = () => {
    const navigation = useNavigation<any>();
    const onPress = () => {
        console.log("Navigating to Knowledge Center details...");
        navigation.navigate("KnowledgeCenter");
    }

    const onItemPress = (id: number) => {
        console.log(`Navigating to details of knowledge item with id: ${id}`);
    }

    return (
        <View style={styles.KnowledgeContainer}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Book size={20} color="#4A90E2" />
                    <Text style={styles.headerText}>Knowledge Center</Text>
                </View>
                <TouchableOpacity onPress={onPress}>
                    <ChevronRight size={20} color="#4A90E2" />
                </TouchableOpacity>
            </View>

            {/* 2 x 2 Grid */}
            <View style={styles.grid}>
                {mockKnowledgeData.map((item, index) => (
                    <TouchableOpacity onPress={() => onItemPress(item.id)} style={styles.gridItem} key={item.id}>
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.content}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    KnowledgeContainer: {
        marginTop: 16,
        backgroundColor: '#f5f8fa',
        borderRadius: 12,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    content:{
        paddingHorizontal: 8,
        paddingTop: 4,
        paddingBottom: 8
    },
    image: {
        width: '100%',
        height: 100,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: 'grey',
    },
});
