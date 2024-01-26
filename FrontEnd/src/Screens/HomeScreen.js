// HomeScreen.js
import React, {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../constants/theme';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = query => setSearchQuery(query);

  const handleFilterPress = () => {
    // Implement your filter logic here
    console.log('Filter icon pressed');
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  searchBar: {
    width: '83%',
  },
  filterIconContainer: {
    width: '15%', // Adjust as needed
    justifyContent: 'center', // Vertically center the icon
    alignItems: 'center', // Horizontally center the icon
    overflow: 'hidden',
    borderRadius: 14,
    padding: 12,
    borderColor: COLORS.blue,
    backgroundColor: COLORS.lightGrey,
  },
});

export default HomeScreen;
