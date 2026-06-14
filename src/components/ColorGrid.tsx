import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { EGA_PALETTE } from '../constants';

interface ColorGridProps {
  selected: string;
  onSelect: (color: string) => void;
}

export function ColorGrid({ selected, onSelect }: ColorGridProps) {
  return (
    <View style={styles.grid}>
      {EGA_PALETTE.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.swatch,
            { backgroundColor: color },
            selected === color ? styles.selectedBorder : styles.normalBorder,
          ]}
          onPress={() => onSelect(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  swatch: {
    width: 28,
    height: 28,
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: '#111111',
  },
  normalBorder: {
    borderWidth: 1,
    borderColor: '#555555',
  },
});
