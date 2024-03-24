import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

const Listings = ({listings, category}) => {
  useEffect(() => {
    console.log('Reload Listing');
  }, [category]);
  return (
    <View>
      <Text> textInComponent </Text>
    </View>
  );
};

export default Listings;
