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
import HomeScreen from '../Screens/HomeScreen';
import PostDetail from '../Screens/PostDetail';
import Listings from '../Screens/Listings';

const Stack = createStackNavigator();

const AppNavigator = props => {
  return (
    <Stack.Navigator initialRouteName="AfterTour">
      <Stack.Screen name="AfterTour" component={AfterToursScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Forget" component={ForgotPasswordScreen} />
      <Stack.Screen name="OPTScreen" component={OTPScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Tabs" component={BottomUpNavigation} />
      <Stack.Screen
        name="Post Details"
        component={PostDetail}
        options={{
          headerTitleStyle: {
            color: '#000000',
            fontSize: 20,
            fontFamily: 'Rubik-Bold',
          },
          headerTitleAlign: 'center',
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
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Listings" component={Listings} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
