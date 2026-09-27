import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, Star, CheckCircle, BookOpen } from 'lucide-react';
import { Language } from '../types';

interface StoryReadingProgressIndicatorProps {
  progressPercentage: number; // 0 - 100
  currentScene?: number;
  totalScenes?: number;
  isPictureBookMode: boolean;
  isCompleted: boolean;
  language: Language;
  onJumpToScene?: (sceneIndex: number) => void;
  soundEnabled?: boolean;
}

export const StoryReadingProgressIndicator: React.FC<StoryReadingProgressIndicatorProps> = ({
  progressPercentage,
  currentScene = 1,
  totalScenes = 1,
  isPictureBookMode,
  isCompleted,
  language,
  onJumpToScene,
}) => {
  // Clamp percentage between 0 and 100
  const clampedProgress = isCompleted ? 100 : Math.min(100, Math.max(0, Math.round(progressPercentage)));

  // Milestone labels for kids
  const getProgressStatus = (pct: number) => {
    if (pct >= 100 || isCompleted) {
      return language === 'hi' ? '🎉 पूरी कहानी पढ़ ली! शाबाश!' : '🎉 Story Completed! Great Job!';
    }
    if (pct >= 75) {
      return language === 'hi' ? '🌟 अंत करीब है! बस थोड़ा सा और...' : '🌟 Almost at the end! Keep going!';
    }
    if (pct >= 50) {
      return language === 'hi' ? '✨ आधी कहानी पूरी हो गई!' : '✨ Halfway there!';
    }
    if (pct >= 25) {
      return language === 'hi' ? '📖 अच्छी शुरुआत! आगे बढ़ें...' : '📖 Good pace! Keep reading...';
    }
    return language === 'hi' ? '🚀 पढ़ना शुरू किया...' : '🚀 Started reading...';
  };

  const getGliderEmoji = (pct: number) => {
    if (pct >= 100 || isCompleted) return '🏆';
    if (pct >= 75) return '⭐';
    if (pct >= 50) return '🚀';
    if (pct >= 25) return '📖';
    return '🏃';
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-emerald-950/30 border border-amber-300/60 dark:border-amber-700/60 rounded-2xl p-2.5 sm:p-3 shadow-xs space-y-2 mb-3">
      {/* Top info line: Title, Percent & Milestone */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="p-1 rounded-lg bg-amber-500 text-white shrink-0 shadow-xs">
            {clampedProgress >= 100 ? (
              <Trophy className="w-3.5 h-3.5" />
            ) : (
              <BookOpen className="w-3.5 h-3.5" />
            )}
          </span>
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span className="font-extrabold text-amber-950 dark:text-amber-200 text-[11px] sm:text-xs">
              {language === 'hi' ? 'पढ़ने की प्रगति:' : 'Reading Progress:'}
            </span>
            <span className="text-[11px] sm:text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full border border-amber-300/60">
              {isPictureBookMode ? `${currentScene}/${totalScenes}` : `${clampedProgress}%`}
            </span>
            <span className="hidden sm:inline text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">
              • {getProgressStatus(clampedProgress)}
            </span>
          </div>
        </div>

        {/* Milestone Badge or Stars */}
        <div className="flex items-center gap-1 shrink-0">
          {isCompleted || clampedProgress >= 100 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px] sm:text-xs shadow-xs animate-bounce">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'hi' ? 'पूर्ण ⭐' : 'Completed ⭐'}</span>
            </span>
          ) : (
            <div className="flex items-center gap-0.5">
              {[25, 50, 75, 100].map((milestone) => (
                <span
                  key={milestone}
                  title={`${milestone}%`}
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                    clampedProgress >= milestone
                      ? 'bg-amber-500 text-white scale-110 shadow-xs'
                      : 'bg-black/10 dark:bg-white/10 text-slate-400 opacity-60'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Track Bar with Gliding Mascot */}
      <div className="relative w-full h-3 sm:h-3.5 bg-black/10 dark:bg-black/40 rounded-full overflow-visible p-0.5 border border-black/5 dark:border-white/10">
        {/* Animated Gradient Fill */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 transition-all duration-300 ease-out relative shadow-xs"
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Subtle light shimmer */}
          <div className="absolute inset-0 bg-white/25 rounded-full animate-pulse" />

          {/* Gliding Mascot/Emoji on top of bar */}
          <div
            className="absolute -top-3 sm:-top-3.5 right-0 transform translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-slate-800 shadow-md border-2 border-amber-400 flex items-center justify-center text-xs sm:text-sm select-none pointer-events-none transition-transform"
            style={{
              zIndex: 10,
            }}
          >
            <span className="transform hover:scale-125 transition-transform">
              {getGliderEmoji(clampedProgress)}
            </span>
          </div>
        </div>

        {/* Milestone tick marks inside track for picture book or full text */}
        {isPictureBookMode && totalScenes > 1 ? (
          <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
            {Array.from({ length: totalScenes }).map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx + 1 <= currentScene ? 'bg-white shadow-xs' : 'bg-black/20 dark:bg-white/20'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="w-1 h-1 rounded-full bg-white/40" />
          </div>
        )}
      </div>

      {/* Picture Book Scene Jump Pills (if applicable) */}
      {isPictureBookMode && totalScenes > 1 && onJumpToScene && (
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
            {language === 'hi' ? 'दृश्य:' : 'Scenes:'}
          </span>
          {Array.from({ length: totalScenes }).map((_, sIdx) => {
            const isCurrent = sIdx === currentScene - 1;
            const isPassed = sIdx < currentScene - 1;
            return (
              <button
                key={sIdx}
                type="button"
                onClick={() => onJumpToScene(sIdx)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500 text-white shadow-xs scale-105 ring-1 ring-amber-400'
                    : isPassed
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-black/5 dark:bg-white/5 text-slate-500 hover:bg-black/10'
                }`}
              >
                #{sIdx + 1}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
