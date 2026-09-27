import React, { useEffect } from 'react';
import {
  X,
  Volume2,
  Building2,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Globe2
} from 'lucide-react';
import { DistrictItem } from '../../data/stateDistrictsData';
import { IndiaRegionItem } from '../../data/indiaData';
import { Language } from '../../types';
import { speakText, stopSpeech, playPopSound } from '../../utils/soundEffects';

interface DistrictDetailModalProps {
  district: DistrictItem | null;
  stateItem: IndiaRegionItem;
  language: Language;
  soundEnabled: boolean;
  onClose: () => void;
  onPrevDistrict?: () => void;
  onNextDistrict?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  district,
  stateItem,
  language,
  soundEnabled,
  onClose,
  onPrevDistrict,
  onNextDistrict,
  hasPrev = false,
  hasNext = false,
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);
  const isHi = language === 'hi';

  // Stop speech when modal closes or district changes
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [district]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrevDistrict && hasPrev) {
        onPrevDistrict();
      } else if (e.key === 'ArrowRight' && onNextDistrict && hasNext) {
        onNextDistrict();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevDistrict, onNextDistrict, hasPrev, hasNext]);

  if (!district) return null;

  // Speak full detailed narration
  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const narrationText = isHi
      ? `${stateItem.nameHi} का जिला क्रमांक ${district.number}: ${district.nameHi} (${district.nameEn})। इसका प्रशासनिक मुख्यालय ${district.headquartersHi} है। यह जिला विशेष रूप से ${district.famousForHi} के लिए प्रसिद्ध है। राज्य की राजधानी ${stateItem.capitalHi} है।`
      : `District number ${district.number} of ${stateItem.nameEn}: ${district.nameEn} (${district.nameHi}). Its administrative headquarters is ${district.headquartersEn}. This district is specially famous for ${district.famousForEn}. State capital is ${stateItem.capitalEn}.`;

    setIsSpeaking(true);
    speakText(
      narrationText,
      isHi ? 'hi' : 'en',
      0.84,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click area */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (soundEnabled) playPopSound();
          stopSpeech();
          onClose();
        }}
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border-3 border-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 font-sans animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-5 relative border-b-2 border-slate-900">
          {/* Close button */}
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              stopSpeech();
              onClose();
            }}
            className="absolute right-3.5 top-3.5 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95"
            title={isHi ? 'बंद करें (Esc)' : 'Close (Esc)'}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 pr-8">
            {/* District Icon */}
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0 font-bold">
              {district.icon}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black">
                  #{district.number} {isHi ? 'जिला' : 'District'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-blue-100 text-[10px] sm:text-xs font-bold border border-white/20">
                  {stateItem.nameEn} ({stateItem.nameHi})
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2 truncate">
                <span>{district.nameEn}</span>
                <span className="text-amber-200 text-base sm:text-lg font-bold">
                  ({district.nameHi})
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* 2. BODY CONTENT (SCROLLABLE) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-slate-800 scrollbar-thin scrollbar-thumb-slate-300">
          {/* Headquarters & Administration Card */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {isHi ? 'प्रशासनिक मुख्यालय' : 'Administrative Headquarters'}
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900">
                  {isHi ? district.headquartersHi : district.headquartersEn}
                  <span className="text-xs text-slate-500 font-semibold ml-1.5">
                    ({isHi ? district.headquartersEn : district.headquartersHi})
                  </span>
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-black shrink-0">
              {stateItem.code}
            </div>
          </div>

          {/* Key Local Specialties & Famous Attractions */}
          <div className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-3.5 sm:p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs sm:text-sm">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isHi ? '🌟 मुख्य विशेषताएं एवं प्रसिद्ध स्थल' : '🌟 Key Specialties & Famous For'}</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
              {isHi ? district.famousForHi : district.famousForEn}
            </p>
          </div>

          {/* Educational Facts & Knowledge */}
          <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center gap-2 text-indigo-950 font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{isHi ? '💡 बालवार्ता रोचक तथ्य (Kids Fun Knowledge)' : '💡 Educational District Insights'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">{isHi ? 'राज्य की राजधानी' : 'State Capital'}</div>
                  <div className="font-black text-slate-800">{isHi ? stateItem.capitalHi : stateItem.capitalEn}</div>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">{isHi ? 'क्षेत्र (Zone)' : 'Zone'}</div>
                  <div className="font-black text-slate-800">{isHi ? stateItem.zoneHi : stateItem.zone}</div>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center gap-2 sm:col-span-2">
                <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">{isHi ? 'प्रमुख भाषाएं' : 'Languages'}</div>
                  <div className="font-black text-slate-800">{isHi ? stateItem.languageHi : stateItem.languageEn}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MODAL FOOTER CONTROLS */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between gap-2 shrink-0">
          {/* Prev / Next navigation */}
          <div className="flex items-center gap-1.5">
            {onPrevDistrict && (
              <button
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  onPrevDistrict();
                }}
                disabled={!hasPrev}
                className={`p-2 rounded-xl border-2 flex items-center justify-center transition-all ${
                  hasPrev
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 active:scale-95'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                }`}
                title={isHi ? 'पिछला जिला' : 'Previous District'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {onNextDistrict && (
              <button
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  onNextDistrict();
                }}
                disabled={!hasNext}
                className={`p-2 rounded-xl border-2 flex items-center justify-center transition-all ${
                  hasNext
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 active:scale-95'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                }`}
                title={isHi ? 'अगला जिला' : 'Next District'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Voice Narrator Button */}
          <button
            onClick={handleSpeak}
            className={`px-3.5 py-2 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              isSpeaking
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 active:scale-95'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? (isHi ? 'रोकें' : 'Stop') : isHi ? 'बोलकर सुनाओ 🔊' : 'Listen Details 🔊'}</span>
          </button>

          {/* Close button */}
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              stopSpeech();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all active:scale-95"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
