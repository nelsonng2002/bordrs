import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TitleBar } from '../components/TitleBar';
import { MenuBar } from '../components/MenuBar';
import { StatusBar } from '../components/StatusBar';
import { RetroButton } from '../components/RetroButton';
import { DialogBox } from '../components/DialogBox';
import { colors, fonts } from '../theme';

interface SavedScreenProps {
  onOk: () => void;
  onNewImage: () => void;
  onClose: () => void;
}

export function SavedScreen({ onOk, onNewImage, onClose }: SavedScreenProps) {
  return (
    <View style={styles.container}>
      <TitleBar title="BORDR.EXE" onClose={onClose} />
      <MenuBar items={[{ label: 'File' }, { label: 'Size' }, { label: 'Export' }]} />

      <View style={styles.content}>
        <DialogBox title="BORDR">
          <Text style={styles.heading}>SAVED</Text>
          <Text style={styles.message}>{'Image saved to\nCamera Roll'}</Text>
          <View style={styles.buttons}>
            <RetroButton label="OK" onPress={onOk} style={styles.okBtn} fontSize={15} />
            <RetroButton label="NEW IMAGE" onPress={onNewImage} fontSize={15} />
          </View>
        </DialogBox>
      </View>

      <StatusBar left="Done." />
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
    padding: 24,
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: '#111111',
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 8,
  },
  okBtn: {
    paddingHorizontal: 24,
  },
});
