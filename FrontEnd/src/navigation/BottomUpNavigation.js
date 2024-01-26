import * as React from 'react';
import {BottomNavigation, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons library
import HomeScreen from '../Screens/HomeScreen';
import Profile from '../Screens/Profile';

const SearchRoute = () => (
  <Text style={{color: 'black', marginTop: 50}}>Search Content</Text>
);

const PlusRoute = () => (
  <Text style={{color: 'black', marginTop: 50}}>Plus Content</Text>
);

const ChatRoute = () => (
  <Text style={{color: 'black', marginTop: 50}}>Chat Content</Text>
);

const ProfileRoute = () => (
  <Text style={{color: 'black', marginTop: 50}}>Profile Content</Text>
);

const BottomUpNavigation = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'home',
      //   title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home',
    },
    {
      key: 'search',
      //   title: 'Search',
      focusedIcon: 'magnify',
      unfocusedIcon: 'magnify',
    },
    {
      key: 'plus',
      //   title: 'Add',
      focusedIcon: 'plus',
      unfocusedIcon: 'plus',
    },
    {
      key: 'chat',
      //   title: 'Chat',
      focusedIcon: 'message',
      unfocusedIcon: 'message',
    },
    {
      key: 'profile',
      //   title: 'Profile',
      focusedIcon: 'account',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    search: SearchRoute,
    plus: PlusRoute,
    chat: ChatRoute,
    profile: Profile,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{
        backgroundColor: 'white',
        marginTop: 5,
        padding: 5,
        fontSize: 32,
      }}
      activeColor="black"
      inactiveColor="gray"
    />
  );
};

export default BottomUpNavigation;
