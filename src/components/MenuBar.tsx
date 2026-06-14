import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, raised } from '../theme';

interface MenuItem {
  label: string;
  onPress?: () => void;
  active?: boolean;
  variant?: 'default' | 'shiny';
}

interface MenuBarProps {
  items: MenuItem[];
}

export function MenuBar({ items }: MenuBarProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1300,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [shimmer]);

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isShiny = item.variant === 'shiny';

        return (
          <TouchableOpacity
            key={item.label}
            onPress={item.onPress}
            disabled={!item.onPress}
            style={isShiny && styles.shinyButton}
          >
            {isShiny && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.shine,
                  {
                    transform: [
                      {
                        translateX: shimmer.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-34, 68],
                        }),
                      },
                      { rotate: '18deg' },
                    ],
                  },
                ]}
              />
            )}
            <Text
              style={[
                styles.item,
                item.active && styles.activeItem,
                isShiny && styles.shinyItem,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: colors.menuBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 12,
  },
  item: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: '#111111',
  },
  activeItem: {
    textDecorationLine: 'underline',
  },
  shinyButton: {
    ...raised,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.shinyGold,
    marginVertical: -3,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  shinyItem: {
    color: colors.black,
    textShadowColor: colors.white,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  shine: {
    position: 'absolute',
    top: -8,
    bottom: -8,
    width: 18,
    backgroundColor: colors.white,
    opacity: 0.55,
  },
});
