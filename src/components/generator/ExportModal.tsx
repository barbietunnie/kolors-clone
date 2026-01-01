'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Color } from '@/types/color';
import { useClipboard } from '@/hooks/useClipboard';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: Color[];
}

type ExportFormat = 'css' | 'scss' | 'tailwind' | 'json' | 'array';

export function ExportModal({ isOpen, onClose, colors }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const { copy, hasCopied } = useClipboard();

  const generateExport = (): string => {
    switch (format) {
      case 'css':
        return `:root {\n${colors
          .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
          .join('\n')}\n}`;

      case 'scss':
        return colors
          .map((c, i) => `$color-${i + 1}: ${c.hex};`)
          .join('\n');

      case 'tailwind':
        return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors
          .map((c, i) => `        'palette-${i + 1}': '${c.hex}',`)
          .join('\n')}\n      }\n    }\n  }\n}`;

      case 'json':
        return JSON.stringify(
          colors.map((c) => ({
            hex: c.hex,
            rgb: c.rgb,
            hsl: c.hsl,
          })),
          null,
          2
        );

      case 'array':
        return `[${colors.map((c) => `'${c.hex}'`).join(', ')}]`;

      default:
        return '';
    }
  };

  const exportContent = generateExport();

  const formats: { value: ExportFormat; label: string }[] = [
    { value: 'css', label: 'CSS Variables' },
    { value: 'scss', label: 'SCSS Variables' },
    { value: 'tailwind', label: 'Tailwind Config' },
    { value: 'json', label: 'JSON' },
    { value: 'array', label: 'Array' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Export Palette</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Color preview */}
            <div className="flex h-16">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="flex-1"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>

            {/* Format selector */}
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {formats.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      format === f.value
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Export content */}
            <div className="px-6 pb-4">
              <div className="relative">
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto max-h-64">
                  <code>{exportContent}</code>
                </pre>
                <button
                  onClick={() => copy(exportContent)}
                  className="absolute top-2 right-2 px-3 py-1 text-xs font-medium text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  {hasCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => copy(exportContent)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {hasCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
