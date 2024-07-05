import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import TrackPlayer, { usePlaybackState, useProgress, Capability, State } from 'react-native-track-player';
import Slider from '@react-native-community/slider';

const Player = () => {
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();
  const theme = useTheme();

  useEffect(() => {
    async function setupPlayer() {
      try {
        console.log('Setting up player...');
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
            Capability.SeekTo,
          ],
          compactCapabilities: [Capability.Play, Capability.Pause],
        });
        await TrackPlayer.add({
          id: 'trackId',
          url: require('../assets/586fc4d5-17cd-4944-a91c-5bfc168acc38.mp3'),
          title: 'Track Title',
          artist: 'Track Artist',
          artwork: require('../assets/splash.png'),
        });
        console.log('Player setup complete.');
      } catch (error) {
        Alert.alert('Error', 'Failed to setup player: ' + error.message);
      }
    }

    // Setup the player
    setupPlayer();

    // Add event listener for playback errors
    const onPlaybackError = TrackPlayer.addEventListener('playback-error', (error) => {
      console.error('Playback Error:', error.message);
      Alert.alert('Playback Error', error.message);
      // Implement additional error handling logic here
    });

    // Cleanup event listener
    return () => {
      onPlaybackError.remove();
    };
  }, []);

  const togglePlayback = async () => {
    // Convert the playbackState object to a string for logging
    console.log(`Current playback state: ${JSON.stringify(playbackState)}`);
  
    try {
      // Assuming playbackState.state holds the actual state value you're interested in
      const stateValue = playbackState.state;
  
      // Check if the player is in a state that indicates it's ready to start playing
      if (stateValue === State.Paused || stateValue === State.Stopped || stateValue === State.Ready || stateValue === State.None) {
        console.log('Attempting to play...');
        await TrackPlayer.play();
      } else if (stateValue === State.Playing) {
        console.log('Attempting to pause...');
        await TrackPlayer.pause();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle playback: ' + error.message);
    }
  };

  const onSliderValueChange = async (value) => {
    try {
      await TrackPlayer.seekTo(value);
    } catch (error) {
      Alert.alert('Error', 'Failed to seek track: ' + error.message);
    }
  };

  return (
      <View style={{backgroundColor: theme.colors.background, ...styles.container}}>
        <Text style={{color: theme.colors.onBackground, ...styles.trackInfo}}></Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.accent}
          thumbTintColor={theme.colors.primary}
          onSlidingComplete={onSliderValueChange}
        />
        <View style={styles.controls}>
          <Button mode="contained" onPress={togglePlayback}>
            {playbackState.state === State.Playing ? 'Pause' : 'Play'}
          </Button>
        </View>
        <View style={styles.timeInfo}>
          <Text style={{color: theme.colors.onBackground}}>{new Date(position * 1000).toISOString().slice(11, 19)}</Text>
          <Text style={{color: theme.colors.onBackground}}>{new Date(duration * 1000).toISOString().slice(11, 19)}</Text>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  trackInfo: {
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    width: 300,
    height: 40,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 20,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginTop: 10,

  },
});

export default Player;
