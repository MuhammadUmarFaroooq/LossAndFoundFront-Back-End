import React, {useEffect, useState} from 'react';
import {View, Text, Image, StatusBar} from 'react-native';
import AfterToursScreen from './src/Screens/AfterToursScreen';
import LinearGradient from 'react-native-linear-gradient';
import OnBoardingUI from './src/Screens/OnBoardingUI';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import {API, COLORS, IP, LINEARCOLOR} from './src/constants/theme';

import axios from 'axios';

export default function App() {
  const [showHomePage, setShowHomePage] = useState(true);

  const fetchApi = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    fetchApi();
    SplashScreen.hide();
  }, []);

  const updateShowHomePage = value => {
    setShowHomePage(value);
  };

  return (
    <LinearGradient colors={LINEARCOLOR} style={{flex: 1}}>
      {showHomePage ? (
        <OnBoardingUI updateShowHomePage={updateShowHomePage} />
      ) : (
        <NavigationContainer>
          <AppNavigator States={''} Country={''} />
        </NavigationContainer>
      )}
    </LinearGradient>
  );
}
