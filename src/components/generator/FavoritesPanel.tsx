'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesStore, type FavoritePalette } from '@/store/favoritesStore';
import Link from 'next/link';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentColors: string[];
}

export function FavoritesPanel({ isOpen, onClose, currentColors }: FavoritesPanelProps) {
  const { favorites, addFavorite, removeFavorite, renameFavorite, isFavorite } = useFavoritesStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const isCurrentFavorite = isFavorite(currentColors);

  const handleAddCurrent = () => {
    if (!isCurrentFavorite) {
      addFavorite(currentColors);
    }
  };

  const handleStartRename = (fav: FavoritePalette) => {
    setEditingId(fav.id);
    setEditName(fav.name || '');
  };

  const handleSaveRename = (id: string) => {
    renameFavorite(id, editName);
    setEditingId(null);
    setEditName('');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card-bg border-l border-card-border z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-card-border">
              <h2 className="text-lg font-semibold text-foreground">Favorites</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted-bg rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Add current palette button */}
            <div className="p-4 border-b border-card-border">
              <button
                onClick={handleAddCurrent}
                disabled={isCurrentFavorite}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isCurrentFavorite
                    ? 'bg-muted-bg text-muted cursor-not-allowed'
                    : 'bg-foreground text-background hover:opacity-90'
                }`}
              >
                {isCurrentFavorite ? 'Current palette is saved' : 'Save current palette'}
              </button>
            </div>

            {/* Favorites list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-muted mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
                  <p className="text-muted text-sm">Save palettes you love for quick access later.</p>
                </div>
              ) : (
                favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="bg-muted-bg rounded-xl p-4 space-y-3"
                  >
                    {/* Color preview */}
                    <Link
                      href={`/generate/${fav.colors.map(c => c.replace('#', '')).join('-')}`}
                      className="flex h-12 rounded-lg overflow-hidden"
                      onClick={onClose}
                    >
                      {fav.colors.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 transition-transform hover:scale-y-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </Link>

                    {/* Name and actions */}
                    <div className="flex items-center justify-between gap-2">
                      {editingId === fav.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Palette name..."
                            className="flex-1 px-3 py-1.5 bg-background border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(fav.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveRename(fav.id)}
                            className="p-1.5 bg-foreground text-background rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {fav.name || 'Untitled palette'}
                            </p>
                            <p className="text-xs text-muted">{formatDate(fav.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartRename(fav)}
                              className="p-1.5 hover:bg-card-border rounded-lg transition-colors"
                              title="Rename"
                            >
                              <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeFavorite(fav.id)}
                              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
