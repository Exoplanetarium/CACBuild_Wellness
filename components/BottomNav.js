import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Home from './Home';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Buddy from './Buddy';
import StoryTime from './StoryTime';
import MoodTracker from './MoodTracker';
import BreathingExercise from './BreathingExercise';

const Tab = createMaterialBottomTabNavigator();

export default function BottomNav() {
  const theme = useTheme();
  const navigation = useNavigation();
  // Refs to persist values across re-renders
  const streakRef = useRef(0);
  const loggedTodayRef = useRef(false);

  // States to trigger re-renders and update the UI
  const [streak, setStreak] = useState(streakRef.current);
  const [loggedToday, setLoggedToday] = useState(loggedTodayRef.current);
  const [moodLevels, setMoodLevels] = useState([]);
  const [problemData, setProblemData] = useState([]);

  // Function to log the mood and update streak
  const handleMoodLog = () => {
    loggedTodayRef.current = true;
    setLoggedToday(loggedTodayRef.current); // Update state for UI re-render
    streakRef.current += 1;
    setStreak(streakRef.current); // Update state for UI re-render
  };

  // Function to reset the loggedToday state at midnight
  const resetLoggedToday = () => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
      loggedTodayRef.current = false;
      setLoggedToday(loggedTodayRef.current); // Reset state for next day
      resetLoggedToday(); // Set the timeout again for the next day
    }, timeUntilMidnight);
  };

  // Initialize the resetLoggedToday function on component mount
  useEffect(() => {
    resetLoggedToday();
    setStreak(streakRef.current); 
    setLoggedToday(loggedTodayRef.current);
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.primary}
      barStyle={{ backgroundColor: theme.colors.primaryContainer }}
      activeIndicatorStyle={{ backgroundColor: theme.colors.primary }}
    >
      <Tab.Screen 
        name="Home"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons
              name={'person'}
              size={24}
              color={focused ? theme.colors.primaryContainer : theme.colors.primary} // Adjust color based on focus
            />,
        }}
      >
        {(props) => (
          <Home 
            {...props} 
            streak={streak}
            loggedToday={loggedToday}
            setMoodLevels={setMoodLevels}
            moodLevels={moodLevels}
            setProblemData={setProblemData}
            problemData={problemData}
          />
        )}
      </Tab.Screen> 
      <Tab.Screen
        name='Mood Tracker'
        options={{
          tabBarLabel: 'Track',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons
              name={'calendar'}
              size={24}
              color={focused ? theme.colors.primaryContainer : theme.colors.primary} // Adjust color based on focus
            />,
        }}
      >
        {(props) => (
          <MoodTracker
            {...props}
            streak={streak}
            loggedToday={loggedToday}
            onMoodLogged={handleMoodLog}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name='Buddy'
        options={{
          tabBarLabel: 'Buddy',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons
              name={'chatbox-ellipses'}
              size={24}
              color={focused ? theme.colors.primaryContainer : theme.colors.primary} // Adjust color based on focus
            />,
        }}
      >
        {(props) => (
          <Buddy
            {...props}
            moodLevels={moodLevels}
            problemData={problemData}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name='Breathing'
        options={{
          tabBarLabel: 'Breathing',
          tabBarIcon: ({ color, focused }) =>
            <FontAwesome6Icon
              name={'wind'}
              size={24}
              color={focused ? theme.colors.primaryContainer : theme.colors.primary} // Adjust color based on focus
            />,
        }}
      >
        {(props) => (
          <BreathingExercise
            {...props}
            moodLevels={moodLevels}
            problemData={problemData}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name='Stories'
        options={{
          tabBarLabel: 'Stories',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons
              name={'book'}
              size={24}
              color={focused ? theme.colors.primaryContainer : theme.colors.primary} // Adjust color based on focus
            />,
        }}
      >
        {(props) => (
          <StoryTime
            {...props}
            moodLevels={moodLevels}
            problemData={problemData}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
