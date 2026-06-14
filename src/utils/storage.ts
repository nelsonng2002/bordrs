import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedEdit } from '../types';

const STORAGE_KEY = 'bordr_saved_edits';

export async function getSavedEdits(): Promise<SavedEdit[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveEdit(edit: SavedEdit): Promise<void> {
  const edits = await getSavedEdits();
  edits.unshift(edit);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

export async function deleteEdit(id: string): Promise<void> {
  const edits = await getSavedEdits();
  const filtered = edits.filter((e) => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
