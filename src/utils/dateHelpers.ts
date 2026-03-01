const DAY_MS = 86400000;

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayString(): string {
  return toDateString(new Date());
}

export function yesterdayString(): string {
  return toDateString(new Date(Date.now() - DAY_MS));
}

export function formatSectionHeader(dateStr: string): string {
  const today = todayString();
  const yesterday = yesterdayString();

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthYear(year: number, month: number): string {
  const date = new Date(year, month);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getDaysElapsedInMonth(year: number, month: number): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  if (year === currentYear && month === currentMonth) {
    return now.getDate();
  }

  // Past month — all days elapsed
  return getDaysInMonth(year, month);
}
