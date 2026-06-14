import { Format } from './types';

export const EGA_PALETTE = [
  '#ffffff',
  '#000000',
  '#ff0000',
  '#0000ff',
  '#00ff00',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
];

export const FORMATS: Record<Format, { width: number; height: number; label: string }> = {
  '1:1': { width: 1080, height: 1080, label: 'Square' },
  '4:5': { width: 1080, height: 1350, label: 'Full' },
  '9:16': { width: 1080, height: 1920, label: 'Story' },
};

export const BORDER_MIN = 0;
export const BORDER_MAX = 200;
export const BORDER_STEP = 4;
export const BORDER_DEFAULT = 40;
