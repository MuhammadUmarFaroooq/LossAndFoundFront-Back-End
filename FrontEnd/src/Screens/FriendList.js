import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../constants/theme';
const FriendList = ({ navigation }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = loginUserID; // Replace with the actual user ID
        const response = await axios.get(`${API}/friends/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const renderFriend = ({ item }) => (
    <TouchableOpacity
      style={styles.friendContainer}
      onPress={() => navigation.navigate('Chat', { userId: item._id })}
    >
      <Text style={styles.friendName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.friendsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  friendsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  friendContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendName: {
    fontSize: 16,
  },
});

export default FriendList;
