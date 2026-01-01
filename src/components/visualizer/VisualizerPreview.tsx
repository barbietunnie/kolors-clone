'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { applyColorsToTemplate, type Template } from '@/data/templates';

interface VisualizerPreviewProps {
  template: Template;
  colorMapping: Record<string, string>;
}

export function VisualizerPreview({ template, colorMapping }: VisualizerPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const svgContent = applyColorsToTemplate(template, colorMapping);

  const downloadSVG = useCallback(() => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-palette.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportSuccess('SVG');
    setTimeout(() => setExportSuccess(null), 2000);
  }, [svgContent, template.name]);

  const downloadPNG = useCallback(async () => {
    setIsExporting(true);

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Set canvas size (2x for retina)
      const scale = 2;
      canvas.width = template.width * scale;
      canvas.height = template.height * scale;

      // Create SVG image
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });

      // Download
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-palette.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setExportSuccess('PNG');
      setTimeout(() => setExportSuccess(null), 2000);
    } catch (error) {
      console.error('Error exporting PNG:', error);
    } finally {
      setIsExporting(false);
    }
  }, [svgContent, template]);

  const copySVG = useCallback(async () => {
    await navigator.clipboard.writeText(svgContent);
    setExportSuccess('Copied');
    setTimeout(() => setExportSuccess(null), 2000);
  }, [svgContent]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={copySVG}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Copy SVG
          </button>
          <button
            onClick={downloadSVG}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Download SVG
          </button>
          <button
            onClick={downloadPNG}
            disabled={isExporting}
            className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Download PNG'}
          </button>
        </div>
      </div>

      {/* Export success message */}
      {exportSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium text-center"
        >
          {exportSuccess === 'Copied' ? 'SVG copied to clipboard!' : `${exportSuccess} downloaded successfully!`}
        </motion.div>
      )}

      {/* Preview */}
      <div
        ref={previewRef}
        className="relative rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center p-8"
        style={{ minHeight: '300px' }}
      >
        <motion.div
          key={template.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="shadow-2xl rounded-lg overflow-hidden"
          style={{
            maxWidth: '100%',
            maxHeight: '400px',
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Template dimensions */}
      <p className="mt-4 text-sm text-gray-500 text-center">
        {template.width} x {template.height}px
      </p>
    </div>
  );
}
