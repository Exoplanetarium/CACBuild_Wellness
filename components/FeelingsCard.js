import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme, Button } from 'react-native-paper';

const { width } = Dimensions.get('window');

const FeelingsCard = ({ onButtonPress }) => {
  const theme = useTheme();

  return (
    <View style={styles.cardContainer}>
      <View style={[styles.card, { backgroundColor: theme.colors.onSecondary }]}>
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={() => onButtonPress()} mode='contained-tonal' contentStyle={{width: 65}} compact={true}>
            <Text style={styles.buttonText}>Great</Text>
          </Button>
          <Button style={styles.button} onPress={() => onButtonPress()} mode='contained-tonal' contentStyle={{width: 65}} compact={true}>
            <Text style={styles.buttonText}>Good</Text>
          </Button>
          <Button style={styles.button} onPress={() => onButtonPress()} mode='contained-tonal' contentStyle={{width: 65}} compact={true}>
            <Text style={styles.buttonText}>Okay</Text>
          </Button>
          <Button style={styles.button} onPress={() => onButtonPress()} mode='contained-tonal' contentStyle={{width: 65}} compact={true}>
            <Text style={styles.buttonText}>Bad</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%', // Ensure the card container takes the full width of the parent
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  button: {
    marginHorizontal: 2,
  }
});

export default FeelingsCard;
