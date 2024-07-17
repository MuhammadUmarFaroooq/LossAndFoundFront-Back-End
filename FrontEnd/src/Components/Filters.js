import React, { useState, useLayoutEffect,useEffect } from 'react';
import { View, Button, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { applyFilters } from '../store/actions';
import {API, COLORS, IP} from '../constants/theme';

const categories = [
  { name: 'Mobile', icon: 'mobile1', class: 1001 },
  { name: 'Vehicle', icon: 'car-sports', class: 1002 },
  { name: 'Bikes', icon: 'motorcycle', class: 1003 },
  { name: 'Fashion & Beauty', icon: 'shopping-bag', class: 1004 },
  { name: 'Pets', icon: 'person-dress', class: 1003 },
  { name: 'Wallets', icon: 'wallet', class: 1001 },
  { name: 'Bags', icon: 'shopping-bag', class: 1004 },
  { name: 'Books', icon: 'notebook', class: 1005 },
  { name: 'Documents', icon: 'file-document-edit-outline', class: 1002 },
  { name: 'Child/Person', icon: 'child', class: 1003 },
  { name: 'Electronic Accessories', icon: 'laptop', class: 1001 },
  { name: 'Clothes', icon: 'person-dress', class: 1003 },
  { name: 'Sports & Instruments', icon: 'sports-tennis', class: 1006 },
  { name: 'Other', class: 1007 },
];


const FiltersScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [keyword, setKeyword] = useState('');
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector(state => state.searchResults);
  // console.log(posts);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '🔍   Advance Search',
    });
  }, [navigation]);

  const handleApplyFilters = () => {
    dispatch(applyFilters({
      category: selectedCategory,
      location: selectedLocation,
      date: selectedDate.toISOString(),
      keyword
    }));
    setFiltersVisible(false);
  };

  const categoryOptions = categories.map(category => ({
    label: category.name,
    value: category.name,
  }));

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePickerModal(false);
    setSelectedDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {filtersVisible ? (
        <View>
          <Text style={styles.label}>Category</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedCategory(value)}
            items={categoryOptions}
            style={pickerSelectStyles}
          />
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#aaa"
            value={selectedLocation}
            onChangeText={setSelectedLocation}
          />
          <Text style={styles.label}>Date and Time</Text>
          <TouchableOpacity onPress={() => setShowDatePickerModal(true)}>
            <View style={styles.dateTimePicker}>
              <TextInput
                value={selectedDate.toDateString()}
                style={styles.input}
                editable={false}
              />
              <Icon
                name="calendar"
                size={24}
                color="#007BFF"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          {showDatePickerModal && (
            <DateTimePicker
              testID="datePicker"
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <Text style={styles.label}>Keyword</Text>
          <TextInput
            style={styles.input}
            placeholder="Keyword"
            placeholderTextColor="#aaa"
            value={keyword}
            onChangeText={setKeyword}
          />
          <Button title="Apply Filters" color="#007BFF" onPress={handleApplyFilters} />
        </View>
      ) : (
        <Button title="Show Filters" color="#007BFF" onPress={() => setFiltersVisible(true)} />
      )}

      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#007BFF',
  },
  input: {
    height: 40,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: '#000',
    backgroundColor: '#F0F8FF',
  },
  dateTimePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#F0F8FF',
    borderRadius: 4,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#007BFF',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 4,
    color: '#000',
    backgroundColor: '#F0F8FF',
    paddingRight: 30,
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 4,
    color: '#000',
    backgroundColor: '#F0F8FF',
    paddingRight: 30,
    marginBottom: 16,
  },
});

export default FiltersScreen;
