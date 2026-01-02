'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { colorLibraries, type NamedColor, type ColorLibrary } from '@/data/colorLibraries';
import { getContrastingTextColor } from '@/lib/colors';
import { useClipboard } from '@/hooks/useClipboard';

export default function ColorLibrariesPage() {
  const [selectedLibrary, setSelectedLibrary] = useState<ColorLibrary>(colorLibraries[0]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { copy, copiedText } = useClipboard();

  // Get unique categories for the selected library
  const categories = useMemo(() => {
    const cats = new Set<string>();
    selectedLibrary.colors.forEach((c) => {
      if (c.category) cats.add(c.category);
    });
    return Array.from(cats).sort();
  }, [selectedLibrary]);

  // Filter colors
  const filteredColors = useMemo(() => {
    let result = [...selectedLibrary.colors];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.hex.toLowerCase().includes(searchLower) ||
          (c.category && c.category.toLowerCase().includes(searchLower))
      );
    }

    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory);
    }

    return result;
  }, [selectedLibrary, search, selectedCategory]);

  const handleCopyColor = (color: NamedColor) => {
    copy(color.hex);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Color Libraries
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Browse curated color palettes from popular design systems. Click any color to copy its hex value.
          </p>
        </div>

        {/* Library tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {colorLibraries.map((library) => (
            <button
              key={library.id}
              onClick={() => {
                setSelectedLibrary(library);
                setSelectedCategory(null);
                setSearch('');
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedLibrary.id === library.id
                  ? 'bg-foreground text-background'
                  : 'bg-muted-bg text-foreground hover:bg-card-border'
              }`}
            >
              {library.name}
            </button>
          ))}
        </div>

        {/* Library description */}
        <div className="text-center mb-8">
          <p className="text-muted">{selectedLibrary.description}</p>
          <p className="text-sm text-muted mt-2">
            {selectedLibrary.colors.length} colors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="font-medium text-foreground mb-4">Search</h3>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
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
                  placeholder="Search colors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground bg-background text-foreground"
                />
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-card-bg rounded-xl border border-card-border p-6">
                <h3 className="font-medium text-foreground mb-4">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === null
                        ? 'bg-foreground text-background'
                        : 'text-muted hover:bg-muted-bg'
                    }`}
                  >
                    All ({selectedLibrary.colors.length})
                  </button>
                  {categories.map((cat) => {
                    const count = selectedLibrary.colors.filter(
                      (c) => c.category === cat
                    ).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat
                            ? 'bg-foreground text-background'
                            : 'text-muted hover:bg-muted-bg'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="bg-muted-bg rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Click any color to copy its hex value</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Click "Use in Generator" to build a palette</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Color grid */}
          <div className="lg:col-span-3">
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-foreground">
                  {filteredColors.length} color{filteredColors.length !== 1 ? 's' : ''}
                </h3>
              </div>

              {filteredColors.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredColors.map((color, index) => {
                    const textColor = getContrastingTextColor(color.hex);
                    const isCopied = copiedText === color.hex;

                    return (
                      <div key={`${color.hex}-${index}`} className="group">
                        <button
                          onClick={() => handleCopyColor(color)}
                          className="w-full aspect-square rounded-lg shadow-sm transition-transform hover:scale-105 hover:shadow-md relative overflow-hidden"
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} - ${color.hex}`}
                        >
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                          >
                            {isCopied ? (
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                        <div className="mt-2 text-center">
                          <p className="text-xs font-medium text-foreground truncate" title={color.name}>
                            {color.name}
                          </p>
                          <p className="text-xs text-muted uppercase">{color.hex}</p>
                        </div>
                        <div className="mt-2 flex gap-1">
                          <Link
                            href={`/color-picker?color=${color.hex.replace('#', '')}`}
                            className="flex-1 text-center text-xs py-1 px-2 bg-muted-bg text-muted rounded hover:bg-card-border transition-colors"
                          >
                            Details
                          </Link>
                          <Link
                            href={`/generate/${color.hex.replace('#', '')}`}
                            className="flex-1 text-center text-xs py-1 px-2 bg-muted-bg text-muted rounded hover:bg-card-border transition-colors"
                          >
                            Generate
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
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
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No colors found
                  </h3>
                  <p className="text-muted">Try adjusting your search or filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
