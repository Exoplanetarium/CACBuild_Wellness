// MoodInsightsWidget.js

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

const MoodInsightsWidget = ({ moodLog }) => {
  const theme = useTheme();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (moodLog && moodLog.length > 0) {
      const calculatedInsights = calculateInsights(moodLog);
      setInsights(calculatedInsights);
    }
  }, [moodLog]);

  const calculateInsights = (moodLog) => {
    const insights = [];

    // Calculate average mood
    const averageMood =
      moodLog.reduce((sum, entry) => sum + entry.moodValue, 0) / moodLog.length;

    insights.push({
      title: 'Average Mood',
      value: averageMood.toFixed(0),
      description:
        averageMood >= 0
          ? 'Overall Positive'
          : 'Overall Negative',
    });

    // Identify most frequent mood
    const moodFrequency = {};
    moodLog.forEach((entry) => {
      moodFrequency[entry.mood] = (moodFrequency[entry.mood] || 0) + 1;
    });
    const mostFrequentMood = Object.keys(moodFrequency).reduce((a, b) =>
      moodFrequency[a] > moodFrequency[b] ? a : b
    );
    insights.push({
      title: 'Most Frequent Mood',
      value: mostFrequentMood,
      description: `Often feeling ${mostFrequentMood.toLowerCase()}`,
    });

    // Detect mood trend (simple implementation)
    if (moodLog.length >= 2) {
      const recentMood = moodLog[moodLog.length - 1].moodValue;
      const previousMood = moodLog[moodLog.length - 2].moodValue;
      const moodDifference = recentMood - previousMood;

      insights.push({
        title: 'Recent Change',
        value:
          moodDifference > 0
            ? 'Improving'
            : moodDifference < 0
            ? 'Declining'
            : 'Stable',
        description:
          moodDifference !== 0
            ? `Changed by ${moodDifference.toFixed(0)}`
            : 'No change in mood',
      });
    } else {
      insights.push({
        title: 'Recent Change',
        value: 'N/A',
        description: 'Not enough data',
      });
    }

    // Analyze mood by day of the week
    const moodByDay = {};
    moodLog.forEach((entry) => {
      const dateParts = entry.date.split('/');
      const dateObj = new Date(
        new Date().getFullYear(),
        parseInt(dateParts[0], 10) - 1,
        parseInt(dateParts[1], 10)
      );
      const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      if (!moodByDay[day]) {
        moodByDay[day] = [];
      }
      moodByDay[day].push(entry.moodValue);
    });

    const dayAverages = Object.keys(moodByDay).map((day) => {
      const avg =
        moodByDay[day].reduce((sum, val) => sum + val, 0) / moodByDay[day].length;
      return { day, average: avg };
    });

    const bestDay = dayAverages.reduce((a, b) =>
      a.average > b.average ? a : b
    );
    insights.push({
      title: 'Best Day',
      value: bestDay.day,
      description: `Feel best on ${bestDay.day}s`,
    });

    return insights;
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={[styles.heading, { color: theme.colors.primary }]}>Mood Insights</Text>
        <View style={styles.gridContainer}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.gridItem}>
              <Text style={[styles.insightTitle, { color: theme.colors.onSurface }]}>
                {insight.title}
              </Text>
              <Text style={[styles.insightValue, { color: theme.colors.primary }]}>
                {insight.value}
              </Text>
              <Text style={[styles.insightDescription, { color: theme.colors.onSurfaceVariant }]}>
                {insight.description}
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 64) / 2, // Adjust based on padding/margins
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
    textAlign: 'center',
  },
  insightDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MoodInsightsWidget;
