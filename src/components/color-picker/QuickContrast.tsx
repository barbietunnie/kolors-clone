'use client';

import Link from 'next/link';
import { checkContrast, getContrastRating } from '@/lib/colors';

interface QuickContrastProps {
  hex: string;
}

export function QuickContrast({ hex }: QuickContrastProps) {
  const whiteContrast = checkContrast(hex, '#FFFFFF');
  const blackContrast = checkContrast(hex, '#000000');

  const ContrastBadge = ({ passes, label }: { passes: boolean; label: string }) => (
    <span
      className={`px-2 py-1 text-xs font-medium rounded ${
        passes ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {label} {passes ? '✓' : '✗'}
    </span>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Contrast Check</h2>
        <Link
          href={`/contrast-checker?fg=${hex.replace('#', '')}&bg=FFFFFF`}
          className="text-sm text-blue-600 hover:underline"
        >
          Full checker →
        </Link>
      </div>

      <div className="space-y-4">
        {/* White background */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: hex }}
              />
              <span className="text-sm font-medium">on White</span>
            </div>
            <span className="text-lg font-bold">{whiteContrast.ratio}:1</span>
          </div>
          <div
            className="p-3 rounded mb-3"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <p style={{ color: hex }} className="text-sm font-medium">
              Sample text on white background
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ContrastBadge passes={whiteContrast.aa.normal} label="AA" />
            <ContrastBadge passes={whiteContrast.aa.large} label="AA Large" />
            <ContrastBadge passes={whiteContrast.aaa.normal} label="AAA" />
          </div>
        </div>

        {/* Black background */}
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: hex }}
              />
              <span className="text-sm font-medium text-white">on Black</span>
            </div>
            <span className="text-lg font-bold text-white">{blackContrast.ratio}:1</span>
          </div>
          <div
            className="p-3 rounded mb-3"
            style={{ backgroundColor: '#000000' }}
          >
            <p style={{ color: hex }} className="text-sm font-medium">
              Sample text on black background
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ContrastBadge passes={blackContrast.aa.normal} label="AA" />
            <ContrastBadge passes={blackContrast.aa.large} label="AA Large" />
            <ContrastBadge passes={blackContrast.aaa.normal} label="AAA" />
          </div>
        </div>
      </div>
    </div>
  );
}
