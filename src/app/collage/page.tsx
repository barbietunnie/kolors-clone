'use client';

import { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/ui/Header';
import { HexColorPicker } from 'react-colorful';
import { generateHarmoniousPalette, getContrastingTextColor } from '@/lib/colors';
import Link from 'next/link';

type LayoutType = '2x2' | '3x3' | '4x4' | '2x3' | '3x2' | '1x4' | '4x1';

interface CollageCell {
  id: string;
  color: string;
}

const layoutConfigs: Record<LayoutType, { rows: number; cols: number }> = {
  '2x2': { rows: 2, cols: 2 },
  '3x3': { rows: 3, cols: 3 },
  '4x4': { rows: 4, cols: 4 },
  '2x3': { rows: 2, cols: 3 },
  '3x2': { rows: 3, cols: 2 },
  '1x4': { rows: 1, cols: 4 },
  '4x1': { rows: 4, cols: 1 },
};

function generateCells(layout: LayoutType, colors: string[]): CollageCell[] {
  const config = layoutConfigs[layout];
  const totalCells = config.rows * config.cols;
  const cells: CollageCell[] = [];

  for (let i = 0; i < totalCells; i++) {
    cells.push({
      id: `cell-${i}`,
      color: colors[i % colors.length],
    });
  }

  return cells;
}

export default function CollagePage() {
  const [layout, setLayout] = useState<LayoutType>('3x3');
  const [cells, setCells] = useState<CollageCell[]>(() => {
    const initialColors = generateHarmoniousPalette(9).map(c => c.hex);
    return generateCells('3x3', initialColors);
  });
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [spacing, setSpacing] = useState(4);
  const [borderRadius, setBorderRadius] = useState(8);
  const collageRef = useRef<HTMLDivElement>(null);

  const handleLayoutChange = useCallback((newLayout: LayoutType) => {
    setLayout(newLayout);
    const currentColors = cells.map(c => c.color);
    setCells(generateCells(newLayout, currentColors));
    setSelectedCellId(null);
  }, [cells]);

  const handleCellColorChange = useCallback((cellId: string, color: string) => {
    setCells(prev => prev.map(cell =>
      cell.id === cellId ? { ...cell, color: color.toUpperCase() } : cell
    ));
  }, []);

  const handleRandomize = useCallback(() => {
    const newColors = generateHarmoniousPalette(cells.length).map(c => c.hex);
    setCells(prev => prev.map((cell, i) => ({
      ...cell,
      color: newColors[i % newColors.length],
    })));
  }, [cells.length]);

  const handleExportPNG = useCallback(async () => {
    if (!collageRef.current) return;

    const canvas = document.createElement('canvas');
    const size = 1200;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = layoutConfigs[layout];
    const cellWidth = (size - (config.cols + 1) * spacing * 2) / config.cols;
    const cellHeight = (size - (config.rows + 1) * spacing * 2) / config.rows;

    // Draw background
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw cells
    cells.forEach((cell, index) => {
      const row = Math.floor(index / config.cols);
      const col = index % config.cols;
      const x = spacing * 2 + col * (cellWidth + spacing * 2);
      const y = spacing * 2 + row * (cellHeight + spacing * 2);

      ctx.fillStyle = cell.color;
      ctx.beginPath();
      ctx.roundRect(x, y, cellWidth, cellHeight, borderRadius);
      ctx.fill();
    });

    // Download
    const link = document.createElement('a');
    link.download = `collage-${layout}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [layout, cells, spacing, borderRadius]);

  const handleExportSVG = useCallback(() => {
    const size = 600;
    const config = layoutConfigs[layout];
    const cellWidth = (size - (config.cols + 1) * spacing) / config.cols;
    const cellHeight = (size - (config.rows + 1) * spacing) / config.rows;

    const rects = cells.map((cell, index) => {
      const row = Math.floor(index / config.cols);
      const col = index % config.cols;
      const x = spacing + col * (cellWidth + spacing);
      const y = spacing + row * (cellHeight + spacing);
      return `<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" rx="${borderRadius}" fill="${cell.color}"/>`;
    }).join('\n  ');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  ${rects}
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `collage-${layout}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [layout, cells, spacing, borderRadius]);

  const selectedCell = cells.find(c => c.id === selectedCellId);
  const config = layoutConfigs[layout];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Color Collage Maker
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Create beautiful color collages with customizable grid layouts. Export as PNG or SVG.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Collage preview */}
          <div className="lg:col-span-2">
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleRandomize}
                    className="px-4 py-2 text-sm font-medium bg-muted-bg text-foreground rounded-lg hover:bg-card-border transition-colors"
                  >
                    Randomize
                  </button>
                </div>
              </div>

              <div
                ref={collageRef}
                className="aspect-square rounded-lg overflow-hidden"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                  gap: `${spacing}px`,
                  padding: `${spacing}px`,
                  backgroundColor: 'var(--muted-bg)',
                }}
              >
                {cells.map((cell) => (
                  <button
                    key={cell.id}
                    onClick={() => setSelectedCellId(cell.id === selectedCellId ? null : cell.id)}
                    className={`transition-transform hover:scale-[1.02] ${
                      selectedCellId === cell.id ? 'ring-2 ring-foreground ring-offset-2' : ''
                    }`}
                    style={{
                      backgroundColor: cell.color,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <span className="sr-only">Select cell</span>
                  </button>
                ))}
              </div>

              {/* Color picker for selected cell */}
              {selectedCell && (
                <div className="mt-6 p-4 bg-muted-bg rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-foreground">Edit Cell Color</span>
                    <div
                      className="w-8 h-8 rounded-lg border border-card-border"
                      style={{ backgroundColor: selectedCell.color }}
                    />
                  </div>
                  <HexColorPicker
                    color={selectedCell.color}
                    onChange={(color) => handleCellColorChange(selectedCell.id, color)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Layout selection */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="font-medium text-foreground mb-4">Layout</h3>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(layoutConfigs) as LayoutType[]).map((layoutOption) => (
                  <button
                    key={layoutOption}
                    onClick={() => handleLayoutChange(layoutOption)}
                    className={`p-3 text-sm font-medium rounded-lg transition-colors ${
                      layout === layoutOption
                        ? 'bg-foreground text-background'
                        : 'bg-muted-bg text-foreground hover:bg-card-border'
                    }`}
                  >
                    {layoutOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing control */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="font-medium text-foreground mb-4">Styling</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-muted">Spacing</label>
                    <span className="text-sm text-muted">{spacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={spacing}
                    onChange={(e) => setSpacing(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-muted">Border Radius</label>
                    <span className="text-sm text-muted">{borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Colors list */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="font-medium text-foreground mb-4">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {cells.map((cell) => (
                  <button
                    key={cell.id}
                    onClick={() => setSelectedCellId(cell.id === selectedCellId ? null : cell.id)}
                    className={`w-10 h-10 rounded-lg transition-transform hover:scale-110 ${
                      selectedCellId === cell.id ? 'ring-2 ring-foreground' : ''
                    }`}
                    style={{ backgroundColor: cell.color }}
                    title={cell.color}
                  />
                ))}
              </div>
            </div>

            {/* Export */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="font-medium text-foreground mb-4">Export</h3>
              <div className="space-y-3">
                <button
                  onClick={handleExportPNG}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Export as PNG
                </button>
                <button
                  onClick={handleExportSVG}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-muted-bg text-foreground rounded-lg font-medium hover:bg-card-border transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Export as SVG
                </button>
                <Link
                  href={`/generate/${cells.slice(0, 10).map(c => c.color.replace('#', '')).join('-')}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-muted-bg text-foreground rounded-lg font-medium hover:bg-card-border transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Open in Generator
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-muted-bg rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span>Click on any cell to change its color</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Use Randomize to generate new color combinations</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Export as PNG for social media, SVG for scalable graphics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
