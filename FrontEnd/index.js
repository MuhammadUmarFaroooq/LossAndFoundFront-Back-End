/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}
AppRegistry.registerComponent(appName, () => Main);
