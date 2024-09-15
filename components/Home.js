import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DailyAffirmation from './DailyAffirmation';
import ActivityStreak from './ActivityStreak';
import MoodTracker from './MoodTracker';
import BreathingExercise from './BreathingExercise';
import StoryTime from './StoryTime';
import Buddy from './Buddy';
import SetupHome from './SetupHome';
import LoadingCircle from './LoadingCircle';

const { width } = Dimensions.get('window');
const size = 100;
const colors2 = ['#4D96FF', '#8338EC', '#FF006E'];

// Example mood log data for testing the chart
const exampleMoodLog = [
  { mood: "Pretty Good", moodValue: 50, notes: 'Feeling pretty good today', date: '01/01' },
  { mood: "Down", moodValue: -30, notes: 'A bit down, stressful day', date: '01/02' },
  { mood: "Neutral", moodValue: 0, notes: 'Neutral, just another day', date: '01/03' },
  { mood: "Hopeless", moodValue: -70, notes: 'Very bad day, feeling hopeless', date: '01/04' },
  { mood: "Amazing", moodValue: 90, notes: 'Amazing day, everything went well', date: '01/05' },
  { mood: "Okay", moodValue: 20, notes: 'Feeling okay, but not great', date: '01/06' },
  { mood: "Annoyed", moodValue: -10, notes: 'A bit annoyed, but nothing major', date: '01/07' },
];

const rows = 15; // Number of rows in the loading animation grid
const columns = 4; // Number of columns in the loading animation grid

// Colors for the loading squares based on their corresponding features
const colors = [
  ['#486be8', '#56f7f2'], // Buddy
  ['#FF5F6D', '#FFC371'], // Inspirational Stories
  ['#eb6d9f', '#467ae1'], // Mood Tracker
  ['#00C9FF', '#92FE9D'], // Meditation
  ['#ffcf5e', '#ed5103'], // Calming Music
];

