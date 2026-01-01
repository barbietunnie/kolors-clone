'use client';

import { Tooltip } from '@/components/ui/Tooltip';

interface GeneratorToolbarProps {
  onGenerate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddColor: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canAddColor: boolean;
  colorCount: number;
}

export function GeneratorToolbar({
  onGenerate,
  onUndo,
  onRedo,
  onAddColor,
  onExport,
  canUndo,
  canRedo,
  canAddColor,
  colorCount,
}: GeneratorToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-full shadow-2xl border border-gray-200">
        {/* Generate button */}
        <Tooltip content="Generate palette (Space)" position="top">
          <button
            onClick={onGenerate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generate
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300" />

        {/* Undo */}
        <Tooltip content="Undo (⌘Z)" position="top">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
        </Tooltip>

        {/* Redo */}
        <Tooltip content="Redo (⌘⇧Z)" position="top">
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300" />

        {/* Add color */}
        <Tooltip content={canAddColor ? "Add color" : "Max 10 colors"} position="top">
          <button
            onClick={onAddColor}
            disabled={!canAddColor}
            className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </Tooltip>

        {/* Color count */}
        <span className="px-2 text-sm text-gray-500">{colorCount} colors</span>

        <div className="w-px h-6 bg-gray-300" />

        {/* Export */}
        <Tooltip content="Export palette" position="top">
          <button
            onClick={onExport}
            className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        </Tooltip>

        {/* Share */}
        <Tooltip content="Copy link" position="top">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Keyboard hint */}
      <p className="mt-3 text-center text-sm text-gray-500">
        Press <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-mono">Space</kbd> to generate
      </p>
    </div>
  );
}
