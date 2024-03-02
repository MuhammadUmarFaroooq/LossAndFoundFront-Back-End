// PostItem.js

import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SahreIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import useLikeStore from '../Zustand_store/LikeStore';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {IP} from '../constants/theme';

const PostItem = ({item, onPress, isFound}) => {
  const navigation = useNavigation();
  const isLiked = useLikeStore(state => state.likedImages.includes(item));

  const formattedDate = new Date(item.dateOfItem);
  const dateString = formattedDate.toLocaleDateString();
  const timeString = formattedDate.toLocaleTimeString();

  return (
    <TouchableOpacity onPress={() => onPress(item._id)}>
      <View style={styles.listing}>
        <Image
          source={{uri: `http://${IP}:8000/Images/uploads/${item.images[0]}`}}
          style={styles.image}
        />
        <TouchableOpacity
          style={{position: 'absolute', right: 30, top: 30}}
          onPress={() => {
            if (isLiked) {
              useLikeStore.getState().removeLikedImage(item);
            } else {
              useLikeStore.getState().addLikedImage(item);
            }
          }}>
          <AntDesign
            name={isLiked ? 'heart' : 'hearto'}
            size={30}
            color={isLiked ? 'red' : '#000'}
          />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 16, fontFamily: 'Poppins-Bold'}}>
            {item.name}
          </Text>
          <View style={{flexDirection: 'row', gap: 4}}>
            <TouchableOpacity>
              <EvilIcons name={'comment'} size={26} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <SahreIcon name={'share'} size={26} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{fontFamily: 'Poppins-Bold'}}>
          {isFound ? item.type : item.room_type}
        </Text>
        <View style={{flexDirection: 'row', gap: 4}}>
          <Text style={{fontFamily: 'Poppins-Light'}}>
            {isFound ? item.location : item.smart_location}
          </Text>
          <Text style={{fontFamily: 'Poppins-Light'}}>{dateString}</Text>
          <Text style={{fontFamily: 'Poppins-Light'}}>{timeString}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    gap: 10,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
});

export default PostItem;
