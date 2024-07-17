import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const Chat = () => {
  const userId = useSelector((state) => state.userId);
  const postId = useSelector((state) => state.postId);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState(null);

  const fetchChatHistory = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(
        `${API}/chat/chat_history/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessages(response.data.messages);
      } else {
        console.error('Error fetching chat history:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    fetchChatHistory();

    const setupSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const newSocket = io(`${API}`, { query: { token } });
        setSocket(newSocket);
      }
    };

    setupSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to socket server');
      });

      socket.on('message_received', newMessage => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        Toast.show({
          type: 'success',
          text1: 'New Message',
          text2: newMessage.message,
          position: 'bottom'
        });
      });
    }
  }, [socket]);

  const sendMessage = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('SendMessage Token:', token);
    console.log('Message Text:', messageText);

    if (socket && messageText.trim() !== '') {
      try {
        const response = await axios.post(
          `${API}/chat/send_message`,
          {
            receiverId: postId,
            message: messageText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const { senderId, receiverId, message } = response.data;
          console.log('hi');
          socket.emit('send_message', { senderId, receiverId, message });

          const newMessage = { _id: Math.random().toString(), senderId, message };
          setMessages(prevMessages => [...prevMessages, newMessage]);

          setMessageText('');

          Toast.show({
            type: 'success',
            text1: 'Message Sent',
            text2: newMessage.message,
            position: 'bottom'
          });
        } else {
          console.error('Error sending message:', response.data.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.senderId === userId ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageText}>{item.message}</Text>
      <TouchableOpacity onPress={() => deleteMessage(item._id)} style={styles.deleteButton}>
        <Icon name="delete" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const deleteMessage = async (messageId) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.delete(
        `${API}/chat/delete_message/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessages(messages.filter(message => message._id !== messageId));
      } else {
        console.error('Error deleting message:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={text => setMessageText(text)}
          placeholder="Type your message..."
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  sentMessage: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#EEEEEE',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;
