import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

interface TitleBarProps {
  title: string;
  onClose?: () => void;
}

export function TitleBar({ title, onClose }: TitleBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onClose ? (
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.icon}>×</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.icon}>▫</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.navy,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.white,
  },
  icon: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.white,
  },
});
