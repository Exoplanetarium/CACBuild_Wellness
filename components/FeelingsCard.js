import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const FeelingsCard = ({ onButtonPress }) => {
  const translateY = useSharedValue(50);
  const hoverAnim = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 1000 });

    hoverAnim.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1000 }),
        withTiming(3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [translateY, hoverAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hoverAnim.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.question}>How are you feeling right now?</Text>
        <View style={styles.buttonsContainer}>
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={{ backgroundColor: '#f68b51', ...styles.button }}
              onPress={() => onButtonPress('theme1')}>
              <Text style={styles.buttonText}>Great</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={{ backgroundColor: '#c1c11c', ...styles.button }}
              onPress={() => onButtonPress('theme2')}>
              <Text style={styles.buttonText}>Good</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={{ backgroundColor: '#349d80', ...styles.button }}
              onPress={() => onButtonPress('theme3')}>
              <Text style={styles.buttonText}>Okay</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={{ backgroundColor: '#344C64', ...styles.button }}
              onPress={() => onButtonPress('theme4')}>
              <Text style={styles.buttonText}>Bad</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d7eaff',
  },
  card: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default FeelingsCard;
