/**
 * Keyboard shortcuts help modal
 * Author: Babatunde Adeyemi
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const generatorShortcuts: ShortcutGroup[] = [
  {
    title: 'Palette Generation',
    shortcuts: [
      { keys: ['Space'], description: 'Generate new palette' },
      { keys: ['L'], description: 'Lock/unlock focused color' },
      { keys: ['C'], description: 'Copy focused color HEX' },
      { keys: ['←', '→'], description: 'Navigate between colors' },
    ],
  },
  {
    title: 'History',
    shortcuts: [
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close modal/panel' },
    ],
  },
];

interface KeyboardShortcutsHelpProps {
  shortcuts?: ShortcutGroup[];
  showTrigger?: boolean;
}

export function KeyboardShortcutsHelp({
  shortcuts = generatorShortcuts,
  showTrigger = true
}: KeyboardShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {showTrigger && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-30 p-3 bg-card-bg border border-card-border rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title="Keyboard shortcuts (?)"
          aria-label="Show keyboard shortcuts"
        >
          <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card-bg rounded-xl shadow-2xl border border-card-border overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-card-border">
                <h2 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted-bg rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-96 overflow-y-auto space-y-6">
                {shortcuts.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-sm font-medium text-muted mb-3">{group.title}</h3>
                    <div className="space-y-2">
                      {group.shortcuts.map((shortcut, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-foreground">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, j) => (
                              <span key={j} className="flex items-center gap-1">
                                <kbd>{key}</kbd>
                                {j < shortcut.keys.length - 1 && (
                                  <span className="text-muted text-xs">+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-card-border bg-muted-bg">
                <p className="text-xs text-muted text-center">
                  Press <kbd>?</kbd> anytime to view shortcuts
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
