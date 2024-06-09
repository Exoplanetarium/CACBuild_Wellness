import { Button, StyleSheet, Text, View, Image } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import PanBackground from './PanBackground'
import SettingsTab from './SettingsTab';
import MusicTab from './MusicTab';

const Tab = createMaterialBottomTabNavigator();

export default function BottomNav() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: '#694fad', width: '100%' }}
      
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