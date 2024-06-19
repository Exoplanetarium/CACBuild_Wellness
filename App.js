import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNav from './components/BottomNav';
import InitialScreen from './components/InitialScreen'; // Import the InitialScreen component
import PanBackground from './components/PanBackground'; // Import the PanBackground component if needed

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <PaperProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Initial" component={InitialScreen} />
            <Stack.Screen name="Main" component={BottomNav} />
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

