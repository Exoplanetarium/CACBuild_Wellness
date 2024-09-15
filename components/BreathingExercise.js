import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme, Button } from 'react-native-paper';

const BreathingExercise = ({ moodLevels, problemData }) => {
  const theme = useTheme();
  const [phase, setPhase] = useState(''); // 'Inhale', 'Hold', 'Exhale'
  const [isBreathing, setIsBreathing] = useState(false);
  const [exerciseType, setExerciseType] = useState('Calming'); // Default exercise
  const [showExercise, setShowExercise] = useState(false); // Control to show exercise or intro
  const [exerciseColors, setExerciseColors] = useState(['#6CA0DC', '#98C1D9']); // State to store colors

  const scale = useSharedValue(1);
  const holdOpacity = useSharedValue(0); // Controls the opacity of the hold circle
  const holdScale = useSharedValue(1); // Controls the scale of the hold circle

  // Adjust these times based on the exercise type
  const animationDurations = {
    Calming: { inhale: 4000, exhale: 4000, hold: 4000},
    Energizing: { inhale: 3000, exhale: 3000, hold: 1500},
    Balanced: { inhale: 3500, exhale: 3500, hold: 2000},
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

  // Use runOnJS to set colors in worklet
  const updateColors = () => {
    runOnJS(setExerciseColors)(getExerciseColors());
  };

  // Animation styles using the updated exerciseColors
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: exerciseColors[0], // Safely use the updated colors here
    };
  });

  const holdAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: holdScale.value }],
      opacity: holdOpacity.value,
      backgroundColor: exerciseColors[1], // Safely use the updated colors here
    };
  });

  const startBreathingCycle = () => {
    if (!isBreathing) return;

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

  // Trigger breathing cycle in useEffect when `isBreathing` changes
  useEffect(() => {
    if (isBreathing) {
      startBreathingCycle();
    }
  }, [isBreathing]);

  const startBreathing = () => {
    setIsBreathing(true);
    setShowExercise(true); // Show the breathing exercise
  };


  const stopBreathing = () => {
    setIsBreathing(false);
    setPhase('');
    scale.value = 1;
    holdOpacity.value = 0;
    holdScale.value = 1;
    setShowExercise(false); // Stop and go back to the initial screen
  };

  // Conditionally render based on `showExercise`
  if (!showExercise) {
    return (
      <View style={{...styles.container, backgroundColor: theme.colors.background}}>
        <Text style={[styles.introText, { color: theme.colors.onBackground }]}>
          {exerciseType === 'Calming'
            ? 'You seem stressed, how about a calming breathing exercise?'
            : exerciseType === 'Energizing'
            ? 'Feeling low on energy? Try an energizing breathing exercise!'
            : 'How about a balanced breathing exercise to stabilize your mood?'}
        </Text>
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
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Animated.View style={[styles.circle, animatedStyle]}>
        <Animated.View style={[styles.holdCircle, holdAnimatedStyle]} />
        <Text style={[styles.phaseText, { color: theme.colors.onPrimary }]}>
          {phase}
        </Text>
      </Animated.View>
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
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#6cace4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  holdCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#6cace4',
    position: 'absolute',
    opacity: 0,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  exerciseTypeText: {
    marginTop: 20,
    fontSize: 18,
  },
  introText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
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
