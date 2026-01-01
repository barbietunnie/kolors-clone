'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import type { Color } from '@/types/color';
import { getContrastingTextColor } from '@/lib/colors';
import { useClipboard } from '@/hooks/useClipboard';
import { Tooltip } from '@/components/ui/Tooltip';

interface ColorColumnProps {
  color: Color;
  index: number;
  totalColors: number;
  onToggleLock: () => void;
  onUpdateColor: (hex: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
}

export function ColorColumn({
  color,
  index,
  totalColors,
  onToggleLock,
  onUpdateColor,
  onRemove,
  canRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: ColorColumnProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { copy, hasCopied } = useClipboard();
  const pickerRef = useRef<HTMLDivElement>(null);

  const textColor = getContrastingTextColor(color.hex);
  const iconColor = textColor === '#FFFFFF' ? 'text-white' : 'text-gray-800';
  const buttonHoverBg = textColor === '#FFFFFF' ? 'hover:bg-white/20' : 'hover:bg-black/10';

  const handleCopy = () => {
    copy(color.hex);
  };

  const handlePickerChange = (newHex: string) => {
    onUpdateColor(newHex);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="relative flex-1 h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
      style={{ backgroundColor: color.hex }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Color actions */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2"
      >
        {canRemove && (
          <Tooltip content="Remove" position="right">
            <button
              onClick={onRemove}
              className={`p-2 rounded-lg ${buttonHoverBg} transition-colors ${iconColor}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Tooltip>
        )}
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col items-center gap-4">
        {/* Hex value - clickable to copy */}
        <button
          onClick={handleCopy}
          className={`text-2xl md:text-3xl font-bold tracking-wider ${iconColor} hover:scale-105 transition-transform`}
        >
          {hasCopied ? 'Copied!' : color.hex.replace('#', '')}
        </button>

        {/* Color picker trigger */}
        <Tooltip content="Adjust color">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className={`p-2 rounded-lg ${buttonHoverBg} transition-colors ${iconColor}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Bottom actions */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered || color.isLocked ? 1 : 0 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
      >
        {/* Lock button */}
        <Tooltip content={color.isLocked ? 'Unlock (L)' : 'Lock (L)'}>
          <button
            onClick={onToggleLock}
            className={`p-2 rounded-lg ${buttonHoverBg} transition-colors ${iconColor}`}
          >
            {color.isLocked ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </Tooltip>

        {/* Copy button */}
        <Tooltip content="Copy HEX (C)">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg ${buttonHoverBg} transition-colors ${iconColor}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </Tooltip>

        {/* Drag handle */}
        <Tooltip content="Drag to reorder">
          <div className={`p-2 cursor-grab active:cursor-grabbing ${iconColor}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        </Tooltip>
      </motion.div>

      {/* Lock indicator */}
      {color.isLocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4"
        >
          <div className={`p-1 rounded-full ${textColor === '#FFFFFF' ? 'bg-white/20' : 'bg-black/10'}`}>
            <svg className={`w-4 h-4 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Color picker popover */}
      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          <div
            ref={pickerRef}
            className="absolute z-50 p-3 bg-white rounded-lg shadow-2xl"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <HexColorPicker color={color.hex} onChange={handlePickerChange} />
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">HEX:</span>
              <input
                type="text"
                value={color.hex}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    if (val.length === 7) {
                      onUpdateColor(val);
                    }
                  }
                }}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowPicker(false)}
              className="mt-3 w-full py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
