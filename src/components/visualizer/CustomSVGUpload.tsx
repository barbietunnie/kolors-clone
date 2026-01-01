'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { Template, TemplateColorSlot } from '@/data/templates';

interface CustomSVGUploadProps {
  onSVGUpload: (template: Template) => void;
}

// Extract colors from SVG content
function extractColorsFromSVG(svgContent: string): string[] {
  const colorRegex = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g;
  const matches = svgContent.match(colorRegex) || [];

  // Normalize and deduplicate colors
  const uniqueColors = new Set<string>();
  matches.forEach(color => {
    let normalized = color.toUpperCase();
    // Expand shorthand hex
    if (/^#[0-9A-F]{3}$/i.test(normalized)) {
      normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
    }
    // Convert RGB to hex
    if (color.startsWith('rgb')) {
      const rgb = color.match(/\d+/g);
      if (rgb && rgb.length === 3) {
        normalized = `#${parseInt(rgb[0]).toString(16).padStart(2, '0')}${parseInt(rgb[1]).toString(16).padStart(2, '0')}${parseInt(rgb[2]).toString(16).padStart(2, '0')}`.toUpperCase();
      }
    }
    // Skip pure black and white
    if (normalized !== '#000000' && normalized !== '#FFFFFF') {
      uniqueColors.add(normalized);
    }
  });

  return Array.from(uniqueColors).slice(0, 10);
}

// Create template with color slots as placeholders
function createTemplateFromSVG(
  svgContent: string,
  fileName: string,
  colors: string[]
): Template {
  let processedSVG = svgContent;

  // Generate color slots
  const colorSlots: TemplateColorSlot[] = colors.map((color, index) => {
    const id = `color${index + 1}`;
    const name = `Color ${index + 1}`;

    // Replace color in SVG with placeholder
    const colorRegex = new RegExp(color.replace('#', '#?'), 'gi');
    processedSVG = processedSVG.replace(colorRegex, `{{${id}}}`);

    return { id, name, defaultColor: color };
  });

  // Extract viewBox dimensions
  const viewBoxMatch = svgContent.match(/viewBox\s*=\s*["']([^"']+)["']/);
  let width = 400;
  let height = 300;

  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/\s+/).map(Number);
    if (parts.length === 4) {
      width = parts[2];
      height = parts[3];
    }
  }

  return {
    id: `custom-${Date.now()}`,
    name: fileName.replace(/\.svg$/i, ''),
    description: 'Custom uploaded SVG',
    category: 'Custom',
    width,
    height,
    colorSlots,
    svgTemplate: processedSVG,
  };
}

export function CustomSVGUpload({ onSVGUpload }: CustomSVGUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      if (!content.includes('<svg') || !content.includes('</svg>')) {
        setError('Invalid SVG file');
        return;
      }

      const colors = extractColorsFromSVG(content);

      if (colors.length === 0) {
        setError('No colors found in SVG. Make sure your SVG uses hex colors.');
        return;
      }

      const template = createTemplateFromSVG(content, file.name, colors);
      onSVGUpload(template);
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsText(file);
  }, [onSVGUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/svg+xml': ['.svg'] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all text-center
        ${isDragActive
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex items-center justify-center gap-3">
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-700">
            {isDragActive ? 'Drop your SVG here' : 'Upload Custom SVG'}
          </p>
          <p className="text-xs text-gray-500">or click to browse</p>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
