import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

interface MenuItem {
  label: string;
  onPress?: () => void;
  active?: boolean;
}

interface MenuBarProps {
  items: MenuItem[];
}

export function MenuBar({ items }: MenuBarProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity key={item.label} onPress={item.onPress} disabled={!item.onPress}>
          <Text style={[styles.item, item.active && styles.activeItem]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: colors.menuBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    gap: 12,
  },
  item: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: '#111111',
  },
  activeItem: {
    textDecorationLine: 'underline',
  },
});
