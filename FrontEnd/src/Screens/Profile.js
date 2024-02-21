import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity ,FlatList} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Tabs, TabScreen, TabsProvider, useTabIndex, useTabNavigation } from 'react-native-paper-tabs';
import { COLORS, IP } from '../constants/theme';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SahreIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { backgroundColors } from '../constants/AppDetail';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [foundPosts, setFoundPosts] = useState([]);
  console.log(foundPosts);
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
    getPostData()
  }, []);
  const getPostData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${IP}:8000/posts/getAllPosts`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setFoundPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const renderFoundPostRow = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Listings', { itemId: item.id })}
    >
      <View style={styles.listing}>
        {/* Render the image */}
        <Image
            source={{
              uri: `http://${IP}:8000/Images/uploads/${item.images[0]}`,
            }} style={styles.image} />


        {/* Render the item details */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold' }}>
            {item.name}
          </Text>
          

          </View>
        </View>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.profileContainer}>
          <View>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: `http://${IP}:8000/Images/uploads/${userData.avatar}`,
                }}
                style={styles.avatar}
                accessibilityLabel="Profile Image"
              />
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.fullName}>{userData.fullName}</Text>
              <View style={styles.cityCountryContainer}>
                <Text style={styles.cityCountry}>
                  {userData.city}, {userData.country}
                </Text>
              </View>
            </View>

            {/* Lost, Found, and Claimed items view */}
            <View style={styles.statsContainer}>
              <View style={styles.statsItem}>
                <Text style={styles.statsNumber}>{1}</Text>
                <Text style={styles.statsLabel}>Lost</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsNumber}>{0}</Text>
                <Text style={styles.statsLabel}>Found</Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsNumber}>{1}</Text>
                <Text style={styles.statsLabel}>Claimed</Text>
              </View>
            </View>

            {/* Edit profile button */}
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Tab navigation */}
            <TabsProvider>

            <Tabs style={{ width:350,marginTop:2 }}>
              <TabScreen label="Lost">
                {/* Component for Lost items */}
                <View style={styles.tabContent}>
                  <Text>Lost items content goes here</Text>
                </View>
              </TabScreen>
              <TabScreen label="Found">
                {/* Component for Found items */}
                <View style={styles.container}>
      {/* Other profile content */}

      {/* FlatList for Found posts */}
      <FlatList
        renderItem={renderFoundPostRow}
        data={foundPosts}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
      />
    </View>
              </TabScreen>
              <TabScreen label="Claimed">
                {/* Component for Claimed items */}
                <View style={styles.tabContent}>
                  <Text>Claimed items content goes here</Text>
                </View>
              </TabScreen>
            </Tabs>
            </TabsProvider>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 119,
    height: 117,
    borderRadius: 30,
    overflow: 'hidden',
  },
  detailContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fullName: {
    fontSize: 25,
    color: '#000',
    marginBottom: 10,
  },
  cityCountryContainer: {
    flexDirection: 'row',
  },
  cityCountry: {
    fontSize: 17,
    color: '#666666',
  },
  editButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  statsItem: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  statsLabel: {
    fontSize: 16,
    color: COLORS.blue,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    height: 50, // Adjust the height of the tab navigation
    width: '100%', // Optional: Adjust the width of the tab navigation
    backgroundColors:COLORS.blue
  },
});

export default Profile;
