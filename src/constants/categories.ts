import { Category } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  { key: 'food', label: 'Food', icon: 'fast-food-outline', color: '#E8453C' },
  { key: 'transport', label: 'Transport', icon: 'car-outline', color: '#2AA89A' },
  { key: 'bills', label: 'Bills', icon: 'home-outline', color: '#3182CE' },
  { key: 'shopping', label: 'Shopping', icon: 'cart-outline', color: '#38A169' },
  { key: 'health', label: 'Health', icon: 'medkit-outline', color: '#E89B3C' },
  { key: 'fun', label: 'Fun', icon: 'game-controller-outline', color: '#9F5FC0' },
  { key: 'travel', label: 'Travel', icon: 'airplane-outline', color: '#D97706' },
  { key: 'subscriptions', label: 'Subscriptions', icon: 'tv-outline', color: '#E44D8A' },
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal-circle-outline', color: '#718096' },
];

export const ICON_OPTIONS = [
  'pricetag-outline',
  'gift-outline',
  'book-outline',
  'musical-notes-outline',
  'paw-outline',
  'fitness-outline',
  'school-outline',
  'construct-outline',
  'shirt-outline',
  'cafe-outline',
  'wine-outline',
  'bicycle-outline',
  'football-outline',
  'camera-outline',
  'cut-outline',
  'briefcase-outline',
  'hammer-outline',
  'bulb-outline',
  'leaf-outline',
  'heart-outline',
];

export const COLOR_OPTIONS = [
  '#E8453C',
  '#E44D8A',
  '#9F5FC0',
  '#3182CE',
  '#2AA89A',
  '#38A169',
  '#D97706',
  '#E89B3C',
  '#8B5CF6',
  '#64748B',
];

export const FALLBACK_CATEGORY: Category = {
  key: 'unknown',
  label: 'Unknown',
  icon: 'help-circle-outline',
  color: '#718096',
};

export function getAllCategories(custom: Category[]): Category[] {
  const otherIndex = DEFAULT_CATEGORIES.findIndex((c) => c.key === 'other');
  const before = DEFAULT_CATEGORIES.slice(0, otherIndex);
  const other = DEFAULT_CATEGORIES.slice(otherIndex);
  return [...before, ...custom, ...other];
}

export function getCategoryMap(custom: Category[]): Record<string, Category> {
  const all = getAllCategories(custom);
  return Object.fromEntries(all.map((c) => [c.key, c]));
}
