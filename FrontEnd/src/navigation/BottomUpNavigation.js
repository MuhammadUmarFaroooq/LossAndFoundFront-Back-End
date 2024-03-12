import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {CommonActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, BottomNavigation} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../Screens/HomeScreen';
import PostCreation from '../Screens/PostCreation';
import {COLORS} from '../constants/theme';
import Profile from '../Screens/Profile';
import {Categories} from '../constants/AppDetail';
import Chat from '../Screens/Chat';
import FavScreen from '../Screens/FavScreen';

const Tab = createBottomTabNavigator();

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;
export default function BottomUpNavigation({navigation}) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <Tab.Navigator
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          style={{backgroundColor: COLORS.white, paddingBottom: 12, height: 60}}
          activeColor={COLORS.blue}
          inactiveColor={COLORS.black}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 25});
            }

            return null;
          }}
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 50,
                marginTop: 12,
                marginBottom: 12, // Adjust margin as needed
              }}>
              <Image
                source={require('../assets/appicons/logo.png')} // Replace with the path to your logo
                style={{
                  width: 200,
                  height: 20,
                  marginRight: 60,
                  marginLeft: 20,
                }}
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
          ),

          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favourite Posts"
        component={FavScreen}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon2 name="hearto" size={size} color={color} />;
          },
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="PostCreation"
        component={PostCreation}
        initialParams={{Categories: Categories}}
        options={{
          headerTitle: 'Create Post',
          headerTitleStyle: {
            color: '#000000',
            fontSize: 20,
            fontFamily: 'Rubik-Bold',
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(CommonActions.goBack());
              }}
              style={{marginLeft: 16}}>
              <Icon2 name="arrowleft" size={25} color="#000000" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({color, size}) => {
            return <Icon2 name="plussquareo" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon2 name="message1" size={size} color={color} />;
          },
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={({navigation}) => ({
          tabBarIcon: ({color, size}) => (
            <Icon name="account-circle-outline" size={size} color={color} />
          ),
          headerTitle: 'User Profile',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Icon.Button
              name="arrow-left"
              size={25}
              color="#000"
              backgroundColor="transparent"
              onPress={() => navigation.navigate('Home')}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
