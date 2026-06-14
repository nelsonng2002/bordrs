import { RefObject } from 'react';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import { FORMATS } from '../constants';
import { Format } from '../types';

export async function captureExport(
  viewRef: RefObject<any>,
  format: Format
): Promise<string | null> {
  const { width, height } = FORMATS[format];
  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      width,
      height,
    });
    return uri;
  } catch (e) {
    console.warn('captureExport failed:', e);
    return null;
  }
}

export async function saveToCameraRoll(uri: string): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') return false;
  try {
    await MediaLibrary.saveToLibraryAsync(uri);
    return true;
  } catch {
    return false;
  }
}

export async function copyToClipboard(uri: string): Promise<boolean> {
  try {
    await Clipboard.setImageAsync(uri);
    return true;
  } catch {
    return false;
  }
}
