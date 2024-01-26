import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, IP, LINEARCOLOR} from '../constants/theme';
import axios from 'axios';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleScreenPress = () => {
    Keyboard.dismiss(); // Dismiss the keyboard when the screen is pressed
  };

  const handleResetPassword = async () => {
    try {
      console.log('Entered email:', email);
      const loginData = {
        email: email,
      };

      const res = await axios.post(
        `http://${IP}:8000/users/forgetpassword`,
        loginData,
      );

      if (res.data.status === 'ok') {
        Alert.alert('OTP Sent');
        navigation.navigate('OPTScreen');
      } else {
        // Handle login error
        Alert.alert('Login Failed', res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <LinearGradient
      colors={LINEARCOLOR}
      style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20}}>
      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={require('../assets/Forgotpassword.png')}
            style={styles.logo}
          />

          {/* Heading */}
          <Text style={styles.heading}>Enter Email</Text>

          {/* Subtext */}
          <Text style={styles.subText}>
            Enter your email address below and we'll send you a link to reset
            your password.
          </Text>

          {/* Email Input */}
          <TextInput
            label="Email"
            mode="outlined"
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={text => setEmail(text)}
          />

          {/* Reset Password Button */}
          <Button
            mode="contained"
            onPress={handleResetPassword}
            contentStyle={{height: 50, width: '95%'}}
            style={{
              backgroundColor: COLORS.blue,
              borderRadius: 50,
              marginTop: 12,
            }}
            labelStyle={{color: 'white'}}>
            Reset Password
          </Button>

          {/* Sign Up Link */}
          <TouchableWithoutFeedback
            onPress={() => {
              console.log('hello');
              navigation.navigate('Register');
            }}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

// Styles...

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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  },
  input: {
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
  signUpText: {
    marginTop: 20,
    color: 'gray',
  },
  signUpLink: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
