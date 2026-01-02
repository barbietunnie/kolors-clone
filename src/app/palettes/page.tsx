'use client';

import { useState, useMemo } from 'react';
import { seedPalettes, allTags, colorFilters, type SeedPalette } from '@/data/palettes';
import { PaletteCard } from '@/components/palettes/PaletteCard';
import chroma from 'chroma-js';

type SortOption = 'popular' | 'newest' | 'random';

export default function PalettesPage() {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const filteredPalettes = useMemo(() => {
    let result = [...seedPalettes];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          p.colors.some((c) => c.toLowerCase().includes(searchLower.replace('#', '')))
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.every((tag) => p.tags.includes(tag))
      );
    }

    // Filter by color (find palettes with similar colors)
    if (selectedColor) {
      result = result.filter((p) =>
        p.colors.some((c) => {
          try {
            return chroma.deltaE(c, selectedColor) < 30;
          } catch {
            return false;
          }
        })
      );
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'newest':
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'random':
        result.sort(() => Math.random() - 0.5);
        break;
    }

    return result;
  }, [search, selectedTags, selectedColor, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTags([]);
    setSelectedColor(null);
  };

  const hasActiveFilters = search || selectedTags.length > 0 || selectedColor;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Palettes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our curated collection of color palettes. Find inspiration for your next project.
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          {/* Search bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search palettes, tags, or colors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="random">Random</option>
            </select>
          </div>

          {/* Color filters */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by color</p>
            <div className="flex flex-wrap gap-2">
              {colorFilters.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    setSelectedColor(selectedColor === color.hex ? null : color.hex)
                  }
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === color.hex
                      ? 'border-gray-900 scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Tag filters */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by style</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-6">
          Showing {filteredPalettes.length} palette{filteredPalettes.length !== 1 ? 's' : ''}
        </p>

        {/* Palette grid */}
        {filteredPalettes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPalettes.map((palette) => (
              <PaletteCard key={palette.id} palette={palette} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No palettes found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
