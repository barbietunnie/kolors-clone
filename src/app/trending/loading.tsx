/**
 * Trending page loading state
 * @author Babatunde Adeyemi
 */

import { Header } from '@/components/ui/Header';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TrendingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page header skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-32 mx-auto mb-4" />
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Filter skeleton */}
        <div className="bg-card-bg rounded-xl border border-card-border p-6 mb-8">
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-8 w-full" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card-bg rounded-xl border border-card-border overflow-hidden">
              <Skeleton className="h-28 w-full" />
              <div className="p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
