import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigators/type'; // Ensure this path is correct
import Background from '../../../../components/background';
import { formatDate } from '../../../../utils/formatDate';
import { fetchArticleById } from '../../../../api/articleApi';
import { useArticleById } from '../hooks/useArticle';
import ImageSlider from '../../../../components/image_slider';

// 1. Define the props for this specific screen
type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeDetail'>;

// 2. Add '{ route }' to the function arguments
export const KnowledgeDetailScreen = ({ route }: Props) => {
    const article = useArticleById(route.params.article.id);

    return (
        <Background disableTopEdge={true}>
            <ScrollView style={styles.container}>
                {/* Now you can use the data */}
                <Text style={styles.title}>{route.params.article.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.idText}>{route.params.article.author}</Text>
                    <Text style={styles.idText}>{formatDate(route.params.article.latestUpdateDate)}</Text>
                </View>
                <ImageSlider slides={route.params.article.imageUrl.map((url: string) => ({ image: url }))} />
                <Text style={styles.content}>{article.ArticleDetail?.content}</Text>
            </ScrollView>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    idText: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 16,
    },
    content: {
        marginTop: 16,
        fontSize: 16,
        lineHeight: 24,
    }
});