import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const BackButton = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.goBack()}
    >
      <IconButton
        icon="arrow-left"
        color={theme.colors.onPrimary}
        size={24}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    zIndex: 10,  // Ensure it's above other elements
  },
});

export default BackButton;
