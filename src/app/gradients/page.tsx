/**
 * Gradients Library Page
 * Author: Babatunde Adeyemi
 *
 * Browse and search through 284 named gradients
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { namedGradients, gradientTypes } from '@/data/gradients';
import { GradientCard } from '@/components/gradients/GradientCard';

type SortOption = 'name' | 'colors';

export default function GradientsPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  const filteredGradients = useMemo(() => {
    let result = [...namedGradients];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(searchLower) ||
          g.colors.some((c) => c.toLowerCase().includes(searchLower.replace('#', '')))
      );
    }

    // Filter by gradient type
    if (selectedType) {
      const typeConfig = gradientTypes.find((t) => t.name === selectedType);
      if (typeConfig) {
        result = result.filter((g) => {
          const nameLower = g.name.toLowerCase();
          return typeConfig.keywords.some((keyword) => nameLower.includes(keyword));
        });
      }
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'colors':
        result.sort((a, b) => a.colors.length - b.colors.length);
        break;
    }

    return result;
  }, [search, selectedType, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedType(null);
  };

  const hasActiveFilters = search || selectedType;

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
            <Link href="/gradient-maker" className="text-gray-600 hover:text-gray-900 transition-colors">
              Gradient Maker
            </Link>
            <Link href="/colors" className="text-gray-600 hover:text-gray-900 transition-colors">
              Colors
            </Link>
            <Link href="/gradients" className="text-gray-900 font-medium">
              Gradients
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gradient Library</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of {namedGradients.length} beautiful gradients.
            Find the perfect blend for your next project.
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
                placeholder="Search by gradient name or hex code..."
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
              <option value="colors">Sort by Color Count</option>
            </select>
          </div>

          {/* Gradient type filters */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by style</p>
            <div className="flex flex-wrap gap-2">
              {gradientTypes.map((type) => (
                <button
                  key={type.name}
                  onClick={() =>
                    setSelectedType(selectedType === type.name ? null : type.name)
                  }
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedType === type.name
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.name}
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
          Showing {filteredGradients.length} gradient{filteredGradients.length !== 1 ? 's' : ''}
        </p>

        {/* Gradient grid */}
        {filteredGradients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGradients.map((gradient, index) => (
              <GradientCard
                key={`${gradient.name}-${index}`}
                name={gradient.name}
                css={gradient.css}
                colors={gradient.colors}
              />
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gradients found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
