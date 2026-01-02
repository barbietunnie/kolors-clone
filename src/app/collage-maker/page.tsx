'use client';

import { useState, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HexColorPicker } from 'react-colorful';
import { getContrastingTextColor } from '@/lib/colors';

type GridLayout = '2x2' | '3x3' | '4x4' | '2x3' | '3x2' | 'custom';

interface GridConfig {
  rows: number;
  cols: number;
}

const layoutConfigs: Record<GridLayout, GridConfig> = {
  '2x2': { rows: 2, cols: 2 },
  '3x3': { rows: 3, cols: 3 },
  '4x4': { rows: 4, cols: 4 },
  '2x3': { rows: 2, cols: 3 },
  '3x2': { rows: 3, cols: 2 },
  'custom': { rows: 3, cols: 3 },
};

const presetColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8B500', '#00CED1', '#FF69B4', '#32CD32', '#FFD700',
];

export default function CollageMakerPage() {
  const [layout, setLayout] = useState<GridLayout>('3x3');
  const [customRows, setCustomRows] = useState(3);
  const [customCols, setCustomCols] = useState(3);
  const [colors, setColors] = useState<string[]>(() => {
    const initial: string[] = [];
    for (let i = 0; i < 9; i++) {
      initial.push(presetColors[i % presetColors.length]);
    }
    return initial;
  });
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [cellSize, setCellSize] = useState(100);
  const [gap, setGap] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);
  const collageRef = useRef<HTMLDivElement>(null);

  const config = layout === 'custom'
    ? { rows: customRows, cols: customCols }
    : layoutConfigs[layout];

  const totalCells = config.rows * config.cols;

  // Ensure we have enough colors
  const updateColorsForGrid = useCallback((newRows: number, newCols: number) => {
    const newTotal = newRows * newCols;
    setColors((prev) => {
      if (prev.length >= newTotal) return prev;
      const additional: string[] = [];
      for (let i = prev.length; i < newTotal; i++) {
        additional.push(presetColors[i % presetColors.length]);
      }
      return [...prev, ...additional];
    });
  }, []);

  const handleLayoutChange = (newLayout: GridLayout) => {
    setLayout(newLayout);
    const newConfig = newLayout === 'custom'
      ? { rows: customRows, cols: customCols }
      : layoutConfigs[newLayout];
    updateColorsForGrid(newConfig.rows, newConfig.cols);
    setSelectedCell(null);
    setShowColorPicker(false);
  };

  const handleCustomRowsChange = (value: number) => {
    setCustomRows(value);
    updateColorsForGrid(value, customCols);
  };

  const handleCustomColsChange = (value: number) => {
    setCustomCols(value);
    updateColorsForGrid(customRows, value);
  };

  const handleCellClick = (index: number) => {
    if (selectedCell === index) {
      setShowColorPicker(!showColorPicker);
    } else {
      setSelectedCell(index);
      setShowColorPicker(true);
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedCell !== null) {
      const newColors = [...colors];
      newColors[selectedCell] = color.toUpperCase();
      setColors(newColors);
    }
  };

  const handlePresetClick = (color: string) => {
    if (selectedCell !== null) {
      const newColors = [...colors];
      newColors[selectedCell] = color;
      setColors(newColors);
    }
  };

  const randomizeColors = () => {
    const randomColors: string[] = [];
    for (let i = 0; i < totalCells; i++) {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()}`;
      randomColors.push(randomColor);
    }
    setColors(randomColors);
  };

  const exportAsImage = async () => {
    if (!collageRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const totalWidth = config.cols * cellSize + (config.cols - 1) * gap;
      const totalHeight = config.rows * cellSize + (config.rows - 1) * gap;

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // Draw cells
      for (let i = 0; i < totalCells; i++) {
        const row = Math.floor(i / config.cols);
        const col = i % config.cols;
        const x = col * (cellSize + gap);
        const y = row * (cellSize + gap);

        ctx.fillStyle = colors[i] || '#FFFFFF';

        if (borderRadius > 0) {
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, borderRadius);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }

      // Download
      const link = document.createElement('a');
      link.download = `collage-${config.cols}x${config.rows}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Color Collage Maker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create beautiful color collages with customizable grid layouts. Click on any cell to change its color.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Controls Panel */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Layout Selection */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
                Grid Layout
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['2x2', '3x3', '4x4', '2x3', '3x2', 'custom'] as GridLayout[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLayoutChange(l)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${
                      layout === l
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {l === 'custom' ? 'Custom' : l}
                  </button>
                ))}
              </div>

              {layout === 'custom' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Rows: {customRows}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={customRows}
                      onChange={(e) => handleCustomRowsChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Columns: {customCols}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={customCols}
                      onChange={(e) => handleCustomColsChange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Style Options */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
                Style Options
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Cell Size: {cellSize}px
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={cellSize}
                    onChange={(e) => setCellSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Gap: {gap}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={gap}
                    onChange={(e) => setGap(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Border Radius: {borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Color Picker */}
            {selectedCell !== null && showColorPicker && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
                  Cell {selectedCell + 1} Color
                </h3>
                <div className="flex justify-center mb-4">
                  <HexColorPicker
                    color={colors[selectedCell]}
                    onChange={handleColorChange}
                  />
                </div>
                <div className="text-center">
                  <input
                    type="text"
                    value={colors[selectedCell]}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center font-mono text-sm w-full"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Colors</p>
                  <div className="flex flex-wrap gap-1">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handlePresetClick(color)}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={randomizeColors}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-target"
              >
                Randomize Colors
              </button>
              <button
                onClick={exportAsImage}
                className="w-full px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors touch-target"
              >
                Export as PNG
              </button>
            </div>
          </div>

          {/* Collage Preview */}
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-8 border border-gray-200 dark:border-gray-800 w-full overflow-x-auto">
              <div
                ref={collageRef}
                className="inline-grid mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${config.rows}, ${cellSize}px)`,
                  gap: `${gap}px`,
                }}
              >
                {Array.from({ length: totalCells }).map((_, index) => {
                  const color = colors[index] || '#FFFFFF';
                  const textColor = getContrastingTextColor(color);
                  return (
                    <button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      className={`transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                        selectedCell === index ? 'ring-2 ring-gray-900 dark:ring-white ring-offset-2' : ''
                      }`}
                      style={{
                        backgroundColor: color,
                        borderRadius: `${borderRadius}px`,
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                      }}
                    >
                      <span
                        className="text-xs font-mono opacity-60"
                        style={{ color: textColor }}
                      >
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Click on a cell to select it and change its color</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
