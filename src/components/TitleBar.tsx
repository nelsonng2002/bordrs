import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
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
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.icon}>×</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.icon}>▫</Text>
      )}
    </View>
  );
}

const topInset = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.navy,
    paddingHorizontal: 12,
    paddingTop: topInset + 6,
    paddingBottom: 10,
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
  closeBtn: {
    padding: 8,
  },
});
