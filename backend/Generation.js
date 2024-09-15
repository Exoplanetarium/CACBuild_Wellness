import React, { useEffect, useState, useRef, useCallback, useMemo, } from "react";
import { View, Text, ActivityIndicator, FlatList, Dimensions, StyleSheet } from "react-native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { useTheme, Button, IconButton } from "react-native-paper";
import Slider from "@react-native-community/slider";
import TrackPlayer, { usePlaybackState, Capability, useProgress, State } from "react-native-track-player";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { useSharedValue, withTiming, withDelay, runOnJS, Easing, } from "react-native-reanimated";
import { Canvas, Path, Circle, useCanvasRef, BlurMask, } from "@shopify/react-native-skia";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const setupTrackPlayer = async () => {
  console.log("Setting up player...");
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

const colorSets = [
  { start: "#08283d", end: "#73aed8" },
  { start: "#330947", end: "#cb0e0e" },
  { start: "#f2ed55", end: "#a74a11" },
  { start: "#0d6644", end: "#f4d35e" },
  { start: "#114e80", end: "#218335" },
  { start: "#3f2caf", end: "#e94057" },
  { start: "#42275a", end: "#734b6d" },
  { start: "#283c86", end: "#45a247" },
  { start: "#8e2de2", end: "#4a00e0" },
  { start: "#ffafbd", end: "#ffc3a0" },
  { start: "#ee0979", end: "#ff6a00" },
  { start: "#16a085", end: "#f4d03f" },
  { start: "#1d2b64", end: "#f8cdda" },
  { start: "#c6ffdd", end: "#fbd786" },
  { start: "#4568dc", end: "#b06ab3" },
  { start: "#ff416c", end: "#ff4b2b" },
  { start: "#1f4037", end: "#99f2c8" },
  { start: "#00c6ff", end: "#0072ff" },
  { start: "#7f00ff", end: "#e100ff" },
  { start: "#ff7e5f", end: "#feb47b" },
  { start: "#6a11cb", end: "#2575fc" },
  { start: "#fc5c7d", end: "#6a82fb" },
  { start: "#43cea2", end: "#185a9d" },
  { start: "#ff0099", end: "#493240" },
  { start: "#c31432", end: "#240b36" },
  { start: "#302b63", end: "#24243e" },
  { start: "#00b09b", end: "#96c93d" },
  { start: "#eacda3", end: "#d6ae7b" },
  { start: "#cc2b5e", end: "#753a88" },
  { start: "#b92b27", end: "#1565c0" },
  { start: "#f857a6", end: "#ff5858" },
  { start: "#003973", end: "#e5e5be" },
  { start: "#1f1c2c", end: "#928dab" },
  { start: "#654ea3", end: "#eaafc8" },
  { start: "#ed213a", end: "#93291e" },
  { start: "#16bffd", end: "#cb3066" },
  { start: "#000428", end: "#004e92" },
  { start: "#360033", end: "#0b8793" },
  { start: "#0082c8", end: "#667db6" },
  { start: "#485563", end: "#29323c" },
  { start: "#eb3349", end: "#f45c43" },
  { start: "#5c258d", end: "#4389a2" },
  { start: "#70e1f5", end: "#ffd194" },
  { start: "#11998e", end: "#38ef7d" },
  { start: "#fc5c7d", end: "#6a82fb" },
  { start: "#16a085", end: "#f4d03f" },
  { start: "#ff0099", end: "#493240" },
  { start: "#8e2de2", end: "#4a00e0" },
  { start: "#00c6ff", end: "#0072ff" },
  { start: "#7f00ff", end: "#e100ff" },
  { start: "#fc466b", end: "#3f5efb" },
  { start: "#ee0979", end: "#ff6a00" },
];

const interpolateColor = (startColor, endColor, factor) => {
  const result = startColor
    .slice(1)
    .match(/.{2}/g)
    .map((hex, i) => {
      const start = parseInt(hex, 16);
      const end = parseInt(endColor.slice(1).match(/.{2}/g)[i], 16);
      const value = Math.round(start + factor * (end - start))
        .toString(16)
        .padStart(2, "0");
      return value;
    })
    .join("");
  return `#${result}`;
};

const { width, height } = Dimensions.get("window");

const MusicGenerator = ({ prompt, instrumental, trigger, onGenerated, handleShowGenerator }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [files, setFiles] = useState([]);
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();

  useEffect(() => {
    setupTrackPlayer();
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
        setFiles(fileList.filter((file) => file.endsWith(".mp3")));
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };

    loadFiles();
  }, []);

  const generateMusic = async () => {
    setLoading(true);
    setStatus("Generating music...");
    const url = "https://suno-api-public.vercel.app/api/generate";
    const headers = { "Content-Type": "application/json" };
    const payload = {
      prompt,
      'make_instrumental': instrumental,
      'wait_audio': false,
    };
    console.log(`prompt: ${prompt}, instrumental: ${instrumental}`);

    try {
      const response = await axios.post(url, payload, { headers: headers });
      const data = response.data;
      if (data) {
        const audioId = data[0].id;
        checkAudioStatus(audioId);
      } else {
        setStatus("Failed to submit generation request.");
      }
    } catch (error) {
      console.error("Error generating music:", error);
      // Enhanced logging
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        console.error("Error data:", error.response.data);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setStatus(
        `Error generating music: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const checkAudioStatus = async (audioId) => {
    const url = `https://suno-api-public.vercel.app/api/get?ids[0]=${audioId}`;
    const headers = { "Content-Type": "application/json" };

    const poll = async () => {
      try {
        const response = await axios.get(url, { headers });
        const data = response.data;
        if (data && data[0].audio_url) {
          const audioUrl = data[0].audio_url;
          setStatus("Audio generation complete.");
          saveAudioFile(audioUrl, audioId);
        } else {
          setStatus(`Audio not ready. Status: ${data[0]?.status || "Unknown"}`);
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
      setFiles((prevFiles) => [...prevFiles, `${audioId}.mp3`]);
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

  const logTrackPlayerQueue = async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      console.log("Current TrackPlayer Queue:");
      queue.forEach((track, index) => {
        console.log(`Track ${index + 1}:`, JSON.stringify(track));
      });
    } catch (error) {
      console.error("Error fetching TrackPlayer queue:", error);
    }
  };

  const togglePlayback = async () => {
    // Convert the playbackState object to a string for logging
    logTrackPlayerQueue();
    console.log(`Current playback state: ${JSON.stringify(playbackState)}`);

    try {
      // Assuming playbackState.state holds the actual state value you're interested in
      const stateValue = playbackState.state;

      // Check if the player is in a state that indicates it's ready to start playing
      if (
        stateValue === State.Paused ||
        stateValue === State.Stopped ||
        stateValue === State.Ready ||
        stateValue === State.None
      ) {
        console.log("Attempting to play...");
        await TrackPlayer.play();
      } else if (stateValue === State.Playing) {
        console.log("Attempting to pause...");
        await TrackPlayer.pause();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to toggle playback: " + error.message);
    }
  };

  const onSliderValueChange = async (value) => {
    try {
      await TrackPlayer.seekTo(value);
    } catch (error) {
      Alert.alert("Error", "Failed to seek track: " + error.message);
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

  /*
   * This is the trail effect stuff please mind the lag :)
   */

  const MAX_CIRCLES = 100;
  const mousePosition = useSharedValue({ horizontal: 0, vertical: 0 });
  const mousePositionLastOffset = useSharedValue({
    horizontal: 0,
    vertical: 0,
  });
  const velocityX = useSharedValue(0);
  const velocityY = useSharedValue(0);

  const [circleQueue, setCircleQueue] = useState([]); // Queue to manage circle positions
  const [currentColorSetIndex, setCurrentColorSetIndex] = useState(0); // Track the current color set
  const [isTouching, setIsTouching] = useState(false); // Track if the screen is being touched

  const getCurrentColorSet = useCallback(() => {
    const safeIndex = currentColorSetIndex % colorSets.length;
    return colorSets[safeIndex];
  }, [currentColorSetIndex]);

  const getRandomColorSet = () => {
    const randomIndex = Math.floor(Math.random() * colorSets.length);
    return colorSets[randomIndex];
  };

  const updateCircleQueue = useCallback((position) => {
    setCircleQueue((currentQueue) => {
      const newQueue = [...currentQueue, { ...position, opacity: 1 }];
      if (newQueue.length > MAX_CIRCLES) {
        newQueue.shift(); // Remove the oldest position
      }
      return newQueue
        .map((pos, index) => ({
          ...pos,
          opacity: pos.opacity - 0.05, // Reduce opacity gradually
        }))
        .filter((pos) => pos.opacity > 0);
    });
  }, []);

  const fadeOutCircles = () => {
    const interval = setInterval(() => {
      setCircleQueue((currentQueue) => {
        const newQueue = currentQueue
          .map((pos) => ({
            ...pos,
            opacity: pos.opacity - 0.05,
          }))
          .filter((pos) => pos.opacity > 0);
        if (newQueue.length === 0) {
          clearInterval(interval);
        }
        return newQueue;
      });
    }, 50); // Adjust the interval time for the fade-out effect
  };

  const handleEnd = useCallback(() => {
    const finalPosition = {
      horizontal: mousePosition.value.horizontal + velocityX.value * 0.2,
      vertical: mousePosition.value.vertical + velocityY.value * 0.2,
    };

    mousePosition.value = withTiming(finalPosition.horizontal, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    mousePosition.value = withTiming(finalPosition.vertical, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });

    runOnJS(updateCircleQueue)(finalPosition);
    runOnJS(fadeOutCircles)();
  }, [mousePosition, velocityX, velocityY, updateCircleQueue, fadeOutCircles]);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      runOnJS(setIsTouching)(true);
      const startPosition = { horizontal: e.x, vertical: e.y };
      mousePosition.value = startPosition;
      mousePositionLastOffset.value = startPosition;
      runOnJS(setCircleQueue)([]); // Clear the queue
      runOnJS(updateCircleQueue)(startPosition);
    })
    .onUpdate((e) => {
      const newPosition = {
        horizontal: mousePositionLastOffset.value.horizontal + e.translationX,
        vertical: mousePositionLastOffset.value.vertical + e.translationY,
      };
      mousePosition.value = newPosition;
      velocityX.value = e.velocityX;
      velocityY.value = e.velocityY;
      runOnJS(updateCircleQueue)(newPosition);
    })
    .onEnd(() => {
      runOnJS(setIsTouching)(false);
      runOnJS(handleEnd)();
    });

  useEffect(() => {
    const randomColorSet = getRandomColorSet();
    if (isTouching) {
      const interval = setCurrentColorSetIndex(
        colorSets.indexOf(randomColorSet)
      );
      return () => clearInterval(interval);
    }
  }, [isTouching]);

  const ref = useCanvasRef();

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.colors.onSecondary,
        }}
      >
        <Canvas style={styles.backgroundCanvas} ref={ref}>
          {circleQueue.map((pos, index) => {
            const factor = index / circleQueue.length;
            const currentColorSet = getCurrentColorSet();
            const color = interpolateColor(
              currentColorSet.start,
              currentColorSet.end,
              factor
            );
            return (
              <Circle
                key={index}
                cx={pos.horizontal}
                cy={pos.vertical}
                r={50 - (index * 50) / circleQueue.length}
                color={color}
                opacity={pos.opacity}
              >
                <BlurMask blur={20} style="normal" />
              </Circle>
            );
          })}
        </Canvas>
        <Text
          style={[styles.status, { color: theme.colors.onPrimaryContainer }]}
        >
          {status}
        </Text>
        {loading && (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}
        <View style={[styles.controlsContainer]}>
          <Text
            style={[styles.trackInfo, { color: theme.colors.onBackground }]}
          ></Text>
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
            <IconButton
              icon="skip-previous"
              iconColor={theme.colors.onBackground}
              size={25}
              onPress={skipToPrevious}
            />
            <Button mode="contained" onPress={togglePlayback}>
              {playbackState.state === State.Playing ? "Pause" : "Play"}
            </Button>
            <IconButton
              icon="skip-next"
              iconColor={theme.colors.onBackground}
              size={25}
              onPress={skipToNext}
            />
          </View>
          <View style={styles.timeInfo}>
            <Text style={{ color: theme.colors.onBackground }}>
              {new Date(position * 1000).toISOString().slice(11, 19)}
            </Text>
            <Text style={{ color: theme.colors.onBackground }}>
              {new Date(duration * 1000).toISOString().slice(11, 19)}
            </Text>
          </View>
        </View>
        <Button
          style={{ borderRadius: 5, zIndex: 3 }}
          onPress={handleShowGenerator}
        >
          Return to Generator
        </Button>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
  backgroundCanvas: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  status: {
    marginTop: 16,
    textAlign: "center",
    zIndex: 3, // Ensure this is above the trail effect
  },
  controlsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 3, // Ensure this is above the trail effect
  },
  trackInfo: {
    fontSize: 18,
    marginBottom: 20,
    zIndex: 3, // Ensure this is above the trail effect
  },
  slider: {
    width: 300,
    height: 40,
    zIndex: 3, // Ensure this is above the trail effect
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "60%",
    marginTop: 20,
    zIndex: 3, // Ensure this is above the trail effect
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    marginTop: 10,
    zIndex: 3, // Ensure this is above the trail effect
  },
});

export default MusicGenerator;
