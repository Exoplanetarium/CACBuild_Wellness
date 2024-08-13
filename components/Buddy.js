import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, useTheme, Text, TextInput, Divider } from 'react-native-paper';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing, runOnJS } from 'react-native-reanimated';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import FeelingsCard from './FeelingsCard';
import TextBubble from './TextBubble';

const { width, height } = Dimensions.get('window');

const Buddy = forwardRef((props, ref) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState([]);
  const opacity = useSharedValue(0);
  const translateOut = useSharedValue(0);
  const translateTextOut = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    showComponent,
  }));

  const showComponent = () => {
    runOnJS(setVisible)(true);
    translateOut.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    translateTextOut.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  };

  const hideComponent = () => {
    translateOut.value = withTiming(-400, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    }, () => {
      runOnJS(setVisible)(false);
    });
    translateTextOut.value = withTiming(400, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateOut.value }],
      opacity: opacity.value,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateTextOut.value }],
      opacity: opacity.value,
    };
  });

  const submitReply = async () => {
    if (replyText.trim()) {
      const userMessage = {
        role: 'user',
        content: replyText,
        id: Date.now(),
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setReplyText('');

      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful and compassionate therapy friend...',
            },
            ...conversationHistory,
          ],
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        const botMessage = {
          role: 'assistant',
          content: response.data.choices[0].message.content,
          id: Date.now() + 1,
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);

      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <>
      {visible && (
        <View style={styles.chatOverlay}>
          <View style={styles.container}>
            <ScrollView
              style={styles.messagesContainer}
              contentContainerStyle={{ flexDirection: 'column-reverse' }}
              ref={(ref) => { this.scrollView = ref; }}
              onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
            >
              <View>
                <Animated.View style={[styles.popup, animatedStyle]}>
                  <TextBubble text="Hi. How are you feeling today?"></TextBubble>
                </Animated.View>
                {messages.map((message) => (
                  <Animated.View key={message.id} style={[{ marginVertical: 12 }, textStyle]}>
                    <TextBubble key={message.id} text={message.content} pointerLocation={message.role === 'user' ? 'right' : 'left'} />
                  </Animated.View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={{ backgroundColor: theme.colors.secondaryContainer, color: theme.colors.onSecondary, margin: 10 }}
                onChangeText={setReplyText}
                value={replyText}
                placeholder="Type your reply here..."
                placeholderTextColor="#999"
              />
              <Button onPress={submitReply} mode="contained" buttonColor={theme.colors.primary}>Reply</Button>
            </View>
            <Divider />
            <View style={{ bottom: -100, width: '100%' }}><Button onPress={hideComponent}>Exit</Button></View>
          </View>
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  chatOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0000004b",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    position: 'absolute',
    bottom: 100,
    maxHeight: 10000,
  },
  messagesContainer: {
    maxHeight: 475,
    width: '100%',
    zIndex: 10,
    marginBottom: -50
  },
  inputContainer: {
    bottom: -100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
});

export default Buddy;
