import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, LogBox} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {IP} from '../constants/theme';
import {TextEncoder, TextDecoder} from 'text-encoding';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null); // State for avatar

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`http://${IP}:8000/users/getUserData`, {
        token,
      });

      setUserData(response.data.data);

      // if (response.data.data.avatar) {
      //   const avatarBuffer = response.data.data.avatar;

      //   const textDecoder = new TextDecoder(); // Create a TextDecoder instance
      //   const avatarUrl = textDecoder.decode(avatarBuffer.data); // Decode Buffer to string

      //   setAvatarSource({uri: avatarUrl});
      // } else {
      //   console.warn('Avatar URL not found in response');
      // }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Home</Text>
      {userData && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>{userData.fullName}</Title>
            <Paragraph>Email: {userData.email}</Paragraph>
            <Paragraph>Phone Number: {userData.phone}</Paragraph>
            <Paragraph>Country: {userData.country}</Paragraph>
            <Paragraph>State: {userData.province}</Paragraph>
            <Paragraph>City: {userData.city}</Paragraph>
            {/* Add more fields as needed */}
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default Profile;
