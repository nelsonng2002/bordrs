import React, { useEffect, useMemo, useRef, useState } from 'react';
import Matter from 'matter-js';
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { TitleBar } from '../components/TitleBar';
import { MenuBar } from '../components/MenuBar';
import { StatusBar } from '../components/StatusBar';
import { colors, fonts } from '../theme';
import { SavedEdit } from '../types';
import { getSavedEdits } from '../utils/storage';

interface FileBrowserProps {
  onClose: () => void;
  onSelectFile: (edit: SavedEdit) => void;
}

export function FileBrowser({ onClose, onSelectFile }: FileBrowserProps) {
  const [edits, setEdits] = useState<SavedEdit[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [physicsFrame, setPhysicsFrame] = useState(0);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  useEffect(() => {
    getSavedEdits().then(setEdits);
  }, []);

  const tileSize = useMemo(() => getPhysicsTileSize(stageSize.width), [stageSize.width]);

  useEffect(() => {
    if (!physicsEnabled || edits.length === 0 || stageSize.width <= 0 || stageSize.height <= 0) {
      return;
    }

    const engine = Matter.Engine.create({ enableSleeping: false });
    engine.gravity.y = 1.05;
    engineRef.current = engine;
    bodiesRef.current.clear();

    const wallThickness = 96;
    const floor = Matter.Bodies.rectangle(
      stageSize.width / 2,
      stageSize.height + wallThickness / 2,
      stageSize.width + wallThickness * 2,
      wallThickness,
      { isStatic: true }
    );
    const ceiling = Matter.Bodies.rectangle(
      stageSize.width / 2,
      -wallThickness / 2,
      stageSize.width + wallThickness * 2,
      wallThickness,
      { isStatic: true }
    );
    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2,
      stageSize.height / 2,
      wallThickness,
      stageSize.height + wallThickness * 2,
      { isStatic: true }
    );
    const rightWall = Matter.Bodies.rectangle(
      stageSize.width + wallThickness / 2,
      stageSize.height / 2,
      wallThickness,
      stageSize.height + wallThickness * 2,
      { isStatic: true }
    );

    const columns = Math.max(1, Math.floor((stageSize.width - 16) / (tileSize.width + 8)));
    const bodies = edits.map((edit, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = 8 + column * (tileSize.width + 8) + tileSize.width / 2;
      const y = 14 + row * (tileSize.height + 10) + tileSize.height / 2;
      const body = Matter.Bodies.rectangle(x, y, tileSize.width, tileSize.height, {
        restitution: 0.58,
        friction: 0.4,
        frictionAir: 0.018,
        density: 0.002,
        label: edit.id,
      });
      bodiesRef.current.set(edit.id, body);
      return body;
    });

    Matter.Composite.add(engine.world, [floor, ceiling, leftWall, rightWall, ...bodies]);

    const step = (time: number) => {
      const lastTime = lastFrameTimeRef.current ?? time;
      const delta = Math.min(time - lastTime || 16.67, 33.33);
      lastFrameTimeRef.current = time;
      Matter.Engine.update(engine, delta);
      setPhysicsFrame((frame) => (frame + 1) % 100000);
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastFrameTimeRef.current = null;
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
      bodiesRef.current.clear();
      engineRef.current = null;
    };
  }, [edits, physicsEnabled, stageSize.height, stageSize.width, tileSize.height, tileSize.width]);

  const handleBrowserAreaLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setStageSize({ width, height });
  };

  return (
    <View style={styles.container}>
      <TitleBar title="BORDR — Saved" onClose={onClose} />
      <MenuBar
        items={[
          { label: 'File', active: true },
          { label: 'View' },
          { label: 'Help', onPress: () => setPhysicsEnabled(true), variant: 'shiny' },
        ]}
      />

      {/* Path bar */}
      <View style={styles.pathBar}>
        <Text style={styles.pathText}>/saved/edits/</Text>
      </View>

      {/* File grid with decorative scrollbar */}
      <View style={styles.browserArea}>
        <View style={styles.scrollArea} onLayout={handleBrowserAreaLayout}>
          {physicsEnabled && edits.length > 0 ? (
            <View style={styles.physicsStage}>
              {edits.map((edit) => {
                const body = bodiesRef.current.get(edit.id);
                if (!body) {
                  return null;
                }

                return (
                  <PhysicsFileItem
                    key={edit.id}
                    edit={edit}
                    body={body}
                    engine={engineRef.current}
                    frame={physicsFrame}
                    tileSize={tileSize}
                  />
                );
              })}
            </View>
          ) : (
            <ScrollView style={styles.normalScrollArea} showsVerticalScrollIndicator={false}>
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
                      <Image
                        source={{ uri: edit.originalUri }}
                        style={styles.filePhoto}
                        resizeMode="cover"
                      />
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
          )}
        </View>

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

interface PhysicsFileItemProps {
  edit: SavedEdit;
  body: Matter.Body;
  engine: Matter.Engine | null;
  frame: number;
  tileSize: { width: number; height: number };
}

function PhysicsFileItem({ edit, body, engine, frame, tileSize }: PhysicsFileItemProps) {
  const bodyRef = useRef(body);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [, setDragFrame] = useState(0);

  bodyRef.current = body;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const activeBody = bodyRef.current;
        dragStartRef.current = { x: activeBody.position.x, y: activeBody.position.y };
        Matter.Body.setVelocity(activeBody, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(activeBody, 0);
        Matter.Body.setStatic(activeBody, true);
      },
      onPanResponderMove: (_event, gesture) => {
        Matter.Body.setPosition(bodyRef.current, {
          x: dragStartRef.current.x + gesture.dx,
          y: dragStartRef.current.y + gesture.dy,
        });
        setDragFrame((value) => value + 1);
      },
      onPanResponderRelease: (_event, gesture) => {
        const activeBody = bodyRef.current;
        Matter.Body.setStatic(activeBody, false);
        Matter.Body.setVelocity(activeBody, { x: gesture.vx * 18, y: gesture.vy * 18 });
        Matter.Body.setAngularVelocity(activeBody, gesture.vx * 0.08);
      },
      onPanResponderTerminate: () => {
        Matter.Body.setStatic(bodyRef.current, false);
      },
    })
  ).current;

  // Read `frame` so React re-renders from the Matter body on every engine tick.
  void frame;
  void engine;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.physicsFileItem,
        {
          width: tileSize.width,
          height: tileSize.height,
          transform: [
            { translateX: body.position.x - tileSize.width / 2 },
            { translateY: body.position.y - tileSize.height / 2 },
            { rotate: `${body.angle}rad` },
          ],
        },
      ]}
    >
      <View style={[styles.fileThumbnail, { backgroundColor: edit.backdropColor }]}>
        <Image source={{ uri: edit.originalUri }} style={styles.filePhoto} resizeMode="cover" />
      </View>
      <Text style={styles.fileName} numberOfLines={1}>
        {edit.filename}
      </Text>
    </Animated.View>
  );
}

function getPhysicsTileSize(stageWidth: number) {
  if (stageWidth <= 0) {
    return { width: 104, height: 122 };
  }

  const width = Math.max(92, Math.min(116, (stageWidth - 40) / 3));
  return { width, height: 122 };
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
    overflow: 'hidden',
  },
  normalScrollArea: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  fileItem: {
    width: '31%',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  physicsStage: {
    flex: 1,
    position: 'relative',
  },
  physicsFileItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  fileThumbnail: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.menuBorder,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  filePhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d0d0d0',
  },
  fileName: {
    fontFamily: fonts.heading,
    fontSize: 15,
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
