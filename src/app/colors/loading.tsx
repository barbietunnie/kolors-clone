/**
 * Loading state for Colors page
 * Author: Babatunde Adeyemi
 */

import { ColorGridSkeleton } from '@/components/ui/Skeleton';

export default function ColorsLoading() {
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
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
        </div>

        {/* Search and filters skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <ColorGridSkeleton count={18} />
      </div>
    </div>
  );
}
