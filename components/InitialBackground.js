import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { View, Dimensions, Platform, StyleSheet } from 'react-native';
import { Canvas, Path, Circle, useCanvasRef, Text, matchFont, BlurMask, Skia } from '@shopify/react-native-skia';
import Animated, { useSharedValue, withTiming, withDelay, runOnJS, Easing } from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import FeelingsCard from './FeelingsCard';

const { width, height } = Dimensions.get('window');

const colorSets = [
  { start: '#08283d', end: '#73aed8' },
  { start: '#330947', end: '#cb0e0e' },
  { start: '#f2ed55', end: '#a74a11' },
  { start: '#0d6644', end: '#f4d35e' },
  { start: '#114e80', end: '#218335' },
  { start: '#3f2caf', end: '#e94057' },
  { start: '#42275a', end: '#734b6d' },
  { start: '#283c86', end: '#45a247' },
  { start: '#8e2de2', end: '#4a00e0' },
  { start: '#ffafbd', end: '#ffc3a0' },
  { start: '#ee0979', end: '#ff6a00' },
  { start: '#16a085', end: '#f4d03f' },
  { start: '#1d2b64', end: '#f8cdda' },
  { start: '#c6ffdd', end: '#fbd786' },
  { start: '#4568dc', end: '#b06ab3' },
  { start: '#ff416c', end: '#ff4b2b' },
  { start: '#1f4037', end: '#99f2c8' },
  { start: '#00c6ff', end: '#0072ff' },
  { start: '#7f00ff', end: '#e100ff' },
  { start: '#ff7e5f', end: '#feb47b' },
  { start: '#6a11cb', end: '#2575fc' },
  { start: '#fc5c7d', end: '#6a82fb' },
  { start: '#43cea2', end: '#185a9d' },
  { start: '#ff0099', end: '#493240' },
  { start: '#c31432', end: '#240b36' },
  { start: '#302b63', end: '#24243e' },
  { start: '#00b09b', end: '#96c93d' },
  { start: '#eacda3', end: '#d6ae7b' },
  { start: '#cc2b5e', end: '#753a88' },
  { start: '#b92b27', end: '#1565c0' },
  { start: '#f857a6', end: '#ff5858' },
  { start: '#003973', end: '#e5e5be' },
  { start: '#1f1c2c', end: '#928dab' },
  { start: '#654ea3', end: '#eaafc8' },
  { start: '#ed213a', end: '#93291e' },
  { start: '#16bffd', end: '#cb3066' },
  { start: '#000428', end: '#004e92' },
  { start: '#360033', end: '#0b8793' },
  { start: '#0082c8', end: '#667db6' },
  { start: '#485563', end: '#29323c' },
  { start: '#eb3349', end: '#f45c43' },
  { start: '#5c258d', end: '#4389a2' },
  { start: '#70e1f5', end: '#ffd194' },
  { start: '#11998e', end: '#38ef7d' },
  { start: '#fc5c7d', end: '#6a82fb' },
  { start: '#16a085', end: '#f4d03f' },
  { start: '#ff0099', end: '#493240' },
  { start: '#8e2de2', end: '#4a00e0' },
  { start: '#00c6ff', end: '#0072ff' },
  { start: '#7f00ff', end: '#e100ff' },
  { start: '#fc466b', end: '#3f5efb' },
  { start: '#ee0979', end: '#ff6a00' },
];

const interpolateColor = (startColor, endColor, factor) => {
  const result = startColor.slice(1).match(/.{2}/g).map((hex, i) => {
    const start = parseInt(hex, 16);
    const end = parseInt(endColor.slice(1).match(/.{2}/g)[i], 16);
    const value = Math.round(start + factor * (end - start)).toString(16).padStart(2, '0');
    return value;
  }).join('');
  return `#${result}`;
};

