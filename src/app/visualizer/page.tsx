'use client';

import { useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { normalizeHex, generateHarmoniousPalette } from '@/lib/colors';
import { templates, type Template } from '@/data/templates';
import { TemplateGallery } from '@/components/visualizer/TemplateGallery';
import { ColorMappingUI } from '@/components/visualizer/ColorMappingUI';
import { VisualizerPreview } from '@/components/visualizer/VisualizerPreview';
import { CustomSVGUpload } from '@/components/visualizer/CustomSVGUpload';

function VisualizerContent() {
  const searchParams = useSearchParams();
  const colorsParam = searchParams.get('colors');

  // Parse initial colors from URL
  const initialColors = useMemo(() => {
    if (colorsParam) {
      try {
        return colorsParam.split('-').map((c) => normalizeHex(c));
      } catch {
        return generateHarmoniousPalette(5).map((c) => c.hex);
      }
    }
    return generateHarmoniousPalette(5).map((c) => c.hex);
  }, [colorsParam]);

  const [paletteColors, setPaletteColors] = useState<string[]>(initialColors);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [colorMapping, setColorMapping] = useState<Record<string, string>>({});

  // Initialize color mapping when template changes
  useEffect(() => {
    const newMapping: Record<string, string> = {};
    selectedTemplate.colorSlots.forEach((slot, index) => {
      newMapping[slot.id] = paletteColors[index % paletteColors.length];
    });
    setColorMapping(newMapping);
  }, [selectedTemplate, paletteColors]);

  const handleMappingChange = useCallback((slotId: string, color: string) => {
    setColorMapping((prev) => ({
      ...prev,
      [slotId]: color,
    }));
  }, []);

  const handleShufflePalette = useCallback(() => {
    // Shuffle the mapping by rotating palette assignments
    setColorMapping((prev) => {
      const slotIds = selectedTemplate.colorSlots.map((s) => s.id);
      const colors = slotIds.map((id) => prev[id] || paletteColors[0]);

      // Rotate colors
      const rotated = [...colors.slice(1), colors[0]];

      const newMapping: Record<string, string> = {};
      slotIds.forEach((id, index) => {
        newMapping[id] = rotated[index];
      });

      return newMapping;
    });
  }, [selectedTemplate, paletteColors]);

  const handleAutoMap = useCallback(() => {
    const newMapping: Record<string, string> = {};
    selectedTemplate.colorSlots.forEach((slot, index) => {
      newMapping[slot.id] = paletteColors[index % paletteColors.length];
    });
    setColorMapping(newMapping);
  }, [selectedTemplate, paletteColors]);

  const handleCustomSVGUpload = useCallback((template: Template) => {
    setCustomTemplates((prev) => [...prev, template]);
    setSelectedTemplate(template);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleShufflePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleShufflePalette]);

  // Combine built-in and custom templates
  const allTemplates = useMemo(() => [...templates, ...customTemplates], [customTemplates]);

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
            <Link href="/image-picker" className="text-gray-600 hover:text-gray-900 transition-colors">
              Image Picker
            </Link>
            <Link href="/visualizer" className="text-gray-900 font-medium">
              Visualizer
            </Link>
            <Link href="/palettes" className="text-gray-600 hover:text-gray-900 transition-colors">
              Explore
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Palette Visualizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preview your color palette on real design mockups. Select a template and see how your colors look in context.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left column - Template Gallery */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Templates</h2>
              <TemplateGallery
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                colorMapping={colorMapping}
              />
            </div>

            {/* Custom SVG Upload */}
            <CustomSVGUpload onSVGUpload={handleCustomSVGUpload} />

            {/* Tips */}
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Keyboard Shortcuts</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white rounded text-xs font-mono shadow">Space</kbd>
                  <span>Shuffle palette mapping</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column - Preview and Mapping */}
          <div className="xl:col-span-2 space-y-6">
            <VisualizerPreview
              template={selectedTemplate}
              colorMapping={colorMapping}
            />

            <ColorMappingUI
              template={selectedTemplate}
              paletteColors={paletteColors}
              colorMapping={colorMapping}
              onMappingChange={handleMappingChange}
              onShufflePalette={handleShufflePalette}
              onAutoMap={handleAutoMap}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VisualizerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      }
    >
      <VisualizerContent />
    </Suspense>
  );
}
