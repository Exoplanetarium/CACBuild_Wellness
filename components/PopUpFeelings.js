import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, ScrollView } from 'react-native';
import { Button, useTheme, Text, TextInput } from 'react-native-paper';
import Animated, { useSharedValue, withTiming, withDelay, useAnimatedStyle, Easing, runOnJS } from 'react-native-reanimated';
import FeelingsCard from './FeelingsCard';
import TextBubble from './TextBubble';

const { width, height } = Dimensions.get('window');

const PopUpFeelings = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState([]);
  const pushUp = useSharedValue(0);
  const scale = useSharedValue(0);
  const textScale = useSharedValue(0);

  const showComponent = () => {
    scale.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    }, () => {
      runOnJS(setVisible)(true);
    });
  };

  const hideComponent = () => {
    scale.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    }, () => {
      runOnJS(setVisible)(false);
    });
  };

  const hideTexts = () => {
    textScale.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }

  useEffect(() => { 
    pushUp.value = withTiming(50, {
      duration: 250,
      easing: Easing.out(Easing.exp),
  })}, [messages]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textScale.value }],
      opacity: textScale.value,
    }
  });

  const submitReply = () => {
    if (replyText.trim()) {
      // Assuming you want to add an object with id and text
      const newMessage = {
        id: Date.now(), // Simple unique ID, consider a better ID for production
        text: replyText,
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setReplyText('');
    }
  };

  return (
    <>
    {visible && (
      <View style={styles.chatOverlay} >
        <View style={styles.container}>
          <ScrollView style={styles.messagesContainer}>
            {(messages || []).map(message => (
              <Pressable key={message.id} onPress={hideTexts}>
                <Animated.View style={[{ marginVertical: 30 }, animatedStyle]}>
                  <TextBubble key={message.id} text={message.text}></TextBubble>
                </Animated.View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
    <Pressable style={styles.container} onPress={hideComponent}>
        <Animated.View style={[styles.popup, animatedStyle]}>
          <TextBubble style={{marginTop: 20}} text="Hi. How are you feeling today?">
            <FeelingsCard onButtonPress={() => console.log(":/")} />
          </TextBubble>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.secondaryContainer, color: theme.colors.onSecondary }]}
              onChangeText={setReplyText}
              value={replyText}
              placeholder="Type your reply here..."
              placeholderTextColor="#999"
            />
            <Button onPress={submitReply} mode="contained" buttonColor={theme.colors.primary}>Reply</Button>
          </View>
        </Animated.View>
    </Pressable>
    </View>
    )}
    {!visible && (
      <View style={styles.activateContainer}>
        <Button 
          style={[styles.activateButton, {backgroundColor: theme.colors.primary}]} 
          onPress={showComponent} 
          mode='contained'
        >
          <Text style={{ color: theme.colors.onSecondary }}>Buddy</Text>
        </Button>
      </View>
    )}
  </>
  );
  
};

const styles = StyleSheet.create({
  chatOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0000004b",
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    bottom: 100, // Adjust this value if needed
    left: 20, // Adjust this value if needed
    width: width * 0.8,
    alignItems: 'flex-start', // Align the popup to the left
    maxHeight: 600, // Adjust based on your UI needs
  },
  activateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    margin: 10,
    width: 100,
    backgroundColor: 'transparent',
  },
  popup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: -100,

  },
  messagesContainer: {
    maxHeight: 600, // Adjust based on your UI needs
    width: '100%',
  },
  input: {
    flex: 1,
    margin: 10,
  },
});

export default PopUpFeelings;
