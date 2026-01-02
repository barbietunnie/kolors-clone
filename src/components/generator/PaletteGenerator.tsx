'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePaletteStore } from '@/store/paletteStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useHistoryStore } from '@/store/historyStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { paletteToUrl, parsePaletteFromUrl } from '@/lib/colors';
import { ColorColumn } from './ColorColumn';
import { GeneratorToolbar } from './GeneratorToolbar';
import { ExportModal } from './ExportModal';
import { ShareModal } from './ShareModal';
import { FavoritesPanel } from './FavoritesPanel';
import { HistoryPanel } from './HistoryPanel';
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp';

interface PaletteGeneratorProps {
  initialColors?: string;
}

export function PaletteGenerator({ initialColors }: PaletteGeneratorProps) {
  const {
    colors,
    setColors,
    generateNewPalette,
    regenerate,
    toggleLock,
    updateColor,
    addColor,
    removeColor,
    reorderColors,
    undo,
    redo,
    canUndo,
    canRedo,
  } = usePaletteStore();

  const { addFavorite, removeFavorite, isFavorite, getFavoriteByColors } = useFavoritesStore();
  const { addToHistory } = useHistoryStore();
  const { autoSaveToHistory } = usePreferencesStore();

  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Track previous colors for history
  const prevColorsRef = useRef<string[]>([]);

  // Initialize palette
  useEffect(() => {
    if (initialColors) {
      try {
        const parsed = parsePaletteFromUrl(initialColors);
        setColors(parsed);
      } catch {
        generateNewPalette();
      }
    } else if (colors.length === 0) {
      generateNewPalette();
    }
  }, [initialColors, colors.length, setColors, generateNewPalette]);

  // Update URL when colors change and save to history
  useEffect(() => {
    if (colors.length > 0) {
      const url = paletteToUrl(colors);
      window.history.replaceState(null, '', `/generate/${url}`);

      // Save to history if colors changed and auto-save is enabled
      const currentHexes = colors.map(c => c.hex);
      const prevHexes = prevColorsRef.current;

      if (autoSaveToHistory && currentHexes.join('-') !== prevHexes.join('-')) {
        addToHistory(currentHexes);
      }

      prevColorsRef.current = currentHexes;
    }
  }, [colors, autoSaveToHistory, addToHistory]);

  // Get current colors as hex strings
  const currentColorHexes = colors.map(c => c.hex);
  const isCurrentFavorite = isFavorite(currentColorHexes);

  const handleToggleFavorite = useCallback(() => {
    if (isCurrentFavorite) {
      const favorite = getFavoriteByColors(currentColorHexes);
      if (favorite) {
        removeFavorite(favorite.id);
      }
    } else {
      addFavorite(currentColorHexes);
    }
  }, [isCurrentFavorite, currentColorHexes, addFavorite, removeFavorite, getFavoriteByColors]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'Space',
      handler: () => regenerate(),
    },
    {
      key: 'l',
      handler: () => {
        if (colors[focusedIndex]) {
          toggleLock(colors[focusedIndex].id);
        }
      },
    },
    {
      key: 'c',
      handler: () => {
        if (colors[focusedIndex]) {
          navigator.clipboard.writeText(colors[focusedIndex].hex);
        }
      },
    },
    {
      key: 'ArrowLeft',
      handler: () => {
        setFocusedIndex((prev) => Math.max(0, prev - 1));
      },
    },
    {
      key: 'ArrowRight',
      handler: () => {
        setFocusedIndex((prev) => Math.min(colors.length - 1, prev + 1));
      },
    },
    {
      key: 'z',
      ctrlKey: true,
      handler: undo,
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      handler: redo,
    },
  ]);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (targetIndex: number) => {
      if (draggedIndex !== null && draggedIndex !== targetIndex) {
        reorderColors(draggedIndex, targetIndex);
      }
      setDraggedIndex(null);
    },
    [draggedIndex, reorderColors]
  );

  if (colors.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Main palette area */}
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="sync">
          {colors.map((color, index) => (
            <ColorColumn
              key={color.id}
              color={color}
              index={index}
              totalColors={colors.length}
              onToggleLock={() => toggleLock(color.id)}
              onUpdateColor={(hex) => updateColor(color.id, hex)}
              onRemove={() => removeColor(color.id)}
              canRemove={colors.length > 2}
              isDragging={draggedIndex === index}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Toolbar */}
      <GeneratorToolbar
        onGenerate={regenerate}
        onUndo={undo}
        onRedo={redo}
        onAddColor={addColor}
        onExport={() => setShowExport(true)}
        onShare={() => setShowShare(true)}
        onFavorites={() => setShowFavorites(true)}
        onHistory={() => setShowHistory(true)}
        onToggleFavorite={handleToggleFavorite}
        canUndo={canUndo()}
        canRedo={canRedo()}
        canAddColor={colors.length < 10}
        colorCount={colors.length}
        isFavorite={isCurrentFavorite}
      />

      {/* Export modal */}
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        colors={colors}
      />

      {/* Share modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        colors={colors}
      />

      {/* Favorites panel */}
      <FavoritesPanel
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        currentColors={currentColorHexes}
      />

      {/* History panel */}
      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsHelp />
    </div>
  );
}
