import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv';
export type ExportFormat = 'css' | 'scss' | 'tailwind' | 'json';

interface PreferencesState {
  // Display preferences
  defaultColorFormat: ColorFormat;
  showColorNames: boolean;
  defaultPaletteSize: number;

  // Export preferences
  defaultExportFormat: ExportFormat;
  includeHashInHex: boolean;

  // Generator preferences
  autoSaveToHistory: boolean;

  // Actions
  setDefaultColorFormat: (format: ColorFormat) => void;
  setShowColorNames: (show: boolean) => void;
  setDefaultPaletteSize: (size: number) => void;
  setDefaultExportFormat: (format: ExportFormat) => void;
  setIncludeHashInHex: (include: boolean) => void;
  setAutoSaveToHistory: (save: boolean) => void;
  resetPreferences: () => void;
}

const defaultPreferences = {
  defaultColorFormat: 'hex' as ColorFormat,
  showColorNames: true,
  defaultPaletteSize: 5,
  defaultExportFormat: 'css' as ExportFormat,
  includeHashInHex: true,
  autoSaveToHistory: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultPreferences,

      setDefaultColorFormat: (format) => set({ defaultColorFormat: format }),
      setShowColorNames: (show) => set({ showColorNames: show }),
      setDefaultPaletteSize: (size) => set({ defaultPaletteSize: Math.min(10, Math.max(2, size)) }),
      setDefaultExportFormat: (format) => set({ defaultExportFormat: format }),
      setIncludeHashInHex: (include) => set({ includeHashInHex: include }),
      setAutoSaveToHistory: (save) => set({ autoSaveToHistory: save }),
      resetPreferences: () => set(defaultPreferences),
    }),
    {
      name: 'kolors-preferences',
    }
  )
);
