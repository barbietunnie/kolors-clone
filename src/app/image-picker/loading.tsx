/**
 * Loading state for Image Picker page
 * Author: Babatunde Adeyemi
 */

import { Skeleton } from '@/components/ui/Skeleton';

export default function ImagePickerLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header skeleton */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image upload area skeleton */}
          <Skeleton className="h-80 rounded-xl" />

          {/* Extracted palette skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-12" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="flex-1 h-24 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
