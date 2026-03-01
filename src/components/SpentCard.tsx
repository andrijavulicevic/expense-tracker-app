import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/utils/formatCurrency';

interface SpentCardProps {
  total: number;
  currency: string;
  comparison: {
    percentage: number;
    direction: 'up' | 'down' | 'same';
  };
}

export function SpentCard({ total, currency, comparison }: SpentCardProps) {
  const theme = useTheme();

  const comparisonText =
    comparison.direction === 'same'
      ? ''
      : comparison.direction === 'up'
        ? `↑ ${comparison.percentage}% more than last month`
        : `↓ ${comparison.percentage}% less than last month`;

  const comparisonColor = comparison.direction === 'up' ? '#FF6B6B' : '#4ECDC4';

  return (
    <Card style={styles.card}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>Spent this month</Text>
      <Text style={[styles.amount, { color: theme.text }]}>
        {formatCurrency(total, currency)}
      </Text>
      {comparison.direction !== 'same' && (
        <Text style={[styles.comparison, { color: comparisonColor }]}>{comparisonText}</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },
  comparison: {
    fontSize: 13,
    fontWeight: '500',
  },
});
