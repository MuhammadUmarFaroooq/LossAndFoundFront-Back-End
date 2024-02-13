import React, {useState} from 'react';
import {View, Text, Button, ScrollView, Image} from 'react-native';
import {useTheme, TextInput, Button as PaperButton} from 'react-native-paper';

import {COLORS} from '../constants/theme';
import {launchImageLibrary} from 'react-native-image-picker';

export default function PostCreation({navigation, route}) {
  const theme = useTheme();
  const {subcategoryName} = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [dateTime, setDateTime] = useState('');

  const MAX_IMAGES = 5; // Maximum number of images allowed

  const [selectedImages, setSelectedImages] = useState([]);
  const selectImages = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxHeight: 500,
      maxWidth: 500,
      selectionLimit: MAX_IMAGES - selectedImages.length, // Limit the selection based on the remaining slots
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Image selection canceled');
      } else if (response.errorCode) {
        console.log(
          'ImagePicker Error: ',
          response.errorCode,
          response.errorMessage,
        );
      } else {
        const newImages = response.assets.map(asset => ({
          uri: asset.uri,
          fileSize: asset.fileSize,
        }));

        setSelectedImages(prevImages => [...prevImages, ...newImages]);
      }
    });
  };

  const handleSave = () => {
    // Implement your save logic here
    // Access the input values (title, description, etc.) and images
  };

  return (
    <ScrollView style={{padding: 10, backgroundColor: 'white'}}>
      <Text style={{fontSize: 30, marginBottom: 30, fontFamily: 'rubik-bold'}}>
        {subcategoryName}
      </Text>

      {/* Image selection */}
      <View
        style={{
          marginBottom: 20,
          borderColor: COLORS.grey,
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
        <Text
          style={{fontSize: 18, marginBottom: 12, fontFamily: 'rubik-bold'}}>
          Upload Images
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderColor: COLORS.grey,
            borderWidth: 1,
            borderRadius: 8,
            overflow: 'hidden',
          }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedImages.map((image, index) => (
              <Image
                key={index}
                source={{uri: image.uri}}
                style={{
                  width: 100,
                  height: 100,
                  padding: 21,
                  marginRight: 8,
                  borderRadius: 8,
                }}
              />
            ))}
          </ScrollView>
        </View>
        <PaperButton
          mode="contained"
          onPress={selectImages}
          style={{
            width: 120,
            alignSelf: 'center',
            backgroundColor: COLORS.blue,
            marginTop: 16,
            fontFamily: 'rubik-bold',
          }}>
          Upload Images
        </PaperButton>
      </View>

      {/* Input fields */}
      <TextInput
        label="Title"
        value={title}
        onChangeText={text => setTitle(text)}
        style={{
          marginBottom: 8,
          backgroundColor: COLORS.lightGrey,
          color: 'black',
        }}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={text => setDescription(text)}
        style={{marginBottom: 8}}
      />
      <TextInput
        label="Brand"
        value={brand}
        onChangeText={text => setBrand(text)}
        style={{marginBottom: 8}}
      />
      <TextInput
        label="Item Color"
        value={itemColor}
        onChangeText={text => setItemColor(text)}
        style={{marginBottom: 8}}
      />
      <TextInput
        label="Date and Time"
        value={dateTime}
        onChangeText={text => setDateTime(text)}
        style={{marginBottom: 8}}
      />

      {/* Save button or other actions */}
      <PaperButton
        mode="contained"
        onPress={handleSave}
        style={{
          width: 120,
          alignSelf: 'center',
          marginTop: 16,
          backgroundColor: COLORS.blue,
          fontFamily: 'rubik-bold',
        }}>
        Post
      </PaperButton>
    </ScrollView>
  );
}
