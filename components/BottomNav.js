import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Home from './Home';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Buddy from './Buddy';
import StoryTime from './StoryTime';
import MoodTracker from './MoodTracker';
import BreathingExercise from './BreathingExercise';
import moment from 'moment'; // Import moment for date handling

const Tab = createMaterialBottomTabNavigator();

// Define AsyncStorage keys
const ASYNC_STORAGE_KEYS = {
  STREAK: 'streak',
  LAST_LOGGED_DATE: 'lastLoggedDate',
  MOOD_LOG: 'moodLog',
};

export default function BottomNav() {
  const theme = useTheme();
  const navigation = useNavigation();

  // State variables
  const [streak, setStreak] = useState(0);
  const [lastLoggedDate, setLastLoggedDate] = useState(null);
  const [loggedToday, setLoggedToday] = useState(false);
  const [moodLevels, setMoodLevels] = useState([]);
  const [problemData, setProblemData] = useState([]);

  // State to store moodLog
  const [moodLog, setMoodLog] = useState([]);

  // Load moodLog, streak, and lastLoggedDate from AsyncStorage when component mounts
  useEffect(() => {
    initializeStreak();
    loadMoodLog();
  }, []);

  // Function to initialize streak and loggedToday state
  const initializeStreak = async () => {
    try {
      const storedStreak = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.STREAK);
      const storedLastLoggedDate = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LAST_LOGGED_DATE);
      
      let parsedStreak = storedStreak ? parseInt(storedStreak, 10) : 0;
      let parsedLastLoggedDate = storedLastLoggedDate ? storedLastLoggedDate : null;
      
      const today = moment().format('YYYY-MM-DD');
      
      if (parsedLastLoggedDate === today) {
        // User has already logged today
        setLoggedToday(true);
        setStreak(parsedStreak);
      } else {
        // Check if the last logged date was yesterday to continue streak
        if (parsedLastLoggedDate) {
          const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
          if (parsedLastLoggedDate === yesterday) {
            // Streak continues
            setStreak(parsedStreak);
          } else {
            // Streak resets
            parsedStreak = 0;
            setStreak(parsedStreak);
            await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.STREAK, parsedStreak.toString());
          }
        } else {
          // No previous log, streak starts at 0
          setStreak(0);
        }
        setLoggedToday(false);
      }
      
      setLastLoggedDate(parsedLastLoggedDate);
      
    } catch (error) {
      console.error('Error initializing streak:', error);
    }
  };

  // Function to load moodLog from AsyncStorage
  const loadMoodLog = async () => {
    try {
      const storedMoodLog = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.MOOD_LOG);
      if (storedMoodLog) {
        setMoodLog(JSON.parse(storedMoodLog));
      }
    } catch (error) {
      console.error('Failed to load mood log:', error);
    }
  };
  
  // Function to save moodLog to AsyncStorage whenever it changes
  useEffect(() => {
    const saveMoodLog = async () => {
      try {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.MOOD_LOG, JSON.stringify(moodLog));
      } catch (error) {
        console.error('Failed to save mood log:', error);
      }
    };
    saveMoodLog();
  }, [moodLog]);

  // Function to handle mood logging
  const handleMoodLog = async (newMoodEntry) => {
    try {
      const today = moment().format('YYYY-MM-DD');
      
      if (!loggedToday) {
        // If the user hasn't logged today, increment streak
        const updatedStreak = streak + 1;
        setStreak(updatedStreak);
        setLoggedToday(true);
        
        // Persist streak and lastLoggedDate
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.STREAK, updatedStreak.toString());
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.LAST_LOGGED_DATE, today);
      }
      
      // Update moodLog
      setMoodLog((prevMoodLog) => [...prevMoodLog, newMoodEntry]);
      
    } catch (error) {
      console.error('Error handling mood log:', error);
      Alert.alert('Error', 'Failed to log your mood. Please try again.');
    }
  };

  const resetMoodLog = async () => {
    try {
      await AsyncStorage.removeItem('moodLog');
      setMoodLog([]);
      Alert.alert('Mood logs have been reset.');
    } catch (error) {
      console.error('Failed to reset mood logs:', error);
    }
  };

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
            moodLog={moodLog} // Pass moodLog to Hom
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
            moodLog={moodLog}
            resetMoodLog={resetMoodLog}
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
