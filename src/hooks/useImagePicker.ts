import * as ImagePicker from 'expo-image-picker';

export async function pickImage(): Promise<{
  uri: string;
  filename: string;
  width: number;
  height: number;
} | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  });

  if (result.canceled || !result.assets[0]) return null;

  const asset = result.assets[0];
  const filename = asset.fileName ?? asset.uri.split('/').pop()?.split('.')[0] ?? 'IMG';

  return {
    uri: asset.uri,
    filename,
    width: asset.width,
    height: asset.height,
  };
}
