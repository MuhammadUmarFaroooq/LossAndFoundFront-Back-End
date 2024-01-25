import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

export default function SuperscriptText({children}) {
  return <Text style={styles.superscript}>{children}</Text>;
}

const styles = StyleSheet.create({
  // ... (previous styles)

  superscript: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 2,
    color: 'red', // You can adjust the color as needed
  },
});
