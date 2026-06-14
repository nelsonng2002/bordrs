import { ViewStyle } from 'react-native';

export const colors = {
  silver: '#c0c0c0',
  navy: '#000080',
  darkGray: '#808080',
  lightGray: '#e0e0e0',
  white: '#ffffff',
  black: '#000000',
  borderLight: '#ffffff',
  borderDark: '#555555',
  menuBorder: '#888888',
};

export const fonts = {
  heading: 'VT323',
  body: 'IBMPlexMono',
};

export const raised: ViewStyle = {
  borderTopWidth: 2,
  borderLeftWidth: 2,
  borderBottomWidth: 2,
  borderRightWidth: 2,
  borderTopColor: colors.borderLight,
  borderLeftColor: colors.borderLight,
  borderBottomColor: colors.borderDark,
  borderRightColor: colors.borderDark,
};

export const pressed: ViewStyle = {
  borderTopWidth: 2,
  borderLeftWidth: 2,
  borderBottomWidth: 2,
  borderRightWidth: 2,
  borderTopColor: colors.borderDark,
  borderLeftColor: colors.borderDark,
  borderBottomColor: colors.borderLight,
  borderRightColor: colors.borderLight,
};

export const inset: ViewStyle = {
  borderTopWidth: 1,
  borderLeftWidth: 1,
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderTopColor: colors.menuBorder,
  borderLeftColor: colors.menuBorder,
  borderBottomColor: colors.borderLight,
  borderRightColor: colors.borderLight,
};
