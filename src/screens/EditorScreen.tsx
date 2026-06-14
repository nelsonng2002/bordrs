import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { TitleBar } from '../components/TitleBar';
import { MenuBar } from '../components/MenuBar';
import { StatusBar } from '../components/StatusBar';
import { RetroButton } from '../components/RetroButton';
import { ColorGrid } from '../components/ColorGrid';
import { colors, fonts } from '../theme';
import { FORMATS, BORDER_MIN, BORDER_MAX, BORDER_STEP } from '../constants';
import { Format, EditorState } from '../types';

interface EditorScreenProps {
  state: EditorState;
  onUpdateState: (updates: Partial<EditorState>) => void;
  onClose: () => void;
  onExport: () => void;
  onOpenFiles: () => void;
  captureRef: React.RefObject<View | null>;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function EditorScreen({
  state,
  onUpdateState,
  onClose,
  onExport,
  onOpenFiles,
  captureRef: exportRef,
}: EditorScreenProps) {
  const { imageUri, imageWidth, imageHeight, filename, format, borderWidth, backdropColor } = state;
  const formatInfo = FORMATS[format];
  const frameAspect = formatInfo.width / formatInfo.height;

  const previewMaxWidth = SCREEN_WIDTH - 24;
  const previewMaxHeight = 340;
  let previewWidth = previewMaxWidth;
  let previewHeight = previewWidth / frameAspect;
  if (previewHeight > previewMaxHeight) {
    previewHeight = previewMaxHeight;
    previewWidth = previewHeight * frameAspect;
  }

  const scaleFactor = previewWidth / formatInfo.width;
  const scaledBorder = borderWidth * scaleFactor;

  const photoAspect = imageWidth / imageHeight;
  const innerWidth = previewWidth - scaledBorder * 2;
  const innerHeight = previewHeight - scaledBorder * 2;
  let photoWidth: number;
  let photoHeight: number;
  if (photoAspect > innerWidth / innerHeight) {
    photoWidth = innerWidth;
    photoHeight = innerWidth / photoAspect;
  } else {
    photoHeight = innerHeight;
    photoWidth = innerHeight * photoAspect;
  }

  return (
    <View style={styles.container}>
      <TitleBar title={`BORDR — ${filename}`} onClose={onClose} />
      <MenuBar
        items={[
          { label: 'File', onPress: onOpenFiles },
          { label: 'Size' },
          { label: 'Export', onPress: onExport },
        ]}
      />

      {/* Canvas area */}
      <View style={styles.canvas}>
        <View
          ref={exportRef}
          collapsable={false}
          style={{
            width: previewWidth,
            height: previewHeight,
            backgroundColor: backdropColor,
            alignItems: 'center',
            justifyContent: 'center',
            padding: scaledBorder,
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: photoWidth, height: photoHeight }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Control panel */}
      <View style={styles.panel}>
        <Text style={styles.label}>FORMAT</Text>
        <View style={styles.formatRow}>
          {(['1:1', '4:5', '9:16'] as Format[]).map((f) => (
            <RetroButton
              key={f}
              label={f}
              active={format === f}
              onPress={() => onUpdateState({ format: f })}
              style={styles.formatBtn}
              fontSize={15}
            />
          ))}
        </View>

        <Text style={styles.label}>BORDER WIDTH</Text>
        <View style={styles.widthRow}>
          <RetroButton
            label="◂"
            onPress={() =>
              onUpdateState({ borderWidth: Math.max(BORDER_MIN, borderWidth - BORDER_STEP) })
            }
            style={styles.arrowBtn}
            fontSize={16}
          />
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${((borderWidth - BORDER_MIN) / (BORDER_MAX - BORDER_MIN)) * 100}%` },
              ]}
            />
          </View>
          <RetroButton
            label="▸"
            onPress={() =>
              onUpdateState({ borderWidth: Math.min(BORDER_MAX, borderWidth + BORDER_STEP) })
            }
            style={styles.arrowBtn}
            fontSize={16}
          />
          <View style={styles.valueBox}>
            <Text style={styles.valueText}>{borderWidth}</Text>
          </View>
        </View>

        <Text style={styles.label}>BACKDROP</Text>
        <ColorGrid selected={backdropColor} onSelect={(c) => onUpdateState({ backdropColor: c })} />

        <RetroButton label="EXPORT" onPress={onExport} style={styles.exportBtn} />
      </View>

      <StatusBar
        left={`${format} ${formatInfo.label} · ${formatInfo.width}×${formatInfo.height}`}
        right={`Border: ${borderWidth}px`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.silver,
  },
  canvas: {
    flex: 1,
    backgroundColor: colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  panel: {
    backgroundColor: colors.silver,
    borderTopWidth: 2,
    borderTopColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  label: {
    fontFamily: fonts.heading,
    fontSize: 13,
    color: '#555555',
    marginBottom: 4,
  },
  formatRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
  },
  formatBtn: {
    flex: 1,
    paddingVertical: 6,
  },
  widthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  arrowBtn: {
    width: 30,
    height: 30,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.menuBorder,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.navy,
  },
  valueBox: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.menuBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 36,
    alignItems: 'center',
  },
  valueText: {
    fontFamily: fonts.heading,
    fontSize: 14,
    color: '#111111',
  },
  exportBtn: {
    marginTop: 10,
  },
});
