'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { HexColorPicker } from 'react-colorful';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';
import { useClipboard } from '@/hooks/useClipboard';
import { getContrastingTextColor } from '@/lib/colors';
import { Header } from '@/components/ui/Header';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial' | 'conic';

const presetGradients = [
  { colors: ['#667eea', '#764ba2'], name: 'Purple Haze' },
  { colors: ['#f093fb', '#f5576c'], name: 'Pink Sunset' },
  { colors: ['#4facfe', '#00f2fe'], name: 'Ocean Blue' },
  { colors: ['#43e97b', '#38f9d7'], name: 'Fresh Mint' },
  { colors: ['#fa709a', '#fee140'], name: 'Warm Flame' },
  { colors: ['#a8edea', '#fed6e3'], name: 'Cotton Candy' },
  { colors: ['#667eea', '#764ba2', '#f093fb'], name: 'Triple Blend' },
  { colors: ['#0f0c29', '#302b63', '#24243e'], name: 'Deep Space' },
];

export default function GradientMakerPage() {
  const [stops, setStops] = useState<ColorStop[]>([
    { id: '1', color: '#667EEA', position: 0 },
    { id: '2', color: '#764BA2', position: 100 },
  ]);
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const { copy, hasCopied } = useClipboard();

  const gradientCSS = useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const colorStops = sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(', ');

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${colorStops})`;
      case 'radial':
        return `radial-gradient(circle, ${colorStops})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${colorStops})`;
      default:
        return `linear-gradient(${angle}deg, ${colorStops})`;
    }
  }, [stops, gradientType, angle]);

  const cssCode = `background: ${gradientCSS};`;

  const addStop = () => {
    if (stops.length >= 5) return;

    const positions = stops.map((s) => s.position).sort((a, b) => a - b);
    let newPosition = 50;

    // Find a gap to place the new stop
    for (let i = 0; i < positions.length - 1; i++) {
      const gap = positions[i + 1] - positions[i];
      if (gap >= 20) {
        newPosition = positions[i] + gap / 2;
        break;
      }
    }

    // Interpolate color at the position
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const scale = chroma.scale(sortedStops.map((s) => s.color));
    const newColor = scale(newPosition / 100).hex().toUpperCase();

    setStops([
      ...stops,
      {
        id: Date.now().toString(),
        color: newColor,
        position: newPosition,
      },
    ]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
    if (activeStopId === id) setActiveStopId(null);
  };

  const updateStop = (id: string, updates: Partial<ColorStop>) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const applyPreset = (preset: { colors: string[] }) => {
    const newStops = preset.colors.map((color, index) => ({
      id: Date.now().toString() + index,
      color: color.toUpperCase(),
      position: (index / (preset.colors.length - 1)) * 100,
    }));
    setStops(newStops);
    setActiveStopId(null);
  };

  const generatePalette = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const scale = chroma.scale(sortedStops.map((s) => s.color)).colors(5);
    const paletteUrl = scale.map((c) => c.replace('#', '').toUpperCase()).join('-');
    return `/generate/${paletteUrl}`;
  };

  const activeStop = stops.find((s) => s.id === activeStopId);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Gradient Maker</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Create beautiful CSS gradients with multiple color stops. Export as CSS or convert to a color palette.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-6">
            {/* Gradient preview */}
            <motion.div
              className="h-80 rounded-xl shadow-lg"
              style={{ background: gradientCSS }}
              layout
            />

            {/* Color stops slider */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">Color Stops</h3>
                <button
                  onClick={addStop}
                  disabled={stops.length >= 5}
                  className="px-3 py-1.5 text-sm font-medium bg-muted-bg text-foreground rounded-lg hover:bg-card-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Stop
                </button>
              </div>

              {/* Gradient bar with stops */}
              <div className="relative h-8 rounded-lg mb-4" style={{ background: gradientCSS }}>
                {stops.map((stop) => (
                  <button
                    key={stop.id}
                    onClick={() => setActiveStopId(stop.id === activeStopId ? null : stop.id)}
                    className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-110 ${
                      activeStopId === stop.id ? 'ring-2 ring-foreground scale-110' : ''
                    }`}
                    style={{
                      left: `calc(${stop.position}% - 10px)`,
                      backgroundColor: stop.color,
                    }}
                  />
                ))}
              </div>

              {/* Stop list */}
              <div className="space-y-2">
                {stops.map((stop) => (
                  <div
                    key={stop.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      activeStopId === stop.id ? 'bg-muted-bg' : 'hover:bg-muted-bg/50'
                    }`}
                    onClick={() => setActiveStopId(stop.id === activeStopId ? null : stop.id)}
                  >
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: stop.color }}
                    />
                    <code className="text-sm font-mono text-muted flex-1">
                      {stop.color}
                    </code>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) =>
                        updateStop(stop.id, { position: parseInt(e.target.value) })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-24"
                    />
                    <span className="text-sm text-muted w-12">
                      {stop.position}%
                    </span>
                    {stops.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStop(stop.id);
                        }}
                        className="p-1 text-muted hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Color picker for active stop */}
              {activeStop && (
                <div className="mt-4 p-4 bg-muted-bg rounded-lg">
                  <HexColorPicker
                    color={activeStop.color}
                    onChange={(color) =>
                      updateStop(activeStop.id, { color: color.toUpperCase() })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Gradient type and angle */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="font-medium text-foreground mb-4">Gradient Type</h3>

              <div className="flex gap-2 mb-6">
                {(['linear', 'radial', 'conic'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors capitalize ${
                      gradientType === type
                        ? 'bg-foreground text-background'
                        : 'bg-muted-bg text-foreground hover:bg-card-border'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {(gradientType === 'linear' || gradientType === 'conic') && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-muted">
                      {gradientType === 'linear' ? 'Angle' : 'Start Angle'}
                    </label>
                    <span className="text-sm text-muted">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <button
                        key={a}
                        onClick={() => setAngle(a)}
                        className={`px-2 py-1 text-xs rounded ${
                          angle === a
                            ? 'bg-foreground text-background'
                            : 'bg-muted-bg text-muted hover:bg-card-border'
                        }`}
                      >
                        {a}°
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CSS Output */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">CSS Code</h3>
                <button
                  onClick={() => copy(cssCode)}
                  className="px-3 py-1.5 text-sm font-medium bg-muted-bg text-foreground rounded-lg hover:bg-card-border transition-colors"
                >
                  {hasCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
                <code>{cssCode}</code>
              </pre>
            </div>

            {/* Actions */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="font-medium text-foreground mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={generatePalette()}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Convert to Palette
                </Link>
                <button
                  onClick={() => {
                    const svgStops = stops.map((s) =>
                      "<stop offset='" + s.position + "%' style='stop-color:" + s.color + "'/>"
                    ).join('');
                    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='0%'>" + svgStops + "</linearGradient></defs><rect fill='url(#g)' width='100%' height='100%'/></svg>";
                    copy('url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-muted-bg text-foreground rounded-lg font-medium hover:bg-card-border transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Copy as SVG Data URL
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="bg-card-bg rounded-xl border border-card-border p-6">
              <h3 className="font-medium text-foreground mb-4">Presets</h3>
              <div className="grid grid-cols-2 gap-3">
                {presetGradients.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset)}
                    className="group relative h-16 rounded-lg overflow-hidden"
                    style={{
                      background: `linear-gradient(90deg, ${preset.colors.join(', ')})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span
                        className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: getContrastingTextColor(preset.colors[0]) }}
                      >
                        {preset.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
