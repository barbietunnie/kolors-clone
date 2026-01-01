'use client';

import Link from 'next/link';
import { getShades, getTints, getTones } from '@/lib/colors';
import { getContrastingTextColor } from '@/lib/colors';

interface ColorVariationsProps {
  hex: string;
}

export function ColorVariations({ hex }: ColorVariationsProps) {
  const shades = getShades(hex);
  const tints = getTints(hex);
  const tones = getTones(hex);

  const variations = [
    { name: 'Shades', description: 'Adding black to darken', colors: shades },
    { name: 'Tints', description: 'Adding white to lighten', colors: tints },
    { name: 'Tones', description: 'Adding gray to mute', colors: tones },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Color Variations</h2>
      <div className="space-y-6">
        {variations.map((variation) => (
          <div key={variation.name}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">{variation.name}</h3>
              <span className="text-xs text-gray-500">{variation.description}</span>
            </div>
            <div className="flex rounded-lg overflow-hidden">
              {variation.colors.map((color, index) => (
                <Link
                  key={index}
                  href={`/color-picker?color=${color.hex.replace('#', '')}`}
                  className="flex-1 h-10 transition-transform hover:scale-110 hover:z-10"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
