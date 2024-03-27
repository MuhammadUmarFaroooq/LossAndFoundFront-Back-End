import React, {useState} from 'react';
import {View, Text, Image, StatusBar, LogBox} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, LINEARCOLOR, SIZES} from '../constants/theme';

const slides = [
  {
    id: 1,
    title: 'Beyond Lost & Found: A Helping Hand',
    description:
      '“Were building a network of helpful neighbors. Share lost item experiences, offer a hand to others in need, and rediscover the spirit of connection within your local area. Its not just about things – its about coming together as a community."',
    image: require('../assets/Onboarding1.png'),
  },
  {
    id: 2,
    title: 'Community Strong, Reunions Frequent',
    description:
      '“We are building a community where helpful neighbors connect. Share your lost item experiences, offer a hand to others, and rediscover not just lost things, but the spirit of connection within your local area."',
    image: require('../assets/Onboarding2.png'),
  },
  {
    id: 3,
    title: 'Find Faster. Search Smarter',
    description:
      '“Our advanced search is your secret weapon. Refine your search by location, category and date.  Put the power of a smart search in your hands and get reconnected with what is missing!"',
    image: require('../assets/Onboarding3.png'),
  },
];

function OnBoardingUI({updateShowHomePage}) {
  StatusBar.setBarStyle('light-content', true);
  console.log(COLORS.statusColor);
  StatusBar.setBackgroundColor(COLORS.statusColor);

  const buttonLabel = label => {
    return (
      <View
        style={{
          padding: 12,
        }}>
        <Text
          style={{
            color: COLORS.title,
            fontWeight: '600',
            fontSize: SIZES.h3,
          }}>
          {label}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={LINEARCOLOR} style={{flex: 1}}>
      <AppIntroSlider
        data={slides}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 19,
                paddingTop: 80,
              }}>
              <View
                style={{
                  width: SIZES.width - 100,
                  height: 350,
                  marginBottom: 60,
                  overflow: 'hidden',
                  borderRadius: 40,
                }}>
                <Image
                  source={item.image}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    left: -12,
                    right: -12,
                    bottom: 12,
                    borderRadius: 19,
                    shadowColor: COLORS.blue,
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 25, // for Android
                  }}
                />
              </View>

              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.title,
                  fontSize: SIZES.h1,
                }}>
                {item.title}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  paddingTop: 5,
                  color: COLORS.grey,
                  fontWeight: 'bold',
                }}>
                {item.description}
              </Text>
            </View>
          );
        }}
        activeDotStyle={{
          backgroundColor: COLORS.blue,
          width: 30,
        }}
        showSkipButton
        renderNextButton={() => buttonLabel('Next')}
        renderSkipButton={() => buttonLabel('Skip')}
        renderDoneButton={() => buttonLabel('Done')}
        onDone={() => {
          updateShowHomePage(false);
        }}
      />
    </LinearGradient>
  );
}

export default OnBoardingUI;
