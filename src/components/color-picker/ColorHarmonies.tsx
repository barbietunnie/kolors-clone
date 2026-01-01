'use client';

import Link from 'next/link';
import { getAllHarmonies } from '@/lib/colors';
import { getContrastingTextColor } from '@/lib/colors';

interface ColorHarmoniesProps {
  hex: string;
}

export function ColorHarmonies({ hex }: ColorHarmoniesProps) {
  const harmonies = getAllHarmonies(hex);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Color Harmonies</h2>
      <div className="space-y-6">
        {harmonies.map((harmony) => (
          <div key={harmony.name}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">{harmony.name}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">{harmony.description}</p>
            <div className="flex rounded-lg overflow-hidden">
              {harmony.colors.map((color, index) => (
                <Link
                  key={index}
                  href={`/color-picker?color=${color.replace('#', '')}`}
                  className="flex-1 h-12 flex items-center justify-center text-xs font-mono transition-transform hover:scale-105"
                  style={{
                    backgroundColor: color,
                    color: getContrastingTextColor(color),
                  }}
                >
                  {color}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
