import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Filter,
  X,
  ArrowRight
} from 'lucide-react';
import { NATIONAL_GK_ITEMS, NationalGkItem } from '../data/nationalGkData';
import { Language } from '../types';
import { speakText, stopSpeech, playPopSound, playSuccessSound } from '../utils/soundEffects';

interface VisualGkFlashcardsSectionProps {
  language: Language;
  soundEnabled: boolean;
}

export const VisualGkFlashcardsSection: React.FC<VisualGkFlashcardsSectionProps> = ({
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelHi: '🌟 सभी ज्ञान कार्ड्स', labelEn: '🌟 All Flashcards', emoji: '🌟' },
    { id: 'symbols', labelHi: '🇮🇳 हमारा प्यारा भारत', labelEn: '🇮🇳 Our India', emoji: '🇮🇳' },
    { id: 'heritage', labelHi: '🏛️ भारतीय धरोहर व स्थल', labelEn: '🏛️ Heritage & Places', emoji: '🏛️' },
    { id: 'science', labelHi: '🚀 अंतरिक्ष व विज्ञान', labelEn: '🚀 Space & Science', emoji: '🚀' },
    { id: 'geography', labelHi: '🏔️ भूगोल व नदियाँ', labelEn: '🏔️ Geography & Nature', emoji: '🏔️' },
    { id: 'leaders', labelHi: '👑 राष्ट्रनायक व महापुरुष', labelEn: '👑 National Leaders', emoji: '👑' },
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
      ? `प्रश्न: ${item.questionHi}। उत्तर: ${item.answerHi}। रोचक बात: ${item.funFactHi}`
      : `Question: ${item.questionEn}. Answer: ${item.answerEn}. Fun Fact: ${item.funFactEn}`;

    speakText(
      textToSpeak,
      isHi ? 'hi' : 'en',
      0.9,
      () => setSpeakingItemId(item.id),
      () => setSpeakingItemId(null),
      () => setSpeakingItemId(null)
    );
  };

  return (
    <div className="space-y-4 font-sans pb-6">
      
      {/* Search & Quick Category Filters */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHi
                ? 'सामान्य ज्ञान कार्ड्स खोजें (जैसे: मोर, बाघ, तिरंगा, ग्रह, गंगा)...'
                : 'Search GK cards (e.g. peacock, tiger, flag, space, planet)...'
            }
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border-2 border-slate-900 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Carousel */}
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
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{isHi ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GK Cards Grid (Clean, Large Visual Typography) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredItems.map((item) => {
          const isPlaying = speakingItemId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group"
            >
              <div className="space-y-2.5">
                
                {/* Card Top Bar: Badge & Emoji */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase tracking-wider">
                    #{item.number} • {isHi ? item.badgeHi : item.badgeEn}
                  </span>

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-indigo-200 flex items-center justify-center text-3xl shadow-2xs group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                </div>

                {/* Question */}
                <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                  ❓ {isHi ? item.questionHi : item.questionEn}
                </h3>

                {/* Large Clear Answer */}
                <div className="p-3 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 flex items-start gap-2 text-emerald-950">
                  <span className="text-lg shrink-0">💡</span>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                      {isHi ? 'उत्तर (Answer):' : 'Answer:'}
                    </span>
                    <span className="text-sm sm:text-base font-black text-emerald-950 leading-tight">
                      {isHi ? item.answerHi : item.answerEn}
                    </span>
                  </div>
                </div>

                {/* Brief Easy Detail */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {isHi ? item.detailHi : item.detailEn}
                </p>

                {/* Fun Fact Pill */}
                {item.funFactHi && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] font-bold flex items-start gap-1.5">
                    <span className="text-base shrink-0">🌟</span>
                    <span>
                      <strong className="text-amber-900">{isHi ? 'रोचक तथ्य: ' : 'Fun Fact: '}</strong>
                      {isHi ? item.funFactHi : item.funFactEn}
                    </span>
                  </div>
                )}

              </div>

              {/* Action Bar: Audio Speech Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeakItem(item)}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-500 text-white animate-pulse shadow-md'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 shadow-2xs active:scale-95'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>{isPlaying ? (isHi ? 'आवाज़ बज रही है...' : 'Speaking...') : (isHi ? 'बोलकर सुनें 🔊' : 'Listen 🔊')}</span>
                </button>

                <span className="text-[10px] text-slate-400 font-bold">
                  {isHi ? 'बालवार्ता बाल-ज्ञान' : 'Baalvarta GK'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl p-8 text-center space-y-3 border-2 border-slate-900">
          <span className="text-4xl">🔍</span>
          <h4 className="text-base font-black text-slate-800">
            {isHi ? 'कोई ज्ञान कार्ड नहीं मिला' : 'No cards found'}
          </h4>
          <p className="text-xs text-slate-500">
            {isHi ? 'कृपया कोई दूसरा शब्द खोजें या सभी कार्ड्स देखें।' : 'Try another search term.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs"
          >
            {isHi ? 'सभी कार्ड्स देखें' : 'View All Cards'}
          </button>
        </div>
      )}

    </div>
  );
};
