import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

interface StatusBarProps {
  left?: string;
  right?: string;
}

export function StatusBar({ left, right }: StatusBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{left}</Text>
      {right && <Text style={styles.text}>{right}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    borderTopWidth: 1,
    borderTopColor: colors.menuBorder,
    paddingHorizontal: 40,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: '#555555',
  },
});
