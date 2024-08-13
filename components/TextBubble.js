import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { Canvas, Path } from '@shopify/react-native-skia';
import TypingEffect from './TypingEffect'; 
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');

const TextBubble = ({ text, pointerLocation, children }) => {
  const theme = useTheme();

  return (
    <>
      {pointerLocation === 'left' ? (
      <Animated.View style={{...styles.leftBubble, backgroundColor: theme.colors.primary, }}>
        <Text style={{fontSize: 16}}>{text}</Text>
        {children && <Divider style={{ marginVertical: 20 }} />}
        <View style={styles.childrenContainer}>
          {children}
        </View> 
        <View style={styles.pointerContainerLeft}>
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
      ) : (
      <Animated.View style={{...styles.rightBubble, backgroundColor: theme.colors.primary, }}>
        <Text style={{fontSize: 16}}>{text}</Text>
        {children && <Divider style={{ marginVertical: 20 }} />}
        <View style={styles.childrenContainer}>
          {children}
        </View> 
        <View style={styles.pointerContainerRight}>
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
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
  leftBubble: {
    padding: 15,
    borderRadius: 15,
    position: 'relative',
    minWidth: 10, 
    maxWidth: width - 30, 
    alignSelf: 'flex-start', 
  },
  rightBubble: {
    padding: 15,
    borderRadius: 15,
    position: 'relative',
    minWidth: 10,
    maxWidth: width - 30, 
    alignSelf: 'flex-end', 
  },
  pointerContainerLeft: {
    position: 'absolute',
    bottom: -7,
    transform: [{ translateX: 10 }],
    width: 20,
    height: 10,
  },
  pointerContainerRight: {
    position: 'absolute',
    bottom: -7,
    right: 0,
    transform: [{ translateX: -10 }],
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

TextBubble.propTypes = {
  text: PropTypes.string.isRequired,
  pointerLocation: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node,
};

// Default props in case they are not provided
TextBubble.defaultProps = {
  pointerLocation: 'left', // Default value if not provided
};

export default TextBubble;