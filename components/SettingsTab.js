import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const Settings = () => {
  const generateMusic = async () => {
    try {
      const response = await fetch('http://localhost:8000/generate-music', {
        method: 'POST',
      });
      const data = await response.json();
      console.log('Music generated:', data);
    } catch (error) {
      console.error('Error generating music:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Generate Music" onPress={generateMusic} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Settings;