import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {Country} from 'country-state-city';
import { COLORS } from '../constants/theme';

const countries = Country.getAllCountries().map((country) => ({
  id: country.isoCode,
  name: country.name,
}));

const CountrySelectorModal = ({state}) => {
  const [searchCountry, setSearchCountry] = useState('');

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchCountry.toLowerCase())
  );


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust as needed
    >
      <SelectDropdown
        data={filteredCountries}
        onSelect={(selectedItem, index) => {
          state(selectedItem)
          // Handle country selection logic here
        }}
        renderButton={(selectedItem, isOpened) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem.name) || 'Select Country'}
            </Text>
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
            <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
        search
        statusBarTranslucent
       
        searchInputStyle={styles.searchInputStyle}
        searchInputTxtColor="#151E26"
        searchInputTxtStyle={styles.searchInputTxtStyle}
        searchPlaceHolder="Search Country"
        searchPlaceHolderColor="#6E798C"
        onFocus={() => setSearchCountry('')}
        onChangeSearchInputText={setSearchCountry}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    paddingTop: 50,
    
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  searchInputStyle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D2D9DF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#151E26',
    elevation: 1, // Add elevation for Android to improve the appearance
  },
  searchInputTxtStyle: {
    fontSize: 16,
    color: '#151E26',
  },
});

export default CountrySelectorModal;
