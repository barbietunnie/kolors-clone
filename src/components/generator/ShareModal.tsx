'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Color } from '@/types/color';
import { useClipboard } from '@/hooks/useClipboard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: Color[];
}

export function ShareModal({ isOpen, onClose, colors }: ShareModalProps) {
  const [embedSize, setEmbedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const { copy, hasCopied } = useClipboard();

  const paletteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/generate/${colors.map(c => c.hex.replace('#', '')).join('-')}`
    : '';

  const colorString = colors.map(c => c.hex).join(', ');

  // Social share URLs
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this color palette: ${colorString}`)}&url=${encodeURIComponent(paletteUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(paletteUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(paletteUrl)}&description=${encodeURIComponent(`Color palette: ${colorString}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(paletteUrl)}`,
  };

  // Embed code sizes
  const embedSizes = {
    small: { width: 400, height: 80 },
    medium: { width: 600, height: 120 },
    large: { width: 800, height: 160 },
  };

  const currentSize = embedSizes[embedSize];

  // Generate embed code
  const embedCode = `<iframe src="${paletteUrl}?embed=true" width="${currentSize.width}" height="${currentSize.height}" frameborder="0" style="border-radius: 8px; overflow: hidden;"></iframe>`;

  // Generate HTML snippet
  const htmlSnippet = `<div style="display: flex; height: ${currentSize.height}px; border-radius: 8px; overflow: hidden;">
${colors.map(c => `  <div style="flex: 1; background-color: ${c.hex};" title="${c.hex}"></div>`).join('\n')}
</div>`;

  const handleSocialShare = useCallback((platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }, [shareUrls]);

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Share Palette</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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

            {/* Share link */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paletteUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                />
                <button
                  onClick={() => copy(paletteUrl)}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  {hasCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Social sharing */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Share on Social</h3>
              <div className="flex gap-3">
                {/* Twitter/X */}
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-sm font-medium">X</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-medium">Facebook</span>
                </button>

                {/* Pinterest */}
                <button
                  onClick={() => handleSocialShare('pinterest')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E60023] text-white rounded-lg hover:bg-[#D50C22] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm font-medium">Pinterest</span>
                </button>
              </div>
            </div>

            {/* Embed code */}
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Embed Code</h3>

              {/* Size selector */}
              <div className="flex gap-2 mb-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setEmbedSize(size)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                      embedSize === size
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* HTML Snippet tab */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">HTML Snippet</span>
                    <button
                      onClick={() => copy(htmlSnippet)}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
                    <code>{htmlSnippet}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">iFrame Embed</span>
                    <button
                      onClick={() => copy(embedCode)}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
