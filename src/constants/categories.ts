import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { key: 'food', label: 'Food', icon: 'fast-food-outline', color: '#FF6B6B' },
  { key: 'transport', label: 'Transport', icon: 'car-outline', color: '#4ECDC4' },
  { key: 'bills', label: 'Bills', icon: 'home-outline', color: '#45B7D1' },
  { key: 'shopping', label: 'Shopping', icon: 'cart-outline', color: '#96CEB4' },
  { key: 'health', label: 'Health', icon: 'medkit-outline', color: '#FFEAA7' },
  { key: 'fun', label: 'Fun', icon: 'game-controller-outline', color: '#DDA0DD' },
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal-circle-outline', color: '#B0B0B0' },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<string, Category>;
