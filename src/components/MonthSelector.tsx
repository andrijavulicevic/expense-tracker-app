import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getMonthYear } from '@/utils/dateHelpers';

interface MonthSelectorProps {
  year: number;
  month: number;
  onPrevious: () => void;
  onNext: () => void;
  isCurrentMonth: boolean;
}

export function MonthSelector({ year, month, onPrevious, onNext, isCurrentMonth }: MonthSelectorProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Pressable onPress={onPrevious} style={styles.arrow}>
        <Text style={[styles.arrowText, { color: theme.text }]}>‹</Text>
      </Pressable>
      <Text style={[styles.label, { color: theme.text }]}>{getMonthYear(year, month)}</Text>
      <Pressable
        onPress={onNext}
        disabled={isCurrentMonth}
        style={styles.arrow}>
        <Text
          style={[
            styles.arrowText,
            { color: isCurrentMonth ? theme.textSecondary : theme.text },
            isCurrentMonth && styles.disabledArrow,
          ]}>
          ›
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  arrow: {
    padding: Spacing.two,
  },
  arrowText: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
  disabledArrow: {
    opacity: 0.3,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    minWidth: 160,
    textAlign: 'center',
  },
});
