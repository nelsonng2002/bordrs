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
        <View style={styles.iconContainer}>
          <Text style={styles.title}>BORDR</Text>
        </View>
        <Text style={styles.subtitle}>{'borders for your\nphotos. that\'s it.'}</Text>
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
    width: 148,
    height: 148,
    borderWidth: 3,
    borderColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
  },
});
