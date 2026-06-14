export type Format = '1:1' | '4:5' | '9:16';

export type Screen = 'home' | 'editor' | 'export' | 'saved' | 'fileBrowser';

export interface EditorState {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  filename: string;
  format: Format;
  borderWidth: number;
  backdropColor: string;
}

export interface SavedEdit {
  id: string;
  originalUri: string;
  exportedUri: string;
  filename: string;
  imageWidth: number;
  imageHeight: number;
  format: Format;
  borderWidth: number;
  backdropColor: string;
  savedAt: number;
}
