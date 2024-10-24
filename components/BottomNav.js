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
import moment from 'moment'; 
import auth from '@react-native-firebase/auth'; 

const Tab = createMaterialBottomTabNavigator();

// Define AsyncStorage keys
const ASYNC_STORAGE_KEYS = {
  STREAK: 'streak',
  LAST_LOGGED_DATE: 'lastLoggedDate',
  MOOD_LOG: 'moodLog',
};

// Define a function to generate AsyncStorage keys based on UID
const getAsyncStorageKeys = (uid) => ({
  STREAK: `streak_${uid}`,
  LAST_LOGGED_DATE: `lastLoggedDate_${uid}`,
  MOOD_LOG: `moodLog_${uid}`,
});

export default function BottomNav() {
  const theme = useTheme();
  const navigation = useNavigation();

  // State variables
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(0);
  const [lastLoggedDate, setLastLoggedDate] = useState(null);
  const [loggedToday, setLoggedToday] = useState(false);
  const [moodLevels, setMoodLevels] = useState([]);
  const [problemData, setProblemData] = useState([]);

  // State to store moodLog
  const [moodLog, setMoodLog] = useState([]);

  // Initialize user and data
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        initializeStreak(currentUser.uid);
        loadMoodLog(currentUser.uid);
      } else {
        setUser(null);
        resetData();
      }
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Function to reset data when user logs out
  const resetData = () => {
    setStreak(0);
    setLastLoggedDate(null);
    setLoggedToday(false);
    setMoodLog([]);
  };

  // Function to initialize streak and loggedToday state
  const initializeStreak = async (uid) => {
    try {
      const keys = getAsyncStorageKeys(uid);
      const storedStreak = await AsyncStorage.getItem(keys.STREAK);
      const storedLastLoggedDate = await AsyncStorage.getItem(keys.LAST_LOGGED_DATE);
      
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
            await AsyncStorage.setItem(keys.STREAK, parsedStreak.toString());
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
  const loadMoodLog = async (uid) => {
    try {
      const keys = getAsyncStorageKeys(uid);
      const storedMoodLog = await AsyncStorage.getItem(keys.MOOD_LOG);
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
        if (user) {
          const keys = getAsyncStorageKeys(user.uid);
          await AsyncStorage.setItem(keys.MOOD_LOG, JSON.stringify(moodLog));
        }
      } catch (error) {
        console.error('Failed to save mood log:', error);
      }
    };
    saveMoodLog();
  }, [moodLog, user]);

  // Function to handle mood logging
  const handleMoodLog = async (newMoodEntry) => {
    try {
      if (!user) {
        Alert.alert('Error', 'No user is signed in.');
        return;
      }

      const uid = user.uid;
      const keys = getAsyncStorageKeys(uid);
      const today = moment().format('YYYY-MM-DD');
      
      if (!loggedToday) {
        // If the user hasn't logged today, increment streak
        const updatedStreak = streak + 1;
        setStreak(updatedStreak);
        setLoggedToday(true);
        
        // Persist streak and lastLoggedDate
        await AsyncStorage.setItem(keys.STREAK, updatedStreak.toString());
        await AsyncStorage.setItem(keys.LAST_LOGGED_DATE, today);
      }
      
      // Update moodLog
      setMoodLog((prevMoodLog) => [...prevMoodLog, newMoodEntry]);
      
    } catch (error) {
      console.error('Error handling mood log:', error);
      Alert.alert('Error', 'Failed to log your mood. Please try again.');
    }
  };

  // Function to reset moodLog
  const resetMoodLog = async () => {
    try {
      if (user) {
        const keys = getAsyncStorageKeys(user.uid);
        await AsyncStorage.removeItem(keys.MOOD_LOG);
        setMoodLog([]);
        Alert.alert('Success', 'Mood logs have been reset.');
      }
    } catch (error) {
      console.error('Failed to reset mood logs:', error);
      Alert.alert('Error', 'Failed to reset mood logs.');
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
