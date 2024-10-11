// BreathingExercise.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
  withSequence,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';
import { useTheme, Button } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';

// Create animated Path
const AnimatedPath = Animated.createAnimatedComponent(Path);

const BreathingExercise = ({ moodLevels, problemData }) => {
  const theme = useTheme();
  const [phase, setPhase] = useState(''); // 'Inhale', 'Hold', 'Exhale'
  const [isBreathing, setIsBreathing] = useState(false);
  const [exerciseType, setExerciseType] = useState('Calming'); // Default exercise
  const [showExercise, setShowExercise] = useState(false); // Control to show exercise or intro
  const [exerciseColors, setExerciseColors] = useState(['#6CA0DC', '#98C1D9']); // State to store colors
  const [animationStyle, setAnimationStyle] = useState('circle'); // 'circle' or 'box'

  // Circle Mode Shared Values
  const scale = useSharedValue(1);
  const holdOpacity = useSharedValue(0);
  const holdScale = useSharedValue(1);

  // Box Mode Shared Values
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  // Define container and box sizes
  const containerSize = 200; // Size of the animation container
  const boxSize = 50; // Size of the moving box

  const maxX = containerSize - boxSize; // Maximum translation on X-axis
  const maxY = containerSize - boxSize; // Maximum translation on Y-axis

  // Box Mode Shared Values
  const strokeDashoffset = useSharedValue(400); // Adjust based on path length

  // Define the square path
  const squarePath = "M50 50 H150 V150 H50 Z";
  const pathLength = 400; // Approximate total length for a square with sides 100

  // Adjust these times based on the exercise type
  const animationDurations = {
    Calming: { inhale: 4000, exhale: 4000, hold: 4000 },
    Energizing: { inhale: 3000, exhale: 3000, hold: 1500 },
    Balanced: { inhale: 3500, exhale: 3500, hold: 2000 },
  };

  const animationDuration = animationDurations[exerciseType].inhale;
  const exhaleDuration = animationDurations[exerciseType].exhale;
  const holdDuration = animationDurations[exerciseType].hold;

  // Decide exercise type based on moodLevels
  useEffect(() => {
    if (moodLevels) {
      const { energy, focus, happiness, stress } = moodLevels;
      // Custom rules for personalization
      if (energy >= 70 || stress >= 70) {
        setExerciseType('Calming'); // Calming for high stress or energy
      } else if (stress <= 40 || energy <= 40) {
        setExerciseType('Energizing'); // Energizing for low stress or energy
      } else {
        setExerciseType('Balanced'); // Balanced for moderate levels
      }
    }
  }, [moodLevels]);

  const getExerciseColors = () => {
    switch (exerciseType) {
      case 'Calming':
        return ['#6CA0DC', '#98C1D9']; // Soothing blue tones
      case 'Energizing':
        return ['#FF6B6B', '#e19075']; // Vibrant reds and oranges
      case 'Balanced':
        return ['#00B894', '#55E6C1']; // Refreshing green tones
      default:
        return ['#6CA0DC', '#98C1D9']; // Default calming colors
    }
  };

  // Update colors whenever exerciseType changes
  useEffect(() => {
    setExerciseColors(getExerciseColors());
  }, [exerciseType]);

  // Animation styles for Circle Mode
  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: exerciseColors[0],
    };
  });

  const animatedHoldCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: holdScale.value }],
      opacity: holdOpacity.value,
      backgroundColor: exerciseColors[1],
    };
  });

  // Animated props for Box Mode
  const animatedPathProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: strokeDashoffset.value,
    };
  });

  // Animation styles for Box Mode
  const animatedBoxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { translateY: y.value },
      ],
      backgroundColor: exerciseColors[0],
    };
  });

  // Start the breathing cycle based on animationStyle
  const startBreathingCycle = () => {
    if (!isBreathing) return;
    if (animationStyle === 'circle') {
      animateCircleCycle();
    } else if (animationStyle === 'box') {
      animateBoxCycle();
    }
  };

  // Circle Mode Breathing Cycle
  const animateCircleCycle = () => {
    if (animationStyle !== 'circle') return;

    // Inhale Phase
    setPhase('Inhale');
    scale.value = withTiming(
      2,
      { duration: animationDuration, easing: Easing.inOut(Easing.ease) },
      (finished) => {
        if (finished && isBreathing) {
          // Transition to Hold Phase
          runOnJS(setPhase)('Hold');
          holdOpacity.value = withTiming(0.4, { duration: holdDuration, easing: Easing.linear });
          holdScale.value = withTiming(3, { duration: holdDuration, easing: Easing.linear }, (finished) => {
            if (finished && isBreathing) {
              // Transition to Exhale Phase
              runOnJS(setPhase)('Exhale');
              scale.value = withTiming(1, { duration: exhaleDuration, easing: Easing.inOut(Easing.ease) }, (finished) => {
                if (finished && isBreathing) {
                  // Hold After Exhale Phase
                  runOnJS(setPhase)('Hold');
                  holdOpacity.value = withTiming(0.4, { duration: holdDuration, easing: Easing.linear });
                  holdScale.value = withTiming(3, { duration: holdDuration, easing: Easing.linear }, (finished) => {
                    if (finished && isBreathing) {
                      // Reset hold circle
                      holdScale.value = withTiming(1, { duration: holdDuration, easing: Easing.inOut(Easing.ease) }, () => {
                        // Loop back to inhale
                        runOnJS(startBreathingCycle)();
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    );
  };

  // Function to start Box Mode animation
  const animateBoxCycle = () => {
    if (!isBreathing || animationStyle !== 'box') return;

    // Inhale Phase: Draw the square
    runOnJS(setPhase)('Inhale');
    strokeDashoffset.value = withTiming(
      0,
      { duration: animationDuration, easing: Easing.linear },
      (finished) => {
        if (finished && isBreathing && animationStyle === 'box') {
          // Hold Phase
          runOnJS(setPhase)('Hold');
          // Hold for holdDuration then start Exhale
          // Using withTiming on a dummy value to create a delay
          // Since setTimeout cannot be used, we simulate the delay with withTiming
          // by animating a dummy shared value and triggering exhaleBox in the callback
          const dummy = useSharedValue(0);
          dummy.value = withTiming(
            1,
            { duration: holdDuration, easing: Easing.linear },
            (finished) => {
              if (finished && isBreathing && animationStyle === 'box') {
                runOnJS(exhaleBox)();
              }
            }
          );
        }
      }
    );
  };

  // Function to handle Exhale Phase
  const exhaleBox = () => {
    if (!isBreathing || animationStyle !== 'box') return;

    // Exhale Phase: Reset the dash offset to erase the square
    runOnJS(setPhase)('Exhale');
    strokeDashoffset.value = withTiming(
      pathLength,
      { duration: exhaleDuration, easing: Easing.linear },
      (finished) => {
        if (finished && isBreathing && animationStyle === 'box') {
          // Hold Phase after Exhale
          runOnJS(setPhase)('Hold');
          // Hold for holdDuration then restart the cycle
          const dummy = useSharedValue(0);
          dummy.value = withTiming(
            1,
            { duration: holdDuration, easing: Easing.linear },
            (finished) => {
              if (finished && isBreathing && animationStyle === 'box') {
                // Restart the breathing cycle
                runOnJS(startBreathingCycle)();
              }
            }
          );
        }
      }
    );
  };

  // Trigger breathing cycle when isBreathing or animationStyle changes
  useEffect(() => {
    if (isBreathing) {
      startBreathingCycle();
    } else {
      resetAnimations();
    }
    // Cleanup on unmount
    return () => {
      resetAnimations();
    };
  }, [isBreathing, animationStyle]);

  // Reset animations when breathing stops or animationStyle changes
  const resetAnimations = () => {
    // Reset Circle Mode animations
    scale.value = 1;
    holdOpacity.value = 0;
    holdScale.value = 1;

    // Reset Box Mode animations
    strokeDashoffset.value = pathLength;

    // Reset phase
    setPhase('');
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setShowExercise(true); // Show the breathing exercise
    resetAnimations();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setShowExercise(false); // Stop and go back to the initial screen
  };

  // Toggle Animation Style between 'circle' and 'box'
  const toggleAnimationStyle = () => {
    setAnimationStyle((prevStyle) => (prevStyle === 'circle' ? 'box' : 'circle'));
    // Reset animations when style changes
    resetAnimations();
    // Restart breathing cycle if currently breathing
    if (isBreathing) {
      startBreathingCycle();
    }
  };

  // Conditionally render based on `showExercise`
  if (!showExercise) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.introText, { color: theme.colors.onBackground }]}>
          {exerciseType === 'Calming'
            ? 'You seem stressed, how about a calming breathing exercise?'
            : exerciseType === 'Energizing'
            ? 'Feeling low on energy? Try an energizing breathing exercise!'
            : 'How about a balanced breathing exercise to stabilize your mood?'}
        </Text>
        
        {/* Toggle Animation Style Button */}
        <Button
          mode="outlined"
          onPress={toggleAnimationStyle}
          style={[styles.toggleButton, { borderColor: theme.colors.primary, marginBottom: 10 }]}
          labelStyle={{ color: theme.colors.primary }}
        >
          {animationStyle === 'circle' ? 'Switch to Box Mode' : 'Switch to Circle Mode'}
        </Button>
        
        <Button
          mode="contained"
          onPress={startBreathing}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.onPrimary }}
        >
          Start Exercise
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Animation Container */}
      <View style={styles.animationContainer}>
        {animationStyle === 'circle' ? (
          <Animated.View style={[styles.circle, animatedCircleStyle]}>
            <Animated.View style={[styles.holdCircle, animatedHoldCircleStyle]} />
            <Text style={[styles.phaseText, { color: theme.colors.onPrimary }]}>{phase}</Text>
          </Animated.View>
        ) : (
          <Svg width={containerSize} height={containerSize}>
            <AnimatedPath
              d={squarePath}
              stroke={exerciseColors[0]}
              strokeWidth="4"
              fill="none"
              strokeDasharray={pathLength}
              animatedProps={animatedPathProps}
            />
          </Svg>
        )}
      </View>

      {/* Phase Text positioned outside the animation container */}
      {animationStyle === 'box' && (
        <Text style={[styles.phaseTextOutside, { color: theme.colors.onBackground }]}>
          {phase}
        </Text>
      )}

      {/* Stop Breathing Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={stopBreathing}
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          labelStyle={{ color: theme.colors.onError }}
        >
          Stop Exercise
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  holdCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    position: 'absolute',
    opacity: 0,
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: '#6cace4',
    position: 'absolute',
  },
  phaseText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  introText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
  },
  button: {
    width: '80%',
    padding: 10,
    marginTop: 20,
  },
});

export default BreathingExercise;
