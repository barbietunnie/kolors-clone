'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import { getContrastingTextColor } from '@/lib/colors';
import { Tooltip } from '@/components/ui/Tooltip';

interface ExtractedPaletteProps {
  colors: string[];
  onRemoveColor: (index: number) => void;
  onReorderColors: (colors: string[]) => void;
  paletteSize: number;
  onPaletteSizeChange: (size: number) => void;
  onReExtract: () => void;
  hasImage: boolean;
}

export function ExtractedPalette({
  colors,
  onRemoveColor,
  onReorderColors,
  paletteSize,
  onPaletteSizeChange,
  onReExtract,
  hasImage,
}: ExtractedPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (color: string, index: number) => {
    await navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const generateUrl = colors.length > 0
    ? `/generate/${colors.map(c => c.replace('#', '')).join('-')}`
    : '/generate';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Extracted Palette</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="palette-size" className="text-sm text-gray-600">
              Colors:
            </label>
            <select
              id="palette-size"
              value={paletteSize}
              onChange={(e) => onPaletteSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          {hasImage && (
            <button
              onClick={onReExtract}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Re-extract
            </button>
          )}
        </div>
      </div>

      {colors.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Upload an image to extract colors</p>
        </div>
      ) : (
        <>
          <Reorder.Group
            axis="x"
            values={colors}
            onReorder={onReorderColors}
            className="flex rounded-xl overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              {colors.map((color, index) => {
                const textColor = getContrastingTextColor(color);
                const isCopied = copiedIndex === index;

                return (
                  <Reorder.Item
                    key={color + index}
                    value={color}
                    as="div"
                    className="relative group flex-1 min-w-0 cursor-grab active:cursor-grabbing"
                    style={{ backgroundColor: color }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="aspect-[4/5] flex flex-col items-center justify-center p-2">
                      {/* Color value */}
                      <motion.span
                        className="font-mono text-xs sm:text-sm font-medium"
                        style={{ color: textColor }}
                        animate={{ opacity: isCopied ? 0.5 : 1 }}
                      >
                        {isCopied ? 'Copied!' : color}
                      </motion.span>

                      {/* Action buttons */}
                      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content="Copy">
                          <button
                            onClick={() => handleCopy(color, index)}
                            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                            style={{ color: textColor }}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </Tooltip>
                        {colors.length > 2 && (
                          <Tooltip content="Remove">
                            <button
                              onClick={() => onRemoveColor(index)}
                              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                              style={{ color: textColor }}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={generateUrl}
              className="flex-1 px-6 py-3 text-center font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Open in Generator
            </Link>
            <Link
              href={`/visualizer?colors=${colors.map(c => c.replace('#', '')).join('-')}`}
              className="flex-1 px-6 py-3 text-center font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Preview in Visualizer
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
