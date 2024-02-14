import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('screen');

export const COLORS = {
  primary: '#f52d56',
  title: '#000',
  white: '#FFFFFF',
  lightGrey: '#D3D6D6',
  grey: '#C1C0C9',
  blue: '#087BB6',
  yellow: '#F4D03F',
  statusColor: '#333333',
  BlockColor: '#adaba0',
};

export const SIZES = {
  h1: 22,
  h2: 20,
  h3: 18,
  h4: 16,
  h5: 14,
  h6: 12,

  width,
  height,
};

export const IP = '172.16.101.31';

export const LINEARCOLOR = [
  'hsla(270, 4%, 100%, 1)',
  'hsla(270, 39%, 100%, 1)',
];
