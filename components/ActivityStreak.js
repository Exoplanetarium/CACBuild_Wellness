import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome6'; // Import FontAwesome icons

const ActivityStreak = ({ streak, loggedToday }) => {
  const theme = useTheme();

  return (
    <View>
      <Text style={[styles.text, { color: theme.colors.primary }]}>
        {`Current Streak: ${streak} day${streak !== 1 ? 's  ' : '  '}`}
        <Icon name="fire" size={24} color={loggedToday ? "#FFA500" : "#B0B0B0"} style={styles.icon} />
      </Text>
      {loggedToday && (
        <Text style={[styles.message, { color: theme.colors.secondary }]}>
          Streak maintained! Keep it up!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ActivityStreak;
