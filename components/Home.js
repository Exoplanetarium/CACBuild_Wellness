import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import Buddy from './Buddy';
import StoryTime from './StoryTime';
import MusicGenerator from '../backend/Generation';
import ProblemSelection from './ProblemSelection';
import SetupHome from './SetupHome';
import MoodTracker from './MoodTracker';

const { width } = Dimensions.get('window');

const Home = () => {
  const theme = useTheme();
  const [setupComplete, setSetupComplete] = useState(false);
  const [moodLevels, setMoodLevels] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [problemData, setProblemData] = useState(null);
  const buddyRef = useRef(null); // Reference to the Buddy component
  const animationValue = useSharedValue(0);
  const selectedButtonIndex = useSharedValue(-1);

  const handleSetupComplete = (moodLevels) => {
    setMoodLevels(moodLevels);
    setSetupComplete(true);
  };

  const handleButtonPress = (feature) => {
    setActiveFeature(feature);
    if (feature === 'buddy' && buddyRef.current) {
      buddyRef.current.showComponent(); // Call showComponent in Buddy
    }
  };

  const handleProblemSubmit = (data) => {
    setProblemData(data);
    setActiveFeature('storytime'); // Move to the StoryTime component after problem selection
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'buddy':
        return <Buddy ref={buddyRef} moodLevels={moodLevels} />;
      case 'stories':
        return <ProblemSelection onSubmit={handleProblemSubmit} />; // Show ProblemSelection first
      case 'storytime':
        return <StoryTime problemData={problemData} moodLevels={moodLevels} />; // Then show StoryTime
      case 'moodtracker':
        return <MoodTracker />;
      case 'music':
        return <MusicGenerator moodLevels={moodLevels} />;
      default:
        return null;
    }
  };

  const renderButton = (feature, colors, label) => (
    <TouchableOpacity onPress={() => handleButtonPress(feature)} style={styles.gridItemWrapper}>
      <LinearGradient colors={colors} style={styles.gridItem}>
        <Text style={[styles.buttonText]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.onSecondary }]}>
      {setupComplete ? (
        <>
          {activeFeature ? (
            <View style={styles.featureContainer}>
              {renderActiveFeature()}
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <Text style={[styles.greeting, { color: theme.colors.primary }]}>
                Welcome to Your Personalized Home!
              </Text>

              <View style={styles.gridContainer}>
                {renderButton('buddy', ['#4c7f9f', '#3e3b98'], 'Chat with Buddy')}
                {renderButton('stories', ['#ffc15e', '#ed7003'], 'Inspirational Stories')}
                {renderButton('moodtracker', ['#c681d4', '#1356b4'], 'Mood Tracker')}
                {renderButton('meditation', ['#00C9FF', '#92FE9D'], 'Meditation')}
                {renderButton('music', ['#FF5F6D', '#FFC371'], 'Calming Music')}
              </View>
            </View>
          )}
        </>
      ) : (
        <SetupHome onComplete={handleSetupComplete} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default Home;
