'use client';

import { hexToRgb, hexToHsl, hexToHsb, hexToCmyk, hexToLab } from '@/lib/colors';
import { useClipboard } from '@/hooks/useClipboard';

interface ColorInfoProps {
  hex: string;
}

export function ColorInfo({ hex }: ColorInfoProps) {
  const { copy, hasCopied, copiedText } = useClipboard();

  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  const hsb = hexToHsb(hex);
  const cmyk = hexToCmyk(hex);
  const lab = hexToLab(hex);

  const formats = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'HSB', value: `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    { label: 'LAB', value: `lab(${lab.l}, ${lab.a}, ${lab.b})` },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Color Values</h2>
      <div className="space-y-3">
        {formats.map((format) => (
          <div
            key={format.label}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => copy(format.value)}
          >
            <span className="text-sm font-medium text-gray-500">{format.label}</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-gray-900">{format.value}</code>
              {hasCopied && copiedText === format.value ? (
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
