import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Headline,
  Text,
  Provider as PaperProvider,
} from 'react-native-paper';
import {COLORS} from '../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  }, []);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let errors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        newPassword,
      )
    ) {
      errors.newPassword =
        'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = () => {
    const isValid = validateFields();

    if (isValid) {
      // Your logic to handle password change goes here
      console.log('Current Password:', currentPassword);
      console.log('New Password:', newPassword);
      console.log('Confirm Password:', confirmPassword);
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
          <TextInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            style={[styles.input, {borderRadius: 10}]}
            error={!!errors.currentPassword}
          />
          <Text style={styles.error}>{errors.currentPassword}</Text>
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={[styles.input, {borderRadius: 10}]}
            error={!!errors.newPassword}
          />
          <Text style={styles.error}>{errors.newPassword}</Text>
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={[styles.input, {borderRadius: 10}]}
            error={!!errors.confirmPassword}
          />
          <Text style={styles.error}>{errors.confirmPassword}</Text>
          <Button
            mode="contained"
            onPress={handlePasswordChange}
            style={styles.button}>
            Change Password
          </Button>
          <Text style={styles.note}>
            Note: Make sure your new password is at least 8 characters long and
            includes a mix of letters, numbers, and symbols.
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
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
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
