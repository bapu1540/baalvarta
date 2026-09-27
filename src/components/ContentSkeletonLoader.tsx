import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { Language } from '../types';

interface ContentSkeletonLoaderProps {
  language?: Language;
  variant?: 'grid' | 'details' | 'cards' | 'banner';
}

export const ContentSkeletonLoader: React.FC<ContentSkeletonLoaderProps> = ({
  language = 'hi',
  variant = 'grid',
}) => {
  const isHi = language === 'hi';

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200 select-none">
      {/* Subtle Mini Loading Status Pill */}
      <div className="flex items-center justify-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-black shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>{isHi ? 'सामग्री लोड हो रही है...' : 'Loading joyful content...'}</span>
        </div>
      </div>

      {/* Top Banner Skeleton */}
      <div className="w-full h-36 sm:h-48 rounded-3xl bg-gradient-to-r from-amber-100/70 via-orange-100/50 to-amber-100/70 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse border border-amber-200/50 dark:border-slate-700/50 p-6 flex flex-col justify-end space-y-3">
        <div className="h-6 w-1/3 bg-amber-200/80 dark:bg-slate-600 rounded-xl"></div>
        <div className="h-4 w-2/3 bg-amber-200/60 dark:bg-slate-600/70 rounded-lg"></div>
      </div>

      {/* Filter Chips / Categories Skeleton */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        {[80, 110, 95, 120, 90].map((width, idx) => (
          <div
            key={idx}
            style={{ width: `${width}px` }}
            className="h-8 rounded-full bg-slate-200/80 dark:bg-slate-800 animate-pulse shrink-0"
          />
        ))}
      </div>

      {/* Grid of Content Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="rounded-2xl sm:rounded-3xl p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            </div>

            {/* Badge & Number */}
            <div className="flex items-center justify-between">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            </div>

            {/* Title lines */}
            <div className="space-y-1.5">
              <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="h-3 w-3/5 bg-slate-200/70 dark:bg-slate-800/70 rounded-md"></div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
