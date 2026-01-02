'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Color } from '@/types/color';
import { useClipboard } from '@/hooks/useClipboard';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: Color[];
}

type ExportFormat = 'css' | 'scss' | 'tailwind' | 'json' | 'array';
type DownloadFormat = 'png' | 'svg' | 'ase' | 'pdf';

export function ExportModal({ isOpen, onClose, colors }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [activeTab, setActiveTab] = useState<'code' | 'download'>('code');
  const { copy, hasCopied } = useClipboard();

  // Download as PNG
  const downloadPNG = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    const colorWidth = width / colors.length;
    colors.forEach((color, i) => {
      ctx.fillStyle = color.hex;
      ctx.fillRect(i * colorWidth, 0, colorWidth, height);
    });

    const link = document.createElement('a');
    link.download = 'palette.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [colors]);

  // Download as SVG
  const downloadSVG = useCallback(() => {
    const width = 1200;
    const height = 300;
    const colorWidth = width / colors.length;

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${colors.map((color, i) => `<rect x="${i * colorWidth}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}" />`).join('\n  ')}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'palette.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [colors]);

  // Download as ASE (Adobe Swatch Exchange)
  const downloadASE = useCallback(() => {
    // ASE file format implementation
    const hexToRgbFloat = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    };

    // Create ASE file buffer
    const buffer: number[] = [];

    // Write helper functions
    const writeString = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        buffer.push(str.charCodeAt(i));
      }
    };

    const writeBigEndian32 = (value: number) => {
      buffer.push((value >> 24) & 0xff);
      buffer.push((value >> 16) & 0xff);
      buffer.push((value >> 8) & 0xff);
      buffer.push(value & 0xff);
    };

    const writeBigEndian16 = (value: number) => {
      buffer.push((value >> 8) & 0xff);
      buffer.push(value & 0xff);
    };

    const writeFloat32 = (value: number) => {
      const view = new DataView(new ArrayBuffer(4));
      view.setFloat32(0, value, false);
      for (let i = 0; i < 4; i++) {
        buffer.push(view.getUint8(i));
      }
    };

    // ASE Header
    writeString('ASEF'); // Signature
    writeBigEndian16(1); // Major version
    writeBigEndian16(0); // Minor version
    writeBigEndian32(colors.length); // Number of blocks

    // Color entries
    colors.forEach((color, i) => {
      const name = `Color ${i + 1}`;
      const [r, g, b] = hexToRgbFloat(color.hex);

      // Block type: 0x0001 = color entry
      writeBigEndian16(0x0001);

      // Block length (name length * 2 + name null terminator * 2 + color model + 3 floats + color type)
      const blockLength = 2 + (name.length + 1) * 2 + 4 + 12 + 2;
      writeBigEndian32(blockLength);

      // Name length (including null terminator)
      writeBigEndian16(name.length + 1);

      // Name as UTF-16BE
      for (let j = 0; j < name.length; j++) {
        writeBigEndian16(name.charCodeAt(j));
      }
      writeBigEndian16(0); // Null terminator

      // Color model: RGB
      writeString('RGB ');

      // RGB values as floats
      writeFloat32(r);
      writeFloat32(g);
      writeFloat32(b);

      // Color type: 0 = Global
      writeBigEndian16(0);
    });

    const blob = new Blob([new Uint8Array(buffer)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'palette.ase';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [colors]);

  // Download as PDF
  const downloadPDF = useCallback(() => {
    // Simple PDF generation without external libraries
    const width = 612; // Letter width in points
    const height = 400;
    const colorWidth = width / colors.length;
    const swatchHeight = 200;

    // Build PDF content
    let pdf = '%PDF-1.4\n';

    // Catalog
    pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

    // Pages
    pdf += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';

    // Page
    pdf += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R >>\nendobj\n`;

    // Content stream
    let content = 'q\n'; // Save graphics state

    // Draw color swatches
    colors.forEach((color, i) => {
      const r = parseInt(color.hex.slice(1, 3), 16) / 255;
      const g = parseInt(color.hex.slice(3, 5), 16) / 255;
      const b = parseInt(color.hex.slice(5, 7), 16) / 255;

      content += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg\n`;
      content += `${i * colorWidth} ${height - swatchHeight} ${colorWidth} ${swatchHeight} re f\n`;
    });

    // Draw hex labels
    content += '0 0 0 rg\n'; // Black text
    content += 'BT\n';
    content += '/F1 10 Tf\n';

    colors.forEach((color, i) => {
      const x = i * colorWidth + colorWidth / 2 - 20;
      const y = height - swatchHeight - 30;
      content += `${x} ${y} Td\n`;
      content += `(${color.hex}) Tj\n`;
      content += `${-x} ${-y} Td\n`;
    });

    content += 'ET\n';
    content += 'Q\n'; // Restore graphics state

    const contentLength = content.length;
    pdf += `4 0 obj\n<< /Length ${contentLength} >>\nstream\n${content}endstream\nendobj\n`;

    // Font
    pdf += '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

    // Resources
    pdf += '6 0 obj\n<< /Font << /F1 5 0 R >> >>\nendobj\n';

    // Update page to include resources
    pdf = pdf.replace(
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 6 0 R /MediaBox'
    );

    // Cross-reference table
    const xrefOffset = pdf.length;
    pdf += 'xref\n0 7\n';
    pdf += '0000000000 65535 f \n';

    let offset = 9; // After %PDF-1.4\n
    for (let i = 1; i <= 6; i++) {
      pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
      const objEnd = pdf.indexOf('endobj', offset) + 7;
      offset = objEnd;
    }

    // Trailer
    pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'palette.pdf';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [colors]);

  const handleDownload = (downloadFormat: DownloadFormat) => {
    switch (downloadFormat) {
      case 'png':
        downloadPNG();
        break;
      case 'svg':
        downloadSVG();
        break;
      case 'ase':
        downloadASE();
        break;
      case 'pdf':
        downloadPDF();
        break;
    }
  };

  const generateExport = (): string => {
    switch (format) {
      case 'css':
        return `:root {\n${colors
          .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
          .join('\n')}\n}`;

      case 'scss':
        return colors
          .map((c, i) => `$color-${i + 1}: ${c.hex};`)
          .join('\n');

      case 'tailwind':
        return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors
          .map((c, i) => `        'palette-${i + 1}': '${c.hex}',`)
          .join('\n')}\n      }\n    }\n  }\n}`;

      case 'json':
        return JSON.stringify(
          colors.map((c) => ({
            hex: c.hex,
            rgb: c.rgb,
            hsl: c.hsl,
          })),
          null,
          2
        );

      case 'array':
        return `[${colors.map((c) => `'${c.hex}'`).join(', ')}]`;

      default:
        return '';
    }
  };

  const exportContent = generateExport();

  const formats: { value: ExportFormat; label: string }[] = [
    { value: 'css', label: 'CSS Variables' },
    { value: 'scss', label: 'SCSS Variables' },
    { value: 'tailwind', label: 'Tailwind Config' },
    { value: 'json', label: 'JSON' },
    { value: 'array', label: 'Array' },
  ];

  const downloadFormats: { value: DownloadFormat; label: string; icon: string; description: string }[] = [
    { value: 'png', label: 'PNG Image', icon: '🖼️', description: 'Raster image for sharing' },
    { value: 'svg', label: 'SVG Vector', icon: '📐', description: 'Scalable vector graphic' },
    { value: 'ase', label: 'Adobe Swatch', icon: '🎨', description: 'For Photoshop & Illustrator' },
    { value: 'pdf', label: 'PDF Document', icon: '📄', description: 'Print-ready document' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Export Palette</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Color preview */}
            <div className="flex h-16">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="flex-1"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>

            {/* Tab selector */}
            <div className="px-6 pt-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'code'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Code Export
                </button>
                <button
                  onClick={() => setActiveTab('download')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'download'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Download Files
                </button>
              </div>
            </div>

            {activeTab === 'code' ? (
              <>
                {/* Format selector */}
                <div className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {formats.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFormat(f.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          format === f.value
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export content */}
                <div className="px-6 pb-4">
                  <div className="relative">
                    <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto max-h-64">
                      <code>{exportContent}</code>
                    </pre>
                    <button
                      onClick={() => copy(exportContent)}
                      className="absolute top-2 right-2 px-3 py-1 text-xs font-medium text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    >
                      {hasCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Download formats */
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                  {downloadFormats.map((df) => (
                    <button
                      key={df.value}
                      onClick={() => handleDownload(df.value)}
                      className="flex items-start gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                    >
                      <span className="text-2xl">{df.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{df.label}</p>
                        <p className="text-xs text-gray-500">{df.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => copy(exportContent)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {hasCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
