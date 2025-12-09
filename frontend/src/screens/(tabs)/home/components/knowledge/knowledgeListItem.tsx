import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Article } from '../../types/article';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '../../../../../utils/formatDate';

interface KnowledgeListItemProps {
  article: Article;
}

export const KnowledgeListItem: React.FC<KnowledgeListItemProps> = ({ article }) => {
  
  // Safe Image Logic (Fallback if missing)
  const imageSource = article.imageUrl && article.imageUrl[0] 
    ? { uri: article.imageUrl[0] } 
    : { uri: 'https://via.placeholder.com/100' };

  const navigation = useNavigation<any>();
  
  const handlePress = () => {
    console.log('Pressed article with id:', article.id);
    navigation.navigate('KnowledgeDetail', { article });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handlePress}>
        <Image source={imageSource} style={styles.image} />
      
        <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
            {article.title}
            </Text>
            
            <Text style={styles.summary} numberOfLines={2}>
            {article.summary}
            </Text>

            {/* Display the formatted date */}
            <Text style={styles.date}>
                {formatDate(article.latestUpdateDate)}
            </Text>
        </View>
      </TouchableOpacity>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  }
});