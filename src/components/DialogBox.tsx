import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, raised } from '../theme';

interface DialogBoxProps {
  title: string;
  children: ReactNode;
}

export function DialogBox({ title, children }: DialogBoxProps) {
  return (
    <View style={[styles.container, raised]}>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.silver,
    width: '100%',
  },
  titleBar: {
    backgroundColor: colors.navy,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  titleText: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.white,
  },
  content: {
    padding: 14,
    gap: 10,
  },
});
