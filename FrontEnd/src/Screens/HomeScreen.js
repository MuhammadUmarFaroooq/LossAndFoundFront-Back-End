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
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS, IP} from '../constants/theme';
import {Link} from 'react-router-native';
import listingsData from '../assets/data/airbnb-listings.json';
import {useNavigation} from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SahreIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const categories = [
  {name: 'All', message: 'All Posts'},
  {name: 'Lost', message: 'Lost Posts'},
  {name: 'Found', message: 'Found Posts'},
  {name: 'NearBy', message: 'Nearby Posts'},
];

const HomeScreen = () => {
  const scrollViewRef = useRef(null);
  const listRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [posts, setPosts] = useState([]);
  const [selectedCategoryMessage, setSelectedCategoryMessage] =
    useState('All Posts');
  const [foundPosts, setFoundPosts] = useState([]);
  const items = useMemo(() => listingsData, []);

  useEffect(() => {
    // Set "All" posts by default
    setPosts(listingsData);
  }, []);

  const handleSearch = query => setSearchQuery(query);

  const handleCategoryPress = async index => {
    let categoryMessage = '';

    switch (categories[index].name) {
      case 'All':
        categoryMessage = 'All Posts';
        setPosts(listingsData);
        break;
      case 'Lost':
        categoryMessage = 'Lost Posts';
        setPosts(listingsData.filter(item => item.category === 'Lost'));
        break;
      case 'Found':
        categoryMessage = 'Found Posts';
        await getPostData();
        break;
      case 'NearBy':
        categoryMessage = 'Nearby Posts';
        setPosts(listingsData.filter(item => item.category === 'NearBy'));
        break;
      default:
        break;
    }

    console.log(`Showing ${categoryMessage}`);

    scrollViewRef.current.scrollTo({
      x: index * 50,
      y: 0,
      animated: true,
    });

    setSelectedCategoryMessage(categoryMessage);
    setActiveIndex(index);
  };

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

  const renderFoundPostRow = ({item}) => {
    const formattedDate = new Date(item.dateOfItem);
    const dateString = formattedDate.toLocaleDateString();
    const timeString = formattedDate.toLocaleTimeString();
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Listings', {itemId: item.id})}>
        <View style={styles.listing}>
          <Image
            source={{
              uri: `http://${IP}:8000/Images/uploads/${item.images[0]}`,
            }}
            style={styles.image}
          />
          <TouchableOpacity style={{position: 'absolute', right: 30, top: 30}}>
            <EvilIcons name={'heart'} size={30} color="#000" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16, fontFamily: 'Poppins-Bold'}}>
              {item.name}
            </Text>

            <View style={{flexDirection: 'row', gap: 4}}>
              <TouchableOpacity>
                <EvilIcons name={'comment'} size={26} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity>
                <SahreIcon name={'share'} size={26} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{fontFamily: 'Poppins-Bold'}}>{item.type}</Text>
          <View style={{flexDirection: 'row', gap: 4}}>
            <Text style={{fontFamily: 'Poppins-Light'}}>{item.location}</Text>
            <Text style={{fontFamily: 'Poppins-Light'}}>{dateString}</Text>
            <Text style={{fontFamily: 'Poppins-Light'}}>{timeString}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleFilterPress = () => {
    console.log('Filter icon pressed');
  };

  const navigation = useNavigation();

  const renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Listings', {itemId: item.id})}>
        <View style={styles.listing}>
          <Image source={{uri: item.medium_url}} style={styles.image} />
          <TouchableOpacity style={{position: 'absolute', right: 30, top: 30}}>
            <EvilIcons name={'heart'} size={30} color="#000" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16, fontFamily: 'Poppins-Bold'}}>
              {item.name}
            </Text>

            <View style={{flexDirection: 'row', gap: 4}}>
              <TouchableOpacity>
                <EvilIcons name={'comment'} size={26} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity>
                <SahreIcon name={'share'} size={26} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{fontFamily: 'Poppins-Bold'}}>{item.room_type}</Text>
          <View style={{flexDirection: 'row', gap: 4}}>
            <Text style={{fontFamily: 'Poppins-Light'}}>
              {item.smart_location}
            </Text>
            <Text style={{fontFamily: 'Poppins-Light'}}>
              {item.first_review}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          gap: 20,
          paddingHorizontal: 16,
          paddingBottom: 5,
          paddingTop: 7,
        }}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={
              activeIndex === index
                ? styles.activeCategoryBtn
                : styles.inactiveCategoryBtn
            }
            onPress={() => handleCategoryPress(index)}>
            <Text
              style={
                activeIndex === index
                  ? styles.categoryTextActive
                  : styles.categoryText
              }>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedCategoryMessage === 'All Posts' && (
        <FlatList
          renderItem={renderRow}
          data={posts}
          keyExtractor={item => item.id.toString()}
          ref={flatListRef => {
            listRef.current = flatListRef;
          }}
        />
      )}

      {selectedCategoryMessage === 'Found Posts' && (
        <FlatList
          renderItem={renderFoundPostRow}
          data={foundPosts}
          keyExtractor={item => item._id.toString()}
          ref={flatListRef => {
            listRef.current = flatListRef;
          }}
        />
      )}
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
