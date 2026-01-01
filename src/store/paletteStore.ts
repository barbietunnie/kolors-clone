import { create } from 'zustand';
import type { Color } from '@/types/color';
import { generateHarmoniousPalette, regeneratePalette, createColorFromHex } from '@/lib/colors';

interface PaletteState {
  colors: Color[];
  history: Color[][];
  historyIndex: number;
  maxHistorySize: number;

  // Actions
  setColors: (colors: Color[]) => void;
  generateNewPalette: () => void;
  regenerate: () => void;
  toggleLock: (colorId: string) => void;
  updateColor: (colorId: string, hex: string) => void;
  addColor: () => void;
  removeColor: (colorId: string) => void;
  reorderColors: (fromIndex: number, toIndex: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const usePaletteStore = create<PaletteState>((set, get) => ({
  colors: [],
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  setColors: (colors) => {
    set({ colors });
  },

  generateNewPalette: () => {
    const newColors = generateHarmoniousPalette(5);
    const { history, historyIndex, maxHistorySize } = get();

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newColors);

    // Trim history if too long
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }

    set({
      colors: newColors,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  regenerate: () => {
    const { colors, history, historyIndex, maxHistorySize } = get();
    const newColors = regeneratePalette(colors);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newColors);

    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }

    set({
      colors: newColors,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  toggleLock: (colorId) => {
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === colorId ? { ...color, isLocked: !color.isLocked } : color
      ),
    }));
  },

  updateColor: (colorId, hex) => {
    const { colors, history, historyIndex, maxHistorySize } = get();
    const newColors = colors.map((color) =>
      color.id === colorId ? createColorFromHex(hex, color.isLocked) : color
    );

    // Preserve the ID
    const originalColor = colors.find((c) => c.id === colorId);
    if (originalColor) {
      const updatedColorIndex = newColors.findIndex((c) => c.id !== colorId && c.hex === hex.toUpperCase());
      if (updatedColorIndex === -1) {
        const targetIndex = colors.findIndex((c) => c.id === colorId);
        newColors[targetIndex] = { ...newColors[targetIndex], id: colorId };
      }
    }

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newColors);

    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }

    set({
      colors: newColors,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  addColor: () => {
    const { colors, history, historyIndex, maxHistorySize } = get();
    if (colors.length >= 10) return;

    const newColor = createColorFromHex(
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    );
    const newColors = [...colors, newColor];

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newColors);

    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }

    set({
      colors: newColors,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  removeColor: (colorId) => {
    const { colors, history, historyIndex, maxHistorySize } = get();
    if (colors.length <= 2) return;

    const newColors = colors.filter((c) => c.id !== colorId);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newColors);

    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }

    set({
      colors: newColors,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  reorderColors: (fromIndex, toIndex) => {
    const { colors, history, historyIndex, maxHistorySize } = get();
    const newColors = [...colors];
    const [removed] = newColors.splice(fromIndex, 1);
    newColors.splice(toIndex, 0, removed);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newColors);

    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }

    set({
      colors: newColors,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        colors: history[historyIndex - 1],
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        colors: history[historyIndex + 1],
      });
    }
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },
}));
