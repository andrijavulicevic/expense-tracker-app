import { useMemo } from 'react';

import { useStore } from '@/store/useStore';
import {
  categoryBreakdown,
  dailyAverage,
  expensesForMonth,
  groupExpensesByDate,
  monthOverMonthChange,
  totalForMonth,
} from '@/utils/calculations';

export function useExpenses(year: number, month: number) {
  const allExpenses = useStore((s) => s.expenses);

  return useMemo(() => {
    const monthExpenses = expensesForMonth(allExpenses, year, month);
    const grouped = groupExpensesByDate(monthExpenses);
    const total = totalForMonth(allExpenses, year, month);
    const breakdown = categoryBreakdown(monthExpenses);
    const comparison = monthOverMonthChange(allExpenses, year, month);
    const average = dailyAverage(allExpenses, year, month);

    return {
      monthExpenses,
      grouped,
      total,
      breakdown,
      comparison,
      average,
    };
  }, [allExpenses, year, month]);
}
