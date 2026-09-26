import React, { useState } from 'react';
import {
  ActiveTab,
  Story,
  Language,
  FunFact,
  LearningItem,
  AudioStory,
  UserReview
} from '../types';
import {
  BookOpen,
  Sparkles,
  Lightbulb,
  Headphones,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  Play,
  Heart,
  Volume2,
  Users,
  CheckCircle2,
  Download,
  Send,
  ChevronRight,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { UserReviewsSection } from './UserReviewsSection';

interface WebsiteHomeProps {
  onNavigate: (tab: ActiveTab) => void;
  stories: Story[];
  facts: FunFact[];
  learningItems: LearningItem[];
  audioStories: AudioStory[];
  language: Language;
  soundEnabled: boolean;
  onOpenAdmin: () => void;
  onSelectStory?: (story: Story) => void;
  onOpenSearch?: (query?: string) => void;
  reviews?: UserReview[];
  onAddReview?: (review: Omit<UserReview, 'id' | 'date'>) => void;
}

export const WebsiteHome: React.FC<WebsiteHomeProps> = ({
  onNavigate,
  stories,
  facts,
  learningItems,
  audioStories,
  language,
  soundEnabled,
  onOpenAdmin,
  onSelectStory,
  onOpenSearch,
  reviews = [],
  onAddReview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeInteractiveLetter, setActiveInteractiveLetter] = useState<string>('अ');

  // Highlights
  const featuredStory = stories.find((s) => s.isFeatured) || stories[0];
  const newUploads = stories.slice(0, 4);
  const topFacts = facts.slice(0, 3);
  const topAudio = audioStories.slice(0, 3);

  const sampleLetters = [
    { symbol: 'अ', name: 'अनार (Pomegranate)', color: 'bg-rose-500 text-white', sound: 'uh' },
    { symbol: 'आ', name: 'आम (Mango)', color: 'bg-amber-500 text-white', sound: 'aa' },
    { symbol: 'इ', name: 'इमली (Tamarind)', color: 'bg-emerald-500 text-white', sound: 'i' },
    { symbol: 'ई', name: 'ईख (Sugarcane)', color: 'bg-teal-500 text-white', sound: 'ee' },
    { symbol: 'उ', name: 'उल्लू (Owl)', color: 'bg-blue-500 text-white', sound: 'u' },
    { symbol: 'A', name: 'Apple (सेब)', color: 'bg-red-500 text-white', sound: 'ey' },
    { symbol: 'B', name: 'Butterfly (तितली)', color: 'bg-indigo-500 text-white', sound: 'bee' },
    { symbol: 'C', name: 'Cat (बिल्ली)', color: 'bg-purple-500 text-white', sound: 'see' },
  ];

  // 8 Colorful Banner Categories with large titles, clear badges, and big open buttons
  // Exactly 6 Core Clean Categories with Distinct Colors and Individual Button Themes
  const categoryBanners = [
    {
      id: 'stories',
      titleHi: '1. कहानियाँ',
      titleEn: '1. Stories',
      badgeHi: '500+ कहानियाँ',
      badgeEn: '500+ Stories',
      emoji: '📚',
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      border: 'border-amber-300',
      btnGradient: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
      subtextHi: 'पंचतंत्र, प्रेरणादायक व नैतिक कथाएँ',
      subtextEn: 'Panchatantra & Moral Tales',
      tab: 'stories' as ActiveTab,
    },
    {
      id: 'facts',
      titleHi: '2. रोचक तथ्य',
      titleEn: '2. Rochak Tathya',
      badgeHi: 'दैनिक ज्ञान',
      badgeEn: 'Daily Facts',
      emoji: '💡',
      gradient: 'from-sky-500 via-blue-500 to-indigo-600',
      border: 'border-sky-300',
      btnGradient: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
      subtextHi: 'अंतरिक्ष, विज्ञान व पशु-पक्षी',
      subtextEn: 'Space, Science & Nature',
      tab: 'facts' as ActiveTab,
    },
    {
      id: 'learning',
      titleHi: '3. अक्षर व ज्ञान',
      titleEn: '3. Learning',
      badgeHi: 'अ से ज्ञ / ABC',
      badgeEn: 'Varnamala & ABC',
      emoji: '🔤',
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      border: 'border-emerald-300',
      btnGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      subtextHi: 'वर्णमाला, गिनती व Phonics',
      subtextEn: 'Hindi Varnamala & Phonics',
      tab: 'learning' as ActiveTab,
    },
    {
      id: 'audio',
      titleHi: '4. ऑडियो कहानियाँ',
      titleEn: '4. Audio Stories',
      badgeHi: 'कभी भी सुनें',
      badgeEn: 'Listen 24/7',
      emoji: '🎧',
      gradient: 'from-purple-500 via-violet-500 to-indigo-600',
      border: 'border-purple-300',
      btnGradient: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
      subtextHi: 'शांत आवाज़ व मधुर संगीत में',
      subtextEn: 'Calm Voice & Night Music',
      tab: 'audio' as ActiveTab,
    },
    {
      id: 'quizzes',
      titleHi: '5. 5-Q बाल क्विज़',
      titleEn: '5. Kids Quiz',
      badgeHi: '🎯 खेलें व सीखें',
      badgeEn: '🎯 5-Q Games',
      emoji: '🏆',
      gradient: 'from-rose-500 via-pink-500 to-rose-600',
      border: 'border-rose-300',
      btnGradient: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
      subtextHi: 'ज्ञानवर्धक प्रश्नोत्तरी खेल',
      subtextEn: 'Fun 5-Question Quizzes',
      tab: 'quizzes' as ActiveTab,
    },
    {
      id: 'videos',
      titleHi: '6. वीडियो कहानियाँ (9:16)',
      titleEn: '6. Video Stories (9:16)',
      badgeHi: '🎬 Shorts & Videos',
      badgeEn: '🎬 Shorts & Videos',
      emoji: '📱',
      gradient: 'from-red-500 via-rose-500 to-amber-600',
      border: 'border-red-300',
      btnGradient: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
      subtextHi: 'रोमांचक 9:16 वीडियो व शॉर्ट्स',
      subtextEn: 'Exciting 9:16 Video Stories & Shorts',
      tab: 'videos' as ActiveTab,
    },
    {
      id: 'coloring',
      titleHi: '7. कलरिंग बुक',
      titleEn: '7. Coloring Book',
      badgeHi: '🎨 डिजिटल आर्ट',
      badgeEn: '🎨 Digital Art',
      emoji: '🎨',
      gradient: 'from-amber-400 via-orange-400 to-rose-500',
      border: 'border-orange-300',
      btnGradient: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
      subtextHi: 'जानवरों व दृश्यों में रंग भरो',
      subtextEn: 'Draw & Color Animal Sketches',
      tab: 'coloring' as ActiveTab,
    },
    {
      id: 'games',
      titleHi: '8. मिनी गेम्स ज़ोन',
      titleEn: '8. Mini Games',
      badgeHi: '🧩 खेलें व जीतें',
      badgeEn: '🧩 Memory & Puzzle',
      emoji: '🎮',
      gradient: 'from-purple-500 via-indigo-500 to-rose-500',
      border: 'border-purple-300',
      btnGradient: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
      subtextHi: 'मेमोरी मैच व चित्र पहेली गेम',
      subtextEn: 'Memory Match & Jigsaw Puzzles',
      tab: 'games' as ActiveTab,
    },
    {
      id: 'certificates',
      titleHi: '9. बाल पाठक प्रमाण पत्र',
      titleEn: '9. Star Certificates',
      badgeHi: '🏆 सम्मान पत्र',
      badgeEn: '🏆 Certificate',
      emoji: '🎖️',
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      border: 'border-amber-300',
      btnGradient: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700',
      subtextHi: 'नाम दर्ज कर 1-क्लिक डाउनलोड करें',
      subtextEn: 'Generate & Print Child Certificate',
      tab: 'certificates' as ActiveTab,
    },
    {
      id: 'worksheets',
      titleHi: '10. फ्री डाउनलोड PDF',
      titleEn: '10. Free Download',
      badgeHi: '🖨️ प्रिंटेबल',
      badgeEn: '🖨️ Printable',
      emoji: '📄',
      gradient: 'from-teal-500 via-cyan-500 to-blue-600',
      border: 'border-teal-300',
      btnGradient: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700',
      subtextHi: 'वर्णमाला ट्रेसिंग व एक्टिविटी शीट्स',
      subtextEn: 'Coloring & Activity Sheets',
      tab: 'worksheets' as ActiveTab,
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) playPopSound();
    if (onOpenSearch) {
      onOpenSearch(searchQuery);
    } else {
      onNavigate('stories');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    if (soundEnabled) playSuccessSound();
    setIsSubscribed(true);
  };

  const handleStoryCardClick = (story: Story) => {
    if (soundEnabled) playPopSound();
    if (onSelectStory) {
      onSelectStory(story);
    } else {
      onNavigate('stories');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-8 font-sans selection:bg-amber-200 overflow-x-hidden">
      
      {/* 1. COMPREHENSIVE GLOBAL SEARCH BAR */}
      <section className="space-y-2.5">
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-3 sm:p-4 shadow-md border-2 border-amber-300">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto space-y-2">
            <div className="relative flex items-center bg-white rounded-2xl p-1 sm:p-1.5 shadow-sm border-2 border-white/70 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-200 transition-all">
              <Search className="w-5 h-5 text-amber-600 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'पूरी वेबसाइट में खोजें — कहानी, वीडियो, PDF वर्कशीट, खेल...'
                    : 'Search entire website — stories, videos, PDF worksheets, games...'
                }
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none placeholder:text-slate-400 bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-4 sm:px-5 py-2 rounded-xl bg-amber-950 hover:bg-black text-white font-black text-xs transition-transform shadow-xs shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>{language === 'hi' ? 'खोजें' : 'Search'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Filter Tags right inside the search bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
              <span className="text-[11px] font-black text-amber-950 shrink-0">
                {language === 'hi' ? 'त्वरित खोज:' : 'Quick search:'}
              </span>
              {[
                { label: language === 'hi' ? '📖 कहानियाँ' : '📖 Stories', query: 'कहानी' },
                { label: language === 'hi' ? '🎬 वीडियो (9:16)' : '🎬 Videos', query: 'video' },
                { label: language === 'hi' ? '📄 PDF वर्कशीट्स' : '📄 PDF Worksheets', query: 'pdf' },
                { label: language === 'hi' ? '🎮 बाल गेम्स' : '🎮 Kids Games', query: 'game' },
                { label: language === 'hi' ? '🔤 वर्णमाला' : '🔤 Alphabet', query: 'varnamala' },
                { label: language === 'hi' ? '💡 रोचक तथ्य' : '💡 Fun Facts', query: 'facts' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    if (onOpenSearch) onOpenSearch(chip.query);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/40 hover:bg-white text-amber-950 font-black text-[11px] transition-all shrink-0 cursor-pointer shadow-2xs border border-white/50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* 2. VIBRANT COLORFUL 6 CORE CATEGORY CARDS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">🎨</span>
            <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'रंग-बिरंगी बाल श्रेणियाँ (All Categories)' : 'Explore All Categories'}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            {language === 'hi' ? 'सीधे अपनी पसंदीदा श्रेणी खोलें' : 'Tap to open any category'}
          </span>
        </div>

        {/* 6 Category Cards with Distinct Color Theme & Matching Individual Button Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {categoryBanners.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (soundEnabled) playPopSound();
                onNavigate(cat.tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-lg transition-all border ${cat.border} bg-white flex flex-col justify-between group`}
            >
              {/* Colorful Gradient Header Banner with Emoji, Badge & Full Uncut Title */}
              <div className={`bg-gradient-to-br ${cat.gradient} p-3.5 sm:p-4 text-white flex flex-col justify-between min-h-[95px] sm:min-h-[110px]`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center text-xl sm:text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-xs text-[10px] sm:text-xs font-black uppercase tracking-wider text-white border border-white/20 shrink-0">
                    {language === 'hi' ? cat.badgeHi : cat.badgeEn}
                  </span>
                </div>
                
                <div className="mt-2.5 space-y-0.5">
                  <h3 className="font-black text-sm sm:text-base md:text-lg text-white leading-tight tracking-tight drop-shadow-xs">
                    {language === 'hi' ? cat.titleHi : cat.titleEn}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-white/90 font-medium truncate">
                    {language === 'hi' ? cat.subtextHi : cat.subtextEn}
                  </p>
                </div>
              </div>

              {/* Card Body with Individually Color-Matched Open Button */}
              <div className="p-2.5 sm:p-3 bg-white border-t border-slate-100 flex-1 flex flex-col justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (soundEnabled) playPopSound();
                    onNavigate(cat.tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full py-2.5 sm:py-3 px-3 rounded-xl ${cat.btnGradient} text-white font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 transition-all cursor-pointer`}
                >
                  <span>{language === 'hi' ? 'खोलें (Open)' : 'Open'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FUN FACTS (DID YOU KNOW / ROCHAK TATHYA) SPOTLIGHT - RIGHT UNDER CATEGORIES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center text-sm shadow-xs">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {language === 'hi' ? '💡 क्या आप जानते हैं? (Did You Know?)' : '💡 Did You Know? (Fun Facts)'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate('facts')}
            className="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 font-black text-xs transition-colors flex items-center gap-1 shrink-0 border border-sky-300 shadow-2xs cursor-pointer"
          >
            <span>{language === 'hi' ? 'सभी तथ्य' : 'All Facts'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5">
          {topFacts.map((fact) => (
            <div
              key={fact.id}
              onClick={() => onNavigate('facts')}
              className="bg-sky-50/70 rounded-xl p-3 border border-sky-200 shadow-2xs hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{fact.emoji}</span>
                  <span className="px-2 py-0.2 rounded-full bg-sky-200 text-sky-900 text-[9px] font-black uppercase">
                    {fact.category}
                  </span>
                </div>

                <h3 className="font-black text-xs sm:text-sm text-slate-900 truncate">
                  {language === 'hi' ? fact.titleHi : fact.titleEn}
                </h3>

                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {language === 'hi' ? fact.factHi : fact.factEn}
                </p>
              </div>

              <div className="pt-1.5 border-t border-sky-200/80 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span className="flex items-center gap-1 text-rose-500">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  <span>{fact.likes} पसंद</span>
                </span>
                <span className="text-sky-700 font-extrabold">पढ़ें →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED STORIES CATALOG SHOWCASE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {language === 'hi' ? 'आज की चुनिंदा बाल कहानियाँ' : 'Featured Storybooks'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">
                सचित्र 2D कहानियाँ और जीवन की प्रेरक सीख
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('stories')}
            className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs transition-colors flex items-center gap-1.5 shrink-0 border border-amber-300 shadow-2xs active:scale-95 cursor-pointer"
          >
            <span>{language === 'hi' ? 'सभी 500+ कहानियाँ' : 'All Stories'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {newUploads.map((story) => (
            <motion.div
              key={story.id}
              whileHover={{ y: -2 }}
              onClick={() => handleStoryCardClick(story)}
              className="bg-white rounded-xl overflow-hidden border border-amber-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={story.coverImage}
                  alt={story.titleHi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5">
                  <span className="px-1.5 py-0.2 rounded bg-black/70 backdrop-blur-xs text-white text-[8px] font-black">
                    #{story.number}
                  </span>
                </div>
                <div className="absolute top-1.5 right-1.5">
                  <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[8px] font-bold">
                    {story.readTime}
                  </span>
                </div>
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                    {language === 'hi' ? story.titleHi : story.titleEn}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 font-serif">
                    {language === 'hi' ? story.summaryHi : story.summaryEn}
                  </p>
                </div>

                <div className="pt-1.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-800 truncate max-w-[100px] sm:max-w-[120px]">
                    💡 {language === 'hi' ? story.moralHi : story.moralEn}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] flex items-center gap-1 shrink-0 shadow-2xs">
                    <span>पढ़ें</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE EARLY LEARNING SPOTLIGHT */}
      <section className="bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white rounded-2xl p-3.5 sm:p-5 shadow-sm border-2 border-emerald-300 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-white/20 text-white font-extrabold text-[9px]">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>{language === 'hi' ? 'प्रारंभिक बाल विकास' : 'Early Learning Zone'}</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white">
              {language === 'hi' ? '🔤 अक्षर, वर्णमाला और बोलकर सीखना' : 'Learn Letters, Phonics & Numbers'}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('learning')}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-emerald-950 font-black text-xs transition-colors shadow-2xs shrink-0 flex items-center gap-1 self-start sm:self-auto active:scale-95 cursor-pointer"
          >
            <span>{language === 'hi' ? 'लर्निंग ज़ोन खोलें' : 'Open Learning Hub'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Interactive Letter Blocks */}
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {sampleLetters.map((item) => {
            const isSelected = activeInteractiveLetter === item.symbol;
            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setActiveInteractiveLetter(item.symbol);
                }}
                className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-emerald-950 shadow-md ring-2 ring-yellow-300'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                }`}
              >
                <span className="text-lg sm:text-xl font-black">{item.symbol}</span>
                <span className={`text-[8px] font-bold truncate w-full text-center ${isSelected ? 'text-emerald-900' : 'text-emerald-100'}`}>
                  {item.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Explanation Box */}
        <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-white font-bold text-[11px]">
            <span>📢</span>
            <span>
              {language === 'hi'
                ? `चयनित अक्षर: '${activeInteractiveLetter}' • बालवार्ता Phonics`
                : `Selected: '${activeInteractiveLetter}' • Baalvarta Phonics`}
            </span>
          </div>

          <button
            onClick={() => onNavigate('parent-guide')}
            className="px-2.5 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-black text-[11px] transition-colors shrink-0 shadow-2xs cursor-pointer"
          >
            {language === 'hi' ? 'वर्कशीट डाउनलोड करें ↓' : 'Download Worksheet ↓'}
          </button>
        </div>
      </section>



      {/* 6. AUDIO STORIES & PRINTABLE CORNER */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Audio Stories (Listen Anytime) */}
        <div className="bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white rounded-2xl p-4 sm:p-6 space-y-3.5 shadow-sm border border-purple-500">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/80 text-purple-100 text-xs font-black border border-purple-400/40">
              <Headphones className="w-4 h-4 text-purple-200" />
              <span>{language === 'hi' ? 'मनपसंद ऑडियो कहानियाँ' : 'Audio Stories Corner'}</span>
            </div>
            <span className="text-[11px] text-purple-200 font-bold">
              {language === 'hi' ? 'जब चाहें सुनें • 24/7' : 'Listen Anytime'}
            </span>
          </div>

          <div className="space-y-2">
            {topAudio.map((track) => (
              <div
                key={track.id}
                onClick={() => onNavigate('audio')}
                className="p-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-900 border border-purple-600/50 transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-white truncate max-w-[200px]">
                      {language === 'hi' ? track.titleHi : track.titleEn}
                    </p>
                    <p className="text-[10px] text-purple-300">
                      {track.narrator} • {track.duration}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-black shrink-0 transition-colors">
                  Play
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('audio')}
            className="w-full py-3 px-4 rounded-xl bg-purple-400 hover:bg-purple-300 text-purple-950 font-black text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{language === 'hi' ? 'सभी ऑडियो कहानियाँ खोलें' : 'View Full Audio Library'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Parent Guide & Free PDF Worksheets */}
        <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-amber-100 rounded-2xl p-4 sm:p-6 border-2 border-amber-300 shadow-sm flex flex-col justify-between space-y-3.5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-black">
              <Download className="w-4 h-4 text-amber-800" />
              <span>{language === 'hi' ? 'मुफ्त डाउनलोड केंद्र' : 'Free Download Center'}</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {language === 'hi'
                ? 'मुफ्त प्रिंटेबल एक्टिविटी वर्कशीट्स व कलरिंग शीट्स'
                : 'Free Printable Activity Sheets & Coloring PDFs'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {language === 'hi'
                ? 'बच्चों के लिए वर्णमाला ट्रेसिंग, रंग भरने की शीट्स और अच्छी आदतों का चार्ट मुफ्त में डाउनलोड करें।'
                : 'Download handwriting worksheets, coloring activities, and daily good habits charts for kids.'}
            </p>
          </div>

          <button
            onClick={() => {
              onNavigate('parent-guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3 px-4 rounded-xl bg-amber-950 hover:bg-black text-white font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'मुफ्त वर्कशीट्स डाउनलोड करें' : 'Download Free Worksheets'}</span>
          </button>
        </div>

      </section>

      {/* 7. USER REVIEWS & FEEDBACK SECTION */}
      {onAddReview && (
        <UserReviewsSection
          reviews={reviews}
          onAddReview={onAddReview}
          language={language}
          soundEnabled={soundEnabled}
        />
      )}

      {/* NEWSLETTER SUBSCRIPTION */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 sm:p-6 text-white shadow-sm relative overflow-hidden">
        <div className="max-w-xl mx-auto text-center space-y-2 relative z-10">
          <h2 className="text-base sm:text-lg font-black text-white">
            {language === 'hi'
              ? '📬 हर रविवार बच्चों के लिए नई नैतिक कहानी!'
              : '📬 Get Weekly Moral Stories & Activity Sheets'}
          </h2>

          <p className="text-xs text-amber-100">
            {language === 'hi'
              ? 'बालवार्ता न्यूज़लेटर से जुड़ें। सीधे अपने ईमेल पर नई कहानियाँ और प्रिंटेबल शीट्स प्राप्त करें।'
              : 'Join parents receiving fresh illustrated stories, parenting tips, and weekend coloring pages.'}
          </p>

          {isSubscribed ? (
            <div className="p-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'hi'
                  ? '🎉 बधाई! आप बालवार्ता परिवार से जुड़ चुके हैं।'
                  : '🎉 Thank you for subscribing to Baalvarta!'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-0.5">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={language === 'hi' ? 'अपना ईमेल दर्ज करें...' : 'Enter parent email address...'}
                className="flex-1 px-3 py-2 rounded-xl bg-white text-slate-800 text-xs font-semibold focus:outline-none shadow-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs transition-colors shadow-xs shrink-0 flex items-center justify-center gap-1"
              >
                <span>{language === 'hi' ? 'सब्सक्राइब करें' : 'Subscribe Free'}</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
