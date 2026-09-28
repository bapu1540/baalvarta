import React, { useState } from 'react';
import { Language } from '../types';
import { VisualGkFlashcardsSection } from './VisualGkFlashcardsSection';
import { KidsQuizGameSection } from './KidsQuizGameSection';
import { playPopSound } from '../utils/soundEffects';

interface GeneralKnowledgeHubProps {
  language: Language;
  soundEnabled: boolean;
  initialSubTab?: 'gk' | 'quiz';
  onNavigateTab?: (tab: any, category?: string, certType?: string) => void;
  onBackToHome?: () => void;
}

export const GeneralKnowledgeHub: React.FC<GeneralKnowledgeHubProps> = ({
  language,
  soundEnabled,
  initialSubTab = 'gk',
  onNavigateTab,
}) => {
  const isHi = language === 'hi';
  const [activeSubTab, setActiveSubTab] = useState<'gk' | 'quiz'>(initialSubTab);

  return (
    <div className="pb-12 max-w-7xl mx-auto font-sans space-y-3 sm:space-y-4 px-1 sm:px-3">
      {/* 1. Category Header Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 text-white rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg sm:text-2xl shrink-0">🧠</span>
          <h1 className="font-black text-xs sm:text-base md:text-lg tracking-tight truncate">
            {isHi ? 'सामान्य ज्ञान व बाल क्विज़ (GK & Kids Quiz)' : 'General Knowledge & Kids Quiz'}
          </h1>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-[10px] sm:text-xs font-black shrink-0 border border-white/20">
          GK & Quiz Zone 🏆
        </span>
      </div>

      {/* 2. SUB MENU TABS: 1. Visual GK Cards, 2. Kids Quiz Games */}
      <div className="bg-white rounded-2xl p-1 sm:p-1.5 border-2 border-slate-900 shadow-xs grid grid-cols-2 gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playPopSound();
            setActiveSubTab('gk');
          }}
          className={`py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'gk'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xs scale-[1.01]'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-base sm:text-lg shrink-0">💡</span>
          <span>{isHi ? '1. सचित्र सामान्य ज्ञान (GK Cards)' : '1. Visual GK Cards'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playPopSound();
            setActiveSubTab('quiz');
          }}
          className={`py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs scale-[1.01]'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-base sm:text-lg shrink-0">🏆</span>
          <span>{isHi ? '2. बाल क्विज़ गेम्स (Kids Quiz)' : '2. Kids Quiz Games'}</span>
        </button>
      </div>

      {/* 3. SUB TAB 1: VISUAL GK FLASHCARDS */}
      {activeSubTab === 'gk' && (
        <VisualGkFlashcardsSection
          language={language}
          soundEnabled={soundEnabled}
        />
      )}

      {/* 4. SUB TAB 2: KIDS QUIZ GAMES */}
      {activeSubTab === 'quiz' && (
        <KidsQuizGameSection
          language={language}
          soundEnabled={soundEnabled}
          onNavigateTab={onNavigateTab}
        />
      )}
    </div>
  );
};
