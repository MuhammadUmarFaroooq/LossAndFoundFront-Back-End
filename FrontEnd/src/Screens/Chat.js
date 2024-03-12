import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Tabs, TabScreen, TabsProvider} from 'react-native-paper-tabs';
import { COLORS } from '../constants/theme';
const Chat = () => {


  return (
    <TabsProvider>
    <Tabs style={{width: 450, marginTop: 2}}>
      <TabScreen label="All">
        {/* Component for Lost items */}
        <View style={styles.tabContent}>
          <Text>All Chats goes here</Text>
        </View>
      </TabScreen>
      <TabScreen label="Read">
        {/* Component for Found items */}
        <View style={styles.tabContent}>
          <Text>All Read Chats goes here</Text>
        </View>
      </TabScreen>
      <TabScreen label="Unread">
        {/* Component for Claimed items */}
        <View style={styles.tabContent}>
          <Text>All Unread Chats goes here</Text>
        </View>
      </TabScreen>
    </Tabs>
  </TabsProvider>
  );
};

export default Chat;

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})