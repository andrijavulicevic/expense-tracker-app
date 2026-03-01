import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideOutLeft } from 'react-native-reanimated';

import { CATEGORY_MAP } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Expense } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

interface ExpenseRowProps {
  expense: Expense;
  currency: string;
  onPress: () => void;
  onDelete: () => void;
}

export function ExpenseRow({ expense, currency, onPress, onDelete }: ExpenseRowProps) {
  const theme = useTheme();
  const category = CATEGORY_MAP[expense.category];

  return (
    <Animated.View exiting={SlideOutLeft.duration(200)}>
      <Pressable
        onPress={onPress}
        onLongPress={onDelete}
        style={({ pressed }) => [
          styles.container,
          { backgroundColor: pressed ? theme.backgroundSelected : 'transparent' },
        ]}>
        <View style={[styles.iconContainer, { backgroundColor: category?.color + '20' }]}>
          <Ionicons
            name={category?.icon as keyof typeof Ionicons.glyphMap}
            size={20}
            color={category?.color}
          />
        </View>
        <View style={styles.details}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {expense.title || category?.label}
          </Text>
          <Text style={[styles.category, { color: theme.textSecondary }]}>
            {expense.title ? category?.label : ''}
          </Text>
        </View>
        <Text style={[styles.amount, { color: theme.text }]}>
          -{formatCurrency(expense.amount, currency)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.three,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  category: {
    fontSize: 13,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
