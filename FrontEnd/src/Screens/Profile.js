import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {IP} from '../constants/theme';

const Profile = ({navigation}) => {
  const [userData, setUserData] = useState(null);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${IP}:8000/users/getUserData`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log('User data:', response.data);

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
      {userData && (
        <View style={styles.profileContainer}>
          {/* Image section */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `http://${IP}:8000/Images/uploads/${userData.avatar}`,
              }}
              style={styles.avatar}
              accessibilityLabel="Profile Image"
            />
          </View>

          {/* Detail section */}
          <View style={styles.detailContainer}>
            <Title style={styles.fullName}>{userData.fullName}</Title>
            <Paragraph style={styles.detailText}>
              Email: {userData.email}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              Phone Number: {userData.phone}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              Country: {userData.country}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              State: {userData.province}
            </Paragraph>
            <Paragraph style={styles.detailText}>
              City: {userData.city}
            </Paragraph>
          </View>

          {/* Edit profile button */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Post section */}
          {/* Add your post section here */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 150, // Adjust the width based on your preference
    height: 150, // Adjust the height based on your preference
    borderRadius: 75, // Half of the width and height for a circular image
  },
  detailContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;
