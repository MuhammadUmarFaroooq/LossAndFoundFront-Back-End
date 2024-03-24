import React from 'react';
import {View, Text} from 'react-native';
import {COLORS} from '../constants/theme';

const AppSlogan = ({lost, find, togther}) => {
  return (
    <View style={{padding: 15}}>
      <Text
        style={{
          fontFamily: 'Poppins-ExtraBoldItalic',
          fontSize: 50,
          color: COLORS.blue,
        }}>
        {lost}
      </Text>

      <Text
        style={{
          fontFamily: 'Poppins-ExtraBold',
          fontSize: 50,

          color: COLORS.statusColor,
        }}>
        {find}
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins-ExtraBold',
          fontSize: 50,
          color: COLORS.title,
        }}>
        {togther}
      </Text>
    </View>
  );
};

export default AppSlogan;
