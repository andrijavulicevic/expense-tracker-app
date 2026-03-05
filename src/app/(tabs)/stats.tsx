import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DonutChart } from '@/components/DonutChart';
import { ExpenseRow } from '@/components/ExpenseRow';
import { MonthSelector } from '@/components/MonthSelector';
import { Card } from '@/components/ui/Card';
import { CATEGORY_MAP } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useExpenses } from '@/hooks/useExpenses';
import { useMonthNavigation } from '@/hooks/useMonthNavigation';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/locales/i18n';
import { useStore } from '@/store/useStore';
import { CategoryKey } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

export default function StatsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { year, month, goToPreviousMonth, goToNextMonth, isCurrentMonth } = useMonthNavigation();
  const { monthExpenses, total, breakdown, average } = useExpenses(year, month);
  const currency = useStore((s) => s.settings.currency);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

  const categoryExpenses = selectedCategory
    ? monthExpenses.filter((e) => e.category === selectedCategory)
    : [];

  const handleCloseSheet = useCallback(() => setSelectedCategory(null), []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={['top']}>
        <MonthSelector
          year={year}
          month={month}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
          isCurrentMonth={isCurrentMonth}
        />
      </SafeAreaView>

      {monthExpenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={48} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {t('stats.noExpenses')}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.totalAmount, { color: theme.text }]}>
            {formatCurrency(total, currency)}
          </Text>

          <DonutChart data={breakdown} total={total} currency={currency} />

          <View style={styles.breakdownList}>
            {breakdown.map((item) => {
              const info = CATEGORY_MAP[item.key];
              return (
                <Pressable
                  key={item.key}
                  onPress={() => setSelectedCategory(item.key)}
                  style={({ pressed }) => [
                    styles.breakdownRow,
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}>
                  <View style={[styles.dot, { backgroundColor: info?.color }]} />
                  <Text style={[styles.breakdownLabel, { color: theme.text }]}>
                    <Ionicons
                      name={info?.icon as keyof typeof Ionicons.glyphMap}
                      size={16}
                      color={info?.color}
                    />{' '}
                    {t(`categories.${item.key}`)}
                  </Text>
                  <Text style={[styles.breakdownAmount, { color: theme.text }]}>
                    {formatCurrency(item.total, currency)}
                  </Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: info?.color,
                        },
                      ]}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Card style={styles.averageCard}>
            <Text style={[styles.averageLabel, { color: theme.textSecondary }]}>
              {t('stats.dailyAverage')}
            </Text>
            <Text style={[styles.averageAmount, { color: theme.text }]}>
              {t('stats.averageText', { amount: formatCurrency(average, currency) })}
            </Text>
          </Card>
        </ScrollView>
      )}

      <Modal
        visible={selectedCategory !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseSheet}>
        <SafeAreaView style={[styles.sheetContainer, { backgroundColor: theme.background }]} edges={['top']}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>
              {selectedCategory ? t('stats.categoryExpenses', { category: t(`categories.${selectedCategory}`) }) : ''}
            </Text>
            <Pressable onPress={handleCloseSheet}>
              <Text style={[styles.sheetClose, { color: '#007AFF' }]}>{t('stats.done')}</Text>
            </Pressable>
          </View>
          <FlatList
            data={categoryExpenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseRow
                expense={item}
                currency={currency}
                onPress={() => {}}
                onDelete={() => {}}
              />
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textSecondary, padding: Spacing.four }]}>
                {t('stats.noCategory')}
              </Text>
            }
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
    paddingBottom: 100,
  },
  totalAmount: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -1,
  },
  breakdownList: {
    gap: Spacing.one,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.two,
    borderRadius: 10,
    gap: Spacing.two,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownLabel: {
    fontSize: 15,
    fontWeight: '500',
    width: 100,
  },
  breakdownAmount: {
    fontSize: 15,
    fontWeight: '600',
    width: 90,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
  averageCard: {
    gap: Spacing.one,
  },
  averageLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  averageAmount: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  emptyIcon: {
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  sheetContainer: {
    flex: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sheetClose: {
    fontSize: 17,
    fontWeight: '500',
  },
});
