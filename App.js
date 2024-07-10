import React, { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNav from './components/BottomNav';
import InitialScreen from './components/InitialScreen'; 
import PanBackground from './components/PanBackground';
import AuthScreen from './components/AuthScreen';

const Stack = createNativeStackNavigator();

const theme4 = {
  "colors": {
    "primary": "rgb(160, 202, 255)",
    "onPrimary": "rgb(0, 50, 89)",
    "primaryContainer": "rgb(0, 73, 126)",
    "onPrimaryContainer": "rgb(210, 228, 255)",
    "secondary": "rgb(187, 199, 219)",
    "onSecondary": "rgb(37, 49, 65)",
    "secondaryContainer": "rgb(60, 72, 88)",
    "onSecondaryContainer": "rgb(215, 227, 248)",
    "tertiary": "rgb(215, 190, 228)",
    "onTertiary": "rgb(59, 41, 71)",
    "tertiaryContainer": "rgb(83, 63, 95)",
    "onTertiaryContainer": "rgb(243, 218, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(26, 28, 30)",
    "onBackground": "rgb(226, 226, 230)",
    "surface": "rgb(26, 28, 30)",
    "onSurface": "rgb(226, 226, 230)",
    "surfaceVariant": "rgb(67, 71, 78)",
    "onSurfaceVariant": "rgb(195, 198, 207)",
    "outline": "rgb(141, 145, 153)",
    "outlineVariant": "rgb(67, 71, 78)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(226, 226, 230)",
    "inverseOnSurface": "rgb(47, 48, 51)",
    "inversePrimary": "rgb(9, 97, 164)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(33, 37, 41)",
      "level2": "rgb(37, 42, 48)",
      "level3": "rgb(41, 47, 55)",
      "level4": "rgb(42, 49, 57)",
      "level5": "rgb(45, 52, 62)"
    },
    "surfaceDisabled": "rgba(226, 226, 230, 0.12)",
    "onSurfaceDisabled": "rgba(226, 226, 230, 0.38)",
    "backdrop": "rgba(44, 49, 55, 0.4)"
  }
};

const theme3 = {
  "colors": {
    "primary": "rgb(122, 218, 157)",
    "onPrimary": "rgb(0, 57, 30)",
    "primaryContainer": "rgb(0, 82, 45)",
    "onPrimaryContainer": "rgb(150, 247, 184)",
    "secondary": "rgb(182, 204, 185)",
    "onSecondary": "rgb(33, 53, 39)",
    "secondaryContainer": "rgb(56, 75, 61)",
    "onSecondaryContainer": "rgb(209, 232, 213)",
    "tertiary": "rgb(163, 205, 219)",
    "onTertiary": "rgb(2, 54, 64)",
    "tertiaryContainer": "rgb(33, 76, 87)",
    "onTertiaryContainer": "rgb(190, 234, 247)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(25, 28, 26)",
    "onBackground": "rgb(225, 227, 222)",
    "surface": "rgb(25, 28, 26)",
    "onSurface": "rgb(225, 227, 222)",
    "surfaceVariant": "rgb(65, 73, 66)",
    "onSurfaceVariant": "rgb(192, 201, 192)",
    "outline": "rgb(138, 147, 139)",
    "outlineVariant": "rgb(65, 73, 66)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(225, 227, 222)",
    "inverseOnSurface": "rgb(46, 49, 46)",
    "inversePrimary": "rgb(0, 109, 62)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(30, 38, 33)",
      "level2": "rgb(33, 43, 37)",
      "level3": "rgb(36, 49, 40)",
      "level4": "rgb(37, 51, 42)",
      "level5": "rgb(39, 55, 44)"
    },
    "surfaceDisabled": "rgba(225, 227, 222, 0.12)",
    "onSurfaceDisabled": "rgba(225, 227, 222, 0.38)",
    "backdrop": "rgba(42, 50, 44, 0.4)"
  }
};

const theme2 = {
  "colors": {
    "primary": "rgb(115, 92, 0)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(255, 224, 136)",
    "onPrimaryContainer": "rgb(36, 26, 0)",
    "secondary": "rgb(105, 93, 63)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(241, 225, 187)",
    "onSecondaryContainer": "rgb(34, 27, 4)",
    "tertiary": "rgb(70, 102, 75)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(200, 236, 201)",
    "onTertiaryContainer": "rgb(3, 33, 12)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(30, 27, 22)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(30, 27, 22)",
    "surfaceVariant": "rgb(235, 225, 207)",
    "onSurfaceVariant": "rgb(76, 70, 57)",
    "outline": "rgb(125, 118, 103)",
    "outlineVariant": "rgb(207, 198, 180)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(51, 48, 42)",
    "inverseOnSurface": "rgb(247, 240, 231)",
    "inversePrimary": "rgb(233, 195, 72)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(248, 243, 242)",
      "level2": "rgb(244, 238, 235)",
      "level3": "rgb(240, 234, 227)",
      "level4": "rgb(238, 232, 224)",
      "level5": "rgb(235, 229, 219)"
    },
    "surfaceDisabled": "rgba(30, 27, 22, 0.12)",
    "onSurfaceDisabled": "rgba(30, 27, 22, 0.38)",
    "backdrop": "rgba(53, 48, 36, 0.4)"
  }
};

const theme1 = {
  "colors": {
    "primary": "rgb(163, 62, 0)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(255, 219, 205)",
    "onPrimaryContainer": "rgb(54, 15, 0)",
    "secondary": "rgb(119, 87, 74)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(255, 219, 205)",
    "onSecondaryContainer": "rgb(44, 22, 12)",
    "tertiary": "rgb(103, 95, 48)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(239, 227, 169)",
    "onTertiaryContainer": "rgb(32, 28, 0)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(32, 26, 24)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(32, 26, 24)",
    "surfaceVariant": "rgb(245, 222, 213)",
    "onSurfaceVariant": "rgb(83, 68, 62)",
    "outline": "rgb(133, 115, 108)",
    "outlineVariant": "rgb(216, 194, 186)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(54, 47, 44)",
    "inverseOnSurface": "rgb(251, 238, 234)",
    "inversePrimary": "rgb(255, 181, 150)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(250, 242, 242)",
      "level2": "rgb(248, 236, 235)",
      "level3": "rgb(245, 230, 227)",
      "level4": "rgb(244, 228, 224)",
      "level5": "rgb(242, 225, 219)"
    },
    "surfaceDisabled": "rgba(32, 26, 24, 0.12)",
    "onSurfaceDisabled": "rgba(32, 26, 24, 0.38)",
    "backdrop": "rgba(59, 45, 40, 0.4)"
  }
};



export default function App() {
  const [currentTheme, setCurrentTheme] = useState(theme4);

  const changeTheme = (theme) => {
    console.log(`Changing theme to: ${theme}`);
    switch (theme) {
      case 'theme1':
        setCurrentTheme(theme1);
        break;
      case 'theme2':
        setCurrentTheme(theme2);
        break;
      case 'theme3':
        setCurrentTheme(theme3);
        break;
      case 'theme4':
        setCurrentTheme(theme4);
        break;
      default:
        setCurrentTheme(theme1);
    }
    console.log(`Current theme set to: ${currentTheme.colors.primary}`);
  };

  return (
    <PaperProvider theme={currentTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={AuthScreen} />
              <Stack.Screen name="Initial">
                {props => <InitialScreen {...props} changeTheme={changeTheme} />}
              </Stack.Screen>
              <Stack.Screen name="Main" component={BottomNav} />
            </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

import firebase from '@react-native-firebase/app';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp();
}
