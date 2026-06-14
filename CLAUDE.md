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
