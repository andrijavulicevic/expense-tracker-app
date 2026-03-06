export type CategoryKey = string;

export interface Expense {
  id: string;
  title?: string;
  amount: number;
  category: CategoryKey;
  note?: string;
  date: string; // 'YYYY-MM-DD'
  addedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type ThemePreference = 'system' | 'light' | 'dark';

export interface Settings {
  currency: string;
  language: string;
  theme: ThemePreference;
  userName: string;
  hasOnboarded: boolean;
  syncUrl: string;
}

export interface SyncState {
  lastSyncedAt: string | null;
  isSyncing: boolean;
  error: string | null;
}

export interface Category {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export type CustomCategory = Category;
