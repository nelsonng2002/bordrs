import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { HomeScreen } from './src/screens/HomeScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { ExportScreen } from './src/screens/ExportScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { FileBrowser } from './src/screens/FileBrowser';
import { pickImage } from './src/hooks/useImagePicker';
import { captureExport, saveToCameraRoll, copyToClipboard } from './src/hooks/useExport';
import { saveEdit } from './src/utils/storage';
import { Screen, EditorState, SavedEdit } from './src/types';
import { BORDER_DEFAULT } from './src/constants';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    VT323: require('./assets/fonts/VT323-Regular.ttf'),
    IBMPlexMono: require('./assets/fonts/IBMPlexMono-Regular.ttf'),
  });

  const [screen, setScreen] = useState<Screen>('home');
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [exportedUri, setExportedUri] = useState<string | null>(null);
  const [fileBrowserOrigin, setFileBrowserOrigin] = useState<'home' | 'editor'>('home');
  const exportViewRef = useRef<View>(null);

  const handleSelectPhoto = useCallback(async () => {
    const result = await pickImage();
    if (result) {
      setEditorState({
        imageUri: result.uri,
        imageWidth: result.width,
        imageHeight: result.height,
        filename: result.filename,
        format: '1:1',
        borderWidth: BORDER_DEFAULT,
        backdropColor: '#ffffff',
      });
      setScreen('editor');
    }
  }, []);

  const handleExport = useCallback(async () => {
    if (!editorState) return;
    const uri = await captureExport(exportViewRef, editorState.format);
    if (!uri) {
      Alert.alert('BORDR', 'Export failed. Please try again.');
      return;
    }
    setExportedUri(uri);
    setScreen('export');
  }, [editorState]);

  const handleSaveToCameraRoll = useCallback(async () => {
    if (!exportedUri || !editorState) return;
    const result = await saveToCameraRoll(exportedUri);
    if (result.success) {
      await saveEdit({
        id: Date.now().toString(),
        originalUri: editorState.imageUri,
        exportedUri,
        filename: editorState.filename,
        imageWidth: editorState.imageWidth,
        imageHeight: editorState.imageHeight,
        format: editorState.format,
        borderWidth: editorState.borderWidth,
        backdropColor: editorState.backdropColor,
        savedAt: Date.now(),
      });
      setScreen('saved');
    } else {
      Alert.alert('BORDR', `Could not save. ${result.error ?? 'Check photo library permissions.'}`);
    }
  }, [exportedUri, editorState]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!exportedUri) return;
    await copyToClipboard(exportedUri);
    setScreen('saved');
  }, [exportedUri]);

  const handleFileSelect = useCallback((edit: SavedEdit) => {
    setEditorState({
      imageUri: edit.originalUri,
      imageWidth: edit.imageWidth ?? 1080,
      imageHeight: edit.imageHeight ?? 1080,
      filename: edit.filename,
      format: edit.format,
      borderWidth: edit.borderWidth,
      backdropColor: edit.backdropColor,
    });
    setScreen('editor');
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {screen === 'home' && (
        <HomeScreen
          onSelectPhoto={handleSelectPhoto}
          onOpenFiles={() => { setFileBrowserOrigin('home'); setScreen('fileBrowser'); }}
        />
      )}
      {screen === 'editor' && editorState && (
        <EditorScreen
          state={editorState}
          onUpdateState={(updates) => setEditorState((s) => (s ? { ...s, ...updates } : s))}
          onClose={() => setScreen('home')}
          onExport={handleExport}
          onOpenFiles={() => { setFileBrowserOrigin('editor'); setScreen('fileBrowser'); }}
          captureRef={exportViewRef}
        />
      )}
      {screen === 'export' && editorState && (
        <ExportScreen
          state={editorState}
          exportedUri={exportedUri}
          onSaveToCameraRoll={handleSaveToCameraRoll}
          onCopyToClipboard={handleCopyToClipboard}
          onCancel={() => setScreen('editor')}
          onGoHome={() => setScreen('home')}
        />
      )}
      {screen === 'saved' && (
        <SavedScreen
          onOk={() => setScreen('editor')}
          onNewImage={() => setScreen('home')}
          onClose={() => setScreen('home')}
        />
      )}
      {screen === 'fileBrowser' && (
        <FileBrowser
          onClose={() => setScreen(fileBrowserOrigin)}
          onSelectFile={handleFileSelect}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.silver,
  },
});
