export type CategoryKey =
  | "food"
  | "transport"
  | "bills"
  | "shopping"
  | "health"
  | "fun"
  | "travel"
  | "other";

export interface Expense {
  id: string;
  title?: string;
  amount: number;
  category: CategoryKey;
  note?: string;
  date: string; // 'YYYY-MM-DD'
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  currency: string;
  language: string;
  hasOnboarded: boolean;
  syncUrl: string;
}

export interface SyncState {
  lastSyncedAt: string | null;
  isSyncing: boolean;
  error: string | null;
}

export interface Category {
  key: CategoryKey;
  label: string;
  icon: string;
  color: string;
}
