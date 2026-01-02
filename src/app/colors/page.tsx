/**
 * Colors Library Page
 * Author: Babatunde Adeyemi
 *
 * Browse and search through 540+ named colors
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { namedColors, colorCategories, type NamedColor } from '@/data/colors';
import { ColorCard } from '@/components/colors/ColorCard';
import { getColorFamily, type ColorFamily } from '@/lib/colors';
import chroma from 'chroma-js';

type SortOption = 'name' | 'hue' | 'brightness' | 'saturation';

export default function ColorsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const filteredColors = useMemo(() => {
    let result = [...namedColors];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.hex.toLowerCase().includes(searchLower.replace('#', ''))
      );
    }

    // Filter by color family using HSL-based classification
    if (selectedCategory) {
      result = result.filter((c) => {
        try {
          return getColorFamily(c.hex) === selectedCategory;
        } catch {
          return false;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'hue':
        result.sort((a, b) => {
          try {
            return chroma(a.hex).hsl()[0] - chroma(b.hex).hsl()[0];
          } catch {
            return 0;
          }
        });
        break;
      case 'brightness':
        result.sort((a, b) => {
          try {
            return chroma(b.hex).luminance() - chroma(a.hex).luminance();
          } catch {
            return 0;
          }
        });
        break;
      case 'saturation':
        result.sort((a, b) => {
          try {
            return chroma(b.hex).hsl()[1] - chroma(a.hex).hsl()[1];
          } catch {
            return 0;
          }
        });
        break;
    }

    return result;
  }, [search, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory(null);
  };

  const hasActiveFilters = search || selectedCategory;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Kolors
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/generate" className="text-gray-600 hover:text-gray-900 transition-colors">
              Generate
            </Link>
            <Link href="/color-picker" className="text-gray-600 hover:text-gray-900 transition-colors">
              Color Picker
            </Link>
            <Link href="/contrast-checker" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contrast Checker
            </Link>
            <Link href="/colors" className="text-gray-900 font-medium">
              Colors
            </Link>
            <Link href="/palettes" className="text-gray-600 hover:text-gray-900 transition-colors">
              Explore
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Color Library</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of {namedColors.length} beautifully named colors.
            Find the perfect shade for your next project.
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
                placeholder="Search by color name or hex code..."
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
              <option value="name">Sort by Name</option>
              <option value="hue">Sort by Hue</option>
              <option value="brightness">Sort by Brightness</option>
              <option value="saturation">Sort by Saturation</option>
            </select>
          </div>

          {/* Color category filters */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by color family</p>
            <div className="flex flex-wrap gap-2">
              {colorCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category.name ? null : category.name)
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: category.hex }}
                  />
                  {category.name}
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
          Showing {filteredColors.length} color{filteredColors.length !== 1 ? 's' : ''}
        </p>

        {/* Color grid */}
        {filteredColors.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredColors.map((color, index) => (
              <ColorCard key={`${color.hex}-${index}`} name={color.name} hex={color.hex} />
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No colors found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
