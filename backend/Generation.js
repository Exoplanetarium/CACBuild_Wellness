import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { useTheme } from 'react-native-paper';
import { Audio } from 'expo-av';
import { Waveform } from '@simform_solutions/react-native-audio-waveform';

const MusicGenerator = ({ prompt, instrumental, trigger, onGenerated }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [files, setFiles] = useState([]);
    const [sound, setSound] = useState(null);
    const [playerState, setPlayerState] = useState(null);
    const [isMoving, setIsMoving] = useState(false);
    const ref = useRef(null);

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
            await FileSystem.downloadAsync(audioUrl, fileUri);
            setFiles(prevFiles => [...prevFiles, `${audioId}.mp3`]);
            setStatus(`Audio file saved: ${audioId}.mp3`);
            console.log(`File saved at: ${fileUri}`);
        } catch (error) {
            setStatus(`Error downloading audio file: ${error}`);
        } finally {
            onGenerated();
        }
    };

    const playSound = async (fileName) => {
        const fileUri = `${FileSystem.documentDirectory}static/${fileName}`;
        try {
            if (sound) await sound.unloadAsync();
            const { sound: newSound } = await Audio.Sound.createAsync({ uri: fileUri });
            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const stopSound = async () => {
        if (sound) {
            try {
                await sound.stopAsync();
                await sound.unloadAsync();
            } catch (error) {
                console.error('Error stopping sound:', error);
            } finally {
                setSound(null);
            }
        }
    };

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    const renderItem = ({ item }) => {
        const filePath = `${FileSystem.documentDirectory}static/${item}`;
        console.log(`Rendering waveform for: ${filePath}`);
        return (
            <View style={styles.waveformContainer}>
                
                <TouchableOpacity onPress={() => playSound(item)} style={styles.playButton}>
                    <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.status, { color: theme.colors.onPrimaryContainer }]}>{status}</Text>
            {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}
            <Waveform
                mode="static"
                ref={ref}
                path="" // Empty path to render an empty waveform
                candleSpace={2}
                candleWidth={4}
                scrubColor={theme.colors.primary}
                onPlayerStateChange={(playerState) => {
                    console.log(playerState);
                    setPlayerState(playerState);
                }}
                onPanStateChange={(isMoving) => {
                    console.log(isMoving);
                    setIsMoving(isMoving);
                }}
            />
            {/* <FlatList
                data={files}
                keyExtractor={(item) => item}
                renderItem={renderItem}
            /> */}
            {sound && (
                <TouchableOpacity style={[styles.stopButton, { backgroundColor: theme.colors.error }]} onPress={stopSound}>
                    <Text style={[styles.stopButtonText, { color: theme.colors.onError }]}>Stop</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
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
});

export default MusicGenerator;
