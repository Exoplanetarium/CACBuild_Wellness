import auth from '@react-native-firebase/auth';

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