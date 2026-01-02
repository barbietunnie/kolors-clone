'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { allColorLibraries, ColorLibrary, ColorGroup, ColorShade } from '@/data/colorLibraries';
import { getContrastingTextColor } from '@/lib/colors';
import { useClipboard } from '@/hooks/useClipboard';

function ColorCard({ shade, showName = true }: { shade: ColorShade; showName?: boolean }) {
  const { copy, hasCopied } = useClipboard();
  const textColor = getContrastingTextColor(shade.hex);

  return (
    <button
      onClick={() => copy(shade.hex)}
      className="group relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      style={{ backgroundColor: shade.hex }}
      title={`${shade.name}: ${shade.hex} - Click to copy`}
    >
      <span
        className="text-xs sm:text-sm font-mono font-medium"
        style={{ color: textColor }}
      >
        {hasCopied ? 'Copied!' : shade.hex}
      </span>
      {showName && (
        <span
          className="text-[10px] sm:text-xs mt-1 opacity-75"
          style={{ color: textColor }}
        >
          {shade.name}
        </span>
      )}
    </button>
  );
}

function ColorGroupSection({ group, compact = false }: { group: ColorGroup; compact?: boolean }) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <span>{group.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({group.shades.length} colors)
        </span>
      </button>

      {expanded && (
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
          {group.shades.map((shade) => (
            <ColorCard key={shade.name} shade={shade} showName />
          ))}
        </div>
      )}
    </div>
  );
}

function LibrarySection({ library }: { library: ColorLibrary }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandAll, setExpandAll] = useState(true);

  const filteredGroups = useCallback(() => {
    if (!searchQuery) return library.colors;

    return library.colors
      .map((group) => ({
        ...group,
        shades: group.shades.filter(
          (shade) =>
            shade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shade.hex.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((group) => group.shades.length > 0);
  }, [library.colors, searchQuery]);

  const groups = filteredGroups();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {library.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {library.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search colors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 pl-9 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {expandAll ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      <div>
        {groups.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No colors found matching &ldquo;{searchQuery}&rdquo;
          </p>
        ) : (
          groups.map((group) => (
            <ColorGroupSection key={group.name} group={group} compact={!expandAll} />
          ))
        )}
      </div>
    </div>
  );
}

export default function ColorLibrariesPage() {
  const [activeLibrary, setActiveLibrary] = useState<string>('material');

  const currentLibrary = allColorLibraries.find((lib) => lib.id === activeLibrary);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Color Libraries
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse popular color palettes from Material Design, Tailwind CSS, and standard CSS named colors.
            Click any color to copy its hex value.
          </p>
        </div>

        {/* Library Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {allColorLibraries.map((library) => (
            <button
              key={library.id}
              onClick={() => setActiveLibrary(library.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium transition-colors touch-target ${
                activeLibrary === library.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {library.name}
            </button>
          ))}
        </div>

        {/* Active Library */}
        {currentLibrary && <LibrarySection library={currentLibrary} />}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Found a color you like? Use it in our other tools:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/generate"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Palette Generator
            </Link>
            <Link
              href="/color-picker"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Color Picker
            </Link>
            <Link
              href="/contrast-checker"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Contrast Checker
            </Link>
            <Link
              href="/collage-maker"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Collage Maker
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
