'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      isDark: false,

      setMode: (mode) => {
        const isDark = calculateIsDark(mode);
        applyTheme(isDark);
        set({ mode, isDark });
      },

      initializeTheme: () => {
        const { mode } = get();
        const isDark = calculateIsDark(mode);
        applyTheme(isDark);
        set({ isDark });

        // Listen for system preference changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
            const currentMode = get().mode;
            if (currentMode === 'system') {
              const newIsDark = mediaQuery.matches;
              applyTheme(newIsDark);
              set({ isDark: newIsDark });
            }
          };
          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'kolors-theme',
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);

function calculateIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  // System preference
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

function applyTheme(isDark: boolean): void {
  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
