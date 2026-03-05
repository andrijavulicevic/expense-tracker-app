import dayjs from 'dayjs';

export function toDateString(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function todayString(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function yesterdayString(): string {
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
}

export function formatSectionHeader(dateStr: string, todayLabel: string, yesterdayLabel: string, locale: string): string {
  if (dateStr === todayString()) return todayLabel;
  if (dateStr === yesterdayString()) return yesterdayLabel;

  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthYear(year: number, month: number, locale: string): string {
  const date = new Date(year, month);
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

export function getDaysInMonth(year: number, month: number): number {
  return dayjs(new Date(year, month)).daysInMonth();
}

export function getDaysElapsedInMonth(year: number, month: number): number {
  const now = dayjs();

  if (year === now.year() && month === now.month()) {
    return now.date();
  }

  return getDaysInMonth(year, month);
}
