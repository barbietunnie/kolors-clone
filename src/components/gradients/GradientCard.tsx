/**
 * GradientCard Component
 * Author: Babatunde Adeyemi
 *
 * Displays a single gradient with its name and actions
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';

interface GradientCardProps {
  name: string;
  css: string;
  colors: string[];
}

export function GradientCard({ name, css, colors }: GradientCardProps) {
  const [copied, setCopied] = useState<'css' | 'colors' | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Determine if text should be light or dark based on first color
  const firstColorLuminance = colors[0] ? chroma(colors[0]).luminance() : 0.5;
  const isLight = firstColorLuminance > 0.5;
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const iconColor = isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)';

  const copyCss = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(css);
      setCopied('css');
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyColors = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(colors.join(', '));
      setCopied('colors');
      setTimeout(() => setCopied(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Convert CSS gradient to URL-safe format for gradient maker
  const gradientMakerUrl = `/gradient-maker?colors=${colors.map(c => c.replace('#', '')).join('-')}`;

  return (
    <motion.div
      className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient swatch */}
      <div
        className="aspect-[3/2] relative"
        style={{ background: css }}
      >
        {/* Color stops overlay on hover */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center gap-2 ${textColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {colors.map((color, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded text-xs font-mono font-medium backdrop-blur-sm"
              style={{
                backgroundColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'
              }}
            >
              {color}
            </span>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="absolute top-2 right-2 flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Copy CSS button */}
          <button
            onClick={copyCss}
            className="p-2 rounded-lg backdrop-blur-sm transition-colors"
            style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            title="Copy CSS"
          >
            {copied === 'css' ? (
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
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            )}
          </button>

          {/* Copy colors button */}
          <button
            onClick={copyColors}
            className="p-2 rounded-lg backdrop-blur-sm transition-colors"
            style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            title="Copy colors"
          >
            {copied === 'colors' ? (
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

          {/* Edit in gradient maker */}
          <Link
            href={gradientMakerUrl}
            className="p-2 rounded-lg backdrop-blur-sm transition-colors"
            style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            title="Edit in Gradient Maker"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Gradient info */}
      <div className="bg-white p-3">
        <h3 className="font-medium text-gray-900 truncate" title={name}>
          {name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">
            {colors.length} colors
          </span>
        </div>
      </div>
    </motion.div>
  );
}
