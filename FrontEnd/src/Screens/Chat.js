import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Tabs, TabScreen, TabsProvider} from 'react-native-paper-tabs';
import {COLORS} from '../constants/theme';
import {useNavigation} from '@react-navigation/native';

const Chat = () => {
  const navigation = useNavigation();

  const handleOpenChat = () => {
    navigation.navigate('ChatScreen'); // Navigate to the ChatScreen component
  };
  const allChats = [
    {
      id: 1,
      name: 'John Doe',
      message: 'Found a lost wallet at the park!',
      read: true,
    },
    {
      id: 2,
      name: 'Talha Tanveer',
      message: 'Lost my keys near the cafe, has anyone seen them?',
      read: false,
    },
    {
      id: 3,
      name: 'Jane Smith',
      message: 'Found a lost puppy near the market, looking for the owner!',
      read: true,
    },
    {
      id: 4,
      name: 'Alice Johnson',
      message:
        'Lost a black umbrella at the bus stop, please let me know if found.',
      read: true,
    },
    {
      id: 5,
      name: 'Bob Williams',
      message:
        'Found a set of headphones in the library, describe them to claim.',
      read: false,
    },
    {
      id: 6,
      name: 'Eva Davis',
      message: 'Lost my glasses at the museum, reward for return!',
      read: false,
    },
    {
      id: 7,
      name: 'Michael Anderson',
      message:
        'Found a lost phone on the train, contact me with details to claim.',
      read: true,
    },
    {
      id: 8,
      name: 'Sophia Clark',
      message:
        'Lost a blue backpack in the park, it has sentimental value, please help!',
      read: false,
    },
    {
      id: 9,
      name: 'Oliver Moore',
      message:
        'Found a wallet near the shopping mall, contact me with ID details.',
      read: true,
    },
    {
      id: 10,
      name: 'Ava Taylor',
      message:
        'Lost my favorite book at the cafe, would really appreciate its return.',
      read: false,
    },
    {
      id: 11,
      name: 'Daniel White',
      message: 'Found a lost bicycle on Main Street, let me know if its yours.',
      read: true,
    },
    {
      id: 12,
      name: 'Emily Harris',
      message:
        'Lost a silver necklace at the beach, sentimental value attached, please help!',
      read: false,
    },
    {
      id: 13,
      name: 'William Martinez',
      message: 'Found a lost skateboard in the park, describe it to claim.',
      read: true,
    },
    {
      id: 14,
      name: 'Lily Johnson',
      message:
        'Lost my wallet in the downtown area, contains important documents.',
      read: false,
    },
    {
      id: 15,
      name: 'James Davis',
      message:
        'Found a lost camera at the movie theater, describe it for return.',
      read: true,
    },
    {
      id: 16,
      name: 'Sophie Wilson',
      message:
        'Lost my favorite hat at the music festival, please contact if found.',
      read: false,
    },
    {
      id: 17,
      name: 'Mason Brown',
      message:
        'Found a lost laptop in the coffee shop, contact with details to claim.',
      read: true,
    },
    {
      id: 18,
      name: 'Grace Taylor',
      message: 'Lost a red umbrella near the bus station, reward for return!',
      read: false,
    },
    {
      id: 19,
      name: 'Elijah Harris',
      message:
        'Found a lost phone on the street, contact me with details to claim.',
      read: true,
    },
    {
      id: 20,
      name: 'Aria Martinez',
      message:
        'Lost my wallet in the park, contains important cards, please help!',
      read: false,
    },
  ];

  const readChats = [
    {
      id: 3,
      name: 'Jane Smith',
      message: 'Read message from Jane Smith',
      read: true,
    },
    {
      id: 4,
      name: 'Alice Johnson',
      message: 'Read message from Alice Johnson',
      read: true,
    },
    {
      id: 6,
      name: 'Eva Davis',
      message: 'Lost my glasses at the museum, reward for return!',
      read: false,
    },
    {
      id: 7,
      name: 'Michael Anderson',
      message:
        'Found a lost phone on the train, contact me with details to claim.',
      read: true,
    },
    {
      id: 8,
      name: 'Sophia Clark',
      message:
        'Lost a blue backpack in the park, it has sentimental value, please help!',
      read: false,
    },
    {
      id: 9,
      name: 'Oliver Moore',
      message:
        'Found a wallet near the shopping mall, contact me with ID details.',
      read: true,
    },
  ];

  const unreadChats = [
    {
      id: 5,
      name: 'Bob Johnson',
      message: 'Unread message from Bob Johnson',
      read: false,
    },
    {
      id: 10,
      name: 'Eva Davis',
      message: 'Unread message from Eva Davis',
      read: false,
    },
    {
      id: 6,
      name: 'Eva Davis',
      message: 'Lost my glasses at the museum, reward for return!',
      read: false,
    },
    {
      id: 7,
      name: 'Michael Anderson',
      message:
        'Found a lost phone on the train, contact me with details to claim.',
      read: true,
    },
    {
      id: 8,
      name: 'Sophia Clark',
      message:
        'Lost a blue backpack in the park, it has sentimental value, please help!',
      read: false,
    },
    {
      id: 9,
      name: 'Oliver Moore',
      message:
        'Found a wallet near the shopping mall, contact me with ID details.',
      read: true,
    },
  ];

  const renderChatItem = ({item}) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image
        source={require('../assets/images.png')}
        style={styles.userImage}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TabsProvider>
      <Tabs
        style={{width: 420, marginTop: 2, paddingLeft: 20, paddingRight: 20}}>
        <TabScreen label="All">
          <View style={styles.tabContent}>
            {/* Search Bar */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search User"
              // Add necessary onChangeText and other props for search functionality
            />
            {/* Chat List */}
            <FlatList
              data={allChats}
              keyExtractor={item => item.id.toString()}
              renderItem={renderChatItem}
            />
          </View>
        </TabScreen>
        <TabScreen label="Read">
          <View style={styles.tabContent}>
            {/* Search Bar */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search User"
              // Add necessary onChangeText and other props for search functionality
            />
            <FlatList
              data={readChats}
              keyExtractor={item => item.id.toString()}
              renderItem={renderChatItem}
            />
            {/* Space at the bottom */}
            <View style={{height: 50}} />
          </View>
        </TabScreen>
        <TabScreen label="Unread">
          <View style={styles.tabContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search User"
              // Add necessary onChangeText and other props for search functionality
            />
            <FlatList
              data={unreadChats}
              keyExtractor={item => item.id.toString()}
              renderItem={renderChatItem}
            />
          </View>
        </TabScreen>
      </Tabs>
      {/* Create Chat Button */}
      <TouchableOpacity
        style={styles.createChatButton}
        onPress={handleOpenChat}>
        {/* You can replace the '+' with your desired icon */}
        <Text style={{fontSize: 24, color: COLORS.white}}>+</Text>
      </TouchableOpacity>
    </TabsProvider>
  );
};

export default Chat;

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.white, // Set the background color to white for each chat item
    borderRadius: 20, // Adjust the border radius as needed
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: 'gray',
  },
  createChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.blue,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
