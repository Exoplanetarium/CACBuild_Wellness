import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import BackButton from './BackButton';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import RNFS from 'react-native-fs'; // Import react-native-fs for file operations
import Sound from 'react-native-sound'; // Import react-native-sound for audio playback
import { Buffer } from 'buffer'; // Import buffer for base64 encoding

// Make Buffer available globally
global.Buffer = Buffer;

const StoryTime = ({ moodLevels, problemData }) => {
  const theme = useTheme();
  const [storySections, setStorySections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);

  // Audio Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Create a ref for the audio sound
  const soundRef = useRef(null);
  
  useEffect(() => {
    // Generate Story
    generateStory();
    
    // Clean up on unmount
    return () => {
      unloadSound();
    };
  }, [problemData, moodLevels]);
  
  const unloadSound = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = null;
        setIsPlaying(false);
        setIsPaused(false);
      });
    }
  };

  const generateStory = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate and understanding therapy friend. Based on the user's current problem and mood levels, create an inspirational real-life story that offers comfort and encouragement. While maintaining a conversational and friendly tone, feel free to be creative in how you tell the story. The structure can vary, but should generally include the following elements:\n\n1. A short paragraph (3-5 sentences) expressing genuine sympathy for the user's situation, gently leading into the story.\n\n2. A clear title for the story. Format it like this: "Title: [Story Title]".\n\n3. The story itself should be meaningful and engaging, broken into distinct parts or scenes as you see fit. Each part can have its own title, but don't feel constrained by rigid formatting. Let the narrative flow naturally, with a focus on creativity and emotional impact.\n\nAvoid using markdown or any special formatting, as the text will be displayed as-is.`,
          },
          {
            role: 'user',
            content: `I am currently facing the following problem: ${problemData.category}. Here are some details: ${problemData.details || 'No additional details provided.'} My current mood levels are as follows: ${JSON.stringify(moodLevels)}. Please provide an inspirational story to help me cope.`,
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      const story = response.data.choices[0].message.content;
      const sections = story.split('\n\n'); // Split story into sections based on double newlines
      setStorySections(sections);
      setCurrentSection(0);
    } catch (error) {
      console.error('Error generating story:', error);
      Alert.alert('Error', 'Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to convert text to speech using OpenAI's TTS API
  const textToSpeech = async (text) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/audio/speech', {
        model: 'tts-1',
        input: text,
        voice: 'alloy',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // Expecting binary data (MP3)
      });

      // Assuming the API returns audio data in the response as MP3 binary
      const audioData = response.data;

      // Convert binary data to base64
      const base64Audio = Buffer.from(audioData, 'binary').toString('base64');

      // Define a temporary file path
      const filePath = `${RNFS.CachesDirectoryPath}/tts_audio_${Date.now()}.mp3`;

      // Write the base64 audio data to the file system as MP3
      await RNFS.writeFile(filePath, base64Audio, 'base64');

      // Initialize and play the audio using react-native-sound
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release();
          soundRef.current = null;
        });
      }

      const sound = new Sound(filePath, '', (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          Alert.alert('Error', 'Failed to load the audio.');
          return;
        }
        soundRef.current = sound;
        sound.play((success) => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
            Alert.alert('Error', 'Audio playback failed.');
          }
          sound.release();
          soundRef.current = null;
          setIsPlaying(false);
          setIsPaused(false);
        });
        setIsPlaying(true);
        setIsPaused(false);
      });

    } catch (error) {
      console.error('Error converting text to speech:', error);
      Alert.alert('Error', 'Failed to convert text to speech. Please try again.');
    }
  };

  // Function to handle reading aloud the current section
  const handleReadAloud = () => {
    if (storySections.length > 0) {
      textToSpeech(storySections[currentSection]);
    }
  };

  // Function to handle pausing the audio
  const handlePause = () => {
    if (soundRef.current && isPlaying && !isPaused) {
      soundRef.current.pause(() => {
        setIsPaused(true);
        setIsPlaying(false);
      });
    }
  };

  // Function to handle resuming the audio
  const handleUnpause = () => {
    if (soundRef.current && isPaused) {
      soundRef.current.play((success) => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
          Alert.alert('Error', 'Audio playback failed.');
        }
        soundRef.current.release();
        soundRef.current = null;
        setIsPlaying(false);
        setIsPaused(false);
      });
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  // Function to stop the speech
  const handleStopSpeaking = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = null;
        setIsPlaying(false);
        setIsPaused(false);
      });
    }
  };

  const handleNextSection = () => {
    if (currentSection < storySections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <>
      <BackButton />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {loading ? (
          <View>
            <Text style={{ color: theme.colors.onBackground, marginBottom: 10, fontSize: 16, textAlign: 'center' }}>
              Generating an inspirational story...
            </Text>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <>
            <ScrollView>
              <Text style={[styles.storySection, { color: theme.colors.onBackground }]}>
                {storySections[currentSection]}
              </Text>
            </ScrollView>
            <View style={styles.navigationButtons}>
              <Button
                mode="contained"
                onPress={handlePreviousSection}
                disabled={currentSection === 0}
                style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
              >
                Previous
              </Button>
              <Button
                mode="contained"
                onPress={handleNextSection}
                disabled={currentSection === storySections.length - 1}
                style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
              >
                Next
              </Button>
            </View>
            <View style={styles.ttsButtons}>
              {/* Dynamic Read Aloud / Pause/Unpause Button */}
              {!isPlaying && !isPaused ? (
                <Button
                  mode="outlined"
                  onPress={handleReadAloud}
                  style={[styles.ttsButton, ]}
                  icon="play-circle"
                >
                  Read Aloud
                </Button>
              ) : isPlaying && !isPaused ? (
                <Button
                  mode="contained"
                  onPress={handlePause}
                  style={[styles.ttsButton, { backgroundColor: '#dfcf75' }]}
                  icon="pause-circle"
                >
                  Pause
                </Button>
              ) : isPaused ? (
                <Button
                  mode="contained"
                  onPress={handleUnpause}
                  style={[styles.ttsButton, { backgroundColor: '#b1df9f' }]}
                  icon="play-circle"
                >
                  Unpause
                </Button>
              ) : null}
              
              {/* Stop Button */}
              <Button
                mode="contained"
                onPress={handleStopSpeaking}
                style={[styles.ttsButton, { backgroundColor: theme.colors.error }]}
                icon="stop-circle"
              >
                Stop
              </Button>
            </View>
          </>
        )}
      </View>
    </>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  storySection: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 50,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    width: '48%',
  },
  ttsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  ttsButton: {
    width: '48%',
  },
});


export default StoryTime;
