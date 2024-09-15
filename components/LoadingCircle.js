// LoadingCircle.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

// Get device dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Constants
const DOT_COUNT = 12; // Number of dots
const DOT_SIZE = width * 0.04; // 4% of screen width
const RADIUS = width * 0.25; // 25% of screen width
const ANIMATION_DURATION = 750; // Duration for one horizontal movement (ms)
const DELAY_BETWEEN_DOTS = 150; // Delay between each dot's animation (ms)

// Calculate LOOP_DURATION
const LOOP_DURATION = (DOT_COUNT - 1) * DELAY_BETWEEN_DOTS + ANIMATION_DURATION;

const LoadingCircle = () => {
  const theme = useTheme(); // Access the current theme

  // Create an array for dots
  const dots = Array.from({ length: DOT_COUNT }, (_, index) => index);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Text style={[styles.header, { color: theme.colors.onBackground }]}>
        Personalizing Your Experience...
      </Text>

      {/* Loading Animation */}
      <View style={styles.loadingContainer}>
        {dots.map((dot) => {
          // Calculate the angle for each dot (evenly distributed)
          const angle = (2 * Math.PI / DOT_COUNT) * dot;

          // Calculate initial positions based on angle
          const initialX = RADIUS * Math.cos(angle);
          const initialY = RADIUS * Math.sin(angle);

          // Assign color based on theme colors
          const color = getDotColor(dot, theme);

          // Calculate delay for sequential animation
          const delay = dot * DELAY_BETWEEN_DOTS;

          return (
            <Dot
              key={dot}
              initialX={initialX}
              initialY={initialY}
              delay={delay}
              color={color}
            />
          );
        })}
      </View>
    </View>
  );
};

// Function to get dot color based on index and theme
const getDotColor = (index, theme) => {
    const colorPalette = [
        '#A8D1FF',  // Lightest Blue
        '#9ACBFF',  // Light Blue
        '#8BC5FF',  // Soft Blue
        '#7DBFFF',  // Soft Blue with a slight gray
        '#6FB9FF',  // Lighter Blue
        '#61B3FF',  // Muted Blue
        '#234B8A',  // Deep Blue-Gray
        '#2A5FB5',  // Dark Grayish Blue
        '#3167CC',  // Deeper Grayish Blue
        '#3C77E6',  // Muted Gray-Blue
        '#4687FF',  // Blue with a touch of gray
        '#539DFF',  // Soft Grayish Blue
    ];
  return colorPalette[index % colorPalette.length];
};

// Dot Component
const Dot = ({ initialX, initialY, delay, color }) => {
  // Shared value for animation progress (0 to 1)
  const progress = useSharedValue(0);

  useEffect(() => {
    // Start the continuous back-and-forth animation with delay
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.ease),
        }),
        -1, // Infinite repeats
        true // Reverse animation (back and forth)
      )
    );
  }, [progress, delay]);

  // Animated style for the dot
  const animatedStyle = useAnimatedStyle(() => {
    // Interpolate translateX and translateY based on progress
    const translateX = interpolate(progress.value, [0, 1], [initialX, -initialX]);
    const translateY = interpolate(progress.value, [0, 1], [initialY, -initialY]);

    // Optional: Add scaling effect based on progress
    const scale = 1 + 0.2 * Math.sin(progress.value * Math.PI);

    return {
      transform: [
        { translateX },
        { translateY },
        { scale }, // Scaling effect
      ],
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle, { backgroundColor: color }]} />;
};

export default LoadingCircle;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor is set dynamically via theme.colors.background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Optional padding
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20, // Space between header and loading animation
    textAlign: 'center',
  },
  loadingContainer: {
    width: width * 0.5, // Adjust as needed
    height: width * 0.5, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    // backgroundColor is set dynamically via props
  },
});
