# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Expo Version

This project uses **Expo SDK 56**. Always read the versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code — Expo APIs change significantly between SDK versions.

## Commands

```bash
npm start              # Start Expo dev server (scan QR with Expo Go)
npm run ios            # Run on iOS simulator (requires prebuild)
npm run android        # Run on Android emulator (requires prebuild)
npx tsc --noEmit       # Type check (no test suite exists)
npx expo prebuild      # Regenerate native ios/ and android/ folders
```

Testing is done manually on device via Expo Go. There are no automated tests.

## Architecture

**Navigation:** State-based, no React Navigation. `App.tsx` owns a `screen` state (`'home' | 'editor' | 'export' | 'saved' | 'fileBrowser'`) and conditionally renders one screen at a time. All cross-screen callbacks are defined in `App.tsx` and passed as props.

**Image export flow:**
1. `EditorScreen` renders the bordered preview into a `View` with `ref={exportViewRef}` and `collapsable={false}` — this same view is what gets captured
2. On export, `captureRef` from `react-native-view-shot` captures that view, scaled to the target Instagram dimensions (1080×1080, 1080×1350, or 1080×1920)
3. The captured URI flows: `App.tsx` → `ExportScreen` → `saveToCameraRoll` or `copyToClipboard`

**Photo rendering:** Photos render at their original aspect ratio (`resizeMode="contain"`) inside the format frame — they are never cropped. The frame/canvas size is determined by the selected format (1:1, 4:5, 9:16), and border padding is applied around the photo within that frame.

**Retro UI system** (`src/theme.ts`):
- `raised` / `pressed` / `inset` — pre-built `ViewStyle` objects for Win95-style beveled borders. Spread these into StyleSheet styles rather than re-declaring border properties.
- `colors` and `fonts` — use these tokens everywhere; never hardcode `#c0c0c0`, `#000080`, `'VT323'`, etc.
- Fonts must be loaded via `useFonts` in `App.tsx` before any text renders. The app returns `null` until fonts are ready.

**Persistent storage:** `src/utils/storage.ts` wraps AsyncStorage with typed helpers for `SavedEdit` records. The `FileBrowser` screen reads these on mount.

**Key types** (`src/types.ts`):
- `EditorState` — the live editing session (imageUri, imageWidth/Height, format, borderWidth, backdropColor)
- `SavedEdit` — persisted record including original URI and exported URI

## File Map

### Root
- `App.tsx` — App entry point. Owns `screen` state, `editorState`, `exportedUri`, and `exportViewRef`. Defines all cross-screen callbacks and conditionally renders screens.
- `index.ts` — Expo entry point; registers App component.
- `app.json` — Expo config (name, slug, icons, permissions).

### `src/`
- `src/types.ts` — All shared TypeScript types: `Format` (`'1:1'|'4:5'|'9:16'`), `Screen`, `EditorState`, `SavedEdit`.
- `src/constants.ts` — `EGA_PALETTE` (8 colors), `FORMATS` (pixel dimensions + labels per format), `BORDER_MIN/MAX/STEP/DEFAULT`.
- `src/theme.ts` — Design tokens: `colors`, `fonts`, and Win95-style border presets `raised`/`pressed`/`inset` (spread these into StyleSheet styles, never inline border properties).

### `src/screens/`
- `EditorScreen.tsx` — Main editing view. Shows live bordered preview (the `exportViewRef` view), format picker (1:1/4:5/9:16), border width stepper, and `ColorGrid` for backdrop. Scales preview to fit screen while computing pixel-perfect border for export.
- `HomeScreen.tsx` — Landing screen with "SELECT PHOTO..." button and file browser access.
- `ExportScreen.tsx` — Shows thumbnail of captured image with "Save to Camera Roll" / "Copy to Clipboard" / "Cancel" actions inside a `DialogBox`.
- `SavedScreen.tsx` — Confirmation screen shown after successful save. Has "OK" (back to editor) and "NEW IMAGE" (back to home) buttons.
- `FileBrowser.tsx` — Win95-style file browser listing all `SavedEdit` records from AsyncStorage. Tapping a file calls `onSelectFile` to reload that edit into the editor.

### `src/hooks/`
- `useImagePicker.ts` — `pickImage()`: launches `expo-image-picker`, returns `{uri, filename, width, height}` or null.
- `useExport.ts` — Three async functions: `captureExport(viewRef, format)` captures the view via `react-native-view-shot` at full Instagram resolution; `saveToCameraRoll(uri)` saves via `expo-media-library`; `copyToClipboard(uri)` copies via `expo-clipboard`.

### `src/utils/`
- `storage.ts` — AsyncStorage helpers keyed to `'bordr_saved_edits'`: `getSavedEdits()`, `saveEdit(edit)` (prepends), `deleteEdit(id)`.

### `src/components/`
- `TitleBar.tsx` — Navy bar with title and optional `×` close button (renders `▫` if no `onClose` prop).
- `MenuBar.tsx` — Horizontal row of text menu items; items without `onPress` are non-interactive.
- `StatusBar.tsx` — Footer bar with optional left/right text labels.
- `RetroButton.tsx` — Win95 push button with press animation toggling `raised`/`pressed` theme borders. Supports `active` prop for toggle state.
- `ColorGrid.tsx` — Horizontal wrap of 28×28 color swatches from `EGA_PALETTE`. Selected swatch gets a thick border.
- `DialogBox.tsx` — Navy title bar + silver content area with `raised` border; wraps arbitrary children.

### `assets/`
- `fonts/VT323-Regular.ttf` — Pixel/retro display font, used for all headings (`fonts.heading`).
- `fonts/IBMPlexMono-Regular.ttf` — Monospace font, used for body text (`fonts.body`).
- `icon.png`, `splash-icon.png`, `favicon.png` — App icons.
- `android-icon-background.png`, `android-icon-foreground.png`, `android-icon-monochrome.png` — Adaptive Android icon layers.
