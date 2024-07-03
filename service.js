import TrackPlayer from 'react-native-track-player';

module.exports = async function() {
  // This service needs to be registered for the player to work
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  // Add other event listeners if needed
};