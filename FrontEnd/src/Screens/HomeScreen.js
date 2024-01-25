import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'http://172.26.3.23:8000/users/getUserData',
        {token},
      );
      setUserData(response.data.data);
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Poppins - BoldItalic',
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    elevation: 4,
    marginVertical: 16,
  },
});

export default HomeScreen;
