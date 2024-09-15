import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, Dimensions, Pressable } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Animated, {
Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import TextBubble from './TextBubble';
import BackButton from './BackButton';

const { width } = Dimensions.get('window');
const PAGE_WIDTH = 120;
const PAGE_HEIGHT = 40;

const categories = ['Family', 'Work', 'Health', 'Relationships', 'Finance', 'Other'];

const ProblemSelection = ({ onProblemSubmit }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const carouselRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); 
  const [details, setDetails] = useState('');

  const handleCategorySelect = (index) => {
    setSelectedCategory(categories[index]);
    carouselRef.current?.scrollTo({ index, animated: true }); // Snap to the selected item
  };

  const handleSubmit = () => {
    const problemData = { category: selectedCategory, details };
    onProblemSubmit(problemData);
  };

  const renderItem = ({ item, index, animationValue }) => {
    const isSelected = item === selectedCategory;

    return (
      <Item
        animationValue={animationValue}
        label={item}
        onPress={() => handleCategorySelect(index)}
        isSelected={isSelected}
      />
    );
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.colors.onSecondary }]}>
        <Carousel
          ref={carouselRef}
          data={categories}
          renderItem={renderItem}
          width={110}
          height={PAGE_HEIGHT}
          style={styles.carousel}
          sliderWidth={width}
          inactiveSlideOpacity={0.5}
          onSnapToItem={handleCategorySelect} // Automatically select the central item
        />
        <TextInput
          label="Additional details (optional)"
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={4}
          style={[styles.textInput, { backgroundColor: theme.colors.secondaryContainer }]}
          placeholder="Type more details here..."
          placeholderTextColor={theme.colors.onSecondaryContainer}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
        >
          Submit
        </Button>
      </View>
    </>
  );
};

const Item = ({ animationValue, label, onPress, isSelected }) => {
    const translateY = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.5, 1, 0.5],
        Extrapolation.CLAMP,
      );
  
      const translateYValue = isSelected ? -5 : 0;
  
      return {
        opacity,
        transform: [{ translateY: withTiming(translateYValue, { duration: 200, }) }],
      };
    }, [animationValue, isSelected]);
  
    const labelStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [1, 1.2, 1],
        Extrapolation.CLAMP,
      );
  
      const color = interpolateColor(
        animationValue.value,
        [-1, 0, 1],
        ['#b6bbc0', '#ffffff', '#b6bbc0'],
      );
  
      return {
        transform: [{ scale }],
        color: isSelected ? 'rgb(153, 203, 255)' : color,
      };
  }, [animationValue, translateY, isSelected]);

  return (
    <Pressable
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          },
          containerStyle,
        ]}
      >
        <Animated.Text
          style={[{ fontSize: 14 }, labelStyle]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    minWidth: '100%',
    borderRadius: 8,
  },
  carousel: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center'
  },
  textInput: {
    marginTop: 16,
    padding: 8,
    borderRadius: 4,
    textAlignVertical: 'top', // Ensures text input starts at the top
    color: 'white'
  },
  submitButton: {
    marginTop: 20,
  },
});

export default ProblemSelection;
