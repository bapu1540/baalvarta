import React, { useRef, useEffect } from 'react';
import { Search, ChevronRight, MapPin, Landmark, X } from 'lucide-react';
import { INDIA_STATES, INDIA_UTS, IndiaRegionItem } from '../../data/indiaData';
import { Language } from '../../types';

interface StateSidebarProps {
  language: Language;
  selectedId: string;
  onSelectRegion: (item: IndiaRegionItem) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: 'states' | 'uts';
  onTabChange: (tab: 'states' | 'uts') => void;
  soundEnabled: boolean;
}

export const StateSidebar: React.FC<StateSidebarProps> = ({
  language,
  selectedId,
  onSelectRegion,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  const isHi = language === 'hi';
  const listContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Auto-scroll the sidebar list to keep the selected item in view
  useEffect(() => {
    if (selectedId && itemRefs.current[selectedId]) {
      const el = itemRefs.current[selectedId];
      if (el && listContainerRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedId]);

  // Filtered lists
  const query = searchQuery.trim().toLowerCase();

  const filteredStates = INDIA_STATES.filter((s) => {
    if (!query) return true;
    return (
      s.nameEn.toLowerCase().includes(query) ||
      s.nameHi.includes(query) ||
      s.capitalEn.toLowerCase().includes(query) ||
      s.capitalHi.includes(query) ||
      s.number.toString() === query
    );
  });

  const filteredUts = INDIA_UTS.filter((u) => {
    if (!query) return true;
    return (
      u.nameEn.toLowerCase().includes(query) ||
      u.nameHi.includes(query) ||
      u.capitalEn.toLowerCase().includes(query) ||
      u.capitalHi.includes(query) ||
      u.number.toString() === query
    );
  });

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-900 shadow-sm p-1.5 sm:p-3.5 flex flex-col h-[460px] sm:h-[620px] shrink-0 font-sans">
      {/* 1. TOP SEGMENTED TABS: States (28) vs Union Territories (8) */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 mb-2 shrink-0">
        <button
          onClick={() => onTabChange('states')}
          className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all ${
            activeTab === 'states'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{isHi ? 'राज्य (28)' : 'States (28)'}</span>
        </button>

        <button
          onClick={() => onTabChange('uts')}
          className={`flex-1 py-1.5 px-1 sm:px-2 rounded-lg text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all ${
            activeTab === 'uts'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-3 h-3 shrink-0" />
          <span className="truncate">{isHi ? 'संघ (8)' : 'UTs (8)'}</span>
        </button>
      </div>

      {/* 2. SEARCH BOX */}
      <div className="relative mb-2 shrink-0">
        <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={isHi ? 'खोजें...' : 'Search State/UT...'}
          className="w-full pl-6 sm:pl-7 pr-6 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] sm:text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-semibold"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3. VERTICAL SCROLLING STATE & UT LIST */}
      <div
        ref={listContainerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-0.5 scrollbar-thin scrollbar-thumb-slate-200"
      >
        {/* STATES SECTION */}
        {(activeTab === 'states' || query) && (
          <div className="space-y-1">
            {/* Header Banner */}
            <div className="sticky top-0 z-10 bg-blue-50/95 backdrop-blur-xs py-1 px-1.5 rounded-lg text-blue-900 font-black text-[10px] sm:text-xs flex items-center justify-between border border-blue-100">
              <span className="truncate">🗺️ {isHi ? 'राज्य (States)' : 'States'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-200/70 text-blue-950 text-[9px] font-bold shrink-0">
                {filteredStates.length}
              </span>
            </div>

            {/* List of States */}
            <div className="space-y-1">
              {filteredStates.map((state) => {
                const isSelected = selectedId === state.id;
                return (
                  <button
                    key={state.id}
                    ref={(el) => {
                      itemRefs.current[state.id] = el;
                    }}
                    onClick={() => onSelectRegion(state)}
                    className={`w-full text-left p-1.5 sm:p-2 rounded-xl flex items-center justify-between gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-black scale-[1.01]'
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-xs shrink-0 font-bold ${
                          isSelected ? 'bg-white text-blue-600' : 'bg-slate-100'
                        }`}
                      >
                        {state.icon}
                      </div>

                      <div className="truncate">
                        <div className="text-[11px] sm:text-xs font-bold truncate leading-tight">
                          {state.nameEn}
                        </div>
                        <div
                          className={`text-[9px] sm:text-[10px] truncate font-medium ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {state.nameHi}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* UNION TERRITORIES SECTION */}
        {(activeTab === 'uts' || query || activeTab === 'states') && (
          <div className="space-y-1 pt-1">
            {/* Header Banner */}
            <div className="sticky top-0 z-10 bg-purple-50/95 backdrop-blur-xs py-1 px-1.5 rounded-lg text-purple-900 font-black text-[10px] sm:text-xs flex items-center justify-between border border-purple-100">
              <span className="truncate">🏛️ {isHi ? 'संघ राज्य' : 'Union Territories'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-200/70 text-purple-950 text-[9px] font-bold shrink-0">
                {filteredUts.length}
              </span>
            </div>

            {/* List of UTs */}
            <div className="space-y-1">
              {filteredUts.map((ut) => {
                const isSelected = selectedId === ut.id;
                return (
                  <button
                    key={ut.id}
                    ref={(el) => {
                      itemRefs.current[ut.id] = el;
                    }}
                    onClick={() => onSelectRegion(ut)}
                    className={`w-full text-left p-1.5 sm:p-2 rounded-xl flex items-center justify-between gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs font-black scale-[1.01]'
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-xs shrink-0 font-bold ${
                          isSelected ? 'bg-white text-purple-600' : 'bg-slate-100'
                        }`}
                      >
                        {ut.icon}
                      </div>

                      <div className="truncate">
                        <div className="text-[11px] sm:text-xs font-bold truncate leading-tight">
                          {ut.nameEn}
                        </div>
                        <div
                          className={`text-[9px] sm:text-[10px] truncate font-medium ${
                            isSelected ? 'text-purple-100' : 'text-slate-400'
                          }`}
                        >
                          {ut.nameHi}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
