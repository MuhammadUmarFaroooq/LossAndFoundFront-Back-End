import axios from 'axios';
import { API } from '../constants/theme';

// Get friend list
export const getFriends = async (userId) => {
  try {
    const response = await axios.get(`${API}/friends/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching friend list:', error);
    throw error;
  }
};

// Get chat history
export const getChatHistory = async (userId, friendId) => {
  try {
    const response = await axios.get(`${API_URL}/chats/history`, {
      params: { userId, friendId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Send message
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API}/chats/send`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
