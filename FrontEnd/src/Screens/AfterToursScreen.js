import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import AppIntroComponents from '../Components/AppIntroComponets';
import AppSlogan from '../Components/AppSlogan';
import { COLORS, LINEARCOLOR } from '../constants/theme';
import LinearGradient from 'react-native-linear-gradient';

const imageicon = [
  {
    id: 1,
    icon: 'map-marked-alt',
    Text: 'Lets find out together Lets find out together   ',
  },
  {
    id: 2,
    icon: 'people-arrows',
    Text: 'Lets find out together Lets find out together   ',
  },
  {
    id: 3,
    icon: 'house-user',
    Text: 'Lets find out together Lets find out together   ',
  },
];

export default function AfterToursScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <LinearGradient colors={LINEARCOLOR} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <AppSlogan
            lost={'Lost ?'}
            find={"Let's find it"}
            togther={'together...'}
          />
          {imageicon.map(item => (
            <AppIntroComponents
              key={item.id}
              icon={item.icon}
              text={item.Text}
            />
          ))}
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={{
                flex: 1,
                marginRight: 8,
                backgroundColor: COLORS.blue,
                borderRadius: 50,
                paddingVertical: 10,
              }}
              labelStyle={{ color: 'white', fontSize: 18 }}>
              Login
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={{
                flex: 1,
                marginLeft: 8,
                borderColor: COLORS.blue,
                borderRadius: 50,
                borderWidth: 1,
                paddingVertical: 10,
              }}
              labelStyle={{ color: COLORS.blue, fontSize: 18 }}>
              Register
            </Button>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
