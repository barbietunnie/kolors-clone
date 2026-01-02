/**
 * Trending Palettes Page
 * @author Babatunde Adeyemi
 */

'use client';

import { useState, useMemo } from 'react';
import { trendingPalettes, trendingTags } from '@/data/trendingPalettes';
import { PaletteCard } from '@/components/palettes/PaletteCard';
import { Header } from '@/components/ui/Header';
import chroma from 'chroma-js';

type SortOption = 'popular' | 'newest' | 'random';

const colorFilters = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Gray', hex: '#6B7280' },
];

export default function TrendingPage() {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const filteredPalettes = useMemo(() => {
    let result = [...trendingPalettes];

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
        result.sort((a, b) => parseInt(b.id.replace('trending-', '')) - parseInt(a.id.replace('trending-', '')));
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full mb-4">
            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-foreground">Hot & Trending</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Trending Palettes</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Discover the most popular color palettes from Coolors.co. These trending combinations are loved by designers worldwide.
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-card-bg rounded-xl border border-card-border p-6 mb-8">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
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
                className="w-full pl-12 pr-4 py-3 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground bg-background text-foreground"
              />
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground bg-background text-foreground"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="random">Random</option>
            </select>
          </div>

          {/* Color filters */}
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground mb-2">Filter by color</p>
            <div className="flex flex-wrap gap-2">
              {colorFilters.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    setSelectedColor(selectedColor === color.hex ? null : color.hex)
                  }
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === color.hex
                      ? 'border-foreground scale-110'
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
            <p className="text-sm font-medium text-foreground mb-2">Filter by style</p>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-foreground text-background'
                      : 'bg-muted-bg text-foreground hover:bg-card-border'
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
              className="mt-4 text-sm text-muted hover:text-foreground underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">
            Showing {filteredPalettes.length} trending palette{filteredPalettes.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted">
            Data sourced from Coolors.co
          </p>
        </div>

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
              className="w-16 h-16 text-muted mx-auto mb-4"
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
            <h3 className="text-lg font-medium text-foreground mb-2">No palettes found</h3>
            <p className="text-muted">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
