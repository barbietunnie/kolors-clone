'use client';

import { useEffect, useCallback } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setResolvedTheme } = useThemeStore();

  const updateTheme = useCallback((isDark: boolean) => {
    const resolvedTheme = isDark ? 'dark' : 'light';
    setResolvedTheme(resolvedTheme);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [setResolvedTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (theme === 'system') {
        updateTheme(e.matches);
      }
    };

    // Initial setup
    if (theme === 'system') {
      updateTheme(mediaQuery.matches);
    } else {
      updateTheme(theme === 'dark');
    }

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, updateTheme]);

  // Apply theme when theme preference changes
  useEffect(() => {
    if (theme !== 'system') {
      updateTheme(theme === 'dark');
    }
  }, [theme, updateTheme]);

  return <>{children}</>;
}
