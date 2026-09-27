import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Filter,
  X,
  Share2
} from 'lucide-react';
import { NATIONAL_GK_ITEMS, NationalGkItem } from '../data/nationalGkData';
import { Language } from '../types';
import { speakText, stopSpeech, playPopSound, playSuccessSound } from '../utils/soundEffects';

interface NationalGeneralKnowledgeSectionProps {
  language: Language;
  soundEnabled: boolean;
}

export const NationalGeneralKnowledgeSection: React.FC<NationalGeneralKnowledgeSectionProps> = ({
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelHi: 'सभी प्रश्न (20)', labelEn: 'All GK (20)', icon: '🌟' },
    { id: 'symbols', labelHi: 'राष्ट्रीय प्रतीक (Symbols)', labelEn: 'National Symbols', icon: '🇮🇳' },
    { id: 'leaders', labelHi: 'राष्ट्रपति व प्रधानमंत्री (Leaders)', labelEn: 'National Leaders', icon: '👑' },
    { id: 'heritage', labelHi: 'राष्ट्रीय धरोहर व पर्व (Heritage)', labelEn: 'Heritage & Songs', icon: '🎶' },
    { id: 'geography', labelHi: 'भूगोल व राजधानी (Geography)', labelEn: 'Geography & River', icon: '🏔️' },
    { id: 'science', labelHi: 'विज्ञान व अंतरिक्ष (Space)', labelEn: 'Science & Space', icon: '🚀' },
  ];

  const filteredItems = useMemo(() => {
    return NATIONAL_GK_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.questionHi.includes(q) ||
          item.questionEn.toLowerCase().includes(q) ||
          item.answerHi.includes(q) ||
          item.answerEn.toLowerCase().includes(q) ||
          item.detailHi.includes(q) ||
          item.detailEn.toLowerCase().includes(q) ||
          item.badgeHi.includes(q) ||
          item.badgeEn.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleSpeakItem = (item: NationalGkItem) => {
    if (speakingItemId === item.id) {
      stopSpeech();
      setSpeakingItemId(null);
      return;
    }

    if (soundEnabled) playPopSound();
    stopSpeech();
    setSpeakingItemId(item.id);

    const textToSpeak = isHi
      ? `प्रश्न: ${item.questionHi} उत्तर: ${item.answerHi}। ${item.detailHi} रोचक तथ्य: ${item.funFactHi}`
      : `Question: ${item.questionEn} Answer: ${item.answerEn}. ${item.detailEn} Fun Fact: ${item.funFactEn}`;

    speakText(
      textToSpeak,
      isHi ? 'hi' : 'en',
      0.85,
      () => setSpeakingItemId(item.id),
      () => setSpeakingItemId(null),
      () => setSpeakingItemId(null)
    );
  };

  return (
    <div className="space-y-4 font-sans pb-8">
      {/* 1. TOP HERO BANNER */}
      <div className="bg-gradient-to-r from-orange-500 via-indigo-600 to-emerald-600 text-white rounded-3xl p-4 sm:p-6 shadow-md border-3 border-slate-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md text-amber-200 flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-white/30 shrink-0">
              🇮🇳
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-900 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  National GK
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-yellow-200 text-[10px] sm:text-xs font-bold border border-white/20">
                  {isHi ? '20+ सचित्र प्रश्न-उत्तर' : '20+ Illustrated Q&A'}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-1">
                {isHi
                  ? 'भारत का सामान्य ज्ञान (राष्ट्रीय प्रतीक, राष्ट्रपति, प्रधानमंत्री व रोचक तथ्य)'
                  : 'Basic India General Knowledge (National Symbols, Leaders & Facts)'}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 font-semibold mt-0.5">
                {isHi
                  ? 'बच्चों के लिए भारत के राष्ट्रीय ध्वज, पशु, पक्षी, नदी, प्रतीक और वर्तमान नेतृत्व के सचित्र ज्ञानवर्धक उत्तर!'
                  : 'Child-friendly illustrated Q&A on India’s national symbols, leaders, anthem, and facts!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER PATTI */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-slate-900 shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHi
                ? 'प्रश्न खोजें (उदा. तिरंगा, मोर, बाघ, प्रधानमंत्री, राष्ट्रपति, गंगा)...'
                : 'Search question (e.g. Flag, Tiger, Peacock, Prime Minister, Ganga)...'
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs scale-[1.01]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isHi ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. QUESTION-ANSWER CARDS GRID */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-300 text-center text-slate-500 space-y-2">
          <div className="text-3xl">🔍</div>
          <div className="font-black text-slate-800 text-sm">
            {isHi ? 'कोई सामान्य ज्ञान प्रश्न नहीं मिला' : 'No GK question found'}
          </div>
          <p className="text-xs">
            {isHi ? 'कृपया दूसरा कीवर्ड खोजें या सभी श्रेणी चुनें।' : 'Please search with another keyword.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredItems.map((item) => {
            const isSpeakingThis = speakingItemId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border-2 sm:border-3 border-slate-900 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* CARD TOP BANNER WITH PHOTO / EMOJI VISUAL */}
                <div
                  className={`bg-gradient-to-r ${item.imageBg} text-white p-3.5 sm:p-4 border-b-2 border-slate-900 relative flex items-center justify-between gap-3 shadow-inner`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0">
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-black">
                          #{item.number}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold border border-white/30">
                          {isHi ? item.badgeHi : item.badgeEn}
                        </span>
                      </div>
                      <div className="text-xs font-black text-white/90 truncate mt-0.5">
                        {isHi ? 'भारतीय सामान्य ज्ञान' : 'India Basic GK'}
                      </div>
                    </div>
                  </div>

                  {/* Audio Speak Button */}
                  <button
                    onClick={() => handleSpeakItem(item)}
                    className={`p-2 rounded-xl transition-all border shadow-xs shrink-0 active:scale-95 ${
                      isSpeakingThis
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                    }`}
                    title={isHi ? 'बोलकर सुनो 🔊' : 'Listen with Audio 🔊'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* CARD CONTENT: QUESTION & ANSWER */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {/* Question (सवाल) */}
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-black shrink-0 mt-0.5">
                        {isHi ? 'प्रश्न' : 'Q'}
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                        {isHi ? item.questionHi : item.questionEn}
                      </h3>
                    </div>

                    {/* Highlighted Answer (उत्तर) */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{isHi ? 'उत्तर (Answer):' : 'Answer:'}</span>
                      </div>
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        {isHi ? item.answerHi : item.answerEn}
                      </div>
                    </div>

                    {/* Detailed Explanation */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {isHi ? item.detailHi : item.detailEn}
                    </p>
                  </div>

                  {/* Fun Fact / रोचक तथ्य (Did You Know?) */}
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-950 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="leading-tight">
                      <strong className="text-amber-900">{isHi ? 'रोचक तथ्य: ' : 'Fun Fact: '}</strong>
                      {isHi ? item.funFactHi : item.funFactEn}
                    </span>
                  </div>
                </div>

                {/* CARD FOOTER WITH VOICE ACTION */}
                <div className="p-2.5 sm:p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
                  <div className="text-[10px] font-bold text-slate-500">
                    {isHi ? `श्रेणी: ${item.badgeHi}` : `Category: ${item.badgeEn}`}
                  </div>

                  <button
                    onClick={() => handleSpeakItem(item)}
                    className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      isSpeakingThis
                        ? 'bg-rose-500 text-white'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeakingThis ? (isHi ? 'रोकें' : 'Stop') : isHi ? 'सुनें 🔊' : 'Listen 🔊'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
