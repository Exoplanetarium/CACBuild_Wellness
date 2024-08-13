import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { Button, useTheme, TextInput, Divider } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const MoodTracker = () => {
  const theme = useTheme();
  const [mood, setMood] = useState('');
  const [moodLog, setMoodLog] = useState([]);
  const [notes, setNotes] = useState('');
  const [logDate, setLogDate] = useState('');

  useEffect(() => {
    loadMoodLog();
  }, []);

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

  const saveMoodLog = async (newLog) => {
    try {
      await AsyncStorage.setItem('moodLog', JSON.stringify(newLog));
    } catch (error) {
      console.error('Failed to save mood log:', error);
    }
  };

  const handleMoodSubmit = () => {
    const date = new Date().toLocaleDateString();
    const newLog = { mood, notes, date };
    const updatedMoodLog = [...moodLog, newLog];
    setMoodLog(updatedMoodLog);
    saveMoodLog(updatedMoodLog);
    setMood('');
    setNotes('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.onSecondary }]}>
      <Text style={[styles.heading, { color: theme.colors.primary }]}>Track Your Mood</Text>
      <TextInput
        label="How are you feeling today? (e.g., happy, stressed)"
        value={mood}
        onChangeText={setMood}
        style={[styles.input, { backgroundColor: theme.colors.secondaryContainer }]}
        placeholder="Enter your mood..."
        placeholderTextColor={theme.colors.onSecondaryContainer}
      />
      <TextInput
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={[styles.textArea, { backgroundColor: theme.colors.secondaryContainer }]}
        placeholder="Any details you'd like to add..."
        placeholderTextColor={theme.colors.onSecondaryContainer}
      />
      <Button
        mode="contained"
        onPress={handleMoodSubmit}
        style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
      >
        Submit Mood
      </Button>
      <Divider style={styles.divider} />
      <Text style={[styles.subHeading, { color: theme.colors.primary }]}>Mood History</Text>
      {moodLog.length > 0 ? (
        <LineChart
          data={{
            labels: moodLog.map(log => log.date),
            datasets: [{
              data: moodLog.map((log, index) => index + 1),
            }],
          }}
          width={width - 32}
          height={220}
          yAxisLabel=""
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
      ) : (
        <Text style={[styles.noDataText, { color: theme.colors.onBackground }]}>No mood data available. Start logging your mood today!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  textArea: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 20,
  },
  divider: {
    marginVertical: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default MoodTracker;
