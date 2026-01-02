import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoritePalette {
  id: string;
  colors: string[]; // Hex colors
  name?: string;
  createdAt: number;
}

interface FavoritesState {
  favorites: FavoritePalette[];
  addFavorite: (colors: string[], name?: string) => void;
  removeFavorite: (id: string) => void;
  renameFavorite: (id: string, name: string) => void;
  isFavorite: (colors: string[]) => boolean;
  getFavoriteByColors: (colors: string[]) => FavoritePalette | undefined;
}

const colorsToKey = (colors: string[]): string =>
  colors.map(c => c.toUpperCase().replace('#', '')).join('-');

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (colors, name) => {
        const key = colorsToKey(colors);
        const existing = get().favorites.find(f => colorsToKey(f.colors) === key);

        if (existing) return; // Already exists

        const newFavorite: FavoritePalette = {
          id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          colors: colors.map(c => c.toUpperCase()),
          name,
          createdAt: Date.now(),
        };

        set((state) => ({
          favorites: [newFavorite, ...state.favorites],
        }));
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },

      renameFavorite: (id, name) => {
        set((state) => ({
          favorites: state.favorites.map((f) =>
            f.id === id ? { ...f, name } : f
          ),
        }));
      },

      isFavorite: (colors) => {
        const key = colorsToKey(colors);
        return get().favorites.some((f) => colorsToKey(f.colors) === key);
      },

      getFavoriteByColors: (colors) => {
        const key = colorsToKey(colors);
        return get().favorites.find((f) => colorsToKey(f.colors) === key);
      },
    }),
    {
      name: 'kolors-favorites',
    }
  )
);
