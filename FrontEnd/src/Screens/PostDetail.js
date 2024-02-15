import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useTheme, TextInput, Button as PaperButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import SuperscriptText from '../Components/SuperscriptText ';
import IconComponent from 'react-native-vector-icons/Fontisto';
import {COLORS} from '../constants/theme';

export default function PostCreation({navigation, route}) {
  const theme = useTheme();
  const {subcategoryName} = route.params;

  const [title, setTitle] = useState(subcategoryName);
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);

  const MAX_IMAGES = 5;
  const [selectedImages, setSelectedImages] = useState([]);

  const selectImages = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxHeight: 500,
      maxWidth: 500,
      selectionLimit: MAX_IMAGES - selectedImages.length,
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

  const onChangeDateTime = (event, selectedDate, time) => {
    if (time) {
      setShowTimePickerModal(false);
    }
    setShowDatePickerModal(false);
    const currentDate = selectedDate || dateTime;
    setDateTime(currentDate);
  };

  return (
    <ScrollView style={{padding: 10, backgroundColor: 'white'}}>
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

      <TextInput
        label={
          <Text>
            Title <SuperscriptText>*</SuperscriptText>
          </Text>
        }
        value={title}
        onChangeText={text => setTitle(text)}
        style={{marginBottom: 8, color: 'black'}}
      />
      <TextInput
        label={
          <Text>
            Description<SuperscriptText>*</SuperscriptText>
          </Text>
        }
        value={description}
        onChangeText={text => setDescription(text)}
        style={{marginBottom: 8}}
      />
      <TextInput
        label={
          <Text>
            Brand<SuperscriptText>*</SuperscriptText>
          </Text>
        }
        value={brand}
        onChangeText={text => setBrand(text)}
        style={{marginBottom: 8}}
      />
      <TextInput
        label={
          <Text>
            Item Color<SuperscriptText>*</SuperscriptText>
          </Text>
        }
        value={itemColor}
        onChangeText={text => setItemColor(text)}
        style={{marginBottom: 8}}
      />

      <View style={{marginBottom: 20}}>
        <TouchableOpacity onPress={() => setShowDatePickerModal(true)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{position: 'relative', width: '100%'}}>
              <TextInput
                label="Date and Time"
                value={dateTime.toString()}
                style={{paddingRight: 40}} // Adjust paddingRight to accommodate icon
              />
              <IconComponent
                name="date"
                size={24}
                color={COLORS.blue}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: [{translateY: -12}],
                }} // Adjust position as needed
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {showDatePickerModal && (
        <DateTimePicker
          testID="datePicker"
          value={dateTime}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePickerModal(true);
            onChangeDateTime(event, selectedDate, false);
          }}
        />
      )}
      {showTimePickerModal && (
        <DateTimePicker
          testID="timePicker"
          value={dateTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            onChangeDateTime(event, selectedDate, true);
          }}
        />
      )}

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
