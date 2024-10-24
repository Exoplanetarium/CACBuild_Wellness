import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const signUp = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error };
  }
};

export const logIn = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
    return { success: true };
  } catch (error) {
    console.error('Log in error:', error);
    return { success: false, error };
  }
};

export const logOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    console.error('Log out error:', error);
    return { success: false, error };
  }
};

export const googleSignIn = async () => {
  try {
    // Ensure that Google Play Services are available (for Android)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Initiate the Google Sign-In process
    const userInfo = await GoogleSignin.signIn();

    // Log the retrieved userInfo for debugging
    console.log('Google Sign-In User Info:', userInfo);

    // Extract the ID token from userInfo
    const idToken = userInfo.data.idToken;

    if (!idToken) {
      throw new Error('No ID Token found');
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    await auth().signInWithCredential(googleCredential);

    return { success: true };
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.error('User cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.error('Sign in is in progress already');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.error('Play services not available or outdated');
    } else {
      console.error('Google Sign-In error:', error);
    }
    return { success: false, error };
  }
};