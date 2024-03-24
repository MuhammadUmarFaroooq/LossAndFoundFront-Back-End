import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Share,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API, IP} from '../constants/theme';

const {width} = Dimensions.get('window');
const IMG_HEIGHT = 280;

const DetailsPage = ({route}) => {
  const {itemId} = route.params;
  console.log(itemId);
  const navigation = useNavigation();
  const [postDetail, setPostDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaimed, setIsClaimed] = useState(false);

  const shareListing = async () => {
    try {
      await Share.share({
        message: postDetail.name,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerBackground: () => <View style={styles.header}></View>,
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={'#000'} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, shareListing]);

  useEffect(() => {
    getPostData();
  }, [itemId]);

  const getPostData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API}/posts/getPostById/${itemId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const user = response.data.post.user;

      if (!user) {
        console.error('User data not available for the post.');
        setIsLoading(false);
        // Handle this case, e.g., set a default user object
        // or skip processing user-related information
        return;
      }

      const userId = user;

      const [postData, userResponse] = await Promise.all([
        response.data.post,
        axios.get(`${API}/users/getUserById/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      ]);

      const postDetailWithUser = {
        ...postData,
        user: {
          fullname: userResponse.data.data.fullName,
          avatar: userResponse.data.data.avatar,
        },
      };

      setPostDetail(postDetailWithUser);
    } catch (error) {
      console.error('Error fetching post data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!postDetail) {
    return (
      <View style={styles.container}>
        <Text>User not found!</Text>
      </View>
    );
  }

  const handleClaimButton = () => {
    // Toggle the isClaimed state
    setIsClaimed(prevIsClaimed => !prevIsClaimed);
  };

  const datelost = new Date(postDetail.dateOfItem);
  const dateloststring = datelost.toLocaleDateString();
  const timeloststring = datelost.toLocaleTimeString();

  const PostedDate = new Date(postDetail.datePosted);
  const dateString = PostedDate.toLocaleDateString();
  const timeString = PostedDate.toLocaleTimeString();

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}}>
        {postDetail.images && postDetail.images.length > 0 && (
          <Image
            source={{
              uri: `${API}/Images/uploads/${postDetail.images[0]}`,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{postDetail.name}</Text>
          <Text style={styles.location}>{postDetail.category}</Text>
          <Text style={styles.rooms}>
            Color: {postDetail.color} · Brand: {postDetail.brand} · Type:{' '}
            {postDetail.type}
          </Text>
          <View style={{flexDirection: 'column', gap: 4}}>
            <Text style={styles.ratings}>
              Location: {postDetail.type} at {postDetail.location}
            </Text>
            <Text style={styles.ratings}>
              {postDetail.type} Time and Date : {dateloststring}{' '}
              {timeloststring}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{
                  uri: `${API}/Images/uploads/${postDetail.user.avatar}`,
                }}
                style={styles.host}
              />
              <View>
                <Text
                  style={{
                    fontWeight: '500',
                    fontSize: 16,
                    paddingLeft: 10,
                    paddingTop: 5,
                  }}>
                  Posted by {postDetail.user.fullname}
                </Text>
                <Text style={{paddingLeft: 10}}>
                  {dateString} {timeString}
                </Text>
              </View>
            </View>
            <View>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={30}
                color={'#000'}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{postDetail.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>{postDetail.category}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.reserveButton,
              {backgroundColor: isClaimed ? 'blue' : '#4CAF50'},
            ]}
            onPress={handleClaimButton}>
            <Text style={styles.reserveButtonText}>
              {isClaimed ? 'Claimed' : 'Claim'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  rooms: {
    fontSize: 16,
    color: '#777',
    marginVertical: 4,
    fontFamily: 'mon',
  },

  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#777',
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#777',
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#777',
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#fff',

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#777',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
  reserveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  reserveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailsPage;
