import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CustomCategory, Expense, Settings, SyncState } from '@/types';

interface AppState {
  expenses: Expense[];
  pendingDeleteIds: string[];
  customCategories: CustomCategory[];
  settings: Settings;
  syncState: SyncState;

  addExpense: (e: Omit<Expense, 'id' | 'addedBy' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteExpense: (id: string) => void;
  addCustomCategory: (cat: CustomCategory) => void;
  updateCustomCategory: (key: string, updates: Partial<Omit<CustomCategory, 'key'>>) => void;
  deleteCustomCategory: (key: string) => void;
  replaceCustomCategories: (cats: CustomCategory[]) => void;
  updateSettings: (s: Partial<Settings>) => void;
  setSyncState: (s: Partial<SyncState>) => void;
  replaceExpenses: (expenses: Expense[]) => void;
  clearPendingDeleteIds: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      expenses: [],
      pendingDeleteIds: [],
      customCategories: [],
      settings: {
        currency: 'RSD',
        language: 'auto',
        theme: 'system',
        userName: '',
        hasOnboarded: false,
        syncUrl: '',
      },
      syncState: {
        lastSyncedAt: null,
        isSyncing: false,
        error: null,
      },

      addExpense: (data) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            {
              ...data,
              id: Crypto.randomUUID(),
              addedBy: state.settings.userName || undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
          pendingDeleteIds: [...state.pendingDeleteIds, id],
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      setSyncState: (updates) =>
        set((state) => ({
          syncState: { ...state.syncState, ...updates },
        })),

      addCustomCategory: (cat) =>
        set((state) => ({
          customCategories: [...state.customCategories, cat],
        })),

      updateCustomCategory: (key, updates) =>
        set((state) => ({
          customCategories: state.customCategories.map((c) =>
            c.key === key ? { ...c, ...updates } : c
          ),
        })),

      deleteCustomCategory: (key) =>
        set((state) => ({
          customCategories: state.customCategories.filter((c) => c.key !== key),
        })),

      replaceCustomCategories: (cats) => set({ customCategories: cats }),

      replaceExpenses: (expenses) => set({ expenses }),

      clearPendingDeleteIds: () => set({ pendingDeleteIds: [] }),
    }),
    {
      name: 'expense-tracker-storage',
      version: 4,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        expenses: state.expenses,
        pendingDeleteIds: state.pendingDeleteIds,
        customCategories: state.customCategories,
        settings: state.settings,
        syncState: { ...state.syncState, isSyncing: false },
      }),
      migrate: (persisted: any, version: number) => {
        const state = persisted as any;
        if (version < 1) {
          state.expenses = (state.expenses || []).map((e: any) => ({
            ...e,
            updatedAt: e.updatedAt || e.createdAt,
          }));
          state.settings = { ...state.settings, syncUrl: state.settings?.syncUrl || '' };
        }
        if (version < 2) {
          state.settings = { ...state.settings, theme: state.settings?.theme || 'system' };
        }
        if (version < 3) {
          state.customCategories = state.customCategories || [];
        }
        if (version < 4) {
          state.settings = { ...state.settings, userName: state.settings?.userName || '' };
        }
        return state;
      },
    }
  )
);
