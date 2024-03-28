import React, {useState, useLayoutEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../constants/theme';

// Mock async function to simulate API call
async function query(data) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/IMSyPP/hate_speech_en',
    {
      headers: {Authorization: 'Bearer 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'},
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
  const result = await response.json();
  return result;
}

const ChatScreen = ({navigation}) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {id: 1, text: 'Hi'},
    {id: 2, text: 'Hello'},
  ]);
  const scrollViewRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{paddingHorizontal: 20}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>John Cena</Text>
        </View>
      ),
    });
  }, [navigation]);

  const handleSend = async () => {
    if (message.trim() === '') {
      return; // Don't send empty messages
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call the API function and get the response
      const response = await query({inputs: message});
      console.log('API Response:', response);

      // Find the label with the highest score
      let maxScore = -1;
      let maxLabel = '';
      response[0].forEach(item => {
        if (item.score > maxScore) {
          maxScore = item.score;
          maxLabel = item.label;
        }
      });

      const newMessage = {id: chatMessages.length + 1, text: message};
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');

      // Scroll to the bottom of the chat after sending a message
      scrollViewRef.current.scrollToEnd({animated: true});

      console.log(maxLabel);
      let hate;
      if (maxLabel == 'LABEL_0') {
        hate = 'Acceptable Message';
      } else if (maxLabel == 'LABEL_1') {
        hate = 'Inappropriate Message';
      } else if (maxLabel == 'LABEL_2') {
        hate = 'Offensive Message';
      } else if (maxLabel == 'LABEL_3') {
        hate = 'Violent Message';
      } else {
        hate = 'Message Sent';
      }
      // Show an alert with the label having the highest score
      Alert.alert('Hate Speech Result', hate);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message.');
      console.error('Error sending message:', error);
    }
  };

  const renderChatMessage = (messageText, isCurrentUser) => (
    <View
      key={messageText.id}
      style={[styles.chatMessage, isCurrentUser && styles.currentUserMessage]}>
      <Text style={styles.messageText}>{messageText.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Display previous chats */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }>
        <View style={styles.previousChats}>
          {chatMessages.map(chatMessage =>
            renderChatMessage(chatMessage, false),
          )}
        </View>
      </ScrollView>
      {/* Input field and send button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your message..."
          value={message}
          onChangeText={text => setMessage(text)}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={{color: COLORS.white}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  previousChats: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: COLORS.blue,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatMessage: {
    backgroundColor: 'skyblue',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%', // Max width for messages
  },
  currentUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.blue,
  },
  messageText: {
    fontSize: 16,
  },
});

export default ChatScreen;
