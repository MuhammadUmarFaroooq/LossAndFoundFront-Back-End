// NotificationScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { COLORS } from '../constants/theme';

const notifications = [
  { id: '1', title: 'New Match', message: 'You have a new match!' },
  { id: '2', title: 'New Activity', message: 'Someone liked your post!' },
  { id: '3', title: 'Friend Request', message: 'You have a new friend request.' },
  { id: '4', title: 'Message', message: 'You received a new message.' },
  { id: '5', title: 'Reminder', message: 'please del your post if found...' },
  { id: '6', title: 'New Match', message: 'You have a new match!' },
  { id: '7', title: 'New Activity', message: 'Someone liked your post!' },
  { id: '8', title: 'Friend Request', message: 'You have a new friend request.' },
  { id: '9', title: 'Message', message: 'You received a new message.' },
  { id: '10', title: 'Reminder', message: 'please del your post if found...' },
];


const NotificationMainScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  header: {
    fontSize: 28,
    marginBottom: 16,
    color: '#ffffff',
    textAlign: 'center',
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
    borderRadius: 10,
  },
  notification: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#00000',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.blue,
  },
  message: {
    fontSize: 16,
    color: '#757575',
  },
});

export default NotificationMainScreen;
