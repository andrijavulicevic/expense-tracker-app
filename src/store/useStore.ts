import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Expense, Settings } from '@/types';

interface AppState {
  expenses: Expense[];
  settings: Settings;

  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void;
  deleteExpense: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      expenses: [],
      settings: {
        currency: 'RSD',
        hasOnboarded: false,
      },

      addExpense: (data) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            {
              ...data,
              id: Crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
    }),
    {
      name: 'expense-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
