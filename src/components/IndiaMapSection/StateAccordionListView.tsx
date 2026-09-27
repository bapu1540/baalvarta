import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Volume2,
  MapPin,
  Building2,
  Sparkles,
  BookOpen,
  Globe2,
  Layers,
  Award,
  ExternalLink,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { ALL_INDIA_REGIONS, IndiaRegionItem } from '../../data/indiaData';
import { getDistrictsForState, DistrictItem } from '../../data/stateDistrictsData';
import { DistrictDetailModal } from './DistrictDetailModal';
import { Language } from '../../types';
import { speakText, stopSpeech, playPopSound } from '../../utils/soundEffects';

interface StateAccordionListViewProps {
  language: Language;
  soundEnabled: boolean;
}

export const StateAccordionListView: React.FC<StateAccordionListViewProps> = ({
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'states' | 'uts'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  
  // Track open state IDs (default first state open)
  const [expandedStateIds, setExpandedStateIds] = useState<Record<string, boolean>>({
    'andhra-pradesh': true,
  });

  // Active district for modal
  const [activeModalState, setActiveModalState] = useState<IndiaRegionItem | null>(null);
  const [activeModalDistrict, setActiveModalDistrict] = useState<DistrictItem | null>(null);
  const [speakingStateId, setSpeakingStateId] = useState<string | null>(null);

  // Filter regions
  const filteredRegions = useMemo(() => {
    return ALL_INDIA_REGIONS.filter((region) => {
      // Type filter
      if (filterType === 'states' && region.type !== 'state') return false;
      if (filterType === 'uts' && region.type !== 'ut') return false;

      // Zone filter
      if (selectedZone !== 'all' && region.zone !== selectedZone) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          region.nameEn.toLowerCase().includes(q) ||
          region.nameHi.includes(q) ||
          region.capitalEn.toLowerCase().includes(q) ||
          region.capitalHi.includes(q) ||
          region.code.toLowerCase().includes(q);

        if (matchesName) return true;

        // Also search within its districts
        const districts = getDistrictsForState(region.id, region.nameEn, region.nameHi, region.capitalEn, region.capitalHi);
        const matchesDistrict = districts.some(
          (d) =>
            d.nameEn.toLowerCase().includes(q) ||
            d.nameHi.includes(q) ||
            d.headquartersEn.toLowerCase().includes(q) ||
            d.headquartersHi.includes(q)
        );

        return matchesDistrict;
      }

      return true;
    });
  }, [filterType, selectedZone, searchQuery]);

  const toggleExpand = (stateId: string) => {
    if (soundEnabled) playPopSound();
    setExpandedStateIds((prev) => ({
      ...prev,
      [stateId]: !prev[stateId],
    }));
  };

  const handleExpandAll = () => {
    if (soundEnabled) playPopSound();
    const allOpen: Record<string, boolean> = {};
    filteredRegions.forEach((r) => {
      allOpen[r.id] = true;
    });
    setExpandedStateIds(allOpen);
  };

  const handleCollapseAll = () => {
    if (soundEnabled) playPopSound();
    setExpandedStateIds({});
  };

  const handleSpeakState = (stateItem: IndiaRegionItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (speakingStateId === stateItem.id) {
      stopSpeech();
      setSpeakingStateId(null);
      return;
    }

    if (soundEnabled) playPopSound();
    stopSpeech();
    setSpeakingStateId(stateItem.id);

    const districts = getDistrictsForState(stateItem.id, stateItem.nameEn, stateItem.nameHi, stateItem.capitalEn, stateItem.capitalHi);
    const text = isHi
      ? `${stateItem.nameHi} (${stateItem.nameEn})। राजधानी: ${stateItem.capitalHi}। यह ${stateItem.zoneHi} में स्थित है। इसमें कुल ${districts.length} जिले हैं। प्रमुख भाषा: ${stateItem.languageHi}। रोचक तथ्य: ${stateItem.funFactHi}`
      : `${stateItem.nameEn} (${stateItem.nameHi}). Capital: ${stateItem.capitalEn}. Located in ${stateItem.zone} India. Total districts: ${districts.length}. Official language: ${stateItem.languageEn}. Fun Fact: ${stateItem.funFactEn}`;

    speakText(
      text,
      isHi ? 'hi' : 'en',
      0.85,
      () => setSpeakingStateId(stateItem.id),
      () => setSpeakingStateId(null),
      () => setSpeakingStateId(null)
    );
  };

  const openDistrictModal = (stateItem: IndiaRegionItem, district: DistrictItem) => {
    if (soundEnabled) playPopSound();
    setActiveModalState(stateItem);
    setActiveModalDistrict(district);
  };

  // Modal Next/Prev navigation
  const currentDistrictsList = activeModalState
    ? getDistrictsForState(activeModalState.id, activeModalState.nameEn, activeModalState.nameHi, activeModalState.capitalEn, activeModalState.capitalHi)
    : [];

  const currentModalIndex = activeModalDistrict
    ? currentDistrictsList.findIndex((d) => d.id === activeModalDistrict.id)
    : -1;

  const handlePrevDistrict = () => {
    if (currentModalIndex > 0) {
      setActiveModalDistrict(currentDistrictsList[currentModalIndex - 1]);
    }
  };

  const handleNextDistrict = () => {
    if (
      currentModalIndex >= 0 &&
      currentModalIndex < currentDistrictsList.length - 1
    ) {
      setActiveModalDistrict(currentDistrictsList[currentModalIndex + 1]);
    }
  };

  return (
    <div className="space-y-3 font-sans pb-6">
      {/* 1. TOP CONTROL BAR: SEARCH & FILTERS */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-slate-900 shadow-xs space-y-3">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHi
                ? 'राज्य, केंद्र शासित प्रदेश, राजधानी या जिले का नाम खोजें...'
                : 'Search State, UT, Capital or District name...'
            }
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          {/* State / UT Toggle */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                setFilterType('all');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isHi ? 'सभी (36)' : 'All (36)'}
            </button>

            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                setFilterType('states');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                filterType === 'states'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isHi ? 'राज्य (28 States)' : 'States (28)'}
            </button>

            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                setFilterType('uts');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                filterType === 'uts'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isHi ? 'केंद्र शासित प्रदेश (8 UTs)' : 'UTs (8)'}
            </button>
          </div>

          {/* Quick Expand / Collapse buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExpandAll}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {isHi ? 'सभी खोलें ▾' : 'Expand All ▾'}
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {isHi ? 'सभी बंद करें ▴' : 'Collapse All ▴'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN STATE ACCORDION LIST */}
      <div className="space-y-2.5">
        {filteredRegions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 text-center text-slate-500 space-y-2">
            <div className="text-3xl">🔍</div>
            <div className="font-black text-slate-800 text-sm">
              {isHi ? 'कोई राज्य या जिला नहीं मिला' : 'No State or District found'}
            </div>
            <p className="text-xs">
              {isHi
                ? 'कृपया दूसरा नाम खोजें या फ़िल्टर रीसेट करें।'
                : 'Please try searching with another keyword or reset filters.'}
            </p>
          </div>
        ) : (
          filteredRegions.map((region) => {
            const isExpanded = !!expandedStateIds[region.id];
            const districts = getDistrictsForState(region.id, region.nameEn, region.nameHi, region.capitalEn, region.capitalHi);
            const isSpeakingThis = speakingStateId === region.id;

            return (
              <div
                key={region.id}
                className={`bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-2xs ${
                  isExpanded
                    ? 'border-blue-600 ring-2 ring-blue-400/30'
                    : 'border-slate-300 hover:border-blue-400'
                }`}
              >
                {/* STATE ACCORDION HEADER (CLICK TO EXPAND / COLLAPSE) */}
                <div
                  onClick={() => toggleExpand(region.id)}
                  className={`p-3 sm:p-4 cursor-pointer flex items-center justify-between gap-2.5 transition-colors select-none ${
                    isExpanded ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-white' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    {/* State Icon / Badge */}
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-white flex items-center justify-center text-xl sm:text-2xl shadow-xs shrink-0 font-black border border-white/20"
                      style={{ backgroundColor: region.color }}
                    >
                      {region.icon}
                    </div>

                    {/* State Names & Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black shrink-0">
                          #{region.number}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold shrink-0">
                          {region.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold shrink-0">
                          {districts.length} {isHi ? 'जिले' : 'Districts'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
                          {isHi ? region.zoneHi : region.zone}
                        </span>
                      </div>

                      <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight mt-0.5 flex items-baseline gap-1.5 truncate">
                        <span>{region.nameEn}</span>
                        <span className="text-blue-600 font-bold text-xs sm:text-sm">
                          ({region.nameHi})
                        </span>
                      </h3>

                      <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>
                          {isHi ? 'राजधानी:' : 'Capital:'}{' '}
                          <strong className="text-slate-800 font-bold">
                            {isHi ? region.capitalHi : region.capitalEn}
                          </strong>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>{isHi ? region.languageHi : region.languageEn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Voice Narration + Down Arrow Toggle */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Speak Button */}
                    <button
                      onClick={(e) => handleSpeakState(region, e)}
                      className={`p-2 rounded-xl border transition-all ${
                        isSpeakingThis
                          ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                          : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 border-slate-200'
                      }`}
                      title={isHi ? 'बोलकर सुनाओ' : 'Listen with Audio'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Down Arrow Toggle Indicator */}
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 flex items-center justify-center transition-all ${
                        isExpanded
                          ? 'bg-blue-600 text-white border-blue-700 rotate-180 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 group-hover:border-blue-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>

                {/* EXPANDED STATE CONTENT (DOWNWARD LIST) */}
                {isExpanded && (
                  <div className="p-3 sm:p-4 bg-slate-50/70 border-t-2 border-slate-200 space-y-3 animate-fadeIn">
                    {/* Quick Facts Banner */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-slate-500 font-bold">{isHi ? 'राजधानी:' : 'Capital:'}</span>
                          <span className="font-black text-slate-900">{isHi ? region.capitalHi : region.capitalEn}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                          <span className="text-slate-500 font-bold">{isHi ? 'भाषा:' : 'Language:'}</span>
                          <span className="font-black text-slate-900">{isHi ? region.languageHi : region.languageEn}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Globe2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-slate-500 font-bold">{isHi ? 'क्षेत्र:' : 'Zone:'}</span>
                          <span className="font-black text-slate-900">{isHi ? region.zoneHi : region.zone}</span>
                        </div>
                      </div>

                      <div className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isHi ? region.funFactHi : region.funFactEn}</span>
                      </div>
                    </div>

                    {/* Districts Header */}
                    <div className="flex items-center justify-between gap-2 px-1">
                      <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>
                          {isHi
                            ? `${region.nameHi} के सभी ${districts.length} जिले`
                            : `All ${districts.length} Districts of ${region.nameEn}`}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {isHi ? 'विवरण देखने के लिए जिले पर क्लिक करें' : 'Click district for full details'}
                      </span>
                    </div>

                    {/* DISTRICTS GRID (DIRECTLY UNDERNEATH) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                      {districts.map((district) => (
                        <div
                          key={district.id}
                          onClick={() => openDistrictModal(region, district)}
                          className="bg-white hover:bg-blue-50/60 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between gap-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center text-[10px] font-black shrink-0">
                                #{district.number}
                              </span>
                              <div className="min-w-0 truncate">
                                <h4 className="font-black text-xs text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                  {district.nameEn}{' '}
                                  <span className="text-blue-600 font-bold text-[11px]">
                                    ({district.nameHi})
                                  </span>
                                </h4>
                                <p className="text-[10px] text-slate-500 font-medium truncate">
                                  HQ: {isHi ? district.headquartersHi : district.headquartersEn}
                                </p>
                              </div>
                            </div>
                            <span className="text-base shrink-0">{district.icon}</span>
                          </div>

                          <div className="p-1 px-2 rounded-lg bg-amber-50 border border-amber-200/70 text-[10px] text-amber-950 font-bold truncate flex items-center justify-between gap-1">
                            <span className="truncate">
                              {isHi ? district.famousForHi : district.famousForEn}
                            </span>
                            <span className="text-[9px] text-blue-600 font-black shrink-0 group-hover:underline">
                              {isHi ? 'विवरण ↗' : 'Info ↗'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. DISTRICT DETAIL POPUP MODAL */}
      {activeModalDistrict && activeModalState && (
        <DistrictDetailModal
          district={activeModalDistrict}
          stateItem={activeModalState}
          language={language}
          soundEnabled={soundEnabled}
          onClose={() => {
            setActiveModalDistrict(null);
            setActiveModalState(null);
          }}
          onPrevDistrict={handlePrevDistrict}
          onNextDistrict={handleNextDistrict}
          hasPrev={currentModalIndex > 0}
          hasNext={
            currentModalIndex >= 0 &&
            currentModalIndex < currentDistrictsList.length - 1
          }
        />
      )}
    </div>
  );
};
