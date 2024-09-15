import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Buddy from './Buddy';
import StoryTime from './StoryTime';
import MusicGenerator from '../backend/Generation';
import MusicTab from './MusicTab';
import SetupHome from './SetupHome';
import MoodTracker from './MoodTracker';
import BreathingExercise from './BreathingExercise';

const { width, height } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const rows = 15;
const columns = 4;
const colors = [
  ['#486be8', '#56f7f2'], // Buddy
  ['#FF5F6D', '#FFC371'], // Inspirational Stories
  ['#eb6d9f', '#467ae1'], // Mood Tracker
  ['#00C9FF', '#92FE9D'], // Meditation
  ['#ffcf5e', '#ed5103'], // Calming Music
];

const Dashboard = ({ moodLevels, setMoodLevels, problemData, setProblemData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // Start with false
  const theme = useTheme();

  const handleSetupComplete = (moodLevels) => {
    setMoodLevels(moodLevels);
    setCurrentStep(1);
  };

  const handleProblemSubmit = (problemData) => {
    setProblemData(problemData);
    setLoading(true);
  };

  const positions = Array(columns).fill(null).map(() => useSharedValue(0));
  const gradientPositions = Array(columns * rows).fill(null).map(() => useSharedValue(-1)); // For each square
  const [selectedSquares, setSelectedSquares] = useState(Array(columns).fill(null));

  useEffect(() => {
    if (loading) {
      positions.forEach((position, index) => {
        const direction = (index % 2 === 0) ? 1 : -1; // Up for odd columns, down for even
        position.value = withRepeat(
          withTiming(direction * 125, {
            duration: 2000,
          }),
          -1,
          true
        );
      });

      gradientPositions.forEach((gradientPosition) => {
        gradientPosition.value = withRepeat(
          withTiming(2, {
            duration: 1000,
            easing: Easing.linear,
          }),
          -1,
          true
        );
      });

      setTimeout(() => {
        selectRandomSquares();
        setTimeout(() => {
          setLoading(false);
        }, 2000); // Display the feature colors for 2 seconds
      }, 3000); // Duration of loading animation before displaying the feature colors
    }
  }, [loading]);

  const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  const selectRandomSquares = () => {
    const selected = positions.map(() => Math.floor(getRandomInt(4, 9)/10 * rows));
    setSelectedSquares(selected);
  };

  const animatedStyles = positions.map((position) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateY: position.value }],
      };
    })
  );

  const gradientStyles = gradientPositions.map((gradientPosition) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: gradientPosition.value * width * 0.4 }], // Adjusting the transform to simulate diagonal movement
      };
    })
  );

  const renderLoadingSquares = () => {
    return (
      <>
      <View style={styles.animationHeader}>
        <Text style={[styles.greeting, { color: theme.colors.primary, }]}>
          Personalizing 
          Your Experience...
        </Text>
      </View>
      <View style={styles.gridContainer}>
        {Array(columns).fill(null).map((_, colIndex) => (
          <View key={colIndex} style={styles.column}>
            {Array(rows).fill(null).map((_, rowIndex) => (
              <Animated.View key={rowIndex} style={[styles.square, animatedStyles[colIndex]]}>
                <View style={styles.squareContainer}>
                  {selectedSquares[colIndex] === rowIndex ? (
                    <LinearGradient
                      colors={colors[colIndex]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientBackground}
                    />
                  ) : (
                    <>
                      <LinearGradient
                        colors={['rgb(72, 85, 100)', 'rgb(36, 50, 64)', 'rgb(15, 25, 40)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBackground}
                      />
                      <Animated.View style={[styles.gradientShine, gradientStyles[colIndex * rows + rowIndex]]} />
                    </>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>
        ))}
      </View>
      </>
    );
  };

  const renderButton = (feature, colors, label, screen) => (
    <TouchableOpacity onPress={() => navigation.navigate(screen, { moodLevels, problemData })} style={styles.gridItemWrapper}>
      <LinearGradient colors={colors} style={styles.gridItem}>
        <Text style={[styles.buttonText]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const HomeScreen = ({ navigation }) => {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.onSecondary }]}>
        {(moodLevels && problemData && !loading) ? (
          <View style={styles.contentContainer}>
            <Text style={[styles.greeting, { color: theme.colors.primary }]}>
              Your Dashboard
            </Text>
            <View style={styles.gridContainer}>
              {renderButton('buddy', ['#486be8', '#56f7f2'], 'Chat with Buddy', 'Buddy')}
              {renderButton('stories', ['#FF5F6D', '#FFC371'], 'Inspirational Stories', 'StoryTime')}
              {renderButton('moodtracker', ['#eb6d9f', '#467ae1'], 'Mood Tracker', 'MoodTracker')}
              {renderButton('meditation', ['#00C9FF', '#92FE9D'], 'Meditation', 'Meditation')}
              {/* {renderButton('music', ['#ffcf5e', '#ed5103'], 'Calming Music', 'MusicGenerator')} */}
            </View>
          </View>
        ) : (loading) ? (
          renderLoadingSquares()
        ) : (
          <SetupHome onMoodSubmit={handleSetupComplete} onProblemSubmit={handleProblemSubmit} currentStep={currentStep}/>
        )}
      </View>
    );
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Buddy" component={Buddy} />
      <Stack.Screen name="StoryTime" component={StoryTime} />
      <Stack.Screen name="MoodTracker" component={MoodTracker} />
      <Stack.Screen name="MusicGenerator" component={MusicTab} />
      <Stack.Screen name="Meditation" component={BreathingExercise} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  square: {
    width: 50,
    height: 50,
    marginVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#2c2c46',
  },
  gridItemWrapper: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 48,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  squareContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientShine: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  animationHeader: {
    position: 'absolute',
    top: 20, // Adjust this value to move the header up or down as needed
    left: 0,
    right: 0,
    alignItems: 'center', // Centers the content horizontally
    zIndex: 10000,
  }
});

export default Dashboard;