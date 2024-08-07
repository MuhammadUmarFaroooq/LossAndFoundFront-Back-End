import React from 'react';
import {View, Text, TouchableOpacity, Image, Share} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/Fontisto';
import SahreIcon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLikeStore from '../Zustand_store/LikeStore';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {API} from '../constants/theme';

const PostItem = ({item, onPress, isFound}) => {
  const navigation = useNavigation();
  const isLiked = useLikeStore(state => state.likedImages.includes(item));

  const formattedDate = new Date(item.dateOfItem);
  const dateString = formattedDate.toLocaleDateString();
  const timeString = formattedDate.toLocaleTimeString();

  const sharePost = async () => {
    try {
      const datelost = new Date(item.dateOfItem);
      const dateloststring = datelost.toLocaleDateString();
      const timeloststring = datelost.toLocaleTimeString();

      const PostedDate = new Date(item.datePosted);
      const dateString = PostedDate.toLocaleDateString();
      const timeString = PostedDate.toLocaleTimeString();

      const message = `ItemSync App \nName: ${item.name}\nCategory: ${item.category}\nColor: ${item.color}\nBrand: ${item.brand}\nType: ${item.type}\nLocation: ${item.location}\nDate and Time Lost: ${dateloststring} ${timeloststring}\nPosted by: ${item.user.fullname}\nDate and Time Posted: ${dateString} ${timeString}\nDescription: ${item.description}`;

      await Share.share({
        message: message,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API}/posts/toggleFavorite/${item._id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (isLiked) {
        useLikeStore.getState().removeLikedImage(item);
      } else {
        useLikeStore.getState().addLikedImage(item);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(item._id)}>
      <View style={styles.listing}>
        <Image
          source={{
            uri: `${API}/Images/uploads/${item.images[0]}`,
          }}
          style={styles.image}
        />
        <TouchableOpacity
          style={{position: 'absolute', right: 30, top: 30}}
          onPress={handleToggleFavorite} // Use the separate onPress function
        >
          <AntDesign
            name={isLiked ? 'heart' : 'hearto'}
            size={25}
            color={isLiked ? 'red' : '#000'}
          />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 16, fontFamily: 'Poppins-Bold'}}>
            {item.name}
          </Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity>
              <EvilIcons name={'commenting'} size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={sharePost}>
              <SahreIcon name={'share'} size={22} color="#000" />
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
    flex: 1,
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
