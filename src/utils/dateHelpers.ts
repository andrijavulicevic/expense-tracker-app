import dayjs from 'dayjs';
import 'dayjs/locale/sr';

export function toDayjsLocale(locale: string): string {
  return locale === 'sr-Latn' ? 'sr' : 'en';
}

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

  return dayjs(dateStr).locale(toDayjsLocale(locale)).format('ddd, MMM D');
}

export function formatShortDate(dateStr: string, locale: string): string {
  return dayjs(dateStr).locale(toDayjsLocale(locale)).format('MMM D');
}

export function getMonthYear(year: number, month: number, locale: string): string {
  return dayjs().year(year).month(month).locale(toDayjsLocale(locale)).format('MMMM YYYY');
}

export function getDaysInMonth(year: number, month: number): number {
  return dayjs().year(year).month(month).daysInMonth();
}

export function getDaysElapsedInMonth(year: number, month: number): number {
  const now = dayjs();

  if (year === now.year() && month === now.month()) {
    return now.date();
  }

  return getDaysInMonth(year, month);
}
