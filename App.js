import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import Animated, { withClamp, withDecay, withSpring, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Background from './components/panBackground'; 

export default function App() {
  const height = useSharedValue(100);
  const width = useSharedValue(100);

  const handleBounce = () => {
    height.value = withSpring(100);
    width.value = withSpring(100);
  };

  return (
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <Background /> 
          <Animated.View style={{ ...styles.box, height, width }} />
          <Button title="Bounce" onPress={handleBounce} />
          <StatusBar style="auto" />
        </NavigationContainer>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131122',
  },
  box: {
    backgroundColor: '#b58df1',
    borderRadius: 20,
    marginVertical: 64,
  },
});

