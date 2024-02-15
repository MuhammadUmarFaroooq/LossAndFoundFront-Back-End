import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {IP} from '../constants/theme';
import {fromByteArray} from 'base64-js'; // Import from base64-js

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null); // State for avatar

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(`http://${IP}:8000/users/getUserData`, {
        token,
      });
      console.log(response.data.data);

      setUserData(response.data.data);

      if (response.data.data.avatar) {
        // Convert Buffer-like data to base64-encoded string
        const avatarUrl = `data:image/jpeg;base64,${fromByteArray(
          response.data.data.avatar.data,
        )}`;
        setAvatarSource(avatarUrl);
        console.log(response.data.data.avatar.data);
        console.log(avatarSource);
      } else {
        console.warn('Avatar data not found in response');
      }
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
            {/* Display Image */}

            <Image
              source={avatarSource || require('../assets/appicons/icon.png')}
              style={styles.avatar}
              accessibilityLabel="Profile Image"
            />

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '80%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default Profile;
