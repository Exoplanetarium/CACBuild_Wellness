import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import service from './service'; // The service file you created
import { AppRegistry } from 'react-native';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => service);
