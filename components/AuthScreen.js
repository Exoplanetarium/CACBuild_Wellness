import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { signUp, logIn, logOut } from './auth';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  // Modified handleSignUp to await the signUp function
  const handleSignUp = async () => {
    const result = await signUp(email, password);
    if (result.success) {
      navigation.replace('Main');
    } else {
      // Handle sign up failure (e.g., show an error message)
      console.error(result.error);
    }
  };

  // Modified handleLogIn to await the logIn function
  const handleLogIn = async () => {
    const result = await logIn(email, password);
    if (result.success) {
      navigation.replace('Main');
    } else {
      // Handle log in failure (e.g., show an error message)
      console.error(result.error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>Welcome</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>
      <Button mode="outlined" onPress={handleLogIn} style={styles.button}>
        Log In
      </Button>
      <Button onPress={() => logOut()} style={styles.button}>
        Log Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default AuthScreen;