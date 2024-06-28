import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FeelingsCard from './FeelingsCard';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

const InitialScreen = ({ navigation, changeTheme }) => {
  const [showCard, setShowCard] = useState(true);
  const opacity = useSharedValue(1);

  const handleButtonPress = (theme) => {
    console.log(`Button pressed, changing to theme: ${theme}`);
    changeTheme(theme);
    opacity.value = withTiming(0, { duration: 1000 }, (finished) => {
      if (finished) {
        runOnJS(setShowCard)(false);
        runOnJS(navigation.replace)('Main');
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {showCard && (
        <Animated.View style={[styles.cardContainer, animatedStyle]}>
          <FeelingsCard onButtonPress={handleButtonPress} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d7eaff',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InitialScreen;
