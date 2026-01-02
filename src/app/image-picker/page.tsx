'use client';

import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { extractColorsFromImage, rgbToHexString } from '@/lib/colors';
import { ImageDropzone } from '@/components/image-picker/ImageDropzone';
import { ImageColorPicker } from '@/components/image-picker/ImageColorPicker';
import { ExtractedPalette } from '@/components/image-picker/ExtractedPalette';

export default function ImagePickerPage() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [paletteSize, setPaletteSize] = useState(5);

  const extractColors = useCallback((data: ImageData, size: number) => {
    const rgbColors = extractColorsFromImage(data, size);
    const hexColors = rgbColors.map(rgb => rgbToHexString(rgb));
    setExtractedColors(hexColors);
  }, []);

  const handleImageLoad = useCallback((data: ImageData, url: string) => {
    setImageData(data);
    setImageUrl(url);
    extractColors(data, paletteSize);
  }, [paletteSize, extractColors]);

  const handlePaletteSizeChange = useCallback((size: number) => {
    setPaletteSize(size);
    if (imageData) {
      extractColors(imageData, size);
    }
  }, [imageData, extractColors]);

  const handleReExtract = useCallback(() => {
    if (imageData) {
      extractColors(imageData, paletteSize);
    }
  }, [imageData, paletteSize, extractColors]);

  const handleColorPick = useCallback((hex: string) => {
    setExtractedColors(prev => {
      // Add to the end, remove oldest if at max
      const newColors = [...prev, hex];
      if (newColors.length > paletteSize) {
        return newColors.slice(1);
      }
      return newColors;
    });
  }, [paletteSize]);

  const handleRemoveColor = useCallback((index: number) => {
    setExtractedColors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleReorderColors = useCallback((newColors: string[]) => {
    setExtractedColors(newColors);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // R to re-extract
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey && imageData) {
        extractColors(imageData, paletteSize);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageData, paletteSize, extractColors]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Extract Colors from Image
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload an image to automatically extract a color palette.
            Click on the image to pick specific colors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left column - Image upload and picker */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Image</h2>
              <ImageDropzone
                onImageLoad={handleImageLoad}
                currentImage={imageUrl}
              />
            </div>

            {imageData && imageUrl && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pick Colors</h2>
                <ImageColorPicker
                  imageUrl={imageUrl}
                  imageData={imageData}
                  onColorPick={handleColorPick}
                />
              </div>
            )}
          </div>

          {/* Right column - Extracted palette */}
          <div className="space-y-6">
            <ExtractedPalette
              colors={extractedColors}
              onRemoveColor={handleRemoveColor}
              onReorderColors={handleReorderColors}
              paletteSize={paletteSize}
              onPaletteSizeChange={handlePaletteSizeChange}
              onReExtract={handleReExtract}
              hasImage={!!imageData}
            />

            {/* Tips */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">P</span>
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs font-mono">P</kbd> to toggle color picker mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">R</span>
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded text-xs font-mono">R</kbd> to re-extract colors</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Drag colors to reorder them</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Click on the image to pick specific colors when picker is active</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
