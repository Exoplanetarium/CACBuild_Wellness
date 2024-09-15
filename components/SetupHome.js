import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TurboModuleRegistry } from 'react-native';
import { useTheme } from 'react-native-paper';
import MoodSliderComponent from './MoodSliderComponent';
import ProblemSelection from './ProblemSelection';
import TextBubble from './TextBubble';

const { width } = Dimensions.get('window');

const SetupHome = ({ onMoodSubmit, onProblemSubmit, currentStep }) => {
  const theme = useTheme();


  const handleMoodSubmit = (moodLevels) => {
    onMoodSubmit(moodLevels);
    console.log("at SetupHome moodLevels: ", moodLevels);
  }

  const handleProblemSubmit = (problemData) => {
    onProblemSubmit(problemData);
    console.log("at SetupHome problemData: ", problemData);

  };

  return (
    <View style={styles.chatOverlay}>
      <View style={styles.container}>
        <View style={styles.popup}>
          {currentStep === 0 ? (
            <TextBubble text="Hi. How are you feeling today?">
              <MoodSliderComponent
                onMoodSubmit={handleMoodSubmit}
              />
            </TextBubble>
          ) :
          (
            <TextBubble text="What's been bothering you?">
              <ProblemSelection onProblemSubmit={handleProblemSubmit} />
            </TextBubble>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0000004b",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    position: 'absolute',
    bottom: 100,
    maxHeight: 10000,
  },
  popup: {
    marginVertical: 10,
  },
  messagesContainer: {
    maxHeight: 700,
    width: '100%',
    zIndex: 10,
    marginBottom: -50,
  },
});

export default SetupHome;