const Home = ({ streak, loggedToday, setMoodLevels, moodLevels, setProblemData, problemData }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [moodLog, setMoodLog] = useState(exampleMoodLog); // Mood log data for testing
  const [dynamicWidget, setDynamicWidget] = useState(null); // Current dynamic widget to display
  const [loading, setLoading] = useState(false); // Loading state for the animation
  const [currentStep, setCurrentStep] = useState(0); // Current step in the setup process

  useEffect(() => {
    console.log("Mood Levels: ", moodLevels);
    console.log("Problem Data: ", problemData);
    console.log("Streak: ", streak);
    console.log("Logged Today: ", loggedToday);
  }, [moodLevels, problemData, streak, loggedToday]);

  // Function to handle completion of the setup
  const handleSetupComplete = (moodLevels) => {
    setMoodLevels(moodLevels);
    setCurrentStep(1);
    console.log("at Home moodLevels: ", moodLevels);
  };

  // Function to handle problem submission
  // Function to handle completion of problem selection
  const handleProblemSubmit = (problemData) => {
    setProblemData(problemData);
    console.log("Problem Data: ", problemData);

    // Start the loading process and trigger the animation
    setLoading(true);

    // Simulate a delay for the loading process (like fetching personalized content)
    setTimeout(() => {
      setLoading(false); // Set loading to false after animation completes
    }, 3000); // Example delay of 3 seconds
    setCurrentStep(3);
  };

  // Create shared values for each column's position and gradient animation
  const positions = Array(columns).fill(null).map((_, index) => useSharedValue(index % 2 === 0 ? -100 : 100)); // Initial positions
  const gradientPositions = Array(columns * rows).fill(null).map(() => useSharedValue(-1)); // For each square's gradient

  const [selectedSquares, setSelectedSquares] = useState(Array(columns).fill(null)); // Track which squares are selected

  useEffect(() => {
    if (loading) {
      // Initial instant "animation" to move squares up by two squares' height
      positions.forEach((position, index) => {
        position.value = withTiming(position.value + (index % 2 === 0 ? -100 : 100), {
          duration: 0, // Instant move
        });
      });

      // Start the main animation for each column
      positions.forEach((position, index) => {
        const direction = index % 2 === 0 ? 1 : -1; // Alternating directions
        position.value = withRepeat(
          withTiming(direction * 10, {
            duration: 2000,
          }),
          -1,
          true
        );
      });

      // Start the gradient animation for each square
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

      // Simulate loading before displaying the feature colors
      setTimeout(() => {
        selectRandomSquares();
        setTimeout(() => {
          setLoading(false);
        }, 2000); // Display the feature colors for 2 seconds
      }, 3000); // Duration of loading animation before displaying the feature colors
    }
  }, [loading]);

  // Function to generate a random integer within a specified range
  const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  // Function to select random squares for the gradient animation
  const selectRandomSquares = () => {
    const selected = positions.map(() => Math.floor(getRandomInt(4, 8) / 10 * rows));
    setSelectedSquares(selected);
  };

  // Define animated styles for each column based on their position
  const animatedStyles = positions.map((position) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateY: position.value }],
      };
    })
  );

  // Define animated styles for the gradient animation in each square
  const gradientStyles = gradientPositions.map((gradientPosition) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: gradientPosition.value * width * 0.4 }], // Adjusting the transform to simulate diagonal movement
      };
    })
  );


  // Function to render the loading animation grid
  const renderLoadingSquares = () => {
    return (
      <View style={{...styles.container, backgroundColor: theme.colors.onSecondary}}>
        <View style={styles.animationHeader}>
          <Text style={[styles.heading, { color: theme.colors.primary }]}>
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
      </View>
    );
  };

  useEffect(() => {
    loadMoodLog();
    determineDynamicWidget();
  }, [loggedToday, moodLevels, problemData]);

  // Function to load mood log from AsyncStorage
  const loadMoodLog = async () => {
    try {
      const storedMoodLog = await AsyncStorage.getItem('moodLog');
      if (storedMoodLog) {
        setMoodLog(JSON.parse(storedMoodLog));
      }
    } catch (error) {
      console.error('Failed to load mood log:', error);
    }
  };

  // Function to determine which dynamic widget to display based on current state
  // Function to determine which dynamic widget to display based on current state
  const determineDynamicWidget = () => {
    if (!loggedToday) {
      setDynamicWidget({
        component: MoodTracker,
        text: "You haven't logged your mood today. How are you feeling?",
        colors: ['#eb6d9f', '#467ae1'],
      });
    } else if (Array.isArray(moodLevels) && moodLevels.length > 0 && moodLevels.some(level => level < 30)) {
      setDynamicWidget({
        component: Buddy,
        text: "You seem stressed. Try chatting with Buddy.",
        colors: ['#486be8', '#56f7f2'],
      });
    } else if (problemData.details && problemData.category) {
      setDynamicWidget({
        component: StoryTime,
        text: "Feeling down? An inspirational story might help.",
        colors: ['#FF5F6D', '#FFC371'],
      });
    } else {
      setDynamicWidget({
        component: BreathingExercise,
        text: "Need to relax? Try a breathing exercise.",
        colors: ['#00C9FF', '#92FE9D'],
      });
    }
  };


  // Function to handle pressing on the dynamic widget
  const handleWidgetPress = () => {
    if (dynamicWidget) {
      // Map the component to a route name
      let routeName = '';
  
      switch (dynamicWidget.component) {
        case MoodTracker:
          routeName = 'Mood Tracker';
          break;
        case Buddy:
          routeName = 'Buddy';
          break;
        case BreathingExercise:
          routeName = 'Breathing';
          break;
        case StoryTime:
          routeName = 'Stories';
          break;
        default:
          routeName = ''; // Default route or handle error
      }
  
      if (routeName) {
        navigation.navigate(routeName); // Navigate to the determined route
      }
    }
  };

  // Function to compile mood data for chart rendering
  const compileMoodData = () => {
    const moodData = {};
  
    moodLog.forEach((log) => {
      let moodValue = Number(log.moodValue); // Use moodValue instead of mood
  
      if (isNaN(moodValue)) {
        console.warn(`Invalid mood value: ${log.moodValue}`);
        return;
      }
  
      if (!moodData[log.date]) {
        moodData[log.date] = [];
      }
      moodData[log.date].push(moodValue);
    });
  
    return Object.keys(moodData).map((date) => {
      const moods = moodData[date];
      const averageMood = moods.reduce((sum, value) => sum + value, 0) / moods.length;
      const color = getMoodColor(averageMood);
      return { date, averageMood, color };
    });
  };

  // Function to get color based on average mood value
  const getMoodColor = (averageMood) => {
    if (averageMood <= -66) return '#0000ff';  // Blue for extremely negative
    if (averageMood <= -33) return '#8080ff';  // Light Blue for moderately negative
    if (averageMood < 0) return '#ffa500';     // Orange for slightly negative
    if (averageMood === 0) return '#808080';   // Gray for neutral
    if (averageMood <= 33) return '#90ee90';   // Light Green for slightly positive
    if (averageMood <= 66) return '#32cd32';   // Green for moderately positive
    return '#00ff00';                          // Bright Green for extremely positive
  };

  // Function to filter dates for chart labels
  const getFilteredDates = () => {
    const totalEntries = moodLog.length;
    const maxLabels = 6;

    if (totalEntries <= maxLabels) {
      return compileMoodData().map(log => log.date);
    }

    const step = Math.ceil(totalEntries / maxLabels);
    return compileMoodData().filter((_, index) => index % step === 0).map(log => log.date);
  };

  // Conditional rendering: If loading is true, show loading animation
  if (loading) {
    return (
      <LoadingCircle />
    ); // Show loading squares animation
  }

  // Adjusted rendering condition: If you're in setup step (i.e., `currentStep === 0`), show `SetupHome`.
  if (currentStep < 2 && loading === false && problemData) {
    
    return (
      <View style={{...styles.container, backgroundColor: theme.colors.onSecondary}}>
        <SetupHome 
          onMoodSubmit={handleSetupComplete} 
          onProblemSubmit={handleProblemSubmit} 
          currentStep={currentStep} 
        />
    </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
    <ScrollView>
      <Text style={[styles.heading, { color: theme.colors.primary }]}>Your Home</Text>
      <Card style={styles.card}>
        <Card.Content>
          <DailyAffirmation />
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <ActivityStreak streak={streak} loggedToday={loggedToday} />
        </Card.Content>
      </Card>

      {/* Dynamic Widget */}
      {dynamicWidget && (
        <TouchableOpacity onPress={handleWidgetPress}>
          <LinearGradient colors={dynamicWidget.colors} style={styles.cardGradient}>
            <Text style={[styles.widgetText, { color: theme.colors.onPrimary }]}>
              {dynamicWidget.text}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Mood Tracker Widget */}
      <Card style={styles.card}>
        <Card.Content>
          {moodLog.length > 0 ? (
            <View >
              <View style={{overflow: 'hidden', borderRadius: 8}}>
              <LineChart
                data={{
                  labels: getFilteredDates(),
                  datasets: [{
                    data: compileMoodData().map((log) => log.averageMood),
                    color: (opacity = 1, index) => compileMoodData()[index]?.color || theme.colors.primary,
                  }],
                }}
                width={width - 32}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.background,
                  backgroundGradientFrom: theme.colors.background,
                  backgroundGradientTo: theme.colors.background,
                  decimalPlaces: 0,
                  color: (opacity = 1) => theme.colors.primary,
                  labelColor: (opacity = 1) => theme.colors.onBackground,
                }}
                style={styles.chart}
              />
              </View>
              <Text style={[styles.chartHint, { color: theme.colors.primary }]}>Mood Tracker</Text>
            </View>
          ) : (
            <Text style={[styles.noDataText, { color: theme.colors.onBackground }]}>No mood logs available.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Additional widgets */}
      <Card style={styles.card}>
        <Card.Content>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Circle cx="50" cy="35" r="12" fill={colors2[0]} opacity={1} />
            <Path d="M30 67 C35 45, 65 45, 70 67 Z" fill={colors2[0]} opacity={1} />
          </Svg>
        </Card.Content>
      </Card>
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    minHeight: '100%',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 48,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
  },
  chartHint: {
    marginTop: 10,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  widgetText: {
    fontSize: 18,
    textAlign: 'center',
    padding: 16,
    fontWeight: 'bold',
  },
  cardGradient: {
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    justifyContent: 'center',
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
});

export default Home;
