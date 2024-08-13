import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing, runOnJS } from 'react-native-reanimated';
import TextBubble from './TextBubble';
import MoodSliderComponent from './MoodSliderComponent';
import ProblemSelection from './ProblemSelection';
import StoryTime from './StoryTime';

const SetupHome = ( { onComplete }) => {
  const theme = useTheme();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleMoodSubmit = (moodLevels) => {
    console.log('User mood levels:', moodLevels);
    onComplete(moodLevels); // Call onComplete with the moodLevels to finish setup
  };

  const handleScrollEnabled = () => {
    setScrollEnabled(true);
  };

  const handleScrollDisabled = () => {
    setScrollEnabled(false);
  };

  return (
    <>
      <View style={styles.chatOverlay}>
        <View style={styles.container}>
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={{ flexDirection: 'column-reverse' }}
            ref={(ref) => { this.scrollView = ref; }}
            onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })} // Scroll to the end when content changes
            scrollEnabled={scrollEnabled}
          >
            <View>
              <Animated.View style={styles.popup}>
                  <TextBubble text="Hi. How are you feeling today?">
                    <MoodSliderComponent
                      onMoodSubmit={handleMoodSubmit}
                      onSlidingStart={handleScrollDisabled}
                      onSlidingComplete={handleScrollEnabled}
                    />
                  </TextBubble>

              </Animated.View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chatOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0000004b",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Ensure there's padding so content isn't flush against screen edges
  },
  container: {
    position: 'absolute',
    bottom: 100,
    maxHeight: 10000,
  },
  activateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    margin: 12,
    width: 100,
    backgroundColor: 'transparent',
  },
  popup: {
    marginVertical: 10,
  },
  inputContainer: {
    bottom: -100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  messagesContainer: {
    maxHeight: 700,
    width: '100%',
    zIndex: 10,
    marginBottom: -50
  },
});

export default SetupHome;