import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import PanBackground from './PanBackground'
import SettingsTab from './SettingsTab';
import MusicTab from './MusicTab';
import TestPlayer from './TestPlayer';
import { useTheme } from 'react-native-paper';

const Tab = createMaterialBottomTabNavigator();

export default function BottomNav() {

  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.primary}
      barStyle={{ backgroundColor: theme.colors.primaryContainer }}
      activeIndicatorStyle={{ backgroundColor: theme.colors.secondary }}
    >
      <Tab.Screen name="Home" component={PanBackground} />
      <Tab.Screen name="Music" component={MusicTab} />
      <Tab.Screen name="Settings" component={SettingsTab} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131122',
    width: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});