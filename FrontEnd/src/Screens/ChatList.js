import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { API } from '../constants/theme'; // Ensure API endpoint is correctly imported

const ChatList = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userId = 'YOUR_USER_ID'; // Replace with the actual user ID
        const response = await axios.get(`${API}/friends/first-time-chats/${userId}`);
        if (response.status === 200) {
          setChats(response.data);
          setLoading(false);
        } else {
          console.error('Failed to fetch chats:', response.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const navigateToChat = (friendId) => {
    // Navigate to the Chat screen with params
    navigation.navigate('Chat', { friendId });
  };

  const renderChat = ({ item }) => (
    <TouchableOpacity style={styles.chatContainer} onPress={() => navigateToChat(item._id)}>
      <Text style={styles.friendName}>{item.name}</Text> {/* Adjust based on user schema */}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.chatsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatsContainer: {
    paddingBottom: 12,
  },
  chatContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendName: {
    fontSize: 18,
  },
});

export default ChatList;
