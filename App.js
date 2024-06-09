import { Button, StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
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

