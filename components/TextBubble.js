import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { Canvas, Path } from '@shopify/react-native-skia';
import TypingEffect from './TypingEffect'; // Adjust the import path as necessary

const { width } = Dimensions.get('window');

const TextBubble = ({ text, children }) => {
  const theme = useTheme();

  return (
    <Animated.View style={{...styles.bubble, backgroundColor: theme.colors.primary}}>
      <TypingEffect text={text} speed={100} fontSize={16} />
      <Divider style={{ marginVertical: 20 }} />
      <View style={styles.childrenContainer}>
        {children}
      </View>
      <View style={styles.pointerContainer}>
        <Canvas style={styles.pointerCanvas}>
            <Path
              path="M 0 0 L 10 10 L 20 0 Z"
              color={theme.colors.primary}
              strokeWidth={2}
              stroke={theme.colors.onPrimary}
            />
          </Canvas>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
  },
  pointerContainer: {
    position: 'absolute',
    bottom: -7,
    transform: [{ translateX: 20 }],
    width: 20,
    height: 10,
  },
  pointerCanvas: {
    width: '100%',
    height: '100%',
  },
  childrenContainer: {
    width: '100%',
    alignItems: 'center', // Ensure children are centered within the bubble
  },
});

export default TextBubble;
