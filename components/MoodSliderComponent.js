import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';

const MoodSliderComponent = ({ onMoodSubmit, onSlidingStart, onSlidingComplete }) => {
  const theme = useTheme();
  const [moods, setMoods] = useState({
    happiness: 0,
    stress: 0,
    anxiety: 0,
    focus: 0,
  });

  const handleSliderChange = (mood, value) => {
    setMoods(prevMoods => ({
      ...prevMoods,
      [mood]: value,
    }));
  };

  const handleSubmit = () => {
    onMoodSubmit(moods);
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.onSecondary }}>
      <View style={styles.gridContainer}>
        {Object.keys(moods).map((mood, index) => (
          <View key={index} style={styles.moodItem}>
            <Text style={[styles.moodLabel, { color: theme.colors.onBackground }]}>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </Text>
            <Text style={[styles.moodValue, { color: theme.colors.onBackground }]}>
              {moods[mood]}
            </Text>
            <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={moods[mood]}
              onValueChange={(value) => handleSliderChange(mood, value)}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.accent}
              thumbTintColor={theme.colors.primary}
              onSlidingStart={onSlidingStart} // Disable scrolling on start
              onSlidingComplete={onSlidingComplete} // Enable scrolling on complete
            />
            </View>

          </View>
        ))}
      </View>
      <Button mode="contained" onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}>
        Submit Mood Levels
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  sliderContainer: {
    width: '100%',
    height: 90, // Increase height to enlarge hitbox area
    justifyContent: 'center', // Center the slider vertically
    paddingHorizontal: 10, // Add horizontal padding for thumb space
  },
  moodItem: {
    width: '45%', // Adjust width to fit two items in a row with some space
    alignItems: 'center',
    marginVertical: 10,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    
  },
  slider: {
    width: '100%',
  },
  moodValue: {
    fontSize: 14,
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default MoodSliderComponent;
