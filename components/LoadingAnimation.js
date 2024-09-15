import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import UserIcon from './UserIcon';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const LoadingAnimation = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate personalization loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000); // Duration matches the color transition cycle

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          style={styles.content}
        >
          <View style={styles.iconContainer}>
            <UserIcon size={120} colors={['#4D96FF', '#8338EC', '#FF006E']} />
          </View>
          <Text style={styles.text}>Personalizing Your Experience...</Text>
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeIn.delay(500).duration(500)}
          style={styles.content}
        >
          <Text style={styles.text}>Personalization Complete!</Text>
          <ActivityIndicator size="large" color="#4D96FF" style={{ marginTop: 20 }} />
        </Animated.View>
      )}
    </View>
  );
};

export default LoadingAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});