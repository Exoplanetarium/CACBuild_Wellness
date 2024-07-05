import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Touchable, Dimensions } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { useTheme, RadioButton, Checkbox, Provider, Card, Button, } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomSlider from './CustomSlider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MusicGenerator from '../backend/Generation'
import * as FileSystem from 'expo-file-system';

// Get screen dimensions
const { width } = Dimensions.get('window');
const genres = ['pop', 'rock', 'jazz', 'classical', 'hip-hop', 'electronic', 'country', 'reggae'];

export default function MusicTab() {

  const [checkedGenres, setCheckedGenres] = useState({});
  const [checkedLyrics, setCheckedLyrics] = useState(false);
  const [moodPercent, setMoodPercent] = useState(50);
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [triggerGeneration, setTriggerGeneration] = useState(false);
  const [showCard, setShowCard] = useState(true);

  const handleCheckboxPress = useCallback((genre) => {
    setCheckedGenres((prevCheckedGenres) => ({
      ...prevCheckedGenres,
      [genre]: !prevCheckedGenres[genre],
    }));
  }, []);

  const genreList = Object.keys(checkedGenres)
    .filter((genre) => checkedGenres[genre])
    .join(', ');

  const generatePrompt = () => {
    return `Generate music with tempo:${value}, genres:${genreList},mood (from 0 is most calm to 100 is most upbeat):${moodPercent}. Follow these instructions closely`;
  };

  const handleGenerateMusic = () => {
    setTriggerGeneration(true);
    setShowCard(false);
  };


  const handleCheckboxLyrics = () => {
    setCheckedLyrics(!checkedLyrics);
  }

  const handleSurpriseMe = () => {
    // Randomly set checkedLyrics
    setCheckedLyrics(Math.random() < 0.5);
  
    // Randomly set value (tempo) between 40 and 150, adhering to a step of 5
    const minTempo = 40;
    const maxTempo = 150;
    const step = 5;
    const randomTempo = Math.round((Math.random() * (maxTempo - minTempo) + minTempo) / step) * step;
    setValue(randomTempo);
  
    // Randomly set moodPercent between 0 and 100
    const randomMoodPercent = Math.floor(Math.random() * 101);
    setMoodPercent(randomMoodPercent);

    // Randomly select a genre and ensure it's checked
    const randomGenreIndex = Math.floor(Math.random() * genres.length);
    const randomGenre = genres[randomGenreIndex];
    setCheckedGenres({ [randomGenre]: true });
  };

  

  return (
    <View style={{backgroundColor: theme.colors.background, ...styles.container}}>
      {showCard ? (
      <Card style={{backgroundColor: theme.colors.primaryContainer, ...styles.card}} >
        <Card.Title title="Shape your music" titleStyle={{color: theme.colors.onPrimaryContainer, fontWeight: 'bold'}} titleMaxFontSizeMultiplier={4}/>
        <Card.Actions>
          <Card.Content style={{marginLeft: -30, marginRight: -30}}>
            {/* Tempo */}
            <View style={{marginLeft: 0}}>
              <Text style={{color: theme.colors.onPrimaryContainer, textAlign: 'center'}}>Tempo</Text>
              <CustomSlider
                min={40}
                max={150}
                step={5}
                value={value}
                onValueChange={setValue}
                width={width*0.4}
                height={40}
                
              />
            </View>
            {/* Lyrics */}
            <TouchableOpacity style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center', width: width*0.4, }} onPress={handleCheckboxLyrics}>
              <Text style={{color: theme.colors.onPrimaryContainer, textAlign: 'center', marginRight: 20}}>Lyrics?</Text>
              <Checkbox value="lyrics" status={checkedLyrics ? 'checked' : 'unchecked'} style={{marginLeft: 20}} theme={theme}/>
            </TouchableOpacity>
          </Card.Content>
          
          {/* Genre */}
          <Card.Content>
            <Text style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: -10}}>Genres</Text>
            {genres.map((genre) => (
              <Checkbox.Item
                key={genre}
                label={genre.charAt(0).toUpperCase() + genre.slice(1)}
                value={genre}
                status={checkedGenres[genre] ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxPress(genre)}
              />
            ))}
          </Card.Content>
        {/*
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //  TODO: ADD PROVERBS TO ENHANCE UX  !!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        */}
        </Card.Actions>
        {/* Mood */}
        <Card.Content>
          <View>
          <Text style={{color: theme.colors.onPrimaryContainer, marginTop: 10, marginLeft: width*0.25}}>Calm</Text>
          <Text style={{color: theme.colors.onPrimaryContainer, marginTop: -20, marginLeft: width*0.72}}>Upbeat</Text>
          </View>
        </Card.Content>
        <Card.Actions style={{marginTop: -15}}>
          <Card.Content>
            <Text style={{color: theme.colors.onPrimaryContainer}}>Mood</Text>        
          </Card.Content>
          <Slider
            style={{width: width*0.6, height: 40}}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.primary}
            thumbTintColor={theme.colors.primary}
            minimumValue={0}
            maximumValue={100}
            value={moodPercent}
            onValueChange={setMoodPercent}
          />
        </Card.Actions>

        <Card.Actions>
          <Button style={{borderRadius: 5}} onPress={handleSurpriseMe}>Surprise Me!</Button>
          <Button style={{borderRadius: 5}} onPress={handleGenerateMusic}>Generate Music</Button>
        </Card.Actions>
      </Card>
      ) : (
        <MusicGenerator
          prompt={generatePrompt()}
          instrumental={!checkedLyrics}
          trigger={triggerGeneration}
          onGenerated={() => setTriggerGeneration(false)}
        />
      )}
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
  },
  card: {
    width: width * 0.9,
  }
});
