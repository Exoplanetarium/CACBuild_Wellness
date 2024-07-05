import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { useTheme, Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import TrackPlayer, { usePlaybackState, Capability, useProgress, State } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

const setupTrackPlayer = async () => {
    console.log('Setting up player...');
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
        stopWithApp: true,
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
};

const MusicGenerator = ({ prompt, instrumental, trigger, onGenerated }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [files, setFiles] = useState([]);
    const playbackState = usePlaybackState();
    const { position, duration } = useProgress();
    
    useEffect(() => {
        setupTrackPlayer();
        return () => TrackPlayer.reset();
    }, []);

    useEffect(() => {
        if (trigger) {
            generateMusic();
        }
    }, [trigger]);

    useEffect(() => {
        const loadFiles = async () => {
            const directory = `${FileSystem.documentDirectory}static/`;
            try {
                const fileList = await FileSystem.readDirectoryAsync(directory);
                setFiles(fileList.filter(file => file.endsWith('.mp3')));
            } catch (error) {
                console.error('Error loading files:', error);
            }
        };

        loadFiles();
    }, []);

    const generateMusic = async () => {
        setLoading(true);
        setStatus('Generating music...');
        const url = 'https://suno-api-iota-henna.vercel.app/api/generate';
        const headers = { 'Content-Type': 'application/json' };
        const payload = {
            prompt,
            make_instrumental: instrumental,
            wait_audio: false,
        };

        try {
            const response = await axios.post(url, payload, { headers });
            const data = response.data;
            if (data) {
                const audioId = data[0].id;
                checkAudioStatus(audioId);
            } else {
                setStatus('Failed to submit generation request.');
            }
        } catch (error) {
            console.error('Error generating music:', error.response?.data || error.message);
            setStatus(`Error generating music: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const checkAudioStatus = async (audioId) => {
        const url = `https://suno-api-iota-henna.vercel.app/api/get?ids=${audioId}`;
        const headers = { 'Content-Type': 'application/json' };

        const poll = async () => {
            try {
                const response = await axios.get(url, { headers });
                const data = response.data;
                if (data && data[0].audio_url) {
                    const audioUrl = data[0].audio_url;
                    setStatus('Audio generation complete.');
                    saveAudioFile(audioUrl, audioId);
                } else {
                    setStatus(`Audio not ready. Status: ${data[0]?.status || 'Unknown'}`);
                    setTimeout(poll, 5000); // Poll every 5 seconds
                }
            } catch (error) {
                setStatus(`Error checking audio status: ${error}`);
            }
        };

        poll();
    };

    const saveAudioFile = async (audioUrl, audioId) => {
        try {
            const dirUri = `${FileSystem.documentDirectory}static/`;
            await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
            const fileUri = `${dirUri}${audioId}.mp3`;
            console.log(`Attempting to download and save file: ${fileUri}`);
            const downloadResult = await FileSystem.downloadAsync(audioUrl, fileUri);
            console.log(`Download result: ${JSON.stringify(downloadResult)}`);
            setFiles(prevFiles => [...prevFiles, `${audioId}.mp3`]);
            setStatus(`Audio file saved: ${audioId}.mp3`);
            console.log(`File saved at: ${fileUri}`);

            // Add track to TrackPlayer queue
            await TrackPlayer.add({
                id: audioId,
                url: fileUri,
                title: "Generated Music",
                artist: "Suno API",
            });
            console.log(`Track added to player: ${audioId}`);
        } catch (error) {
            console.error(`Error downloading or saving audio file: ${error}`);
            setStatus(`Error downloading audio file: ${error}`);
        } finally {
            onGenerated();
        }
    };

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

    const skipToNext = async () => {
        try {
          await TrackPlayer.skipToNext();
        } catch (error) {
          console.log(error);
        }
      };
    
    const skipToPrevious = async () => {
        try {
            await TrackPlayer.skipToPrevious();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.status, { color: theme.colors.onPrimaryContainer }]}>{status}</Text>
            {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}   
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
                    <Button title="skip to next" onPress={skipToNext} />
                    <Button mode="contained" onPress={togglePlayback}>
                        {playbackState.state === State.Playing ? 'Pause' : 'Play'}
                    </Button>
                    <Button icon={<Icon size={20} name="skip-previous"/>} onPress={skipToPrevious} />
                </View>
                <View style={styles.timeInfo}>
                    <Text style={{color: theme.colors.onBackground}}>{new Date(position * 1000).toISOString().slice(11, 19)}</Text>
                    <Text style={{color: theme.colors.onBackground}}>{new Date(duration * 1000).toISOString().slice(11, 19)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    status: {
        marginBottom: 16,
        textAlign: 'center',
    },
    waveformContainer: {
        height: 100,
        width: '100%', // Ensure the container takes the full width
        marginVertical: 10,
    },
    playButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
    },
    playButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    stopButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
    stopButtonText: {
        textAlign: 'center',
    },
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

export default MusicGenerator;
