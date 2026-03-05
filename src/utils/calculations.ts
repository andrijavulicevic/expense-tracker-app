import { Expense, CategoryKey } from '@/types';
import { getDaysElapsedInMonth } from './dateHelpers';

function matchesMonth(dateStr: string, year: number, month: number): boolean {
  // Parse year/month directly from the "YYYY-MM-DD" string.
  // Avoids creating a Date object which causes timezone issues:
  // Hermes (Android) parses date-only ISO strings as UTC, shifting
  // dates backward in negative UTC offsets (e.g. March 1 → Feb 28).
  const y = parseInt(dateStr.substring(0, 4), 10);
  const m = parseInt(dateStr.substring(5, 7), 10) - 1; // 0-indexed to match JS months
  return y === year && m === month;
}

export function totalForMonth(expenses: Expense[], year: number, month: number): number {
  return expenses
    .filter((e) => matchesMonth(e.date, year, month))
    .reduce((sum, e) => sum + e.amount, 0);
}

export function expensesForMonth(expenses: Expense[], year: number, month: number): Expense[] {
  return expenses.filter((e) => matchesMonth(e.date, year, month));
}

export interface CategoryTotal {
  key: CategoryKey;
  total: number;
  percentage: number;
}

export function categoryBreakdown(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<CategoryKey, number>();

  for (const e of expenses) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }

  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0);

  return Array.from(totals.entries())
    .map(([key, total]) => ({
      key,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function monthOverMonthChange(
  expenses: Expense[],
  year: number,
  month: number
): { percentage: number; direction: 'up' | 'down' | 'same' } {
  const current = totalForMonth(expenses, year, month);

  // Previous month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const previous = totalForMonth(expenses, prevYear, prevMonth);

  if (previous === 0) return { percentage: 0, direction: 'same' };

  const change = ((current - previous) / previous) * 100;

  return {
    percentage: Math.abs(Math.round(change)),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
  };
}

export function dailyAverage(expenses: Expense[], year: number, month: number): number {
  const total = totalForMonth(expenses, year, month);
  const days = getDaysElapsedInMonth(year, month);
  return days > 0 ? total / days : 0;
}

export interface GroupedExpenses {
  date: string;
  total: number;
  expenses: Expense[];
}

export function groupExpensesByDate(expenses: Expense[]): GroupedExpenses[] {
  const groups = new Map<string, Expense[]>();

  for (const e of expenses) {
    const list = groups.get(e.date) ?? [];
    list.push(e);
    groups.set(e.date, list);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, exps]) => ({
      date,
      total: exps.reduce((sum, e) => sum + e.amount, 0),
      expenses: exps.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }));
}
