import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { key: 'food', label: 'Food', icon: 'fast-food-outline', color: '#E8453C' },
  { key: 'transport', label: 'Transport', icon: 'car-outline', color: '#2AA89A' },
  { key: 'bills', label: 'Bills', icon: 'home-outline', color: '#3182CE' },
  { key: 'shopping', label: 'Shopping', icon: 'cart-outline', color: '#38A169' },
  { key: 'health', label: 'Health', icon: 'medkit-outline', color: '#E89B3C' },
  { key: 'fun', label: 'Fun', icon: 'game-controller-outline', color: '#9F5FC0' },
  { key: 'travel', label: 'Travel', icon: 'airplane-outline', color: '#D97706' },
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal-circle-outline', color: '#718096' },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<string, Category>;
