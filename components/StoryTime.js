import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import BackButton from './BackButton';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const StoryTime = ({ moodLevels, problemData }) => {
  const theme = useTheme();
  const [storySections, setStorySections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateStory = async () => {
      setLoading(true);
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: "You are a compassionate and understanding therapy friend. Based on the user's current problem and mood levels, create an inspirational real-life story that offers comfort and encouragement. While maintaining a conversational and friendly tone, feel free to be creative in how you tell the story. The structure can vary, but should generally include the following elements:\n\n1. A short paragraph (3-5 sentences) expressing genuine sympathy for the user's situation, gently leading into the story.\n\n2. A clear title for the story. Format it like this: \"Title: [Story Title]\".\n\n3. The story itself should be meaningful and engaging, broken into distinct parts or scenes as you see fit. Each part can have its own title, but don't feel constrained by rigid formatting. Let the narrative flow naturally, with a focus on creativity and emotional impact.\n\nAvoid using markdown or any special formatting, as the text will be displayed as-is.",
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
      } finally {
        setLoading(false);
      }
    };

    generateStory();
  }, [problemData, moodLevels]);

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
    <View style={[styles.container, { backgroundColor: theme.colors.onSecondary }]}>
      {loading ? (
        <View>
        <Text style={{ color: theme.colors.onBackground, marginBottom: 10, fontSize: 16, textAlign: 'center' }}>Generating an inspirational story...</Text>
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
});

export default StoryTime;
