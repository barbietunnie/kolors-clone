'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { SeedPalette } from '@/data/palettes';
import { useClipboard } from '@/hooks/useClipboard';

interface PaletteCardProps {
  palette: SeedPalette;
}

export function PaletteCard({ palette }: PaletteCardProps) {
  const { copy, hasCopied } = useClipboard();

  const paletteUrl = palette.colors.map((c) => c.replace('#', '')).join('-');

  const handleCopyAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copy(palette.colors.join(', '));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
    >
      {/* Color swatches */}
      <Link href={`/generate/${paletteUrl}`}>
        <div className="flex h-28">
          {palette.colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 transition-transform group-hover:scale-y-105 origin-bottom"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 truncate">{palette.name}</h3>
          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{palette.likes.toLocaleString()}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {palette.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/generate/${paletteUrl}`}
            className="flex-1 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Open
          </Link>
          <button
            onClick={handleCopyAll}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Copy all colors"
          >
            {hasCopied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
