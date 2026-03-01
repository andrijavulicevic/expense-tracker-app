import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ChipProps {
  label: string;
  icon: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Chip({ label, icon, color, selected, onPress }: ChipProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!selected) {
      cancelAnimation(scale);
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [selected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.1, { damping: 8, stiffness: 300 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : theme.backgroundElement,
          borderColor: selected ? color : theme.backgroundSelected,
        },
        animatedStyle,
      ]}>
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={18}
        color={selected ? '#FFFFFF' : color}
      />
      <Text
        style={[
          styles.label,
          { color: selected ? '#FFFFFF' : theme.text },
        ]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: Spacing.two,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
