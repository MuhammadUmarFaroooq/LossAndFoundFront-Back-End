import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme, TextInput, Button as PaperButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import SuperscriptText from '../Components/SuperscriptText ';
import IconComponent from 'react-native-vector-icons/Fontisto';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, COLORS } from '../constants/theme';
import { Picker } from '@react-native-picker/picker'; // Import Picker from react-native

export default function PostCreation({ navigation, route }) {
  const theme = useTheme();
  const { subcategoryName } = route.params;

  const [title, setTitle] = useState(subcategoryName);
  const [brand, setBrand] = useState('');
  const [itemColor, setItemColor] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [postType, setPostType] = useState(''); // Default to 'Lost'
  const [itemName, setItemName] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [itemNameError, setItemNameError] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [questionFields, setQuestionFields] = useState([]);
  const [questionOptions, setQuestionOptions] = useState(Array(numberOfQuestions).fill(''));
  

  const MAX_IMAGES = 5;

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

  const handleTypeSelection = type => {
    setPostType(type);
  };

  // Update handlePost function
const handlePost = async () => {
  if (
    !title ||
    !itemName ||
    !brand ||
    !itemColor ||
    !location ||
    !detailedDescription
  ) {
    // Set error borders for empty fields
    setTitleError(!title);
    setItemNameError(!itemName);

    console.log('Please fill in all the required fields.');
    Alert.alert('Please fill in all the required fields.');
    return;
  }

  // Create FormData object for multipart/form-data request
  const formData = new FormData();
  formData.append('type', postType);
  formData.append('name', itemName);
  formData.append('category', title);
  formData.append('brand', brand);
  formData.append('color', itemColor);
  formData.append('location', location);
  formData.append('description', detailedDescription);
  formData.append('dateOfItem', dateTime.toString());

  // Append each selected image to the FormData object
  selectedImages.forEach((image, index) => {
    const imageType = image.type || 'image/jpeg';
    formData.append(`images`, {
      uri: image.uri,
      type: imageType, // Adjust according to your image type
      name: `image${index}.${imageType.split('/').pop()}`,
    });
  });

  // Append questions and options to FormData
  questionFields.forEach((question, index) => {
    formData.append(`questions[${index}]`, question);
    formData.append(`options[${index}]`, questionOptions[index]);
  });

  try {
    // Send POST request to your server
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API}/posts/uploadPost`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${token}`,
      },
    });

    console.log(response.data);

    if (response.data.status === 'ok') {
      Alert.alert('Post Uploaded');
      navigation.navigate('Home', { refreshPosts: true });
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error uploading post. Please try again.');
  }
};


  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateTime;
    setShowDatePickerModal(false);
    setDateTime(currentDate);
    setShowTimePickerModal(true);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentDate = selectedTime || dateTime;
    setShowTimePickerModal(false);
    setDateTime(currentDate);
  };

  const handleNumQuestionsChange = value => {
    setNumberOfQuestions(value);
  };

  const renderQuestionFields = () => {
    const fields = [];
    for (let i = 0; i < numberOfQuestions; i++) {
      fields.push(
        <View key={i} style={{ marginTop: 10 }}>
          <TextInput
            placeholder={`Question ${i + 1}`}
            style={{
              borderWidth: 1,
              borderColor: COLORS.grey,
              borderRadius: 8,
              padding: 10,
            }}
            onChangeText={text => handleQuestionChange(text, i)}
            />
            <Picker
            selectedValue={questionOptions[i]}
            onValueChange={questionOptions => handleQuestionOptionChange(questionOptions, i)}
            style={{ height: 50, width: 150 }}
          >
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
          
        </View>
      );
    }
    return fields; // Return the fields array
  };

  const handleQuestionChange = (text, index) => {
    // Update the questions in the state
    const updatedQuestions = [...questionFields];
    updatedQuestions[index] = text;
    setQuestionFields(updatedQuestions);
    console.log(questionFields);
    console.log(questionOptions);
  };
  

  const handleQuestionOptionChange = (option, index) => {
    const updatedOptions = [...questionOptions];
    updatedOptions[index] = option;
    setQuestionOptions(updatedOptions);
  };
  return (
    <ScrollView style={{ padding: 10, backgroundColor: 'white' }}>
      {/* Type selection */}
      <View>
        <Text>Type</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingTop: 10,
          }}
        >
       <View style={{ flex: 1, paddingRight: 8 }}>
  <PaperButton
    mode={postType === 'Lost' ? 'contained' : 'outlined'}
    onPress={() => handleTypeSelection('Lost')}
    style={{
      width: '90%', // Adjust width as needed
      backgroundColor: postType === 'Lost' ? COLORS.blue : 'white',
    }}
  >
    Lost
  </PaperButton>
