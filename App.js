import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';
import BottomNav from './components/BottomNav';
import InitialScreen from './components/InitialScreen'; // Import the InitialScreen component
import PanBackground from './components/PanBackground'; // Import the PanBackground component if needed

const Stack = createNativeStackNavigator();

const theme4 = {
  "colors": {
    "primary": "rgb(113, 210, 255)",
    "onPrimary": "rgb(0, 53, 71)",
    "primaryContainer": "rgb(0, 77, 102)",
    "onPrimaryContainer": "rgb(192, 232, 255)",
    "secondary": "rgb(181, 202, 214)",
    "onSecondary": "rgb(31, 51, 61)",
    "secondaryContainer": "rgb(54, 73, 84)",
    "onSecondaryContainer": "rgb(208, 230, 243)",
    "tertiary": "rgb(200, 194, 234)",
    "onTertiary": "rgb(48, 44, 76)",
    "tertiaryContainer": "rgb(71, 67, 100)",
    "onTertiaryContainer": "rgb(228, 223, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(25, 28, 30)",
    "onBackground": "rgb(225, 226, 229)",
    "surface": "rgb(25, 28, 30)",
    "onSurface": "rgb(225, 226, 229)",
    "surfaceVariant": "rgb(64, 72, 76)",
    "onSurfaceVariant": "rgb(192, 199, 205)",
    "outline": "rgb(138, 146, 151)",
    "outlineVariant": "rgb(64, 72, 76)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(225, 226, 229)",
    "inverseOnSurface": "rgb(46, 49, 51)",
    "inversePrimary": "rgb(0, 102, 134)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(29, 37, 41)",
      "level2": "rgb(32, 43, 48)",
      "level3": "rgb(35, 48, 55)",
      "level4": "rgb(36, 50, 57)",
      "level5": "rgb(37, 54, 62)"
    },
    "surfaceDisabled": "rgba(225, 226, 229, 0.12)",
    "onSurfaceDisabled": "rgba(225, 226, 229, 0.38)",
    "backdrop": "rgba(42, 49, 54, 0.4)"
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
  const [currentTheme, setCurrentTheme] = useState(theme1);

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

