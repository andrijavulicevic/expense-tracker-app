import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Expense, Settings, SyncState } from '@/types';

interface AppState {
  expenses: Expense[];
  pendingDeleteIds: string[];
  settings: Settings;
  syncState: SyncState;

  addExpense: (e: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteExpense: (id: string) => void;
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
      settings: {
        currency: 'RSD',
        language: 'auto',
        theme: 'system',
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

      replaceExpenses: (expenses) => set({ expenses }),

      clearPendingDeleteIds: () => set({ pendingDeleteIds: [] }),
    }),
    {
      name: 'expense-tracker-storage',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        expenses: state.expenses,
        pendingDeleteIds: state.pendingDeleteIds,
        settings: state.settings,
        syncState: state.syncState,
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
        return state;
      },
    }
  )
);
