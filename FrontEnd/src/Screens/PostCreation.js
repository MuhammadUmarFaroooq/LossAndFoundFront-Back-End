import React, {useState, useLayoutEffect} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Categories} from '../constants/AppDetail';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constants/theme';

const getIconComponent = iconType => {
  switch (iconType) {
    case 1004:
      return FontAwesomeIcon;
    case 1003:
      return FontAwesomeIcon6;
    case 1005:
      return SimpleLineIcon;
    case 1006:
      return MaterialIcon;
    case 1001:
      return AntDesignIcon;
    case 1002:
      return MaterialCommunityIcon;
    default:
      return FontAwesomeIcon;
  }
};

export default function PostCreation() {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const navigation = useNavigation(); // Add this line

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // Set headerLeft to null to remove the back button
    });
  }, [navigation]);

  const toggleCategory = categoryName => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(
        expandedCategories.filter(cat => cat !== categoryName),
      );
    } else {
      setExpandedCategories([expandedCategories, categoryName]);
    }
  };

  const renderItem = ({item}) => {
    const IconComponent = getIconComponent(item.class);

    return (
      <View style={{marginBottom: 20}}>
        <TouchableOpacity onPress={() => toggleCategory(item.name)}>
          <View
            style={[styles.categoryContainer, {backgroundColor: '#FFFFFF'}]}>
            <View style={styles.iconcss}>
              <IconComponent
                name={item.icon}
                size={24}
                color={COLORS.blue}
                style={{marginLeft: 12}}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginLeft: 12,
                }}>
                {item.name}
              </Text>
            </View>
            <Text style={{color: '#000000'}}>
              {expandedCategories.includes(item.name) ? ' ▲' : ' ▼'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {expandedCategories.includes(item.name) && (
          <FlatList
            data={item.subcategories}
            keyExtractor={subcategory => subcategory}
            renderItem={({item: subcategory}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Post Details', {
                    subcategoryName: subcategory,
                  })
                }>
                <View style={styles.bulletPointContainer}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text
                    style={{
                      marginLeft: 10,
                      padding: 5,
                      color: '#000000',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {subcategory}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{padding: 20, backgroundColor: '#FFFFFF', flex: 1}}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 10,
          color: '#000000',
        }}>
        CHOOSE A CATEGORY
      </Text>
      <FlatList
        data={Categories}
        keyExtractor={category => category.name}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  iconcss: {
    flexDirection: 'row',
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    fontSize: 15,
    color: '#000000',
  },
});
