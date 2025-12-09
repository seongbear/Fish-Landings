import React, { useState, useRef } from 'react';
import { 
  View, 
  FlatList, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Text, 
  ViewToken 
} from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

interface ImageSliderProps {
  slides: { image: string; title?: string }[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle visible items change
  const onViewRef = useRef((info: { viewableItems: ViewToken[] }) => {
    if (info.viewableItems.length > 0) {
      setActiveIndex(info.viewableItems[0].index ?? 0);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.image.toString()}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
        <View style={{marginHorizontal: 3}}>
          <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          </View>
        </View>
        )}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  slide: {
    width: windowWidth * 0.9, // Adjust for padding/margin if needed
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: windowWidth * 0.9, // Adjust for padding/margin if needed
    marginHorizontal: 10,
    height: '100%',
    borderRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: { backgroundColor: '#3498db' },
  inactiveDot: { backgroundColor: '#ccc' },
});

export default ImageSlider;
