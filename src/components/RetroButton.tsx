import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, raised, pressed } from '../theme';

interface RetroButtonProps {
  label: string;
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
  fontSize?: number;
}

export function RetroButton({ label, onPress, active, style, fontSize = 17 }: RetroButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const showPressed = active || isPressed;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        showPressed ? pressed : raised,
        showPressed && styles.activeBackground,
        style,
      ]}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}
    >
      <Text style={[styles.label, { fontSize }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.silver,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBackground: {
    backgroundColor: '#aaaaaa',
  },
  label: {
    fontFamily: fonts.heading,
    color: '#111111',
    textAlign: 'center',
  },
});
