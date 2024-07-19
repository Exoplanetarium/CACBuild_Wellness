import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import PopUpFeelings from './PopUpFeelings';
import { useTheme } from 'react-native-paper';

export default function PanBackground() {
    const theme = useTheme();
    
    return (
        <>
            <View style={{backgroundColor: theme.colors.onSecondary,...styles.container}}>
                <Text>Hello</Text>
            </View>
            <PopUpFeelings />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        width: '100%',
        height: '100%',
    },
});