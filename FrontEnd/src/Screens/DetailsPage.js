import React, { useLayoutEffect, useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPostId } from '../store/actions';
import { API } from '../constants/theme';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 280;

const DetailsPage = ({ route }) => {
  const { itemId } = route.params;
  const navigation = useNavigation();
  const [postDetail, setPostDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaimed, setIsClaimed] = useState(false);
  const dispatch = useDispatch();

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
    setIsClaimed((prevIsClaimed) => !prevIsClaimed);
    console.log('hanan ', itemId);
    dispatch(setPostId(itemId));
    navigation.navigate('Chat', { userId: postDetail.user._id });
  };

  const datelost = new Date(postDetail.dateOfItem);
  const dateloststring = datelost.toLocaleDateString();
  const timeloststring = datelost.toLocaleTimeString();

  const PostedDate = new Date(postDetail.datePosted);
  const dateString = PostedDate.toLocaleDateString();
  const timeString = PostedDate.toLocaleTimeString();

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
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
          <View style={{ flexDirection: 'column', gap: 4 }}>
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
            <View style={{ flexDirection: 'row' }}>
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
                <Text style={{ paddingLeft: 10 }}>
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
              { backgroundColor: isClaimed ? 'blue' : '#4CAF50' },
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
    fontFamily: 'Arial',
    color: '#000',
  },
  location: {
    fontSize: 20,
    marginVertical: 4,
    color: '#888',
  },
  rooms: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    marginVertical: 24,
    height: 1,
    backgroundColor: '#eee',
  },
  hostView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  host: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerPrice: {
    fontSize: 20,
    color: '#000',
  },
  reserveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  reserveButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    height: '100%',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
});

export default DetailsPage;
