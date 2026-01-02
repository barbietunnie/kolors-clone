/**
 * ColorCard Component
 * Author: Babatunde Adeyemi
 *
 * Displays a single color with its name and actions
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';

interface ColorCardProps {
  name: string;
  hex: string;
}

export function ColorCard({ name, hex }: ColorCardProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine if text should be light or dark based on background
  const isLight = chroma(hex).luminance() > 0.5;
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const iconColor = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)';

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Color swatch */}
      <div
        className="aspect-[4/3] relative"
        style={{ backgroundColor: hex }}
      >
        {/* Hex code overlay on hover */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center ${textColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-mono text-lg font-medium tracking-wider">
            {hex}
          </span>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="absolute top-2 right-2 flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg backdrop-blur-sm transition-colors"
            style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            title="Copy hex code"
          >
            {copied ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke={iconColor}
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke={iconColor}
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>

          {/* View in color picker */}
          <Link
            href={`/color-picker?color=${hex.replace('#', '')}`}
            className="p-2 rounded-lg backdrop-blur-sm transition-colors"
            style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            title="View details"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke={iconColor}
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Color info */}
      <div className="bg-white p-3">
        <h3 className="font-medium text-gray-900 truncate" title={name}>
          {name}
        </h3>
        <p className="text-sm text-gray-500 font-mono">{hex}</p>
      </div>
    </motion.div>
  );
}
