import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';

const CustomDropdown = ({ items, onSelect }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const handleSearch = text => {
    setSearchText(text);
    const filtered = items.filter(item =>
      item.label.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelect(item)}>
      <Text style={{ padding: 10 }}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        placeholder="Search"
        value={searchText}
        onChangeText={handleSearch}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.value.toString()}
      />
    </View>
  );
};

export default CustomDropdown;
