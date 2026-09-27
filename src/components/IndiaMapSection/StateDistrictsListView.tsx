import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Sparkles,
  X,
  MapPin,
  Building2,
  CheckCircle2,
  Info,
  ExternalLink
} from 'lucide-react';
import { IndiaRegionItem } from '../../data/indiaData';
import { getDistrictsForState, DistrictItem } from '../../data/stateDistrictsData';
import { DistrictDetailModal } from './DistrictDetailModal';
import { Language } from '../../types';
import { speakText, stopSpeech, playPopSound } from '../../utils/soundEffects';

interface StateDistrictsListViewProps {
  language: Language;
  selectedItem: IndiaRegionItem;
  soundEnabled: boolean;
}

export const StateDistrictsListView: React.FC<StateDistrictsListViewProps> = ({
  language,
  selectedItem,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [districtQuery, setDistrictQuery] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [activeModalDistrict, setActiveModalDistrict] = useState<DistrictItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Retrieve official districts list for selected state
  const districtsList: DistrictItem[] = getDistrictsForState(
    selectedItem.id,
    selectedItem.nameEn,
    selectedItem.nameHi,
    selectedItem.capitalEn,
    selectedItem.capitalHi
  );

  const query = districtQuery.toLowerCase().trim();
  const filteredDistricts = districtsList.filter((d) => {
    if (!query) return true;
    return (
      d.nameEn.toLowerCase().includes(query) ||
      d.nameHi.includes(query) ||
      d.headquartersEn.toLowerCase().includes(query) ||
      d.headquartersHi.includes(query) ||
      d.famousForEn.toLowerCase().includes(query) ||
      d.famousForHi.includes(query) ||
      d.number.toString() === query
    );
  });

  const activeDistrict =
    districtsList.find((d) => d.id === selectedDistrictId) || districtsList[0];

  const currentModalIndex = activeModalDistrict
    ? districtsList.findIndex((d) => d.id === activeModalDistrict.id)
    : -1;

  const handlePrevDistrict = () => {
    if (currentModalIndex > 0) {
      const prev = districtsList[currentModalIndex - 1];
      setSelectedDistrictId(prev.id);
      setActiveModalDistrict(prev);
    }
  };

  const handleNextDistrict = () => {
    if (currentModalIndex >= 0 && currentModalIndex < districtsList.length - 1) {
      const next = districtsList[currentModalIndex + 1];
      setSelectedDistrictId(next.id);
      setActiveModalDistrict(next);
    }
  };

  // Speak State & Districts Summary
  const handleSpeakState = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = isHi
      ? `${selectedItem.nameHi} राज्य के जिले। इस राज्य में कुल ${districtsList.length} जिले हैं। राजधानी ${selectedItem.capitalHi} है।`
      : `Districts of ${selectedItem.nameEn} state. Total ${districtsList.length} districts. Capital is ${selectedItem.capitalEn}.`;

    setIsSpeaking(true);
    speakText(
      textToSpeak,
      isHi ? 'hi' : 'en',
      0.82,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // Speak Individual District Details
  const handleSpeakDistrict = (district: DistrictItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playPopSound();
    stopSpeech();
    const textToSpeak = isHi
      ? `जिला ${district.number}: ${district.nameHi}। मुख्यालय ${district.headquartersHi}। यह ${district.famousForHi} के लिए प्रसिद्ध है।`
      : `District ${district.number}: ${district.nameEn}. Headquarters is ${district.headquartersEn}. Famous for ${district.famousForEn}.`;

    setIsSpeaking(true);
    speakText(
      textToSpeak,
      isHi ? 'hi' : 'en',
      0.82,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="w-full bg-white border-2 sm:border-[3px] border-slate-900 rounded-2xl sm:rounded-3xl p-2 sm:p-4 relative flex flex-col h-[460px] sm:h-[620px] shadow-sm overflow-hidden font-sans space-y-2.5">
      {/* 1. STATE DETAILS BANNER & TITLE (NO MAP) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2 sm:p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl border-2 border-slate-900 z-10 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-xl sm:text-2xl shadow-xs font-bold shrink-0 border border-white/30">
            {selectedItem.icon}
          </div>
          <div className="min-w-0 leading-tight">
            <div className="font-black text-xs sm:text-base tracking-tight truncate flex items-center gap-1.5">
              <span>{selectedItem.nameEn}</span>
              <span className="text-amber-200 text-xs sm:text-sm">({selectedItem.nameHi})</span>
            </div>
            <div className="text-[10px] sm:text-xs text-blue-100 font-bold flex items-center gap-1.5 truncate mt-0.5">
              <span>🏛️ {isHi ? 'राजधानी:' : 'Capital:'}</span>
              <span className="text-white font-black">{isHi ? selectedItem.capitalHi : selectedItem.capitalEn}</span>
              <span className="text-white/60">•</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-md text-amber-200 text-[10px] font-black">
                {districtsList.length} {isHi ? 'जिले' : 'Districts'}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Speech Button */}
        <button
          onClick={handleSpeakState}
          className={`p-1.5 sm:p-2 rounded-xl border transition-all flex items-center gap-1.5 shrink-0 ${
            isSpeaking
              ? 'bg-rose-500 border-white text-white animate-pulse'
              : 'bg-white/20 hover:bg-white/30 border-white/30 text-white'
          }`}
          title={isHi ? 'बोलकर सुनाओ' : 'Listen with Audio'}
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs font-black hidden sm:inline">
            {isSpeaking ? (isHi ? 'रोकें' : 'Stop') : isHi ? 'सुनें 🔊' : 'Listen 🔊'}
          </span>
        </button>
      </div>

      {/* 2. DISTRICT SEARCH & FILTER BAR */}
      <div className="w-full flex items-center justify-between gap-2 px-1 shrink-0">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={districtQuery}
            onChange={(e) => setDistrictQuery(e.target.value)}
            placeholder={
              isHi
                ? `${selectedItem.nameHi} के जिले खोजें (उदा: Kutch, Ahmedabad, 1)...`
                : `Search district in ${selectedItem.nameEn} (e.g. Surat, 1)...`
            }
            className="w-full pl-8 pr-7 py-1.5 sm:py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold transition-all"
          />
          {districtQuery && (
            <button
              onClick={() => setDistrictQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-[10px] sm:text-xs font-black px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
          {filteredDistricts.length} / {districtsList.length} {isHi ? 'जिले' : 'Districts'}
        </div>
      </div>

      {/* 3. SCROLLABLE DISTRICTS GRID / LIST (NO MAP) */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredDistricts.map((district) => {
            const isSelected = selectedDistrictId === district.id;

            return (
              <div
                key={district.id}
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setSelectedDistrictId(district.id);
                  setActiveModalDistrict(district);
                }}
                className={`p-2.5 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex flex-col justify-between gap-1.5 shadow-2xs group ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-400/40 shadow-xs scale-[1.01]'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 hover:shadow-xs'
                }`}
              >
                {/* District Top Header */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700'
                      }`}
                    >
                      {district.number}
                    </div>

                    <div className="min-w-0">
                      <div className="font-black text-xs sm:text-sm text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
                        {district.nameEn}{' '}
                        <span className="text-blue-600 font-bold text-[11px]">
                          ({district.nameHi})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1 truncate mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{isHi ? 'मुख्यालय:' : 'HQ:'}</span>
                        <span className="text-slate-800 font-bold">
                          {isHi ? district.headquartersHi : district.headquartersEn}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* District Audio Speak Button */}
                  <button
                    onClick={(e) => handleSpeakDistrict(district, e)}
                    className="p-1 rounded-lg hover:bg-blue-100 text-blue-600 shrink-0 transition-all active:scale-95"
                    title={isHi ? 'जिले का विवरण सुनें' : 'Listen District Details'}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* District Key Attraction / Famous Feature */}
                <div className="p-1.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-[10px] sm:text-[11px] font-bold text-amber-950 flex items-center justify-between gap-1.5 leading-snug">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <span className="text-xs shrink-0">{district.icon}</span>
                    <span className="truncate">
                      {isHi ? district.famousForHi : district.famousForEn}
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-black shrink-0 hidden sm:inline group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {isHi ? 'विवरण' : 'Info'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDistricts.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs font-bold">
            {isHi
              ? 'कोई जिला नहीं मिला। कृपया दूसरा नाम खोजें।'
              : 'No district found. Please try another name.'}
          </div>
        )}
      </div>

      {/* 4. ACTIVE DISTRICT DETAIL FOOTER BANNER */}
      {activeDistrict && (
        <div
          onClick={() => {
            if (soundEnabled) playPopSound();
            setActiveModalDistrict(activeDistrict);
          }}
          className="w-full bg-slate-900 hover:bg-slate-800 cursor-pointer text-white rounded-xl p-2 border-2 border-slate-900 text-xs flex items-center justify-between gap-2 shrink-0 select-none shadow-xs transition-colors"
          title={isHi ? 'विस्तार से देखने के लिए क्लिक करें' : 'Click to view full details'}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">{activeDistrict.icon}</span>
            <div className="min-w-0 truncate leading-tight">
              <span className="font-black text-amber-300">
                #{activeDistrict.number} {activeDistrict.nameEn} ({activeDistrict.nameHi}):{' '}
              </span>
              <span className="text-slate-200 text-[11px] font-medium">
                {isHi ? activeDistrict.famousForHi : activeDistrict.famousForEn}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-black">
              HQ: {activeDistrict.headquartersEn}
            </div>
            <div className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
              {isHi ? 'विस्तार ↗' : 'Details ↗'}
            </div>
          </div>
        </div>
      )}

      {/* 5. DISTRICT DETAILS POPUP MODAL */}
      {activeModalDistrict && (
        <DistrictDetailModal
          district={activeModalDistrict}
          stateItem={selectedItem}
          language={language}
          soundEnabled={soundEnabled}
          onClose={() => setActiveModalDistrict(null)}
          onPrevDistrict={handlePrevDistrict}
          onNextDistrict={handleNextDistrict}
          hasPrev={currentModalIndex > 0}
          hasNext={currentModalIndex >= 0 && currentModalIndex < districtsList.length - 1}
        />
      )}
    </div>
  );
};
