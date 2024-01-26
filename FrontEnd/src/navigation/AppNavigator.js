import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../Screens/Login';
import Register from '../Screens/Register';
import AfterToursScreen from '../Screens/AfterToursScreen';
import LinearGradient from 'react-native-linear-gradient';
import ForgotPasswordScreen from '../Screens/Forget';
import OTPScreen from '../Screens/OTPScreen';
import ChangePasswordScreen from '../Screens/ChangePasswordScreen';
import {COLORS} from '../constants/theme';
import {View, Image, Text, TouchableOpacity} from 'react-native';

import BottomUpNavigation from './BottomUpNavigation';

const Stack = createStackNavigator();

const AppNavigator = props => {
  const renderHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 50,
        marginTop: 12, // Adjust margin as needed
      }}>
      <Image
        source={require('../assets/appicons/logo.png')} // Replace with the path to your logo
        style={{width: 200, height: 20, marginRight: 60, marginLeft: 20}}
      />

      {/* Bell Icon */}
      <TouchableOpacity
        onPress={() => {
          // Handle bell icon press
        }}
        style={{backgroundColor: COLORS.white, padding: 6}}>
        {/* Pushes bell icon to the right */}
        <Image
          source={require('../assets/bell.png')} // Replace with the path to your bell icon
          style={{
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity>
    </View>
  );
  return (
    <Stack.Navigator initialRouteName="AfterTour">
      <Stack.Screen name="AfterTour" component={AfterToursScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Forget" component={ForgotPasswordScreen} />
      <Stack.Screen name="OPTScreen" component={OTPScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen
        name="HomeScreen"
        component={BottomUpNavigation}
        options={{
          headerTitle: () => renderHeader(),
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerLeft: null, // Hide back button
        }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        initialParams={props}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 50,
              }}>
              {/* Logo */}
              <Image
                source={require('../assets/appicons/icon.png')} // Replace with the path to your logo
                style={{width: 30, height: 30, marginRight: 10}}
              />
              {/* Header Text */}
              <Text
                style={{color: COLORS.title, fontWeight: 'bold', fontSize: 20}}>
                Create Account
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.white,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
