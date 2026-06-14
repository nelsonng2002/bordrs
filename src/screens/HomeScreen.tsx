import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TitleBar } from '../components/TitleBar';
import { MenuBar } from '../components/MenuBar';
import { StatusBar } from '../components/StatusBar';
import { RetroButton } from '../components/RetroButton';
import { colors, fonts } from '../theme';

interface HomeScreenProps {
  onSelectPhoto: () => void;
  onOpenFiles: () => void;
}

export function HomeScreen({ onSelectPhoto, onOpenFiles }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <TitleBar title="BORDR.EXE" />
      <MenuBar
        items={[
          { label: 'File', onPress: onOpenFiles },
          { label: 'Help' },
          { label: 'About' },
        ]}
      />
      <View style={styles.content}>
        <Text style={styles.title}>BORDR</Text>
        <Text style={styles.subtitle}>{'borders for your\nphotos. that\'s it.'}</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconInner} />
        </View>
        <RetroButton label="SELECT PHOTO..." onPress={onSelectPhoto} style={styles.button} />
      </View>
      <StatusBar left="Ready." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.silver,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 20,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 48,
    color: '#111111',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderWidth: 3,
    borderColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 44,
    height: 44,
    backgroundColor: '#bbbbbb',
  },
  button: {
    width: '100%',
  },
});
