import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { useTheme, Button } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const FeelingsCard = ({ onButtonPress }) => {
  const translateY = useSharedValue(50);
  const hoverAnim = useSharedValue(0);
  const theme = useTheme();

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
      <Animated.View style={[{backgroundColor: theme.colors.onSecondary, ...styles.card}, animatedStyle]}>
        <View style={styles.buttonsContainer}>
          <Animated.View style={buttonAnimatedStyle}>
            <Button
              style={styles.button}
              buttonColor='#f68b51'
              onPress={() => onButtonPress()}
            >
              <Text style={styles.buttonText}>Great</Text>
            </Button>
          </Animated.View>
          <Animated.View style={buttonAnimatedStyle}>
            <Button
              style={styles.button}
              buttonColor='#c1c11c'
              onPress={() => onButtonPress()}
            >
              <Text style={styles.buttonText}>Good</Text>
            </Button>
          </Animated.View>
          <Animated.View style={buttonAnimatedStyle}>
            <Button
              style={styles.button}
              buttonColor='#349d80'
              onPress={() => onButtonPress()}
            >
              <Text style={styles.buttonText}>Okay</Text>
            </Button>
          </Animated.View>
          <Animated.View style={buttonAnimatedStyle}>
            <Button
              style={styles.button}
              buttonColor='#344C64'
              onPress={() => onButtonPress()}>
              <Text style={styles.buttonText}>Bad</Text>
            </Button>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Use absolute positioning
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    transform: [{ translateX: -(width * 0.45) }, { translateY: -50 }], // Adjust based on the card size and desired position
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: 'white'
  }
});

export default FeelingsCard;
