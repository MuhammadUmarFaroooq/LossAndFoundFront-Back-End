import React, {useState, useCallback, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import {
  TextInput,
  Button,
  Avatar,
  Text,
  Modal,
  Portal,
} from 'react-native-paper';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import {API, COLORS, IP} from '../constants/theme';
import {Country, State, City} from 'country-state-city';
import axios from 'axios';
import SuperscriptText from '../Components/SuperscriptText ';
import CountryPicker from 'react-native-country-picker-modal';
import CountrySelectorModal from '../Components/CountrySelectorModal';
import CountryStateSelector from '../Components/CountryStateSelector';
import CountryCitySelector from '../Components/CountryCitySelector';
const MAX_IMAGE_SIZE = 1024 * 1024 * 5;

const SignupScreen = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState();
  const [phoneCountryCallingCode, setPhoneCountryCallingCode] = useState();
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  const [phone, setPhoneNo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () =>
    setShowPassword(prevState => !prevState);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(prevState => !prevState);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handleLaunchCamera = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxHeight: 500,
      maxWidth: 500,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('Image selection canceled');
      } else if (response.errorCode) {
        console.log(
          'ImagePicker Error: ',
          response.errorCode,
          response.errorMessage,
        );
      } else {
        if (response.assets[0].fileSize > MAX_IMAGE_SIZE) {
          Alert.alert('Image size exceeds limit');
          return;
        }

        setAvatarSource({uri: response.assets[0].uri});
        hideModal(); // Close the modal after image selection
      }
    });
  }, []);

  const handleImageUpload = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxHeight: 500,
      maxWidth: 500,
      saveToPhotos: true,
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
        if (response.assets[0].fileSize > MAX_IMAGE_SIZE) {
          Alert.alert('Image size exceeds limit');
          return;
        }

        setAvatarSource({uri: response.assets[0].uri});
        hideModal(); // Close the modal after image selection
      }
    });
  }, []);

  const [errors, setErrors] = useState({
    firstName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '', // New error state
    selectedCountry: '',
    selectedState: '',
    selectedCity: '',
  });

  const handleSignup = async () => {
    // Validate form data
    if (
      !firstName ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword ||
      !selectedCountry ||
      !selectedState ||
      !selectedCity
    ) {
      setErrors({
        firstName: firstName ? '' : 'Required',
        phone: phone ? '' : 'Required',
        email: email ? '' : 'Required',
        password: password ? '' : 'Required',
        confirmPassword: confirmPassword ? '' : 'Required',
        selectedCountry: selectedCountry ? '' : 'Required',
        selectedState: selectedState ? '' : 'Required',
        selectedCity: selectedCity ? '' : 'Required',
      });
    } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
      setErrors({
        ...errors,
        firstName: 'Only alphabets are allowed',
        phone: '', // Reset phone error if any
      });
    } else if (!/^\d+$/.test(phone)) {
      setErrors({
        ...errors,
        phone: 'Only numbers are allowed',
        firstName: '', // Reset firstName error if any
      });
    } else if (password !== confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: 'Passwords do not match',
      });
    } else {
      const userData = new FormData();
      userData.append('fullName', firstName);
      userData.append('phone', `${phoneCountryCallingCode}${phone}`);
      userData.append('email', email);
      userData.append('password', password);
      userData.append('confirmPassword', confirmPassword);
      userData.append('country', selectedCountry.name);
      userData.append('province', selectedState.name);
      userData.append('city', selectedCity.name);

      if (avatarSource) {
        const imageType = avatarSource.type || 'image/jpeg';
        userData.append('avatar', {
          uri: avatarSource.uri,
          type: imageType,
          name: `avatar.${imageType.split('/').pop()}`,
        });
      }

      try {
        const res = await axios.post(`${API}/users/signup`, userData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(res.data);
        const userId = res.data.userToSave._id;

        if (res.data.status === 'ok') {
          
          // Navigate to login screen only if there are no backend errors
          navigation.navigate('OPTScreen', {userId});
        }
     
      } catch (err) {
        console.log(err.response.data);
        Alert.alert(err.response.data.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.avatarContainer}>
        {avatarSource ? (
          <Avatar.Image source={avatarSource} size={100} />
        ) : (
          <Avatar.Image
            source={{uri: 'https://i.imgur.com/BoN9kdC.png'}}
            size={100}
          />
        )}
        <Text style={styles.uploadText} onPress={showModal}>
          Upload Image
        </Text>
      </TouchableOpacity>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}>
          <ScrollView>
            <TouchableOpacity
              onPress={handleImageUpload}
              style={styles.modalOption}>
              <Text>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLaunchCamera}
              style={styles.modalOption}>
              <Text>On camera</Text>
            </TouchableOpacity>
            <Button
              mode="contained"
              onPress={hideModal}
              contentStyle={{height: 50, width: '100%'}}
              style={{
                backgroundColor: COLORS.blue,
                borderRadius: 50,
                marginTop: 12,
              }}
              labelStyle={{color: 'white'}}>
              Close
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
      {/* Input fields */}
      <TextInput
        label={
          <Text>
            Full Name <SuperscriptText>*</SuperscriptText>
          </Text>
        }
        value={firstName}
        onChangeText={text => {
          setFirstName(text);
          setErrors(prevErrors => ({
            ...prevErrors,
            firstName: text ? '' : 'Required',
          }));
        }}
        style={[styles.input, {borderColor: errors.firstName ? 'red' : 'gray'}]}
        error={errors.firstName !== ''}
      />
      <TextInput
        label={
          <Text>
            Email <SuperscriptText>*</SuperscriptText>
          </Text>
        }
        value={email}
        onChangeText={text => {
          setEmail(text);
          setErrors(prevErrors => ({
            ...prevErrors,
            email: text ? '' : 'Required',
          }));
        }}
        style={[styles.input, {borderColor: errors.email ? 'red' : 'gray'}]}
        error={errors.email !== ''}
      />
      <View style={styles.inputContainer}>
        <CountryPicker
          countryCode={phoneCountryCode}
          visible={showPhoneCountryPicker}
          onSelect={country => {
            console.log('COUNTRY ==> ', country);
            setPhoneCountryCode(country.cca2);
            setPhoneCountryCallingCode(country.callingCode);
            setShowPhoneCountryPicker(false);
          }}
          withFilter={true}
        />

        <View style={styles.phoneTextContainer}>
          <Text style={styles.phoneCountryCallingCodeText}>
            +{phoneCountryCallingCode}
          </Text>
          <TextInput
            label={
              <Text>
                Phone number
                <SuperscriptText>*</SuperscriptText>
              </Text>
            }
            keyboardType="numeric"
            value={phone}
            onChangeText={text => {
              setPhoneNo(text);
              setErrors(prevErrors => ({
                ...prevErrors,
                phone: text ? '' : 'Required',
              }));
            }}
            style={[
              styles.phoneNoTextInput,
              {borderColor: errors.phone ? 'red' : 'gray'},
            ]}
            error={errors.phone !== ''}
          />
        </View>
      </View>
      <TextInput
        label={
          <Text>
            Password <SuperscriptText>*</SuperscriptText>
          </Text>
        }
        secureTextEntry
        value={password}
        onChangeText={text => {
          setPassword(text);
          setErrors(prevErrors => ({
            ...prevErrors,
            password: text ? '' : 'Required',
          }));
        }}
        style={[styles.input, {borderColor: errors.password ? 'red' : 'gray'}]}
        error={errors.password !== ''}
      />
      {/* Confirm Password */}
      <TextInput
        label={
          <Text>
            Confirm Password <SuperscriptText>*</SuperscriptText>
          </Text>
        }
        secureTextEntry
        value={confirmPassword}
        onChangeText={text => {
          setConfirmPassword(text);
          setErrors(prevErrors => ({
            ...prevErrors,
            confirmPassword: text ? '' : 'Required',
          }));
        }}
        style={[
          styles.input,
          {borderColor: errors.confirmPassword ? 'red' : 'gray'},
        ]}
        error={errors.confirmPassword !== ''}
      />


        
          <CountrySelectorModal state={setSelectedCountry} />
        {console.log(selectedCountry)}
       
        {selectedCountry && (
        <CountryStateSelector state={selectedCountry} updatesstate={setSelectedState}/>
      )}
  {selectedState && (
        <CountryCitySelector States={selectedState} updatedCity={setSelectedCity} />
      )}
      <Button
        mode="contained"
        onPress={handleSignup}
        contentStyle={{height: 50, width: '100%'}}
        style={{
          backgroundColor: COLORS.blue,
          borderRadius: 50,
          marginTop: 12,
        }}
        labelStyle={{color: 'white'}}>
        Sign Up
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  input: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadText: {
    marginTop: 5,
    marginHorizontal: 10,
    color: COLORS.blue,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
  modalOption: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  inputContainer: {
    height: 80,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',

    padding: 10,
    borderRadius: 5,
  },
  phoneTextContainer: {
    flex: 1,

    height: '100%',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  phoneCountryCallingCodeText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  phoneNoTextInput: {
    flex: 1,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
