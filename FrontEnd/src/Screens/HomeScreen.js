import React, {useState, useRef, useMemo, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  FlatList,
  Image,
} from 'react-native';
import PostItem from './PostItem';
import {Searchbar} from 'react-native-paper';
import useLikeStore from '../Zustand_store/LikeStore';
import Icon from 'react-native-vector-icons/Ionicons';
import {API, COLORS, IP} from '../constants/theme';
import {Link} from 'react-router-native';
import listingsData from '../assets/data/airbnb-listings.json';
import {useNavigation} from '@react-navigation/native';
import {
  Tabs,
  TabScreen,
  TabsProvider,
  useTabIndex,
  useTabNavigation,
} from 'react-native-paper-tabs';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SahreIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const categories = [
  {name: 'All', message: 'All Posts'},
  {name: 'Lost', message: 'Lost Posts'},
  {name: 'Found', message: 'Found Posts'},
  {name: 'NearBy', message: 'Nearby Posts'},
];

const HomeScreen = ({route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [foundPosts, setFoundPosts] = useState([]);
  const items = useMemo(() => listingsData, []);
  const {likedImages, addLikedImage, removeLikedImage} = useLikeStore(); // Use the Zustand store

  useEffect(() => {
    getPostData();
  }, [route.params?.refreshPosts]);

  const handleSearch = query => setSearchQuery(query);

  const getPostData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API}/posts/getAllPosts`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setFoundPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API}/posts/getAllPosts`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setFoundPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const renderFoundPostRow = ({item}) => {
    return (
      <PostItem
        item={item}
        onPress={() => navigation.navigate('DetailsPage', {itemId: item._id})}
        isFound={true}
      />
    );
  };

  const handleFilterPress = () => {
    console.log('Filter icon pressed');
  };

  const navigation = useNavigation();

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />

        <TouchableOpacity
          onPress={handleFilterPress}
          style={styles.filterIconContainer}>
          <Icon name={'filter-sharp'} size={30} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <TabsProvider>
        <Tabs
          style={{
            width: 400,
            marginTop: 2,
            backgroundColor: '#fff',
            paddingLeft: 15,
          }}
          mode="scrollable"
          showLeadingSpace={false}
          disableSwipe={false}
          theme={{colors: {primary: 'blue'}}}>
          <TabScreen label="All">
            {/* Component for Found items */}
            <View style={styles.tabContent}>
              <FlatList
                renderItem={renderFoundPostRow}
                data={foundPosts}
                keyExtractor={item => item._id.toString()}
              />
            </View>
          </TabScreen>
          <TabScreen label="Lost">
            {/* Component for Lost items */}
            <View style={styles.tabContent}>
              {/* <FlatList
          renderItem={renderLostPostRow}
          data={posts}
          keyExtractor={(item) => item.id.toString()}
        /> */}
            </View>
          </TabScreen>
          <TabScreen label="Found">
            {/* Component for Found items */}
            <View style={styles.tabContent}>
              <FlatList
                renderItem={renderFoundPostRow}
                data={foundPosts}
                keyExtractor={item => item._id.toString()}
              />
            </View>
          </TabScreen>

          <TabScreen label="NearBy">
            {/* Component for Nearby items */}
            <View style={styles.tabContent}>
              <Text>Nearby items content goes here</Text>
            </View>
          </TabScreen>
        </Tabs>
      </TabsProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  searchBar: {
    width: '83%',
  },
  filterIconContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 14,
    padding: 12,
    borderColor: COLORS.blue,
    backgroundColor: COLORS.lightGrey,
  },
  categoryText: {
    fontSize: 20,
    fontFamily: 'Poppins-Light',
    color: '#37474F',
    textAlign: 'center',
  },
  categoryTextActive: {
    fontSize: 20,
    fontFamily: 'Poppins-Light',
    color: COLORS.white,
    textAlign: 'center',
  },
  inactiveCategoryBtn: {
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#F0F1F2',
    paddingVertical: 4,
    paddingHorizontal: 28,
  },
  activeCategoryBtn: {
    borderRadius: 10,
    backgroundColor: COLORS.blue,
    color: COLORS.white,
    borderWidth: 2,
    paddingVertical: 4,
    paddingHorizontal: 28,
  },
  categoryMessage: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: COLORS.blue,
    textAlign: 'center',
    paddingVertical: 10,
  },
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  info: {
    textAlign: 'center',
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginTop: 4,
  },
});

export default HomeScreen;
