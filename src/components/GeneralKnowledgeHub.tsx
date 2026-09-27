import React, { useState } from 'react';
import { Language } from '../types';
import { IndiaMapSection } from './IndiaMapSection/IndiaMapSection';
import { StateAccordionListView } from './IndiaMapSection/StateAccordionListView';
import { NationalGeneralKnowledgeSection } from './NationalGeneralKnowledgeSection';
import { playPopSound } from '../utils/soundEffects';

interface GeneralKnowledgeHubProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
}

export const GeneralKnowledgeHub: React.FC<GeneralKnowledgeHubProps> = ({
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [activeSubTab, setActiveSubTab] = useState<'india' | 'state' | 'basic-gk'>('india');

  return (
    <div className="pb-12 max-w-7xl mx-auto font-sans space-y-3 px-1 sm:px-3">
      {/* 1. TOP SINGLE PATTI: Category Title */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg sm:text-2xl shrink-0">🧠</span>
          <h1 className="font-black text-xs sm:text-base md:text-lg tracking-tight truncate">
            {isHi ? '4. सामान्य ज्ञान / General Knowledge' : '4. General Knowledge / सामान्य ज्ञान'}
          </h1>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-[10px] sm:text-xs font-black shrink-0 border border-white/20">
          GK Zone
        </span>
      </div>

      {/* 2. SUB MENU PATTI: 1. India Map, 2. States & Districts, 3. Basic GK Q&A */}
      <div className="bg-white rounded-2xl p-1 sm:p-1.5 border-2 border-slate-900 shadow-xs grid grid-cols-3 gap-1 sm:gap-2">
        <button
          onClick={() => {
            if (soundEnabled) playPopSound();
            setActiveSubTab('india');
          }}
          className={`py-1.5 sm:py-2 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs md:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-center ${
            activeSubTab === 'india'
              ? 'bg-blue-600 text-white shadow-xs scale-[1.01]'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-xs sm:text-base shrink-0">🇮🇳</span>
          <span className="leading-tight">
            <span className="hidden sm:inline">{isHi ? '1. India (नक्शा)' : '1. India Map'}</span>
            <span className="sm:hidden">{isHi ? '1. भारत नक्शा' : '1. India Map'}</span>
          </span>
        </button>

        <button
          onClick={() => {
            if (soundEnabled) playPopSound();
            setActiveSubTab('state');
          }}
          className={`py-1.5 sm:py-2 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs md:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-center ${
            activeSubTab === 'state'
              ? 'bg-blue-600 text-white shadow-xs scale-[1.01]'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-xs sm:text-base shrink-0">🏛️</span>
          <span className="leading-tight">
            <span className="hidden sm:inline">{isHi ? '2. State (राज्य व जिले)' : '2. States & Districts'}</span>
            <span className="sm:hidden">{isHi ? '2. राज्य/जिले' : '2. States'}</span>
          </span>
        </button>

        <button
          onClick={() => {
            if (soundEnabled) playPopSound();
            setActiveSubTab('basic-gk');
          }}
          className={`py-1.5 sm:py-2 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs md:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition-all text-center ${
            activeSubTab === 'basic-gk'
              ? 'bg-blue-600 text-white shadow-xs scale-[1.01]'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="text-xs sm:text-base shrink-0">💡</span>
          <span className="leading-tight">
            <span className="hidden sm:inline">{isHi ? '3. Basic GK (प्रतीक व तथ्य)' : '3. Basic GK Q&A'}</span>
            <span className="sm:hidden">{isHi ? '3. बेसिक GK' : '3. Basic GK'}</span>
          </span>
        </button>
      </div>

      {/* 3. SUB TAB 1: INTERACTIVE INDIA MAP */}
      {activeSubTab === 'india' && (
        <IndiaMapSection
          language={language}
          soundEnabled={soundEnabled}
          viewMode="india"
        />
      )}

      {/* 4. SUB TAB 2: EXPANDABLE DOWN-ARROW STATES & DISTRICTS LIST */}
      {activeSubTab === 'state' && (
        <StateAccordionListView
          language={language}
          soundEnabled={soundEnabled}
        />
      )}

      {/* 5. SUB TAB 3: BASIC NATIONAL GENERAL KNOWLEDGE Q&A WITH PHOTOS & AUDIO */}
      {activeSubTab === 'basic-gk' && (
        <NationalGeneralKnowledgeSection
          language={language}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
};
