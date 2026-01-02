import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  id: string;
  colors: string[]; // Hex colors
  createdAt: number;
}

interface HistoryState {
  history: HistoryEntry[];
  maxHistorySize: number;
  addToHistory: (colors: string[]) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const colorsToKey = (colors: string[]): string =>
  colors.map(c => c.toUpperCase().replace('#', '')).join('-');

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      maxHistorySize: 50,

      addToHistory: (colors) => {
        const key = colorsToKey(colors);
        const { history, maxHistorySize } = get();

        // Remove duplicate if it exists
        const filtered = history.filter((h) => colorsToKey(h.colors) !== key);

        const newEntry: HistoryEntry = {
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          colors: colors.map(c => c.toUpperCase()),
          createdAt: Date.now(),
        };

        // Add to beginning, trim if too long
        const newHistory = [newEntry, ...filtered].slice(0, maxHistorySize);

        set({ history: newHistory });
      },

      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'kolors-history',
    }
  )
);
