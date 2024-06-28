import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { useTheme, RadioButton, Checkbox, Provider, Card, Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomSlider from './CustomSlider';

const genres = ['pop', 'rock', 'jazz', 'classical', 'hip-hop', 'electronic', 'country', 'reggae'];

export default function MusicTab() {
  const [checkedGenres, setCheckedGenres] = useState({});
  const [langs, setLangs] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const theme = useTheme();

  const [languages, setLanguages] = useState([
    { label: 'English', value: 'en', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Spanish', value: 'es', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'French', value: 'fr', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'German', value: 'de', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Italian', value: 'it', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Portuguese', value: 'pt', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Russian', value: 'ru', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Japanese', value: 'ja', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Korean', value: 'ko', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Chinese', value: 'zh', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Arabic', value: 'ar', labelStyle: {color: theme.colors.onPrimaryContainer}},
    { label: 'Hindi', value: 'hi', labelStyle: {color: theme.colors.onPrimaryContainer}},
  ]);

  DropDownPicker.setTheme('DARK');
  const [value, setValue] = useState(0);

  const handleCheckboxPress = useCallback((genre) => {
    setCheckedGenres((prevCheckedGenres) => ({
      ...prevCheckedGenres,
      [genre]: !prevCheckedGenres[genre],
    }));
  }, []);

  return (
    <View style={{backgroundColor: theme.colors.background, ...styles.container}}>
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
            {/* Language */}
            <Text style={{color: theme.colors.onPrimaryContainer, textAlign: 'center'}}>Language</Text>
            <Provider theme={theme}>
            <DropDownPicker
              zIndex={1000}
              placeholder='Select Language'
              placeholderStyle={{color: theme.colors.onPrimaryContainer}}
              value={langs}
              setValue={setLangs}
              items={languages}
              setItems={setLanguages}
              open={showDropdown}
              setOpen={setShowDropdown}
              style={{backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.onPrimaryContainer, width: 200}}
              labelStyle={{color: theme.colors.onPrimaryContainer}}
              containerStyle={{color: theme.colors.onPrimaryContainer, marginLeft: 30, marginTop: 25}}
              selectedItemLabelStyle={{fontWeight: 'bold', color: theme.colors.onPrimaryContainer}}
              dropDownContainerStyle={{backgroundColor: theme.colors.secondaryContainer, width: 200, maxHeight: 200, top: 0, position: 'relative'}}
              ArrowDownIconComponent={({ style }) => (
                <Icon name="arrow-drop-down" size={24} color={theme.colors.onPrimaryContainer} style={style} />
              )}
              ArrowUpIconComponent={({ style }) => (
                <Icon name="arrow-drop-up" size={24} color={theme.colors.onPrimaryContainer} style={style} />
              )}
              TickIconComponent={({ style }) => (
                <Icon name="check" size={20} color={theme.colors.onPrimaryContainer} style={style} />
              )}
              listMode="SCROLLVIEW"
              scrollViewProps={{nestedScrollEnabled: true,}}
            />
            </Provider>
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
          />
        </Card.Actions>

        <Card.Actions>
          <Button style={{borderRadius: 5}}>Surprise Me!</Button>
          <Button style={{borderRadius: 5}}>Generate Music</Button>
        </Card.Actions>
      </Card>
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
