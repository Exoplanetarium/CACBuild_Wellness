import { Button, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import PanBackground from './components/PanBackground';
import BottomNav from './components/BottomNav';

export default function App() {

  return (
    
      <NavigationContainer>
        <PaperProvider>
          <BottomNav />
        </PaperProvider>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#112233',
  },
});

