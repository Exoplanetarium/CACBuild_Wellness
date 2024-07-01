import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Touchable } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { useTheme, RadioButton, Checkbox, Provider, Card, Button, } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomSlider from './CustomSlider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MusicGenerator from '../backend/Generation'

//! TESTING REMOVE LATER
import { Waveform } from '@simform_solutions/react-native-audio-waveform';


const genres = ['pop', 'rock', 'jazz', 'classical', 'hip-hop', 'electronic', 'country', 'reggae'];

export default function MusicTab() {

  const [checkedGenres, setCheckedGenres] = useState({});
  const [checkedLyrics, setCheckedLyrics] = useState(false);
  const [moodPercent, setMoodPercent] = useState(50);
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [triggerGeneration, setTriggerGeneration] = useState(false);
  const [showCard, setShowCard] = useState(true);

  //! TESTING REMOVE LATER
  const ref = useRef(null);
  const [playerState, setPlayerState] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const filePath = '../backend/static/586fc4d5-17cd-4944-a91c-5bfc168acc38.mp3'

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

  

  return (
    <View style={{backgroundColor: theme.colors.background, ...styles.container}}>
      {showCard ? (
      <Card style={{backgroundColor: theme.colors.primaryContainer}} >
        <Card.Title title="Shape your music" titleStyle={{color: theme.colors.onPrimaryContainer, fontWeight: 'bold'}} titleMaxFontSizeMultiplier={4}/>
        <Card.Actions>
          <Card.Content style={{marginLeft: -30, marginRight: -30}}>
            {/* Tempo */}
            <Text style={{color: theme.colors.onPrimaryContainer, textAlign: 'center'}}>Tempo</Text>
            <CustomSlider
              min={40}
              max={150}
              step={5}
              value={value}
              onValueChange={setValue}
              width={200}
              height={40}
              
            />
            {/* Lyrics */}
            <TouchableOpacity style={{flexDirection: 'row',justifyContent: 'space-around',alignItems: 'center', width: 240, }} onPress={handleCheckboxLyrics}>
              <Text style={{color: theme.colors.onPrimaryContainer, textAlign: 'center'}}>Lyrics?</Text>
              <Checkbox value="lyrics" status={checkedLyrics ? 'checked' : 'unchecked'} style={{justifyContent: 'center', width: 200}} theme={theme}/>
            </TouchableOpacity>
   
          </Card.Content>
          
          {/* Genre */}
          <Card.Content>
            <Text style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}>Genres</Text>
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
          <Text style={{color: theme.colors.onPrimaryContainer, marginTop: 10}}>                          Calm                                                                Upbeat</Text>
        </Card.Content>
        <Card.Actions style={{marginTop: -15}}>
          <Card.Content>
            <Text style={{color: theme.colors.onPrimaryContainer}}>Mood</Text>        
          </Card.Content>
          <Slider
            style={{width: 300, height: 40}}
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
          <Button style={{borderRadius: 5}}>Surprise Me!</Button>
          <Button style={{borderRadius: 5}} onPress={handleGenerateMusic}>Generate Music</Button>
        </Card.Actions>
      </Card>
      ) : (
        <Waveform
          mode="static"
          ref={ref}
          path={filePath}
          candleSpace={2}
          candleWidth={4}
          scrubColor={theme.colors.primary}
          onPlayerStateChange={() => {
            console.log(playerState);
            setPlayerState(playerState);
          }}
          onPanStateChange={() => {
            console.log(isMoving);
            setIsMoving(isMoving);
          }}
          onError={(error) => console.error('Waveform error:', error)}
        />
        // <MusicGenerator
        //   prompt={generatePrompt()}
        //   instrumental={!checkedLyrics}
        //   trigger={triggerGeneration}
        //   onGenerated={() => setTriggerGeneration(false)}
        // />
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
    fontSize: 18,
  },
});
