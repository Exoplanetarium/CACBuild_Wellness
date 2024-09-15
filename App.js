import React, { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNav from './components/BottomNav';
import AuthScreen from './components/AuthScreen';
import TextBubble from './components/TextBubble';

const Stack = createNativeStackNavigator();

const theme4 = {
  "colors": {
    "primary": "rgb(153, 203, 255)",
    "onPrimary": "rgb(0, 51, 85)",
    "primaryContainer": "rgb(0, 74, 120)",
    "onPrimaryContainer": "rgb(207, 229, 255)",
    "secondary": "rgb(185, 200, 218)",
    "onSecondary": "rgb(36, 50, 64)",
    "secondaryContainer": "rgb(58, 72, 87)",
    "onSecondaryContainer": "rgb(213, 228, 247)",
    "tertiary": "rgb(212, 190, 230)",
    "onTertiary": "rgb(57, 42, 73)",
    "tertiaryContainer": "rgb(80, 64, 96)",
    "onTertiaryContainer": "rgb(240, 219, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(26, 28, 30)",
    "onBackground": "rgb(226, 226, 229)",
    "surface": "rgb(26, 28, 30)",
    "onSurface": "rgb(226, 226, 229)",
    "surfaceVariant": "rgb(66, 71, 78)",
    "onSurfaceVariant": "rgb(194, 199, 207)",
    "outline": "rgb(140, 145, 153)",
    "outlineVariant": "rgb(66, 71, 78)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(226, 226, 229)",
    "inverseOnSurface": "rgb(47, 48, 51)",
    "inversePrimary": "rgb(0, 98, 158)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(32, 37, 41)",
      "level2": "rgb(36, 42, 48)",
      "level3": "rgb(40, 47, 55)",
      "level4": "rgb(41, 49, 57)",
      "level5": "rgb(44, 53, 62)"
    },
    "surfaceDisabled": "rgba(226, 226, 229, 0.12)",
    "onSurfaceDisabled": "rgba(226, 226, 229, 0.38)",
    "backdrop": "rgba(44, 49, 55, 0.4)"
  }
};

export default function App() {

  return (
    <PaperProvider theme={theme4}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={AuthScreen} />
              <Stack.Screen name="Main">
                {(props) => 
                  <BottomNav
                    {...props}
                  />
                }
              </Stack.Screen>
            </Stack.Navigator>           
        </NavigationContainer>
        
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

import firebase from '@react-native-firebase/app';
import SetupHome from './components/SetupHome';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp();
}
