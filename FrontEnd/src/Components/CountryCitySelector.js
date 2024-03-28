import React, { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {City} from 'country-state-city';
import { COLORS } from '../constants/theme';



const CountryCitySelector = ({States,updatedCity}) => {
    
    const citiesOfSelectedState = States
    ? City.getCitiesOfState(States.countryCode, States.isoCode).map((city) => ({
        name: city.name,
      }))
    : [];
  const [searchcity, setsearchcity] = useState('');

  
  const filteredCountries = citiesOfSelectedState.filter((country) =>
    country.name.toLowerCase().includes(searchcity.toLowerCase())
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
            updatedCity(selectedItem)

          // Handle country selection logic here
        }}
        renderButton={(selectedItem, isOpened) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem.name) || 'Select city'}
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
        searchInputStyle={styles.searchInputStyle}
        searchInputTxtColor="#151E26"
        searchInputTxtStyle={styles.searchInputTxtStyle}
        searchPlaceHolder="Search city"
        searchPlaceHolderColor="#6E798C"
        onFocus={() => setsearchcity('')}
        onChangeSearchInputText={setsearchcity}
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
    paddingTop:30
  
    
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

export default CountryCitySelector;
