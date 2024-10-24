import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { TextInput, Button, Text, useTheme, Divider } from 'react-native-paper';
import { signUp, logIn, logOut, googleSignIn } from './auth';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/FontAwesome'; // For Google icon (ensure react-native-vector-icons is installed)

const { width, height } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  // State to control splash screen visibility
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Shared value for splash opacity
  const splashOpacity = useSharedValue(0);

  // Animated style for the splash screen
  const animatedSplashStyle = useAnimatedStyle(() => {
    return {
      opacity: splashOpacity.value,
    };
  });

  useEffect(() => {
    Orientation.lockToPortrait();

    // Start the animation sequence
    splashOpacity.value = withTiming(1, { duration: 750 }, () => {
      splashOpacity.value = withDelay(
        1200,
        withTiming(0, { duration: 750 }, () => {
          // After fade-out, hide the splash screen
          runOnJS(setIsSplashVisible)(false);
        })
      );
    });
  }, []);

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

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const result = await googleSignIn();
    if (result.success) {
      navigation.replace('Main');
    } else {
      // Handle Google Sign-In failure (e.g., show an error message)
      console.error(result.error);
      // Optionally, show an alert or Snackbar
    }
  };

  return (
    <View style={{backgroundColor: theme.colors.background, ...styles.container}}>
    {isSplashVisible ? (
      // Splash Screen
      <Animated.View style={[styles.splashContainer, animatedSplashStyle]}>
        <Image
          source={require('../assets/Buddy_LOGO_Transparent.png')} // Adjust the path to your logo image
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    ) : (
      // Auth Form
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
      {/* Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 32 }}>
        <Divider style={{ flex: 1 }} />
        <Text style={{ marginHorizontal: 16, color: theme.colors.outline }}>or</Text>
        <Divider style={{ flex: 1 }} />
      </View>
      {/* Google Sign-In Button */}
      <Button mode="contained" style={[styles.googleButton, { backgroundColor: theme.colors.primary }]} onPress={handleGoogleSignIn} icon={"google"}>
        Sign In with Google
      </Button>
    </View>
    )}
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
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300, // Adjust the size as needed
    height: 300,
  },
  googleIcon: {
    marginRight: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default AuthScreen;