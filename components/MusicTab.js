import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

export default function MusicTab() {
  const [musicStatus, setMusicStatus] = useState('');
  const [sound, setSound] = useState(null);

  const generateMusic = async () => {
    console.log("Button pressed");
    try {
      const response = await axios.post('http://10.0.2.2:5000/generate', {
        descriptions: ['80s pop track']
      });
      const fileUrl = response.data.file_url;
      console.log('Generated file URL:', fileUrl);
      setMusicStatus('Music generated. Playing now...');
      await playMusic(fileUrl);
    } catch (error) {
      console.error(error);
      setMusicStatus('Error generating music');
    }
  };

  const playMusic = async (url) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing music:', error);
      setMusicStatus('Error playing music');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Generate Music" onPress={generateMusic} />
      <Text style={styles.text}>{musicStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131122',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});
