import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Card } from 'react-native-paper';

const affirmations = [
  "You are capable of amazing things.",
  "Believe in yourself and all that you are.",
  "You have the power to create change.",
  "Today is going to be a great day!",
  "Keep pushing forward; you are doing great!",
  "Embrace the journey, even the challenges.",
  "You are stronger than you think.",
  "Every day is a new opportunity to grow.",
];

const DailyAffirmation = () => {
  const theme = useTheme();
  const [affirmation, setAffirmation] = useState('');

  useEffect(() => {
    const date = new Date();
    const dayOfYear = Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );
    const index = dayOfYear % affirmations.length;
    setAffirmation(affirmations[index]);
  }, []);

  return (
    <Text style={[styles.text, { color: theme.colors.primary }]}>
        {affirmation}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DailyAffirmation;
