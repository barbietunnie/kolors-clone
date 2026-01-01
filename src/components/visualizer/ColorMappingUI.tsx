'use client';

import { motion } from 'framer-motion';
import { getContrastingTextColor } from '@/lib/colors';
import type { Template, TemplateColorSlot } from '@/data/templates';

interface ColorMappingUIProps {
  template: Template;
  paletteColors: string[];
  colorMapping: Record<string, string>;
  onMappingChange: (slotId: string, color: string) => void;
  onShufflePalette: () => void;
  onAutoMap: () => void;
}

export function ColorMappingUI({
  template,
  paletteColors,
  colorMapping,
  onMappingChange,
  onShufflePalette,
  onAutoMap,
}: ColorMappingUIProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Color Mapping</h2>
        <div className="flex gap-2">
          <button
            onClick={onAutoMap}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Auto Map
          </button>
          <button
            onClick={onShufflePalette}
            className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Shuffle (Space)
          </button>
        </div>
      </div>

      {/* Palette Colors */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">Your Palette</p>
        <div className="flex rounded-lg overflow-hidden">
          {paletteColors.map((color, index) => {
            const textColor = getContrastingTextColor(color);
            return (
              <motion.div
                key={`${color}-${index}`}
                className="flex-1 h-12 flex items-center justify-center cursor-pointer group relative"
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <span
                  className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: textColor }}
                >
                  {color}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Template Slots */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Map to Template Areas</p>
        {template.colorSlots.map((slot) => (
          <ColorSlotRow
            key={slot.id}
            slot={slot}
            paletteColors={paletteColors}
            currentColor={colorMapping[slot.id] || slot.defaultColor}
            onColorSelect={(color) => onMappingChange(slot.id, color)}
          />
        ))}
      </div>
    </div>
  );
}

interface ColorSlotRowProps {
  slot: TemplateColorSlot;
  paletteColors: string[];
  currentColor: string;
  onColorSelect: (color: string) => void;
}

function ColorSlotRow({ slot, paletteColors, currentColor, onColorSelect }: ColorSlotRowProps) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      {/* Slot info */}
      <div className="flex items-center gap-3 min-w-[120px]">
        <div
          className="w-8 h-8 rounded-md border border-gray-300 shadow-sm"
          style={{ backgroundColor: currentColor }}
        />
        <span className="text-sm font-medium text-gray-700">{slot.name}</span>
      </div>

      {/* Arrow */}
      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>

      {/* Color options */}
      <div className="flex gap-2 flex-1 overflow-x-auto py-1">
        {paletteColors.map((color, index) => {
          const isSelected = currentColor.toUpperCase() === color.toUpperCase();
          return (
            <motion.button
              key={`${color}-${index}`}
              onClick={() => onColorSelect(color)}
              className={`
                w-8 h-8 rounded-md flex-shrink-0 border-2 transition-all
                ${isSelected ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-gray-300 hover:border-gray-400'}
              `}
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          );
        })}

        {/* Default color option */}
        <motion.button
          onClick={() => onColorSelect(slot.defaultColor)}
          className={`
            w-8 h-8 rounded-md flex-shrink-0 border-2 transition-all relative
            ${currentColor.toUpperCase() === slot.defaultColor.toUpperCase()
              ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
              : 'border-dashed border-gray-400 hover:border-gray-500'
            }
          `}
          style={{ backgroundColor: slot.defaultColor }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Reset to default"
        />
      </div>
    </div>
  );
}
