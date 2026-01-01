'use client';

import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options;
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setHasCopied(true);

        setTimeout(() => {
          setHasCopied(false);
          setCopiedText(null);
        }, timeout);

        return true;
      } catch (error) {
        console.error('Failed to copy:', error);
        setHasCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { copy, copiedText, hasCopied };
}
