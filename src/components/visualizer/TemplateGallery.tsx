'use client';

import { motion } from 'framer-motion';
import { templates, applyColorsToTemplate, type Template } from '@/data/templates';

interface TemplateGalleryProps {
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
  colorMapping: Record<string, string>;
}

export function TemplateGallery({
  selectedTemplate,
  onSelectTemplate,
  colorMapping,
}: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => {
        const isSelected = selectedTemplate?.id === template.id;
        const previewSvg = applyColorsToTemplate(template, colorMapping);

        return (
          <motion.button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`
              relative p-3 rounded-xl border-2 transition-all text-left
              ${isSelected
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* SVG Preview */}
            <div
              className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-3 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: previewSvg }}
              style={{
                maxHeight: '150px',
              }}
            />

            {/* Template Info */}
            <div>
              <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
              <p className="text-xs text-gray-500">{template.description}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {template.category}
              </span>
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
