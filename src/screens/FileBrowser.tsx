import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { TitleBar } from '../components/TitleBar';
import { MenuBar } from '../components/MenuBar';
import { StatusBar } from '../components/StatusBar';
import { colors, fonts, inset } from '../theme';
import { SavedEdit } from '../types';
import { getSavedEdits } from '../utils/storage';

interface FileBrowserProps {
  onClose: () => void;
  onSelectFile: (edit: SavedEdit) => void;
}

export function FileBrowser({ onClose, onSelectFile }: FileBrowserProps) {
  const [edits, setEdits] = useState<SavedEdit[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    getSavedEdits().then(setEdits);
  }, []);

  return (
    <View style={styles.container}>
      <TitleBar title="BORDR — Saved" onClose={onClose} />
      <MenuBar
        items={[
          { label: 'File', active: true },
          { label: 'View' },
          { label: 'Help' },
        ]}
      />

      {/* Path bar */}
      <View style={styles.pathBar}>
        <Text style={styles.pathText}>/saved/edits/</Text>
      </View>

      {/* File grid with decorative scrollbar */}
      <View style={styles.browserArea}>
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {edits.map((edit) => (
              <TouchableOpacity
                key={edit.id}
                style={styles.fileItem}
                onPress={() => {
                  setSelectedId(edit.id);
                  onSelectFile(edit);
                }}
              >
                <View style={[styles.fileThumbnail, { backgroundColor: edit.backdropColor }]}>
                  <View style={styles.filePhoto} />
                </View>
                <Text
                  style={[styles.fileName, selectedId === edit.id && styles.fileNameSelected]}
                  numberOfLines={1}
                >
                  {edit.filename}
                </Text>
              </TouchableOpacity>
            ))}
            {edits.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No saved edits.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Decorative scrollbar */}
        <View style={styles.scrollbar}>
          <View style={styles.scrollArrow}>
            <Text style={styles.scrollArrowText}>▲</Text>
          </View>
          <View style={styles.scrollTrack}>
            <View style={styles.scrollThumb} />
          </View>
          <View style={styles.scrollArrow}>
            <Text style={styles.scrollArrowText}>▼</Text>
          </View>
        </View>
      </View>

      <StatusBar left={`/saved/edits/ : ${edits.length} files`} right="BORDR" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.silver,
  },
  pathBar: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.menuBorder,
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  pathText: {
    fontFamily: fonts.heading,
    fontSize: 13,
    color: '#333333',
  },
  browserArea: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#aaaaaa',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  fileItem: {
    width: '30%',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  fileThumbnail: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: colors.menuBorder,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  filePhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d0d0d0',
  },
  fileName: {
    fontFamily: fonts.heading,
    fontSize: 11,
    color: '#333333',
    textAlign: 'center',
  },
  fileNameSelected: {
    color: colors.white,
    backgroundColor: colors.navy,
    paddingHorizontal: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: '#888888',
  },
  scrollbar: {
    width: 18,
    backgroundColor: colors.silver,
    borderWidth: 1,
    borderColor: colors.menuBorder,
    marginLeft: 2,
  },
  scrollArrow: {
    height: 18,
    backgroundColor: colors.silver,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: colors.white,
    borderLeftColor: colors.white,
    borderBottomColor: '#555555',
    borderRightColor: '#555555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArrowText: {
    fontFamily: fonts.heading,
    fontSize: 11,
    color: '#111111',
  },
  scrollTrack: {
    flex: 1,
    backgroundColor: '#aaaaaa',
    position: 'relative',
  },
  scrollThumb: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: 2,
    height: 36,
    backgroundColor: colors.silver,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: colors.white,
    borderLeftColor: colors.white,
    borderBottomColor: '#555555',
    borderRightColor: '#555555',
  },
});
