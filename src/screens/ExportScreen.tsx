import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TitleBar } from '../components/TitleBar';
import { MenuBar } from '../components/MenuBar';
import { StatusBar } from '../components/StatusBar';
import { RetroButton } from '../components/RetroButton';
import { DialogBox } from '../components/DialogBox';
import { colors, fonts, inset } from '../theme';
import { FORMATS } from '../constants';
import { EditorState } from '../types';

interface ExportScreenProps {
  state: EditorState;
  exportedUri: string | null;
  onSaveToCameraRoll: () => void;
  onCopyToClipboard: () => void;
  onCancel: () => void;
  onGoHome: () => void;
}

export function ExportScreen({
  state,
  exportedUri,
  onSaveToCameraRoll,
  onCopyToClipboard,
  onCancel,
  onGoHome,
}: ExportScreenProps) {
  const formatInfo = FORMATS[state.format];

  return (
    <View style={styles.container}>
      <TitleBar title="BORDR.EXE" />
      <MenuBar items={[{ label: 'File', onPress: onGoHome }, { label: 'Size' }, { label: 'Export' }]} />

      <View style={styles.content}>
        <View style={styles.thumbnailContainer}>
          {exportedUri && (
            <Image source={{ uri: exportedUri }} style={styles.thumbnail} resizeMode="contain" />
          )}
        </View>
        <Text style={styles.dimensions}>
          {formatInfo.width} × {formatInfo.height} · PNG
        </Text>

        <DialogBox title="Save As">
          <RetroButton label="SAVE TO CAMERA ROLL" onPress={onSaveToCameraRoll} fontSize={15} />
          <RetroButton label="COPY TO CLIPBOARD" onPress={onCopyToClipboard} fontSize={15} />
          <RetroButton label="CANCEL" onPress={onCancel} fontSize={15} />
        </DialogBox>
      </View>

      <StatusBar left="Export ready." />
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
    gap: 16,
  },
  thumbnailContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#aaaaaa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  dimensions: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: '#333333',
  },
});
