'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HexColorPicker } from 'react-colorful';
import { normalizeHex, getContrastingTextColor } from '@/lib/colors';
import { ColorInfo } from '@/components/color-picker/ColorInfo';
import { ColorHarmonies } from '@/components/color-picker/ColorHarmonies';
import { ColorVariations } from '@/components/color-picker/ColorVariations';
import { BlindnessSimulator } from '@/components/color-picker/BlindnessSimulator';
import { QuickContrast } from '@/components/color-picker/QuickContrast';

function ColorPickerContent() {
  const searchParams = useSearchParams();
  const initialColor = searchParams.get('color');
  const [color, setColor] = useState('#6366F1');
  const [inputValue, setInputValue] = useState('6366F1');

  useEffect(() => {
    if (initialColor) {
      try {
        const normalized = normalizeHex(initialColor);
        setColor(normalized);
        setInputValue(normalized.replace('#', ''));
      } catch {
        // Invalid color, use default
      }
    }
  }, [initialColor]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (/^[0-9A-Fa-f]{6}$/.test(value)) {
      try {
        const normalized = normalizeHex(value);
        setColor(normalized);
        // Update URL
        window.history.replaceState(null, '', `/color-picker?color=${value.toUpperCase()}`);
      } catch {
        // Invalid color
      }
    }
  };

  const handlePickerChange = (newColor: string) => {
    setColor(newColor.toUpperCase());
    setInputValue(newColor.replace('#', '').toUpperCase());
    window.history.replaceState(null, '', `/color-picker?color=${newColor.replace('#', '').toUpperCase()}`);
  };

  const textColor = getContrastingTextColor(color);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Kolors
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/generate" className="text-gray-600 hover:text-gray-900 transition-colors">
              Generate
            </Link>
            <Link href="/color-picker" className="text-gray-900 font-medium">
              Color Picker
            </Link>
            <Link href="/contrast-checker" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contrast Checker
            </Link>
            <Link href="/palettes" className="text-gray-600 hover:text-gray-900 transition-colors">
              Explore
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero color section */}
      <div
        className="py-16 transition-colors duration-300"
        style={{ backgroundColor: color }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Color picker */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <HexColorPicker color={color} onChange={handlePickerChange} />
            </div>

            {/* Color input and info */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-4">
                <span style={{ color: textColor }} className="text-2xl font-bold">#</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-4xl md:text-6xl font-bold bg-transparent border-none outline-none uppercase tracking-wider"
                  style={{ color: textColor, width: '280px' }}
                />
              </div>
              <p style={{ color: textColor }} className="text-lg opacity-80">
                Click anywhere on the picker or enter a HEX value
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  href={`/generate/${color.replace('#', '')}`}
                  className="px-6 py-3 bg-white/20 backdrop-blur rounded-full font-medium transition-colors hover:bg-white/30"
                  style={{ color: textColor }}
                >
                  Use in Generator
                </Link>
                <Link
                  href={`/contrast-checker?fg=${color.replace('#', '')}&bg=FFFFFF`}
                  className="px-6 py-3 bg-white/20 backdrop-blur rounded-full font-medium transition-colors hover:bg-white/30"
                  style={{ color: textColor }}
                >
                  Check Contrast
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ColorInfo hex={color} />
          <QuickContrast hex={color} />
          <ColorHarmonies hex={color} />
          <ColorVariations hex={color} />
          <div className="lg:col-span-2">
            <BlindnessSimulator hex={color} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ColorPickerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    }>
      <ColorPickerContent />
    </Suspense>
  );
}
