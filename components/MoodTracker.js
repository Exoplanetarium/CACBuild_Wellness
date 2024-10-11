import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, useTheme, TextInput, Divider, Card,  } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FullScreenChart from './FullScreenChart';
import BackButton from './BackButton';
import Icon from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const { width, height } = Dimensions.get('window');

// for testing chart
const exampleMoodLog = [
  { mood: "Pretty Good", moodValue: 50, notes: 'Feeling pretty good today', date: '01/01' },
  { mood: "Down", moodValue: -30, notes: 'A bit down, stressful day', date: '01/02' },
  { mood: "Neutral", moodValue: 0, notes: 'Neutral, just another day', date: '01/03' },
  { mood: "Hopeless", moodValue: -70, notes: 'Very bad day, feeling hopeless', date: '01/04' },
  { mood: "Amazing", moodValue: 90, notes: 'Amazing day, everything went well', date: '01/05' },
  { mood: "Okay", moodValue: 20, notes: 'Feeling okay, but not great', date: '01/06' },
  { mood: "Annoyed", moodValue: -10, notes: 'A bit annoyed, but nothing major', date: '01/07' },
];  

const MoodTracker = ({ streak, loggedToday, onMoodLogged, moodLog, resetMoodLog }) => {
  const theme = useTheme();
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);

  // Add invisible points at -100 and 100 to ensure full y-axis range
  const invisiblePoints = [100, -100];

  const validateAndConvertMood = async (moodDescription) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Please validate if the following is a real mood. If it is, assign it a numerical value between -100 and 100 representing the intensity and sentiment of the mood. Positive moods should have positive values, and negative moods should have negative values. Return ONLY THE NUMBER. If the word is not a real mood, respond with "INVALID". Mood: "${moodDescription}"`,
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      const result = response.data.choices[0].message.content.trim();
  
      if (result === 'INVALID') {
        return { valid: false, moodDescription, moodValue: null };
      }
  
      const numericalValue = parseFloat(result);
      if (isNaN(numericalValue)) {
        return { valid: false, moodDescription, moodValue: null };
      }
  
      return { valid: true, moodDescription, moodValue: numericalValue };
    } catch (error) {
      console.error('Error validating and converting mood:', error);
      return { valid: false, moodDescription, moodValue: null };
    }
  };  

  const handleMoodSubmit = async () => {
    const { valid, moodDescription, moodValue } = await validateAndConvertMood(mood);
  
    if (!valid) {
      Alert.alert('Invalid Mood', 'The mood you entered is not recognized. Please enter a real mood.');
      return;
    }
  
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

    const newLog = { mood: moodDescription, moodValue, notes, date: dateString };

    // Call the handler passed from BottomNav
    onMoodLogged(newLog);

    setMood('');
    setNotes('');
  };

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

  const getMoodColor = (averageMood) => {
    if (averageMood <= -66) return '#0000ff';  // Blue for extremely negative
    if (averageMood <= -33) return '#8080ff';  // Light Blue for moderately negative
    if (averageMood < 0) return '#ffa500';     // Orange for slightly negative
    if (averageMood === 0) return '#808080';   // Gray for neutral
    if (averageMood <= 33) return '#90ee90';   // Light Green for slightly positive
    if (averageMood <= 66) return '#32cd32';   // Green for moderately positive
    return '#00ff00';                          // Bright Green for extremely positive
  };

  const getFilteredDates = () => {
    const totalEntries = moodLog.length;
    const maxLabels = 6;

    if (totalEntries <= maxLabels) {
      return compileMoodData().map(log => log.date);
    }

    const step = Math.ceil(totalEntries / maxLabels);
    return compileMoodData().filter((_, index) => index % step === 0).map(log => log.date);
  };

  const handleExpandChart = () => {
    setChartVisible(true);
  };

  const closeChart = () => {
    setChartVisible(false);
  };

  return (
    <>
    <BackButton />
      {chartVisible ? (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <FullScreenChart
          onClose={closeChart}
          compileMoodData={compileMoodData}
          getFilteredDates={getFilteredDates}
          theme={theme}
        />
        </View>
      ) : (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.heading, { color: theme.colors.primary }]}>Track Your Mood</Text>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={[styles.streak]}>Streak: {streak}  <Icon name="fire" size={24} color={loggedToday ? "orange" : "gray"} /></Text>
            </Card.Content> 
          </Card>
          {/* Mood Input Card */}
          <Card style={styles.card}>
            <Card.Content>
              <TextInput
                label="Enter your mood (one word)"
                value={mood}
                onChangeText={setMood}
                style={[styles.textInput, { backgroundColor: theme.colors.secondaryContainer }]}
                placeholder="e.g., Happy, Sad, Anxious"
                placeholderTextColor={theme.colors.onSecondaryContainer}
              />

              <TextInput
                label="Notes (optional)"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                style={[styles.textInput, { backgroundColor: theme.colors.secondaryContainer, marginTop: 10 }]}
                placeholder="Any additional notes..."
                placeholderTextColor={theme.colors.onSecondaryContainer}
              />

              <Button
                mode="contained"
                onPress={handleMoodSubmit}
                style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
              >
                Submit Mood
              </Button>
            </Card.Content>
          </Card>

          {/* Chart Widget */}
          <Card style={styles.card}>
            <Card.Content>
              {moodLog.length > 0 ? (
                <View>
                  <TouchableOpacity onPress={handleExpandChart}>
                  <View style={{overflow: 'hidden', borderRadius: 8,}}>
                    <LineChart
                      data={{
                        labels: getFilteredDates(),
                        datasets: [{
                          data: compileMoodData().map((log) => log.averageMood),
                          color: (opacity = 1, index) => compileMoodData()[index]?.color || theme.colors.primary,
                        },
                        {
                          data: invisiblePoints, // Invisible points dataset
                          color: (opacity = 0) => 'transparent', // Make the line transparent
                          strokeWidth: 0, // No stroke to avoid connecting these points
                          withDots: false, // No dots for these points
                          propsForDots: { 
                            r: "0", // No radius for the invisible points
                          },
            
                        },
                      ],
                      }}
                      width={width}
                      height={220}
                      yAxisLabel=""
                      yAxisInterval={1}
                      chartConfig={{
                        backgroundColor: theme.colors.background,
                        backgroundGradientFrom: theme.colors.background,
                        backgroundGradientTo: theme.colors.background,
                        decimalPlaces: 0,
                        color: (opacity = 1) => theme.colors.primary,
                        labelColor: (opacity = 1) => theme.colors.onBackground,
                        yAxisMin: -100,
                        yAxisMax: 100,
                        propsForBackgroundLines: {
                          strokeWidth: 1,
                        },
                        propsForLabels: {
                          fontSize: 10,
                        },
                        useShadowColorFromDataset: true,
                      }}
                      bezier
                      style={styles.chart}
                    />
                    </View>
                    <Text style={[styles.chartHint, { color: theme.colors.primary }]}>Tap to expand the chart</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={[styles.noDataText, { color: theme.colors.onBackground }]}>No mood logs available.</Text>
              )}
            </Card.Content>
          </Card>


          {/* Mood Logs Widget */}
          <Card style={styles.card}>
            <Card.Content>
              <Button
                mode="outlined"
                onPress={() => setShowLogs(!showLogs)}
                style={[styles.toggleButton, { borderColor: theme.colors.primary }]}
                labelStyle={{ color: theme.colors.primary }}
              >
                {showLogs ? 'Hide Past Logs' : 'View Past Logs'}
              </Button>

              {showLogs && (
                <View style={styles.logContainer}>
                  <Text style={[styles.subHeading, { color: theme.colors.primary }]}>Your Past Mood Logs</Text>
                  {moodLog.map((log, index) => (
                    <View key={index} style={[styles.logItem, { borderColor: theme.colors.primary }]}>
                      <Text style={[styles.logDate, { color: theme.colors.primary }]}>
                        Date: {log.date}
                      </Text>
                      <Text style={[styles.logMood, { color: theme.colors.onBackground }]}>
                        Mood: {log.mood}
                      </Text>
                      <Text style={[styles.logMoodValue, { color: theme.colors.onBackground }]}>
                        Mood Value: {log.moodValue}
                      </Text>
                      {log.notes ? (
                        <Text style={[styles.logNotes, { color: theme.colors.onBackground }]}>
                          Notes: {log.notes}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              )}

            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={resetMoodLog}
            style={[styles.resetButton, { backgroundColor: theme.colors.secondary }]}
          >
            Reset Mood Logs
          </Button>

        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    minHeight: '100%',
    width: '100%',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  textInput: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
  },
  submitButton: {
    marginVertical: 10,
  },
  resetButton: {
    marginVertical: 10,
    marginBottom: 30,
    alignSelf: 'center',
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
  logContainer: {
    marginTop: 20,
  },
  logItem: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  logDate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  logMood: {
    fontSize: 14,
  },
  logNotes: {
    fontSize: 12,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  streak: {
    textAlign: 'center', 
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default MoodTracker;
