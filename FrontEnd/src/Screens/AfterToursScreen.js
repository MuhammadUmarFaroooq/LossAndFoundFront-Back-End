import React from 'react';
import {View, Image, Text} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {ScrollView} from 'react-native';
import AppIntroComponets from '../Components/AppIntroComponets';
import AppSlogan from '../Components/AppSlogan';
import {COLORS, LINEARCOLOR} from '../constants/theme';
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
    Text: 'Lets find out together  Lets find out together   ',
  },
  {
    id: 3,
    icon: 'house-user',
    Text: 'Lets find out together  Lets find out together   ',
  },
];

export default function AfterToursScreen({navigation}) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <LinearGradient colors={LINEARCOLOR} style={{flex: 1}}>
      <ScrollView>
        <View style={{padding: 16}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              gap: 5,
              paddingLeft: 5,
              paddingTop: 8,
            }}>
            <Image
              style={{width: 25, height: 25, marginHorizontal: 4}}
              source={require('../assets/appicons/icon.png')}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: COLORS.blue,
                alignSelf: 'center',
              }}>
              ItemSync
            </Text>
          </View>

          <Divider
            style={{marginBottom: 12}}
            bold={true}
            theme={{colors: {primary: 'tomato'}}}
          />
          <AppSlogan
            lost={'Lost ?'}
            find={"Let's find it"}
            togther={'together...'}
          />
          {imageicon.map(item => (
            <AppIntroComponets
              key={item.id}
              icon={item.icon}
              text={item.Text}
            />
          ))}

          {/* Login and Signup Buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={{
                flex: 1,
                marginRight: 8,
                backgroundColor: COLORS.blue,
                borderColor: 'white',
                borderWidth: 1,
                borderRadius: 50,
                padding: 12,
                fontWeight: 'bold',
                fontSize: 32,
              }}
              labelStyle={{color: 'white'}}>
              Login
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={{
                flex: 1,
                backgroundColor: COLORS.blue,
                borderColor: 'white',
                fontWeight: 'bold',
                borderWidth: 1,
                borderRadius: 50,
                padding: 12,
                fontSize: 32,
              }}
              labelStyle={{color: COLORS.white}}>
              Register
            </Button>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
