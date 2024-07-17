// RecommendationsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const RecommendationsScreen = () => {
  const recommendations = useSelector(state => state.recommendations);

  return (
    <View>
      <Text style={styles.heading}>Recommended for you</Text>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
        )}
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  item: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 8,
  },
});

export default RecommendationsScreen;
