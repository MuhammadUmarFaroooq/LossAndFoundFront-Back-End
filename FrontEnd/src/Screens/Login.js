import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  Alert,
} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {API, COLORS, LINEARCOLOR} from '../constants/theme';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { setUserId } from '../store/actions';
import { useDispatch } from 'react-redux';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State to manage validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {email: '', password: ''};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    navigation.navigate('Forget');
  };

  const handleSignUp = () => {
    // Navigate to the SignUpScreen
    navigation.navigate('Register');
  };

  const handleLogin = async () => {
    // Validate form data
    if (validateForm()) {
      try {
        // If valid, proceed with login logic
        const loginData = {
          email: formData.email,
          password: formData.password,
        };

        const res = await axios.post(`${API}/users/login`, loginData);

        console.log('Login Data:', loginData);

        if (res.status === 200 && res.data.status === 'ok') {
          ToastAndroid.show('Login Successful', ToastAndroid.LONG);
          await AsyncStorage.setItem('token', res.data.token);

          // const decodedToken = jwt_decode(res.data.token);
          // console.log('Decoded Token:', decodedToken);

          // if (decodedToken ) {
          //   dispatch(setUserId(decodedToken));
          // } else {
          //   Alert.alert('Login Error', 'Failed to decode token');
          // }

          setFormData({email: '', password: ''});
          navigation.navigate('Tabs');
          
        } else {
          // Handle login error
          Alert.alert('Login Failed', res.data.message);
        }
      } catch (error) {
        // Handle any other errors
        console.error('Login Error:', error.response);

        if (error.response && error.response.data && error.response.data.message) {
          Alert.alert('Login Error', error.response.data.message);
        } else {
          Alert.alert('Login Error', 'An unexpected error occurred');
        }
      }
    }
  };

  return (
    <LinearGradient
      colors={LINEARCOLOR}
      style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20}}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image
            source={require('../assets/appicons/icon.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          <TextInput
            label="Email"
            mode="outlined"
            style={styles.input}
            placeholder="Enter your email"
            onChangeText={text => setFormData({...formData, email: text})}
            theme={{
              colors: {primary: COLORS.blue, underlineColor: 'transparent'},
            }}
            error={Boolean(errors.email)}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          <TextInput
            label="Password"
            mode="outlined"
            onChangeText={text => setFormData({...formData, password: text})}
            style={styles.input}
            secureTextEntry
            placeholder="Enter the password"
            theme={{
              colors: {primary: COLORS.blue, underlineColor: 'transparent'},
            }}
            error={Boolean(errors.password)}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            contentStyle={{height: 50, width: '95%'}}
            style={{
              backgroundColor: COLORS.blue,
              borderRadius: 50,
              marginTop: 12,
            }}
            labelStyle={{color: 'white'}}>
            Login
          </Button>

          <TouchableWithoutFeedback onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={handleSignUp}>
            <Text style={styles.signupText}>
              Don't have an account? Sign up
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 250,
  },
  title: {
    fontSize: 30,
    marginBottom: 8,
    alignSelf: 'flex-start',
    color: COLORS.title,
    fontFamily: 'Poppins-BoldItalic',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: 'gray',
    alignSelf: 'flex-start',
    fontFamily: 'Poppins-LightItalic',
  },
  inputContainer: {
    width: '100%',
    margin: 16,
    backgroundColor: COLORS.blue,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
  },
  forgotPassword: {
    color: 'blue',
    marginBottom: 16,
    marginTop: 12,
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-LightItalic',
  },
  signupText: {
    color: 'gray',
    fontFamily: 'Poppins-LightItalic',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 16,
    fontFamily: 'Poppins-LightItalic',
  },
});

export default Login;
