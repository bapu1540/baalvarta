import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  Award,
  ChevronRight,
  X,
  Star,
  Flame,
  Heart,
  ShieldCheck,
  Trophy,
  Share2,
  CheckCircle2,
  Quote,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerStoryCompleteConfetti } from '../utils/confetti';
import { GreatHeroItem, GREAT_HEROES_LIST } from '../data/greatHeroesData';
import { Language } from '../types';
import { playPopSound, playSuccessSound, stopSpeech } from '../utils/soundEffects';
import { getStoredGreatHeroes } from '../utils/storage';

interface GreatHeroesChildhoodHubProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
}

export const GreatHeroesChildhoodHub: React.FC<GreatHeroesChildhoodHubProps> = ({
  language,
  soundEnabled,
  onBackToHome,
}) => {
  const isHi = language === 'hi';
  const [heroes, setHeroes] = useState<GreatHeroItem[]>(() => getStoredGreatHeroes());
  const [selectedHero, setSelectedHero] = useState<GreatHeroItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [likedHeroIds, setLikedHeroIds] = useState<string[]>([]);
  const [completedHeroIds, setCompletedHeroIds] = useState<string[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      setHeroes(getStoredGreatHeroes());
    };
    window.addEventListener('baalvarta_great_heroes_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('baalvarta_great_heroes_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleSpeakText = (text: string) => {
    if (!soundEnabled) return;
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    stopSpeech();
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isHi ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleLikeHero = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (soundEnabled) playSuccessSound();
    if (likedHeroIds.includes(id)) {
      setLikedHeroIds(likedHeroIds.filter((item) => item !== id));
    } else {
      setLikedHeroIds([...likedHeroIds, id]);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  const list = heroes && heroes.length > 0 ? heroes : GREAT_HEROES_LIST;

  const filteredHeroes = activeFilter === 'all'
    ? list
    : list.filter((h) => {
        if (activeFilter === 'warriors') return h.id === 'shivaji-maharaj' || h.id === 'rani-lakshmibai' || h.id === 'bhagat-singh';
        if (activeFilter === 'scientists') return h.id === 'apj-abdul-kalam' || h.id === 'kalpana-chawla';
        if (activeFilter === 'thinkers') return h.id === 'swami-vivekananda' || h.id === 'mahatma-gandhi' || h.id === 'dr-ambedkar';
        return true;
      });

  return (
    <div className="space-y-4 pb-20 font-sans">
      
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white p-4 sm:p-6 shadow-lg border-2 border-pink-400/40">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/30 backdrop-blur-md text-amber-200 text-xs font-black border border-amber-300/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? '9. महान हस्तियों का प्रेरक बचपन' : '9. Childhood of Great Heroes'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>🌟</span>
              <span>{isHi ? 'जब नन्हें बच्चे बने इतिहास रचने वाले महानायक' : 'Inspiring Childhood of Great Legends'}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSpeakText(isHi ? 'महान हस्तियों का प्रेरक बचपन। जानिए कैसे बचपन के संस्कारों ने इन महान विभूतियों को अमर बनाया।' : 'Inspirational Childhood of Great Heroes.')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-red-900 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? (isHi ? 'रोकें' : 'Stop') : (isHi ? 'ऑडियो सुनें' : 'Listen')}</span>
            </button>
          </div>
        </div>

        {/* 2. SUB-MENU FILTERS */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-pink-400/30 pt-3">
          {[
            { id: 'all', labelHi: '🌟 सभी महानायक', labelEn: '🌟 All Heroes' },
            { id: 'warriors', labelHi: '⚔️ वीर शूरवीर', labelEn: '⚔️ Warriors' },
            { id: 'scientists', labelHi: '🚀 वैज्ञानिक व अंतरिक्ष', labelEn: '🚀 Scientists' },
            { id: 'thinkers', labelHi: '📜 संत व सुधारक', labelEn: '📜 Thinkers' },
          ].map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setActiveFilter(filter.id);
                }}
                className={`px-3 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-amber-300 text-slate-950 shadow-md border border-amber-200'
                    : 'bg-pink-900/60 hover:bg-pink-800/80 text-pink-100 border border-pink-400/30'
                }`}
              >
                <span>{isHi ? filter.labelHi : filter.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. HEROES GRID WITH CLEAR PHOTOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📖</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {isHi ? 'प्रेरणादायक बचपन की गाथाएँ (Childhood Stories)' : 'Childhood Stories of Legends'}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {isHi ? `${filteredHeroes.length} महानायक` : `${filteredHeroes.length} Heroes`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredHeroes.map((hero) => {
            const isLiked = likedHeroIds.includes(hero.id);
            return (
              <div
                key={hero.id}
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setSelectedHero(hero);
                }}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-pink-500 shadow-xs hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
              >
                {/* Hero Header Strip with Portrait Image */}
                <div className={`p-3.5 bg-gradient-to-r ${hero.heroColor || 'from-pink-600 to-amber-600'} text-white relative overflow-hidden`}>
                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/50 text-amber-300 text-[10px] font-black backdrop-blur-xs">
                      {hero.titleBadgeHi}
                    </span>
                    <button
                      onClick={(e) => handleLikeHero(e, hero.id)}
                      className={`p-1.5 rounded-full transition-all ${
                        isLiked ? 'bg-rose-500 text-white' : 'bg-slate-900/40 text-white hover:bg-slate-900/60'
                      }`}
                      title="Like"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Hero Portrait Photo & Name in Header */}
                  <div className="mt-2.5 flex items-center gap-3 relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md shrink-0 bg-slate-900">
                      <img
                        src={hero.image}
                        alt={hero.nameEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-amber-200 font-bold truncate">{isHi ? `बचपन: ${hero.childhoodNameHi}` : `Childhood: ${hero.childhoodNameEn}`}</p>
                      <h3 className="text-base font-black text-white drop-shadow-xs leading-tight truncate">{isHi ? hero.nameHi : hero.nameEn}</h3>
                      <p className="text-[10px] text-pink-100 font-semibold opacity-90 truncate">📍 {isHi ? hero.eraHi : hero.eraEn}</p>
                    </div>
                  </div>
                </div>

                {/* Hero Summary & Key Trait */}
                <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
                      <p className="font-bold text-amber-900 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="text-[11px]">{isHi ? 'बचपन का मुख्य गुण:' : 'Childhood Virtue:'}</span>
                      </p>
                      <p className="text-slate-800 font-semibold mt-0.5 text-xs">{isHi ? hero.childhoodKeyTraitHi : hero.childhoodKeyTraitEn}</p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">
                      {isHi ? hero.shortSummaryHi : hero.shortSummaryEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 text-[11px]">
                      💡 {isHi ? 'जीवन सीख' : 'Life Moral'}
                    </span>
                    <span className="font-black text-pink-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-xs">
                      {isHi ? 'पूरी कहानी' : 'Read Story'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. HERO FULL STORY MODAL WITH PHOTO & NOTES */}
      {selectedHero && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border-2 border-pink-400 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 bg-gradient-to-r ${selectedHero.heroColor || 'from-pink-600 to-amber-600'} text-white relative overflow-hidden`}>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg shrink-0 bg-slate-900">
                    <img
                      src={selectedHero.image}
                      alt={selectedHero.nameEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/50 text-amber-300 text-[10px] font-black backdrop-blur-xs">
                      {selectedHero.titleBadgeHi}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                      {isHi ? selectedHero.nameHi : selectedHero.nameEn}
                    </h3>
                    <p className="text-xs text-amber-200 font-bold">
                      {isHi ? `बचपन: ${selectedHero.childhoodNameHi}` : `Childhood: ${selectedHero.childhoodNameEn}`} • 📍 {isHi ? selectedHero.eraHi : selectedHero.eraEn}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    stopSpeech();
                    setIsSpeaking(false);
                    setSelectedHero(null);
                  }}
                  className="p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-all shrink-0 cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-3.5">
              
              {/* Audio & Trait Bar */}
              <div className="flex items-center justify-between gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-900 text-[11px]">{isHi ? 'बचपन का विशेष गुण:' : 'Key Virtue:'}</p>
                  <p className="font-black text-slate-800 text-xs">{isHi ? selectedHero.childhoodKeyTraitHi : selectedHero.childhoodKeyTraitEn}</p>
                </div>
                <button
                  onClick={() => handleSpeakText(isHi ? `${selectedHero.nameHi} का प्रेरक बचपन। ${selectedHero.childhoodStoryHi} सीख: ${selectedHero.moralLessonHi}` : `${selectedHero.nameEn}'s childhood story.`)}
                  className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? (isHi ? 'रोकें' : 'Stop') : (isHi ? 'कहानी सुनें' : 'Listen')}</span>
                </button>
              </div>

              {/* Full Childhood Story */}
              <div className="space-y-1.5">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-pink-600" />
                  <span>{isHi ? 'बचपन की प्रेरक दास्तान' : 'Childhood Tale'}</span>
                </h4>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line space-y-2">
                  {isHi ? selectedHero.childhoodStoryHi : selectedHero.childhoodStoryEn}
                </div>
              </div>

              {/* Moral Lesson Banner */}
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl space-y-0.5 text-xs">
                <p className="font-black text-emerald-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isHi ? 'अनमोल सीख (Moral):' : 'Moral Lesson:'}</span>
                </p>
                <p className="text-slate-800 font-bold leading-snug">
                  {isHi ? selectedHero.moralLessonHi : selectedHero.moralLessonEn}
                </p>
              </div>

              {/* Famous Quote */}
              <div className="p-2.5 bg-pink-50 border border-pink-200 rounded-xl text-xs space-y-0.5">
                <p className="font-black text-pink-900 flex items-center gap-1 text-[11px]">
                  <Quote className="w-3 h-3 text-pink-600" />
                  <span>{isHi ? 'महान विचार:' : 'Quote:'}</span>
                </p>
                <p className="text-slate-900 font-black italic text-xs">
                  {isHi ? selectedHero.famousQuoteHi : selectedHero.famousQuoteEn}
                </p>
              </div>

              {/* Key Facts / Notes Grid */}
              {selectedHero.keyFacts && selectedHero.keyFacts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedHero.keyFacts.map((fact, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                      <p className="font-black text-slate-900 text-xs">{isHi ? fact.titleHi : fact.titleEn}</p>
                      <p className="text-slate-600 font-medium text-[11px] leading-tight">{isHi ? fact.descHi : fact.descEn}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Story Completion / Positive Reinforcement Button */}
              <div className="pt-1 flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (soundEnabled) playSuccessSound();
                    if (!completedHeroIds.includes(selectedHero.id)) {
                      setCompletedHeroIds((prev) => [...prev, selectedHero.id]);
                    }
                    triggerStoryCompleteConfetti();
                  }}
                  className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                    completedHeroIds.includes(selectedHero.id)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-700 hover:to-amber-600 text-white animate-pulse'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>
                    {completedHeroIds.includes(selectedHero.id)
                      ? (isHi ? '✅ मैंने यह प्रेरक गाथा पूरी पढ़ ली! शाबाश!' : '✅ Completed Reading! Great Job!')
                      : (isHi ? '🎉 मैंने यह प्रेरक गाथा पूरी पढ़ ली!' : '🎉 I Finished Reading This Story!')}
                  </span>
                </button>

                <button
                  onClick={() => {
                    stopSpeech();
                    setIsSpeaking(false);
                    setSelectedHero(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs sm:text-sm hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {isHi ? 'बंद करें (Close)' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
