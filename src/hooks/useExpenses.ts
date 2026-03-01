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
  const expenses = useStore((s) => s.expenses);

  return useMemo(() => {
    const monthExpenses = expensesForMonth(expenses, year, month);
    const grouped = groupExpensesByDate(monthExpenses);
    const total = totalForMonth(expenses, year, month);
    const breakdown = categoryBreakdown(monthExpenses);
    const comparison = monthOverMonthChange(expenses, year, month);
    const average = dailyAverage(expenses, year, month);

    return {
      monthExpenses,
      grouped,
      total,
      breakdown,
      comparison,
      average,
    };
  }, [expenses, year, month]);
}
