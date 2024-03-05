import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Tabs, TabScreen, TabsProvider} from 'react-native-paper-tabs';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {COLORS, IP} from '../constants/theme';

const PostThumbnail = ({post, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailsPage', {itemId: post._id})}>
      <Image
        source={{
          uri: `http://${IP}:8000/Images/uploads/${post.images[0]}`,
        }}
        style={styles.postThumbnail}
      />
    </TouchableOpacity>
  );
};

const Profile = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [foundPosts, setFoundPosts] = useState([]);
  const [numColumns, setNumColumns] = useState(3);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${IP}:8000/users/getUserData`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const id = response.data.data.id;

      setUserData(response.data.data);

      // Call the function to get posts for the user
      getPostsByUserId(id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      // This function will be called every time the screen comes into focus
      getData();
    }, []),
  );

  useEffect(() => {
    // This effect will run when userData is updated
    // You can perform any additional actions here
    // For example, re-fetch posts when userData changes
    if (userData) {
      getPostsByUserId(userData.id);
    }
  }, [userData]);

  // Function to get posts for a specific user by userId
  const getPostsByUserId = async userId => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `http://${IP}:8000/posts/getPostsByUserId/${userId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      setFoundPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const renderPostThumbnail = ({item}) => <PostThumbnail post={item} />;

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
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                navigation.navigate('EditProfile', {userData: userData});
              }}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Tab navigation */}
            <TabsProvider>
              <Tabs style={{width: 350, marginTop: 2}}>
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
                      key={`posts-${foundPosts.length}-${numColumns}`}
                      renderItem={({item}) => (
                        <PostThumbnail post={item} navigation={navigation} />
                      )}
                      data={foundPosts}
                      keyExtractor={item => item._id.toString()}
                      numColumns={3}
                      contentContainerStyle={styles.postList}
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
  postContainer: {
    width: '58%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 5,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postList: {
    marginVertical: 20,
  },
  postThumbnail: {
    width: '50%',
    aspectRatio: 1, // Square aspect ratio
    borderRadius: 10,
    overflow: 'hidden',
    margin: 5,
    height: 200,
  },
});

export default Profile;
