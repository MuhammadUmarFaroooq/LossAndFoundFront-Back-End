import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Screens/Login';
import Register from '../Screens/Register';
import AfterToursScreen from '../Screens/AfterToursScreen';
import LinearGradient from 'react-native-linear-gradient';
import ForgotPasswordScreen from '../Screens/Forget';
import OTPScreen from '../Screens/OTPScreen';
import ChangePasswordScreen from '../Screens/ChangePasswordScreen';
import { COLORS } from '../constants/theme';
import { View, Image, Text } from 'react-native';

import BottomUpNavigation from './BottomUpNavigation';
import HomeScreen from '../Screens/HomeScreen';
import PostDetail from '../Screens/PostDetail';
import Listings from '../Screens/Listings';
import DetailsPage from '../Screens/DetailsPage';
import EditProfile from '../Screens/EditProfile';
import ChangePasswordWithCurrent from '../Screens/ChangePasswordWithCurrent';
import NotificationMainScreen from '../Screens/NotificationMainScreen';
import FiltersScreen from '../Components/Filters';
import Chat from '../Screens/Chat';
import FriendList from '../Screens/FriendList';

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
      <Stack.Screen name="NotificationMainScreen" component={NotificationMainScreen} />
      <Stack.Screen name="Filters" component={FiltersScreen} />
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
              <Image
                source={require('../assets/appicons/icon.png')}
                style={{ width: 30, height: 30, marginRight: 10 }}
              />
              <Text style={{ color: COLORS.title, fontWeight: 'bold', fontSize: 20 }}>
                Create Account
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.white,
          },
        }}
      />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerTitleAlign: 'center' }} />
      <Stack.Screen name="Listings" component={Listings} />
      <Stack.Screen name="DetailsPage" component={DetailsPage} />
      <Stack.Screen name="ChangePasswordWithCurrent" component={ChangePasswordWithCurrent} />
      <Stack.Screen name="Chat" component={Chat} options={{ headerTitleAlign: 'center', headerTitle: 'Chat' }} />
      <Stack.Screen name="FriendList" component={FriendList} options={{ headerTitleAlign: 'center', headerTitle: 'Friend List' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
