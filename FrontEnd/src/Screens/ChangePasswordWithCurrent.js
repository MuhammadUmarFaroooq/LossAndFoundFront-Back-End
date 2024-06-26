import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Headline,
  Text,
  Provider as PaperProvider,
} from 'react-native-paper';
import {API, COLORS} from '../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ChangePasswordWithCurrent({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerBackground: () => <View style={styles.header}></View>,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const validateFields = () => {
    let errors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async () => {
    const isValid = validateFields();

    if (isValid) {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.patch(
          `${API}/users/changepassword`,
          {
            currentPassword,
            newPassword,
            confirmPassword,
          },
          {
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (res.data.status === 'ok') {
          Alert.alert('Password Changed Successfully', '', [
            {text: 'OK', onPress: () => navigation.goBack()}, // Navigate back to previous screen
          ]);
        }
      } catch (err) {
        console.log(err);
        Alert.alert('Error Changing Password', err);
      }
    }
  };

  return (
    <PaperProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Headline style={styles.title}>Change Password</Headline>
          <Text style={styles.subtitle}>
            Please enter your current password, new password, and confirm the
            new password below:
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              style={[styles.input, {borderRadius: 10}]}
              error={!!errors.currentPassword}
            />
            <TouchableWithoutFeedback
              onPress={() => togglePasswordVisibility('current')}>
              <Ionicons
                name={showCurrentPassword ? 'eye-off' : 'eye'}
                size={24}
                color={'black'}
                style={styles.eyeIcon}
              />
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.error}>{errors.currentPassword}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              style={[styles.input, {borderRadius: 10}]}
              error={!!errors.newPassword}
            />
            <TouchableWithoutFeedback
              onPress={() => togglePasswordVisibility('new')}>
              <Ionicons
                name={showNewPassword ? 'eye-off' : 'eye'}
                size={24}
                color={'black'}
                style={styles.eyeIcon}
              />
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.error}>{errors.newPassword}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={[styles.input, {borderRadius: 10}]}
              error={!!errors.confirmPassword}
            />
            <TouchableWithoutFeedback
              onPress={() => togglePasswordVisibility('confirm')}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={24}
                color={'black'}
                style={styles.eyeIcon}
              />
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.error}>{errors.confirmPassword}</Text>

          <Button
            mode="contained"
            onPress={handlePasswordChange}
            style={styles.button}>
            Change Password
          </Button>
          <Text style={styles.note}>
            Note: Make sure your new password is at least 8 characters long and
            the new password and confirm password fields match.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#777',
  },
  title: {
    marginTop: 32,
    marginBottom: 20,
    fontSize: 24,
  },
  subtitle: {
    marginBottom: 10,
    fontSize: 16,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eyeIcon: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    opacity: 0.6,
    fontSize: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.blue,
    borderRadius: 10,
  },
  note: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});
