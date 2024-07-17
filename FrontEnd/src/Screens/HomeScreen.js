import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchAllPosts } from '../store/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PostItem from './PostItem';
import {
  Tabs,
  TabScreen,
  TabsProvider,
} from 'react-native-paper-tabs';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundPosts, setFoundPosts] = useState([]);
  const [lostPosts, setLostPosts] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const posts = useSelector(state => state.items);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchAllPosts());
    }, [dispatch])
  );

  useEffect(() => {
    if (posts && posts.length) {
      setFoundPosts([...posts.filter(item => item.type === 'Found')]);
      setLostPosts([...posts.filter(item => item.type === 'Lost' || item.type === 'lost')]);
    }
  }, [posts]);

  const handleSearch = query => setSearchQuery(query);

  const renderPostRow = ({ item }) => {
    return (
      <PostItem
        item={item}
        onPress={() => navigation.navigate('DetailsPage', { itemId: item._id })}
        isFound={item.type === 'Found'}
      />
    );
  };

  const handleFilterPress = () => {
    navigation.navigate('Filters');
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
          <Icon name={'filter-sharp'} size={30} color={'#000'} />
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
          theme={{ colors: { primary: 'blue' } }}>
          <TabScreen label="All">
            <View style={styles.tabContent}>
              <FlatList
                renderItem={renderPostRow}
                data={posts ? [...posts].reverse() : []}
                keyExtractor={item => (item._id ? item._id.toString() : Math.random().toString())}
              />
            </View>
          </TabScreen>
          <TabScreen label="Lost">
            <View style={styles.tabContent}>
              <FlatList
                renderItem={renderPostRow}
                data={lostPosts}
                keyExtractor={item => (item._id ? item._id.toString() : Math.random().toString())}
              />
            </View>
          </TabScreen>
          <TabScreen label="Found">
            <View style={styles.tabContent}>
              <FlatList
                renderItem={renderPostRow}
                data={foundPosts}
                keyExtractor={item => (item._id ? item._id.toString() : Math.random().toString())}
              />
            </View>
          </TabScreen>
          <TabScreen label="NearBy">
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
    backgroundColor: '#fff',
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
    borderColor: '#000',
    backgroundColor: '#e0e0e0',
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
});

export default HomeScreen;
