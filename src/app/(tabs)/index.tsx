import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExpenseRow } from '@/components/ExpenseRow';
import { MonthSelector } from '@/components/MonthSelector';
import { SpentCard } from '@/components/SpentCard';
import { SwipeableMonthView } from '@/components/SwipeableMonthView';
import { FAB } from '@/components/ui/FAB';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useExpenses } from '@/hooks/useExpenses';
import { useMonthNavigation } from '@/hooks/useMonthNavigation';
import { useTheme } from '@/hooks/use-theme';

const DEFAULT_KEYS = new Set(DEFAULT_CATEGORIES.map((c) => c.key));
import { useTranslation, getDateLocale } from '@/locales/i18n';
import { syncExpenses } from '@/services/syncService';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatSectionHeader } from '@/utils/dateHelpers';

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { getCategory } = useCategories();
  const language = useStore((s) => s.settings.language);
  const dateLocale = getDateLocale(language);
  const { year, month, goToPreviousMonth, goToNextMonth, isCurrentMonth } = useMonthNavigation();
  const { grouped, total, comparison, breakdown } = useExpenses(year, month);
  const currency = useStore((s) => s.settings.currency);
  const deleteExpense = useStore((s) => s.deleteExpense);

  const sections = grouped.map((group) => ({
    title: formatSectionHeader(group.date, t('dates.today'), t('dates.yesterday'), dateLocale),
    dailyTotal: group.total,
    data: group.expenses,
  }));

  const topCategories = breakdown.slice(0, 4);

  const handleDeleteExpense = (id: string) => {
    Alert.alert(t('home.deleteTitle'), t('home.deleteMessage'), [
      { text: t('home.cancel'), style: 'cancel' },
      {
        text: t('home.delete'),
        style: 'destructive',
        onPress: () => {
          deleteExpense(id);
          syncExpenses();
        },
      },
    ]);
  };

  return (
    <SwipeableMonthView onSwipeLeft={goToNextMonth} onSwipeRight={goToPreviousMonth} disableSwipeLeft={isCurrentMonth}>
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <MonthSelector
          year={year}
          month={month}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
          isCurrentMonth={isCurrentMonth}
        />
      </SafeAreaView>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <SpentCard total={total} currency={currency} comparison={comparison} />

            {topCategories.length > 0 && (
              <View style={styles.categoryPills}>
                {topCategories.map((cat) => {
                  const info = getCategory(cat.key);
                  return (
                    <View
                      key={cat.key}
                      style={[styles.pill, { backgroundColor: info.color + '15' }]}>
                      <Ionicons
                        name={info.icon as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={info.color}
                      />
                      <View>
                        <Text style={[styles.pillLabel, { color: theme.text }]}>
                          {DEFAULT_KEYS.has(cat.key) ? t(`categories.${cat.key}`) : info.label}
                        </Text>
                        <Text style={[styles.pillAmount, { color: theme.textSecondary }]}>
                          {formatCurrency(cat.total, currency)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionTotal, { color: theme.textSecondary }]}>
              {formatCurrency(section.dailyTotal, currency)}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ExpenseRow
            expense={item}
            currency={currency}
            onPress={() => router.push({ pathname: '/add-expense', params: { id: item.id } })}
            onDelete={() => handleDeleteExpense(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('home.noExpenses')}</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              {t('home.trackFirst')}
            </Text>
          </View>
        }
      />

      <FAB onPress={() => router.push('/add-expense')} />
    </View>
    </SwipeableMonthView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  listContent: {
    paddingBottom: 100,
  },
  headerContent: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    gap: Spacing.two,
  },
  pillIcon: {
    width: 18,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillAmount: {
    fontSize: 12,
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTotal: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: Spacing.two,
  },
  emptyIcon: {
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 15,
  },
});
