'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HexColorPicker } from 'react-colorful';
import { normalizeHex, checkContrast, getContrastRating, suggestAccessibleColor } from '@/lib/colors';
import { Header } from '@/components/ui/Header';

function ContrastCheckerContent() {
  const searchParams = useSearchParams();
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');
  const [fgInput, setFgInput] = useState('000000');
  const [bgInput, setBgInput] = useState('FFFFFF');
  const [activeColorPicker, setActiveColorPicker] = useState<'fg' | 'bg' | null>(null);

  useEffect(() => {
    const fg = searchParams.get('fg');
    const bg = searchParams.get('bg');

    if (fg) {
      try {
        const normalized = normalizeHex(fg);
        setForeground(normalized);
        setFgInput(normalized.replace('#', ''));
      } catch {}
    }

    if (bg) {
      try {
        const normalized = normalizeHex(bg);
        setBackground(normalized);
        setBgInput(normalized.replace('#', ''));
      } catch {}
    }
  }, [searchParams]);

  const contrast = checkContrast(foreground, background);
  const rating = getContrastRating(contrast.ratio);

  const updateUrl = (fg: string, bg: string) => {
    window.history.replaceState(
      null,
      '',
      `/contrast-checker?fg=${fg.replace('#', '')}&bg=${bg.replace('#', '')}`
    );
  };

  const handleFgChange = (value: string) => {
    setFgInput(value);
    if (/^[0-9A-Fa-f]{6}$/.test(value)) {
      const normalized = normalizeHex(value);
      setForeground(normalized);
      updateUrl(normalized, background);
    }
  };

  const handleBgChange = (value: string) => {
    setBgInput(value);
    if (/^[0-9A-Fa-f]{6}$/.test(value)) {
      const normalized = normalizeHex(value);
      setBackground(normalized);
      updateUrl(foreground, normalized);
    }
  };

  const handlePickerChange = (color: string) => {
    const normalized = color.toUpperCase();
    if (activeColorPicker === 'fg') {
      setForeground(normalized);
      setFgInput(normalized.replace('#', ''));
      updateUrl(normalized, background);
    } else if (activeColorPicker === 'bg') {
      setBackground(normalized);
      setBgInput(normalized.replace('#', ''));
      updateUrl(foreground, normalized);
    }
  };

  const swapColors = () => {
    setForeground(background);
    setBackground(foreground);
    setFgInput(bgInput);
    setBgInput(fgInput);
    updateUrl(background, foreground);
  };

  const suggestFg = () => {
    const suggested = suggestAccessibleColor(foreground, background, 4.5);
    setForeground(suggested);
    setFgInput(suggested.replace('#', ''));
    updateUrl(suggested, background);
  };

  const PassFailBadge = ({ passes, label }: { passes: boolean; label: string }) => (
    <div
      className={`flex items-center justify-between p-4 rounded-lg ${
        passes ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      }`}
    >
      <span className="font-medium text-foreground">{label}</span>
      <span
        className={`px-3 py-1 rounded-full text-sm font-bold ${
          passes ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}
      >
        {passes ? 'PASS' : 'FAIL'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contrast Checker</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Check the contrast ratio between text and background colors to ensure
            accessibility compliance with WCAG guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color inputs */}
          <div className="bg-card-bg rounded-xl border border-card-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Colors</h2>

            {/* Foreground color */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-muted mb-2">
                Text Color (Foreground)
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveColorPicker(activeColorPicker === 'fg' ? null : 'fg')}
                  className="w-12 h-12 rounded-lg border-2 border-card-border cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: foreground }}
                />
                <div className="flex items-center bg-muted-bg rounded-lg px-3 py-2 flex-1">
                  <span className="text-muted font-mono">#</span>
                  <input
                    type="text"
                    value={fgInput}
                    onChange={(e) => handleFgChange(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="bg-transparent border-none outline-none font-mono uppercase flex-1 ml-1 text-foreground"
                  />
                </div>
              </div>
              {activeColorPicker === 'fg' && (
                <div className="mt-4">
                  <HexColorPicker color={foreground} onChange={handlePickerChange} />
                </div>
              )}
            </div>

            {/* Swap button */}
            <div className="flex justify-center my-4">
              <button
                onClick={swapColors}
                className="p-3 bg-muted-bg rounded-full hover:bg-card-border transition-colors"
                title="Swap colors"
              >
                <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* Background color */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveColorPicker(activeColorPicker === 'bg' ? null : 'bg')}
                  className="w-12 h-12 rounded-lg border-2 border-card-border cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: background }}
                />
                <div className="flex items-center bg-muted-bg rounded-lg px-3 py-2 flex-1">
                  <span className="text-muted font-mono">#</span>
                  <input
                    type="text"
                    value={bgInput}
                    onChange={(e) => handleBgChange(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="bg-transparent border-none outline-none font-mono uppercase flex-1 ml-1 text-foreground"
                  />
                </div>
              </div>
              {activeColorPicker === 'bg' && (
                <div className="mt-4">
                  <HexColorPicker color={background} onChange={handlePickerChange} />
                </div>
              )}
            </div>

            {/* Suggestion button */}
            {!contrast.aa.normal && (
              <button
                onClick={suggestFg}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Suggest accessible text color
              </button>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Contrast ratio */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6 text-center">
              <p className="text-sm text-muted mb-2">Contrast Ratio</p>
              <p className="text-6xl font-bold text-foreground">{contrast.ratio}</p>
              <p className="text-2xl text-muted">:1</p>
              <div className="mt-4">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${
                    rating === 'AAA'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : rating.includes('AA')
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  {rating}
                </span>
              </div>
            </div>

            {/* WCAG levels */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">WCAG Compliance</h3>
              <div className="space-y-3">
                <PassFailBadge passes={contrast.aa.large} label="AA Large Text (3:1)" />
                <PassFailBadge passes={contrast.aa.normal} label="AA Normal Text (4.5:1)" />
                <PassFailBadge passes={contrast.aaa.large} label="AAA Large Text (4.5:1)" />
                <PassFailBadge passes={contrast.aaa.normal} label="AAA Normal Text (7:1)" />
              </div>
            </div>
          </div>
        </div>

        {/* Preview section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Normal text preview */}
            <div
              className="rounded-xl p-8"
              style={{ backgroundColor: background }}
            >
              <p style={{ color: foreground }} className="text-sm mb-2">
                Small text (14px) - This is how small body text will appear with these colors.
              </p>
              <p style={{ color: foreground }} className="text-base mb-2">
                Normal text (16px) - Regular paragraph text at standard size.
              </p>
              <p style={{ color: foreground }} className="text-lg mb-2">
                Large text (18px) - Slightly larger text for emphasis.
              </p>
              <p style={{ color: foreground }} className="text-xl font-bold">
                Bold large text (20px bold) - Headlines and important content.
              </p>
            </div>

            {/* UI elements preview */}
            <div
              className="rounded-xl p-8"
              style={{ backgroundColor: background }}
            >
              <h3 style={{ color: foreground }} className="text-xl font-bold mb-4">
                UI Elements Preview
              </h3>
              <button
                className="px-4 py-2 rounded-lg font-medium mb-4"
                style={{ backgroundColor: foreground, color: background }}
              >
                Primary Button
              </button>
              <p style={{ color: foreground }} className="mb-2">
                <a href="#" className="underline">This is a link</a> within a paragraph of text.
              </p>
              <div
                className="p-4 rounded-lg border-2 mt-4"
                style={{ borderColor: foreground }}
              >
                <p style={{ color: foreground }} className="text-sm">
                  A bordered container with text inside.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-12 bg-card-bg rounded-xl border border-card-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">WCAG Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Level AA (Minimum)</h3>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-foreground">4.5:1</strong> for normal text (under 18pt or 14pt bold)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-foreground">3:1</strong> for large text (18pt+ or 14pt+ bold)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Level AAA (Enhanced)</h3>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-foreground">7:1</strong> for normal text</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-foreground">4.5:1</strong> for large text</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContrastCheckerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    }>
      <ContrastCheckerContent />
    </Suspense>
  );
}
