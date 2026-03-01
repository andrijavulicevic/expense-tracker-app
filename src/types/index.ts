export type CategoryKey = 'food' | 'transport' | 'bills' | 'shopping' | 'health' | 'fun' | 'other';

export interface Expense {
  id: string;
  title?: string;
  amount: number;
  category: CategoryKey;
  note?: string;
  date: string; // 'YYYY-MM-DD'
  createdAt: string;
}

export interface Settings {
  currency: string;
  hasOnboarded: boolean;
}

export interface Category {
  key: CategoryKey;
  label: string;
  icon: string;
  color: string;
}
