import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Volume2,
  Heart,
  Shuffle,
  Share2,
  Check,
  Rocket,
  Flame,
  Globe,
  Compass
} from 'lucide-react';
import { FunFact, Language } from '../types';
import { playPopSound, playStarChime, speakText } from '../utils/soundEffects';

interface FunFactsHubProps {
  facts: FunFact[];
  language: Language;
  soundEnabled: boolean;
  onLikeFact: (id: string) => void;
}

export const FunFactsHub: React.FC<FunFactsHubProps> = ({
  facts,
  language,
  soundEnabled,
  onLikeFact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingFactId, setSpeakingFactId] = useState<string | null>(null);
  const [featuredFactIndex, setFeaturedFactIndex] = useState(0);

  const categories = [
    { id: 'all', labelHi: 'सभी तथ्य', labelEn: 'All Facts', icon: '🌟' },
    { id: 'animals', labelHi: 'जीव-जंतु', labelEn: 'Animals', icon: '🦁' },
    { id: 'space', labelHi: 'अंतरिक्ष', labelEn: 'Space & Stars', icon: '🚀' },
    { id: 'nature', labelHi: 'प्रकृति व पेड़', labelEn: 'Nature', icon: '🌿' },
    { id: 'human_body', labelHi: 'हमारा शरीर', labelEn: 'Human Body', icon: '🧠' },
    { id: 'science', labelHi: 'विज्ञान के चमत्कार', labelEn: 'Science', icon: '🔬' },
  ];

  const filteredFacts = facts.filter((fact) => {
    if (selectedCategory === 'all') return true;
    return fact.category === selectedCategory;
  });

  const featuredFact = facts[featuredFactIndex % facts.length] || facts[0];

  const handleShuffleFeatured = () => {
    if (soundEnabled) playPopSound();
    const nextIndex = Math.floor(Math.random() * facts.length);
    setFeaturedFactIndex(nextIndex);
  };

  const handleListenFact = (fact: FunFact) => {
    if (soundEnabled) playPopSound();
    setSpeakingFactId(fact.id);

    const textToSpeak =
      language === 'hi'
        ? `${fact.titleHi}। ${fact.factHi}`
        : `${fact.titleEn}. ${fact.factEn}`;

    speakText(
      textToSpeak,
      language,
      0.9,
      () => setSpeakingFactId(fact.id),
      () => setSpeakingFactId(null),
      () => setSpeakingFactId(null)
    );
  };

  const handleShareFact = (fact: FunFact) => {
    if (soundEnabled) playPopSound();
    const shareText =
      language === 'hi'
        ? `🌟 रोचक तथ्य (Baalvarta):\n${fact.titleHi}\n${fact.factHi}`
        : `🌟 Fun Fact (Baalvarta):\n${fact.titleEn}\n${fact.factEn}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(fact.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero: Aaj Ka Rochak Tathya (Daily Spotlight Card) */}
      {featuredFact && (
        <div className="rounded-3xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-9xl opacity-20 pointer-events-none select-none">
            {featuredFact.emoji}
          </div>
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black uppercase tracking-wider text-sky-100">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{language === 'hi' ? '3. रोचक तथ्य (Fun Facts)' : '3. Fun Facts & Knowledge'}</span>
              </div>
              <button
                onClick={handleShuffleFeatured}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all active:rotate-180 duration-200"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'नया तथ्य देखें' : 'Shuffle'}</span>
              </button>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-4xl sm:text-5xl filter drop-shadow">{featuredFact.emoji}</span>
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-white leading-snug">
                  {language === 'hi' ? featuredFact.titleHi : featuredFact.titleEn}
                </h2>
                <p className="text-sky-100 text-sm sm:text-base font-medium mt-1 leading-relaxed">
                  {language === 'hi' ? featuredFact.factHi : featuredFact.factEn}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                id="listen-featured-fact-btn"
                onClick={() => handleListenFact(featuredFact)}
                className="px-4 py-2 rounded-xl bg-white text-blue-700 font-extrabold text-xs shadow-md hover:bg-blue-50 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {speakingFactId === featuredFact.id
                    ? language === 'hi'
                      ? 'सुनाई दे रहा है...'
                      : 'Speaking...'
                    : language === 'hi'
                    ? 'तथ्य सुनें (Listen)'
                    : 'Listen to Fact'}
                </span>
              </button>

              <button
                onClick={() => {
                  if (soundEnabled) playStarChime();
                  onLikeFact(featuredFact.id);
                }}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all flex items-center gap-1.5 text-xs font-bold"
              >
                <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
                <span>{featuredFact.likes}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`fact-cat-${cat.id}`}
            onClick={() => {
              if (soundEnabled) playPopSound();
              setSelectedCategory(cat.id);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-sky-200 hover:bg-sky-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Colourful Daily Card System Grid (Slide 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFacts.map((fact) => {
          const isSpeaking = speakingFactId === fact.id;
          return (
            <div
              key={fact.id}
              id={`fact-card-${fact.id}`}
              className="bg-white rounded-3xl border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Banner Image with Sticker Badge */}
              <div className="relative h-40 w-full overflow-hidden bg-sky-50">
                <img
                  src={fact.image}
                  alt={fact.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Big Emoji Sticker */}
                <div className="absolute top-3 left-3 w-10 h-10 rounded-2xl bg-white/95 shadow-md flex items-center justify-center text-2xl border border-sky-200">
                  {fact.emoji}
                </div>

                {/* Category Pill */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-sky-800 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg shadow-sm border border-sky-100">
                  {fact.category}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-extrabold text-base line-clamp-1 filter drop-shadow">
                    {language === 'hi' ? fact.titleHi : fact.titleEn}
                  </h3>
                </div>
              </div>

              {/* Fact Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wide flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'hi' ? 'क्या आप जानते हैं?' : 'Did you know?'}</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                    {language === 'hi' ? fact.factHi : fact.factEn}
                  </p>
                </div>

                {/* Card Action Controls: Listen, Like, Share */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleListenFact(fact)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSpeaking
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? (language === 'hi' ? 'बोल रहे हैं...' : 'Speaking...') : (language === 'hi' ? 'सुनाएँ' : 'Listen')}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShareFact(fact)}
                      title="Copy Fact"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      {copiedId === fact.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (soundEnabled) playStarChime();
                        onLikeFact(fact.id);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{fact.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

