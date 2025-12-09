import { Book, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useArticleList } from '../../hooks/useArticle';

interface KnowledgeProps {
    id: number;
    image: any; // Image source
    title: string;
    description: string;
}

export const Knowledge: React.FC = () => {
    const navigation = useNavigation<any>();
    const knowledgeData = useArticleList();
    const onPress = () => {
        console.log("Navigating to Knowledge Center details...");
        navigation.navigate("KnowledgeCenter");
    }

    const onItemPress = (item: any) => {
        navigation.navigate('KnowledgeDetail', { article: item });
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
                {knowledgeData.articles.slice(0, 4).map((item, index) => (
                    <TouchableOpacity onPress={() => onItemPress(item)} style={styles.gridItem} key={item.id}>
                        <Image source={{ uri: item.imageUrl[0] }} style={styles.image} />
                        <View style={styles.content}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.description} numberOfLines={2}>{item.summary}</Text>
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
