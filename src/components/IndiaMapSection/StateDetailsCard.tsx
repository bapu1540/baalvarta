import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { ALL_INDIA_REGIONS, IndiaRegionItem } from '../../data/indiaData';
import { Language } from '../../types';
import { speakText, stopSpeech } from '../../utils/soundEffects';

interface StateDetailsCardProps {
  language: Language;
  selectedItem: IndiaRegionItem;
  onSelectRegion: (item: IndiaRegionItem) => void;
  soundEnabled: boolean;
}

export const StateDetailsCard: React.FC<StateDetailsCardProps> = ({
  language,
  selectedItem,
  onSelectRegion,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Audio narration handler
  const handleSpeakDetails = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = isHi
      ? `${selectedItem.nameHi}। राजधानी ${selectedItem.capitalHi} है। यह ${selectedItem.famousForHi} के लिए प्रसिद्ध है। रोचक तथ्य: ${selectedItem.funFactHi}`
      : `${selectedItem.nameEn}. Capital is ${selectedItem.capitalEn}. Famous for ${selectedItem.famousForEn}. Fun fact: ${selectedItem.funFactEn}`;

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

  // Next / Previous State Navigation
  const currentIndex = ALL_INDIA_REGIONS.findIndex((r) => r.id === selectedItem.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % ALL_INDIA_REGIONS.length;
    onSelectRegion(ALL_INDIA_REGIONS[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx =
      (currentIndex - 1 + ALL_INDIA_REGIONS.length) % ALL_INDIA_REGIONS.length;
    onSelectRegion(ALL_INDIA_REGIONS[prevIdx]);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-blue-200/90 shadow-sm space-y-4 font-sans mt-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0">
            {selectedItem.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider">
                {selectedItem.type === 'state'
                  ? `State #${selectedItem.number}`
                  : `Union Territory #${selectedItem.number}`}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                {isHi ? selectedItem.zoneHi : selectedItem.zone}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                {selectedItem.code}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {selectedItem.nameEn}{' '}
              <span className="text-blue-600 font-bold text-lg sm:text-xl">
                ({selectedItem.nameHi})
              </span>
            </h3>
          </div>
        </div>

        {/* Audio Speech Button */}
        <button
          onClick={handleSpeakDetails}
          className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center gap-1.5 shadow-xs ${
            isSpeaking
              ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
              : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
          }`}
          title={isHi ? 'आवाज में सुनें' : 'Listen with Audio'}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-xs font-black hidden sm:inline">
            {isSpeaking
              ? isHi
                ? 'रोकें ⏹️'
                : 'Stop'
              : isHi
              ? 'बोलकर सुनाओ 🔊'
              : 'Listen 🔊'}
          </span>
        </button>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <span>🏛️</span>
            <span>{isHi ? 'राजधानी (Capital)' : 'Capital City'}</span>
          </div>
          <div className="text-sm font-black text-slate-900 mt-1">
            {isHi ? selectedItem.capitalHi : selectedItem.capitalEn}
            <span className="text-xs font-medium text-slate-500 ml-1.5">
              ({isHi ? selectedItem.capitalEn : selectedItem.capitalHi})
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <span>🗣️</span>
            <span>{isHi ? 'प्रमुख भाषाएं (Languages)' : 'Official Languages'}</span>
          </div>
          <div className="text-sm font-black text-slate-900 mt-1">
            {isHi ? selectedItem.languageHi : selectedItem.languageEn}
          </div>
        </div>
      </div>

      {/* Famous For */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
        <div className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {isHi ? 'किसके लिए प्रसिद्ध है (Famous For)' : 'Famous Attractions'}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-amber-950 mt-1">
          {isHi ? selectedItem.famousForHi : selectedItem.famousForEn}
        </p>
      </div>

      {/* Fun Fact for Kids */}
      <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200">
        <div className="text-[11px] font-black uppercase tracking-wider text-blue-800 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>
            {isHi ? 'बच्चों के लिए रोचक तथ्य (Fun Fact for Kids)' : 'Did You Know?'}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-blue-950 mt-1 leading-relaxed">
          💡 {isHi ? selectedItem.funFactHi : selectedItem.funFactEn}
        </p>
      </div>

      {/* Prev / Next Navigation Controls */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <button
          onClick={handlePrev}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-700 flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isHi ? 'पिछला' : 'Previous'}</span>
        </button>

        <div className="text-xs text-slate-400 font-bold">
          {currentIndex + 1} / {ALL_INDIA_REGIONS.length}
        </div>

        <button
          onClick={handleNext}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-xs"
        >
          <span>{isHi ? 'अगला' : 'Next'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
