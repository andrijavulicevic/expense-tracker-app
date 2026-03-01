import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'destructive' | 'ghost';
  style?: ViewStyle;
}

export function Button({ title, onPress, disabled = false, variant = 'primary', style }: ButtonProps) {
  const bgColor =
    variant === 'primary'
      ? '#007AFF'
      : variant === 'destructive'
        ? 'transparent'
        : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor },
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <ThemedText
        style={[
          styles.text,
          variant === 'primary' && styles.primaryText,
          variant === 'destructive' && styles.destructiveText,
        ]}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  destructiveText: {
    color: '#FF3B30',
  },
});
