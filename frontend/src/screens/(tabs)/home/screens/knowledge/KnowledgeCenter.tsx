import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Carousel } from '../../components/knowledge/carousel';
import { KnowledgeListItem } from '../../components/knowledge/knowledgeListItem';
import { FilterDropdown } from '../../../../../components/filter';
import Background from '../../../../../components/background';
import { useArticleById, useArticleCategories, useArticleList } from '../../hooks/useArticle';


export const KnowledgeCenterScreen = () => {
    const articleList = useArticleList();
    const articleCategories = [ 'All', ...useArticleCategories().categories ].map(cat => typeof cat === 'string' ? cat : cat.name);

    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    return (
        <Background disableTopEdge={true}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Latest Updates</Text>
                {/* Horizontal scroll of articles */}
                <Carousel articleList={articleList.articles}/>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={styles.title}>All Articles</Text>
                    <FilterDropdown label="Category" data={articleCategories} selected={selectedCategory} onSelect={(item: string) => setSelectedCategory(item)}/>
                </View>

                {/* List of articles */}
                <View style={{ marginHorizontal: 5, marginBottom: 20 }}>
                    {articleList.articles
                        .filter(article => selectedCategory === 'All' || article.category?.includes(selectedCategory))
                        .map(article => (
                            <KnowledgeListItem key={article.id} article={article} />
                        ))}
                </View>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    title:{
        fontSize: 20,
        fontWeight: '600',
        color: '#0000',
    },
})