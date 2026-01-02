/**
 * Loading state for Gradients page
 * Author: Babatunde Adeyemi
 */

import { GradientGridSkeleton } from '@/components/ui/Skeleton';

export default function GradientsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header skeleton */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page header skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-56 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-72 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
        </div>

        {/* Search and filters skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <GradientGridSkeleton count={12} />
      </div>
    </div>
  );
}
