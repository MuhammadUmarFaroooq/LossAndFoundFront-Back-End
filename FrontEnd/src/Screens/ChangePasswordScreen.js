// ChangePasswordScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, LINEARCOLOR} from '../constants/theme';
const ChangePasswordScreen = ({navigation,route}) => {
  const {navigationto}=route.params
  console.log(navigationto);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    // Check if passwords match

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please try again.');
      return;
    }
    // Add your logic to handle password change here
    console.log('Changing password:', password);
    navigation.navigate(navigationto);
  };
  const handleScreenPress = () => {
    Keyboard.dismiss(); // Dismiss the keyboard when the screen is pressed
  };

  return (
    <LinearGradient
      colors={LINEARCOLOR}
      style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20}}>
      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={require('../assets/Resetpassword.png')}
            style={styles.logo}
          />

          <Text style={styles.heading}>Change Password</Text>

          {/* Password Input */}
          <TextInput
            label="Password"
            mode="outlined"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />

          {/* Confirm Password Input */}
          <TextInput
            label="Confirm Password"
            mode="outlined"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
          />

          {/* Change Password Button */}

          <Button
            mode="contained"
            onPress={handleChangePassword}
            contentStyle={{height: 50, width: '95%'}}
            style={{
              backgroundColor: COLORS.blue,
              borderRadius: 50,
              marginTop: 12,
            }}
            labelStyle={{color: 'white'}}>
            Change Password
          </Button>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
});

export default ChangePasswordScreen;
