'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { getColorAtPixel, rgbToHexString } from '@/lib/colors';

interface ImageColorPickerProps {
  imageUrl: string;
  imageData: ImageData;
  onColorPick: (hex: string) => void;
}

export function ImageColorPicker({ imageUrl, imageData, onColorPick }: ImageColorPickerProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isPickerActive, setIsPickerActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const getImageCoordinates = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || !containerRef.current) return null;

    const imgRect = imgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate click position relative to the image
    const clickX = e.clientX - imgRect.left;
    const clickY = e.clientY - imgRect.top;

    // Convert to image data coordinates
    const scaleX = imageData.width / imgRect.width;
    const scaleY = imageData.height / imgRect.height;

    const x = Math.floor(clickX * scaleX);
    const y = Math.floor(clickY * scaleY);

    // Check bounds
    if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
      return null;
    }

    return { x, y, screenX: e.clientX - containerRect.left, screenY: e.clientY - containerRect.top };
  }, [imageData]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPickerActive) return;

    const coords = getImageCoordinates(e);
    if (!coords) {
      setHoveredColor(null);
      setCursorPos(null);
      return;
    }

    const rgb = getColorAtPixel(imageData, coords.x, coords.y);
    const hex = rgbToHexString(rgb);
    setHoveredColor(hex);
    setCursorPos({ x: coords.screenX, y: coords.screenY });
  }, [isPickerActive, imageData, getImageCoordinates]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPickerActive) return;

    const coords = getImageCoordinates(e);
    if (!coords) return;

    const rgb = getColorAtPixel(imageData, coords.x, coords.y);
    const hex = rgbToHexString(rgb);
    onColorPick(hex);
  }, [isPickerActive, imageData, getImageCoordinates, onColorPick]);

  const handleMouseLeave = useCallback(() => {
    setHoveredColor(null);
    setCursorPos(null);
  }, []);

  // Handle keyboard shortcut to toggle picker
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setIsPickerActive(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Click on the image to pick specific colors
        </p>
        <button
          onClick={() => setIsPickerActive(!isPickerActive)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${isPickerActive
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {isPickerActive ? 'Picker Active (P)' : 'Pick Color (P)'}
          </span>
        </button>
      </div>

      <div
        ref={containerRef}
        className={`relative rounded-xl overflow-hidden ${isPickerActive ? 'cursor-crosshair' : ''}`}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Image for color picking"
          className="w-full h-auto"
        />

        {/* Overlay when picker is active */}
        {isPickerActive && (
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        )}

        {/* Color preview tooltip */}
        {hoveredColor && cursorPos && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: cursorPos.x + 20,
              top: cursorPos.y - 40,
            }}
          >
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-xl px-3 py-2 border border-gray-200">
              <div
                className="w-8 h-8 rounded-md border border-gray-300"
                style={{ backgroundColor: hoveredColor }}
              />
              <span className="font-mono text-sm font-medium">{hoveredColor}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