</View>
<View style={{ flex: 1, paddingLeft: 8 }}>
  <PaperButton
    mode={postType === 'Found' ? 'contained' : 'outlined'}
    onPress={() => handleTypeSelection('Found')}
    style={{
      width: '90%', // Adjust width as needed
      backgroundColor: postType === 'Found' ? COLORS.blue : 'white',
    }}
  >
    Found
  </PaperButton>
</View>
        </View>
      </View>
      
      {postType && ( // Conditionally render the fields when type is selected
        <>
      <View
        style={{
          marginBottom: 20,
          borderColor: COLORS.grey,
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 12, fontFamily: 'rubik-bold' }}>
          Upload Images
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderColor: COLORS.grey,
            borderWidth: 1,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
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
            width: 150,
            alignSelf: 'center',
            backgroundColor: COLORS.blue,
            marginTop: 16,
            fontFamily: 'rubik-bold',
          }}
        >
          Upload Images
        </PaperButton>
      </View>
  
      {/* TextInputs for various fields */}
      <TextInput
        label={<Text>Catagory <SuperscriptText>*</SuperscriptText></Text>}
        value={title}
        onChangeText={text => setTitle(text)}
        style={{ marginBottom: 8, color: titleError ? 'red' : 'black', borderColor: titleError ? 'red' : COLORS.grey }}
      />
         <TextInput
          label={
            <Text>
              Item Name<SuperscriptText>*</SuperscriptText>
            </Text>
          }
          value={itemName}
          onChangeText={text => setItemName(text)}
          style={{
            marginBottom: 8,
            color: titleError ? 'red' : 'black',
            borderColor: titleError ? 'red' : COLORS.grey,
          }}
        />
  
        <TextInput
          label={
            <Text>
              Brand<SuperscriptText>*</SuperscriptText>
            </Text>
          }
          value={brand}
          onChangeText={text => setBrand(text)}
          style={{
            marginBottom: 8,
            color: titleError ? 'red' : 'black',
            borderColor: titleError ? 'red' : COLORS.grey,
          }}
        />
        <TextInput
          label={
            <Text>
              Item Color<SuperscriptText>*</SuperscriptText>
            </Text>
          }
          value={itemColor}
          onChangeText={text => setItemColor(text)}
          style={{
            marginBottom: 8,
            color: titleError ? 'red' : 'black',
            borderColor: titleError ? 'red' : COLORS.grey,
          }}
        />
     
      {/* Other TextInputs */}
  
      {/* Date and Time selection */}
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setShowDatePickerModal(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ position: 'relative', width: '100%' }}>
              <TextInput
                label="Date and Time"
                value={dateTime.toString()}
                style={{ paddingRight: 40 }} // Adjust paddingRight to accommodate icon
              />
              <IconComponent
                name="date"
                size={24}
                color={COLORS.blue}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: [{ translateY: -12 }],
                }} // Adjust position as needed
              />
            </View>
          </View>
        </TouchableOpacity>
        {showDatePickerModal && (
          <DateTimePicker
            testID="datePicker"
            value={dateTime}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        {showTimePickerModal && (
          <DateTimePicker
            testID="timePicker"
            value={dateTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>

      <TextInput
          label={
            <Text>
              Location<SuperscriptText>*</SuperscriptText>
            </Text>
          }
          value={location}
          onChangeText={text => setLocation(text)}
          style={{
            marginBottom: 8,
            color: titleError ? 'red' : 'black',
            borderColor: titleError ? 'red' : COLORS.grey,
          }}
        />

      <TextInput
        label={
          <Text>
            Detailed Description<SuperscriptText>*</SuperscriptText>
          </Text>
        }
        value={detailedDescription}
        onChangeText={text => setDetailedDescription(text)}
        multiline
        numberOfLines={4}
        style={{
          marginBottom: 8,
          color: titleError ? 'red' : 'black',
          borderColor: titleError ? 'red' : COLORS.grey,
        }}
      />

      {postType === 'Found' && ( // Only render questions when type is 'Found'
      <View style={{ marginBottom: 20 }}>
        <Text>Select number of Secret Questions:</Text>
        <Picker
          selectedValue={numberOfQuestions}
          onValueChange={handleNumQuestionsChange}
        >
          {[...Array(10).keys()].map(num => (
            <Picker.Item key={num} label={`${num + 1}`} value={num + 1} />
          ))}
        </Picker>
      </View>
      )}
      {numberOfQuestions > 0 && postType === 'Found' && (
        <View>
          <Text>Questions:</Text>
          {renderQuestionFields()}
        </View>
      )}
      
  
      {/* Button to upload the post */}
      <PaperButton
        mode="contained"
        onPress={handlePost}
        style={{
          width: 150,
          alignSelf: 'center',
          marginTop: 16,
          backgroundColor: COLORS.blue,
          fontFamily: 'rubik-bold',
        }}
      >
        Upload Post
      </PaperButton>
      </>
      )}
    </ScrollView>
  );
}



