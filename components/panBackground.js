import { Button, StyleSheet, Text, View, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function PanBackground() {

    const mousePosition = useSharedValue({ horizontal: 0, vertical: 0 });
    const mousePositionLastOffset = useSharedValue({ horizontal: 0, vertical: 0 });
  
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            mousePosition.value = {
                horizontal: mousePositionLastOffset.value.horizontal + e.translationX,
                vertical: mousePositionLastOffset.value.vertical + e.translationY,
            }
        })
        .onEnd(() => {
            mousePositionLastOffset.value = {
                horizontal: mousePosition.value.horizontal,
                vertical: mousePosition.value.vertical,
            }
        });
  
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: mousePosition.value.horizontal}, { translateY: mousePosition.value.vertical }],
    }));
    
    return (
        <GestureHandlerRootView  style={styles.container}>
            <GestureDetector gesture={panGesture}> 
                <Animated.View style={[styles.background, animatedStyle]}>
                    <Image source={require('../assets/background.png')} resizeMode='repeat' />
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
});