const InitialBackground = ({ navigation }) => {
  const MAX_CIRCLES = 100;
  const mousePosition = useSharedValue({ horizontal: 0, vertical: 0 });
  const mousePositionLastOffset = useSharedValue({ horizontal: 0, vertical: 0 });
  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);
  const theme = useTheme();

  const [circleQueue, setCircleQueue] = useState([]); // Queue to manage circle positions
  const [currentColorSetIndex, setCurrentColorSetIndex] = useState(0); // Track the current color set
  const [isTouching, setIsTouching] = useState(false); // Track if the screen is being touched

  const getCurrentColorSet = useCallback(() => {
    const safeIndex = currentColorSetIndex % colorSets.length;
    return colorSets[safeIndex];
  }, [currentColorSetIndex]);

  const getRandomColorSet = () => {
    const randomIndex = Math.floor(Math.random() * colorSets.length);
    return colorSets[randomIndex];
  };

  const updateCircleQueue = useCallback((position) => {
    setCircleQueue((currentQueue) => {
      const newQueue = [...currentQueue, { ...position, opacity: 1 }];
      if (newQueue.length > MAX_CIRCLES) {
        newQueue.shift(); // Remove the oldest position
      }
      return newQueue.map((pos, index) => ({
        ...pos,
        opacity: pos.opacity - 0.05, // Reduce opacity gradually
      })).filter(pos => pos.opacity > 0);
    });
  }, []);

  const fadeOutCircles = () => {
    const interval = setInterval(() => {
      setCircleQueue((currentQueue) => {
        const newQueue = currentQueue.map((pos) => ({
          ...pos,
          opacity: pos.opacity - 0.05,
        })).filter(pos => pos.opacity > 0);
        if (newQueue.length === 0) {
          clearInterval(interval);
        }
        return newQueue;
      });
    }, 50); // Adjust the interval time for the fade-out effect
  };

  const handleEnd = useCallback(() => {
    const finalPosition = {
      horizontal: mousePosition.value.horizontal + velocityX.value * 0.2,
      vertical: mousePosition.value.vertical + velocityY.value * 0.2,
    };
  
    mousePosition.value = withTiming(finalPosition.horizontal, { duration: 500, easing: Easing.out(Easing.exp) });
    mousePosition.value = withTiming(finalPosition.vertical, { duration: 500, easing: Easing.out(Easing.exp) });
  
    runOnJS(updateCircleQueue)(finalPosition);
    runOnJS(fadeOutCircles)();
  }, [mousePosition, velocityX, velocityY, updateCircleQueue, fadeOutCircles]);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      runOnJS(setIsTouching)(true);
      const startPosition = { horizontal: e.x, vertical: e.y };
      mousePosition.value = startPosition;
      mousePositionLastOffset.value = startPosition;
      runOnJS(setCircleQueue)([]); // Clear the queue
      runOnJS(updateCircleQueue)(startPosition);
    })
    .onUpdate((e) => {
      const newPosition = {
        horizontal: mousePositionLastOffset.value.horizontal + e.translationX,
        vertical: mousePositionLastOffset.value.vertical + e.translationY,
      };
      mousePosition.value = newPosition;
      velocityX.value = e.velocityX;
      velocityY.value = e.velocityY;
      runOnJS(updateCircleQueue)(newPosition);
    })
    .onEnd(() => {
      runOnJS(setIsTouching)(false);
      runOnJS(handleEnd)();
    });

  useEffect(() => {
    const randomColorSet = getRandomColorSet();
    if (isTouching) {
      const interval = setCurrentColorSetIndex(colorSets.indexOf(randomColorSet)); 
      return () => clearInterval(interval);
    }
  }, [isTouching]);

  const ref = useCanvasRef();

  const fontFamily = Platform.select({ ios: "Helvetica", default: "verdana" });
  const fontStyle = {
    fontFamily,
    fontSize: 32,
    fontWeight: "bold",
  };
  const font = useMemo(() => matchFont(fontStyle), [fontStyle]); // Memoize font to avoid re-creation

  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);

  useEffect(() => {
    opacity1.value = withTiming(1, { duration: 2000 });
    opacity2.value = withDelay(2000, withTiming(1, { duration: 2000 }));
  }, []);

  const [showCard, setShowCard] = useState(true);

  const handleButtonPress = () => {
    setShowCard(false);
    navigation.replace('Main');
  };

  return (
    <>
      {showCard && (
        <View style={{ flex: 1, backgroundColor: theme.colors.onSecondary }}>
          <GestureDetector gesture={panGesture}>
          <Canvas style={{ flex: 1 }} ref={ref}>
            {circleQueue.map((pos, index) => {
              const factor = index / circleQueue.length;
              const currentColorSet = getCurrentColorSet();
              const color = interpolateColor(currentColorSet.start, currentColorSet.end, factor);
              return (
                <Circle
                  key={index}
                  cx={pos.horizontal}
                  cy={pos.vertical}
                  r={50 - (index * 50) / circleQueue.length}
                  color={color}
                  opacity={pos.opacity}
                >
                  <BlurMask blur={20} style="normal" />
                </Circle>
              );
            })}
            <Text
              x={width / 2 - 15}
              y={height / 2 - 150}
              text="Hi."
              font={font}
              color={theme.colors.onBackground}
              opacity={opacity1.value}
            />
            <Text
              x={width / 2 - 145}
              y={height / 2 - 110}
              text="How are you feeling?"
              font={font}
              color={theme.colors.onSecondaryContainer}
              opacity={opacity2.value}
            />
          </Canvas>
          </GestureDetector>
          
          <FeelingsCard onButtonPress={handleButtonPress} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  canvasContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2, // Ensure the canvas is at the bottom layer
  },
  functionalOverlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
  },
});

export default InitialBackground;
