import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

const CustomSlider = ({ min, max, step, value, onValueChange, width, height }) => {

  const theme = useTheme();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const handleValueChange = (val) => {
      onValueChange(val);
      opacity.value = 1; // Animate opacity to visible
  };

  const handleSlidingComplete = (val) => {
      runOnJS(() => {
          setTimeout(() => {
            opacity.value = withTiming(0, { duration: 500 }); // Animate opacity to hidden after a delay
          }, 700); // 0.7 second delay before hiding
      })();
      console.log('Sliding complete', val); // Debug log to ensure this function is called
  };

  const animatedStyle = useAnimatedStyle(() => {
      return {
          transform: [{ translateX: withTiming(translateX.value - 15) }],
          opacity: opacity.value,        
      };
  });
  

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Animated.View style={[styles.valueContainer, animatedStyle]}>
          <Text style={styles.valueLabel}>{value}</Text>
        </Animated.View>
        <Slider
            style={{width: width, height: height}}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value}
            onValueChange={handleValueChange}
            onSlidingComplete={handleSlidingComplete}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.primary}
            thumbTintColor={theme.colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      margin: 20,
    },
    sliderContainer: {
      position: 'relative',
      width: '100%',
      alignItems: 'center',
    },
    valueContainer: {
      position: 'absolute',
      bottom: 40,
      left: '50%',
      transform: [{ translateX: -15 }],
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 5,
      borderRadius: 5,
    },
    valueLabel: {
      color: '#fff',
      fontSize: 14,
    },
    slider: {
      width: '100%',
      height: 40,
    },
  });

export default CustomSlider;
