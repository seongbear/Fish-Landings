import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Dimensions, 
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
  TouchableOpacity
} from 'react-native';
import { Article } from '../../types/article';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from '../../../../../utils/formatDate';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- 1. Fix Dimensions to include Margins ---
const ITEM_WIDTH = SCREEN_WIDTH * 0.85;
const ITEM_MARGIN = 3;

export const Carousel: React.FC<{ articleList: Article[] }> = ({ articleList }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Memoized top 3 articles
  const topArticles = useMemo(() => {
    if (!articleList) return [];
    
    return [...articleList] 
      .sort((a, b) => {
        const dateA = new Date(a.latestUpdateDate).getTime();
        const dateB = new Date(b.latestUpdateDate).getTime();
        return dateB - dateA; 
      })
      .slice(0, 3); 
  }, [articleList]);

  // --- Auto-Play Logic ---
  useEffect(() => {
    if (!topArticles || topArticles.length <= 1) return;

    const interval = setInterval(() => {
      // Calculate next index looping back to 0
      const nextIndex = activeIndex === topArticles.length - 1 ? 0 : activeIndex + 1;
      
      flatListRef.current?.scrollToIndex({ 
        index: nextIndex, 
        animated: true 
      });
      
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, topArticles.length]);


  // --- Handle Scroll ---
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // FIX: Divide by TOTAL width (card + margins)
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  const navigation = useNavigation<any>();
  const renderItem = ({ item }: { item: Article }) => {
     const handleItemPress = () => {
      console.log('Pressed article with id:', item.id);
      navigation.navigate('KnowledgeDetail', { article: item });
    }

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress()}>
        <View style={styles.innerItemContainer}>
           {item.imageUrl && item.imageUrl[0] && (
              <Image source={{ uri: item.imageUrl[0] }} style={styles.image} />
           )}

           <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
           <Text style={styles.dateText}>{formatDate(item.latestUpdateDate)}</Text>
           <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!topArticles || topArticles.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={topArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        
        // --- Snap Logic ---
        pagingEnabled={false} 
        snapToInterval={ITEM_WIDTH} // FIX: Snap to total width
        snapToAlignment="center"
        decelerationRate="fast"
        
        // --- Layout Helper ---
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH, // FIX: Use total width
          offset: ITEM_WIDTH * index,
          index,
        })}
        
        // --- Centering Fix ---
        // Adds padding to the list container so the first item is centered
        contentContainerStyle={{
          paddingHorizontal: 0
        }}
      />

      <View style={styles.paginationContainer}>
        {/* FIX: Map over topArticles, not articleList */}
        {topArticles.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 285, 
    marginVertical: 10,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN, // 5px on left, 5px on right
    height: 250,
  },
  innerItemContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16, 
    fontWeight: '600', 
    marginHorizontal: 10, 
    marginTop: 10, 
    marginBottom: 5 
  },
  summary: {
    fontSize: 12, 
    color: '#666', 
    marginHorizontal: 10 
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2137a8ff',
    width: 20, 
  },
  inactiveDot: {
    backgroundColor: 'gray',
    opacity: 0.5,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 10,
    marginBottom: 5,
  },
});