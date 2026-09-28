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
import { playPopSound, playSuccessSound, speakText } from '../utils/soundEffects';
import {
  getDisplayStoryTitle,
  getDisplayStorySummary,
  getDisplayStoryMoral,
} from '../utils/storyLanguageHelper';
import { AdBannerSlot } from './AdBannerSlot';
import { UserReviewsSection } from './UserReviewsSection';

interface WebsiteHomeProps {
  onNavigate: (tab: ActiveTab, format?: 'all' | 'picture_book' | 'single_image') => void;
  stories: Story[];
  facts: FunFact[];
  learningItems: LearningItem[];
  audioStories: AudioStory[];
  language: Language;
  soundEnabled: boolean;
  onOpenAdmin: () => void;
  onSelectStory?: (story: Story) => void;
  onOpenSearch?: (query?: string) => void;
  onOpenProModal?: () => void;
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
  onOpenProModal,
  reviews = [],
  onAddReview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeInteractiveLetter, setActiveInteractiveLetter] = useState<string>('A');

  // Featured Storybooks Sorting: Ensure newly uploaded stories appear at the very top (beginning)
  const getStoryTimestamp = (s: Story): number => {
    if (s.createdAt) return s.createdAt;
    if (typeof s.id === 'string') {
      const match = s.id.match(/\d{10,}/);
      if (match) return parseInt(match[0], 10);
    }
    return (s.number || 0) * 1000;
  };

  const sortedByNewest = [...stories].sort((a, b) => getStoryTimestamp(b) - getStoryTimestamp(a));
  const singleFeaturedAudio = audioStories[0];

  // Compact ABC letters for sleek homepage banner
  const sampleLetters = [
    { symbol: 'A', name: 'Apple (सेब)', color: 'bg-rose-500 text-white', sound: 'Apple. A for Apple.' },
    { symbol: 'B', name: 'Ball (गेंद)', color: 'bg-indigo-500 text-white', sound: 'Ball. B for Ball.' },
    { symbol: 'C', name: 'Cat (बिल्ली)', color: 'bg-emerald-500 text-white', sound: 'Cat. C for Cat.' },
  ];

  // Colorful Core Categories in exact requested sequence:
  // 1. Stories, 2. Learning, 3. Fun fact, 4. General knowledge, 5. Audio stories, 
  // 6. Video stories, 7. Mini games, 8. Kids Quiz, 9. Colouring books, 10. Free download
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
      tab: 'stories' as ActiveTab,
    },
    {
      id: 'learning',
      titleHi: '2. सीखें',
      titleEn: '2. Learning',
      badgeHi: 'ABC 🔤',
      badgeEn: 'ABC 🔤',
      emoji: '🔤',
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      border: 'border-emerald-300',
      tab: 'learning' as ActiveTab,
    },
    {
      id: 'facts',
      titleHi: '3. रोचक तथ्य',
      titleEn: '3. Fun Facts',
      badgeHi: '💡 ज्ञान',
      badgeEn: '💡 Facts',
      emoji: '💡',
      gradient: 'from-sky-500 via-blue-500 to-indigo-600',
      border: 'border-sky-300',
      tab: 'facts' as ActiveTab,
    },
    {
      id: 'gk',
      titleHi: '4. सामान्य ज्ञान',
      titleEn: '4. General Knowledge',
      badgeHi: 'GK 🧠',
      badgeEn: 'GK 🧠',
      emoji: '🌍',
      gradient: 'from-indigo-500 via-blue-600 to-purple-700',
      border: 'border-indigo-300',
      tab: 'gk' as ActiveTab,
    },
    {
      id: 'audio',
      titleHi: '5. ऑडियो कहानियाँ',
      titleEn: '5. Audio Stories',
      badgeHi: '🎧 सुनें',
      badgeEn: '🎧 Audio',
      emoji: '🎧',
      gradient: 'from-purple-500 via-violet-500 to-indigo-600',
      border: 'border-purple-300',
      tab: 'audio' as ActiveTab,
    },
    {
      id: 'videos',
      titleHi: '6. वीडियो कहानियाँ',
      titleEn: '6. Video Stories',
      badgeHi: '🎬 Videos',
      badgeEn: '🎬 Videos',
      emoji: '📺',
      gradient: 'from-red-500 via-rose-500 to-amber-600',
      border: 'border-red-300',
      tab: 'videos' as ActiveTab,
    },
    {
      id: 'games',
      titleHi: '7. मिनी गेम्स',
      titleEn: '7. Mini Games',
      badgeHi: '🧩 खेलें',
      badgeEn: '🧩 Games',
      emoji: '🎮',
      gradient: 'from-purple-500 via-indigo-500 to-rose-500',
      border: 'border-purple-300',
      tab: 'games' as ActiveTab,
    },
    {
      id: 'quizzes',
      titleHi: '8. बाल क्विज़',
      titleEn: '8. Kids Quiz',
      badgeHi: '🎯 खेलें व सीखें',
      badgeEn: '🎯 5-Q Games',
      emoji: '🏆',
      gradient: 'from-rose-500 via-pink-500 to-rose-600',
      border: 'border-rose-300',
      tab: 'quizzes' as ActiveTab,
    },
    {
      id: 'coloring',
      titleHi: '9. कलरिंग बुक',
      titleEn: '9. Colouring Books',
      badgeHi: '🎨 डिजिटल आर्ट',
      badgeEn: '🎨 Digital Art',
      emoji: '🎨',
      gradient: 'from-amber-400 via-orange-400 to-rose-500',
      border: 'border-orange-300',
      tab: 'coloring' as ActiveTab,
    },
    {
      id: 'worksheets',
      titleHi: '10. फ्री डाउनलोड',
      titleEn: '10. Free Download',
      badgeHi: '🖨️ PDF + 🎖️',
      badgeEn: '🖨️ PDF + 🎖️',
      emoji: '📄',
      gradient: 'from-teal-500 via-cyan-500 to-blue-600',
      border: 'border-teal-300',
      tab: 'worksheets' as ActiveTab,
    },
  ];

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
    <div className="space-y-3 sm:space-y-4 pb-0 font-sans selection:bg-amber-200 overflow-x-hidden">
      
      {/* 1. VIBRANT COMPACT CATEGORY CARDS (1 TO 10 ORDER) */}
      <section className="space-y-2.5">
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

        {/* Category Cards Grid with Large Punchy Font and Compact Height */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {categoryBanners.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (soundEnabled) playPopSound();
                onNavigate(cat.tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer shadow-2xs hover:shadow-md transition-all border ${cat.border} bg-white flex flex-col justify-between group`}
            >
              {/* Colorful Gradient Header with Emoji, Badge & Large Bold Title */}
              <div className={`bg-gradient-to-br ${cat.gradient} p-2.5 sm:p-3 text-white flex flex-col justify-between min-h-[64px] sm:min-h-[72px]`}>
                <div className="flex items-center justify-between gap-1.5">
                  <span className="w-8 h-8 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center text-lg sm:text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-xs text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white border border-white/20 shrink-0">
                    {language === 'hi' ? cat.badgeHi : cat.badgeEn}
                  </span>
                </div>
                
                <div className="mt-1.5">
                  <h3 className="font-black text-sm sm:text-base md:text-lg text-white leading-tight tracking-tight drop-shadow-xs">
                    {language === 'hi' ? cat.titleHi : cat.titleEn}
                  </h3>
                </div>
              </div>

              {/* Compact Card Body with Color-Matched Open Button */}
              <div className="p-1.5 sm:p-2 bg-white border-t border-slate-100 flex-1 flex flex-col justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (soundEnabled) playPopSound();
                    onNavigate(cat.tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full py-1.5 sm:py-2 px-2.5 rounded-xl bg-gradient-to-r ${cat.gradient} text-white font-black text-xs shadow-2xs flex items-center justify-center gap-1.5 group-hover:scale-[1.02] active:scale-95 transition-all cursor-pointer`}
                >
                  <span>{language === 'hi' ? 'खोलें (Open)' : 'Open'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad Space Banner (AdSense & Partner Banner) */}
      <AdBannerSlot format="leaderboard" slotId="home-banner-top" />

      {/* 3. FUN FACTS SPOTLIGHT - SINGLE FEATURED FACT */}
      {facts.length > 0 && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center text-sm shadow-xs">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {language === 'hi' ? '💡 क्या आप जानते हैं? (Did You Know?)' : '💡 Did You Know? (Fun Fact)'}
                </h2>
              </div>
            </div>

            <button
              onClick={() => onNavigate('facts')}
              className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 font-black text-xs transition-colors flex items-center gap-1 shrink-0 border border-sky-200 shadow-2xs cursor-pointer active:scale-95"
            >
              <span>{language === 'hi' ? 'सभी रोचक तथ्य देखें' : 'View All Facts'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
            </button>
          </div>

          {/* Single Featured Fact Card */}
          {(() => {
            const singleFact = facts[0];
            return (
              <div
                onClick={() => onNavigate('facts')}
                className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-5 border border-sky-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform shrink-0 p-1 bg-white rounded-xl shadow-2xs">
                    {singleFact.emoji || '💡'}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-900 text-[10px] font-black uppercase tracking-wide">
                        {singleFact.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold">रोचक तथ्य</span>
                    </div>
                    <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                      {language === 'hi' ? singleFact.titleHi : singleFact.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                      {language === 'hi' ? singleFact.factHi : singleFact.factEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
                  <span className="px-3.5 py-2 rounded-xl bg-sky-600 group-hover:bg-sky-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors">
                    <span>{language === 'hi' ? 'अन्य तथ्य पढ़ें' : 'Read Facts'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* 4. FEATURED STORYBOOK SPOTLIGHT - SINGLE NEWEST STORY & 2 STORY CATEGORIES */}
      {stories.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {language === 'hi' ? 'आज की मुख्य बाल कहानी व श्रेणियाँ' : 'Featured Storybook & Categories'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigate('stories', 'picture_book')}
                className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-extrabold text-[11px] transition-colors flex items-center gap-1 border border-purple-200 shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>🎨 सचित्र कहानियाँ</span>
              </button>
              <button
                onClick={() => onNavigate('stories', 'single_image')}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-[11px] transition-colors flex items-center gap-1 border border-emerald-200 shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>🖼️ 1 इमेज कहानी</span>
              </button>
              <button
                onClick={() => onNavigate('stories', 'all')}
                className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-xs transition-colors flex items-center gap-1 shrink-0 border border-amber-200 shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>{language === 'hi' ? 'सभी 500+ कहानियाँ' : 'Browse All'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Quick 2 Story Category Launchers on Homepage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div
              onClick={() => {
                if (soundEnabled) playPopSound();
                onNavigate('stories', 'picture_book');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white cursor-pointer hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  🎨
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black truncate">
                    {language === 'hi' ? 'सचित्र कहानियाँ (Picture Stories)' : 'Picture Book Stories'}
                  </div>
                  <div className="text-[11px] text-purple-100 font-medium truncate">
                    {language === 'hi' ? 'हर दृश्य के चित्र, टेक्स्ट व स्लाइडर कथाएँ' : 'Scene-by-scene picture book stories'}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-white/20 text-white font-black text-xs shrink-0 ml-2">
                {stories.filter(s => s.format === 'picture_book' || (s.scenes && s.scenes.length > 1)).length} कथाएँ ➔
              </span>
            </div>

            <div
              onClick={() => {
                if (soundEnabled) playPopSound();
                onNavigate('stories', 'single_image');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white cursor-pointer hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  🖼️
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black truncate">
                    {language === 'hi' ? 'एक इमेज वाली कहानियाँ (Single Image)' : 'Single Image Classic Stories'}
                  </div>
                  <div className="text-[11px] text-emerald-100 font-medium truncate">
                    {language === 'hi' ? '1 मुख्य चित्र के साथ पूरी कहानी पढ़ने का अनुभव' : '1 Cover photo with full story text'}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-white/20 text-white font-black text-xs shrink-0 ml-2">
                {stories.filter(s => !(s.format === 'picture_book' || (s.scenes && s.scenes.length > 1))).length} कथाएँ ➔
              </span>
            </div>
          </div>

          {/* Single Newest Featured Story Card */}
          {(() => {
            const singleStory = sortedByNewest[0] || stories[0];
            return (
              <motion.div
                whileHover={{ y: -2 }}
                onClick={() => handleStoryCardClick(singleStory)}
                className="bg-white rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row group"
              >
                <div className="relative md:w-5/12 aspect-video md:aspect-auto overflow-hidden bg-slate-100 min-h-[160px]">
                  <img
                    src={singleStory.coverImage}
                    alt={getDisplayStoryTitle(singleStory, language)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-black">
                      #{singleStory.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black shadow-xs">
                      {language === 'hi' ? '🌟 नई कहानी' : '🌟 New Story'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black shadow-xs">
                      ⏱️ {singleStory.readTime}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 md:w-7/12 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                        {singleStory.category}
                      </span>
                      <span className="text-slate-400 font-bold">{language === 'hi' ? 'आयु:' : 'Age:'} {singleStory.recommendedAge}</span>
                    </div>

                    <h3 className="font-black text-base sm:text-xl text-slate-900 group-hover:text-amber-600 transition-colors">
                      {getDisplayStoryTitle(singleStory, language)}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 font-serif leading-relaxed line-clamp-2">
                      {getDisplayStorySummary(singleStory, language)}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-amber-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 truncate">
                      <span>💡 {language === 'hi' ? 'सीख:' : 'Moral:'}</span>
                      <span className="truncate">{getDisplayStoryMoral(singleStory, language)}</span>
                    </div>

                    <span className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-xs group-hover:scale-105 transition-all">
                      <span>{language === 'hi' ? 'पूरी कहानी पढ़ें' : 'Read Story'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* Additional Recent Stories Quick Strip */}
          {sortedByNewest.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
              {sortedByNewest.slice(1, 4).map((recentStory) => (
                <div
                  key={recentStory.id}
                  onClick={() => handleStoryCardClick(recentStory)}
                  className="p-2.5 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer flex items-center gap-2.5 group"
                >
                  <img
                    src={recentStory.coverImage}
                    alt={getDisplayStoryTitle(recentStory, language)}
                    className="w-14 h-11 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform bg-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-black text-[9px]">
                        #{recentStory.number}
                      </span>
                      <span className="text-slate-400 font-semibold truncate">{recentStory.category}</span>
                    </div>
                    <h4 className="font-black text-xs text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                      {getDisplayStoryTitle(recentStory, language)}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-serif truncate">
                      {getDisplayStorySummary(recentStory, language)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 5. INTERACTIVE EARLY LEARNING SPOTLIGHT (COMPACT A, B, C) */}
      <section className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-emerald-300/80 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center text-sm shadow-xs">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                {language === 'hi' ? '🔤 प्रारंभिक अक्षर ज्ञान (ABC Phonics)' : 'Early Learning & ABC Phonics'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate('learning')}
            className="px-3 py-1 rounded-xl bg-white hover:bg-amber-50 text-emerald-950 font-black text-xs transition-colors shadow-2xs shrink-0 flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <span>{language === 'hi' ? 'पूरा लर्निंग ज़ोन खोलें' : 'Open Learning Hub'}</span>
            <ArrowRight className="w-3 h-3 text-emerald-700" />
          </button>
        </div>

        {/* Compact ABC Blocks */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {sampleLetters.map((item) => {
            const isSelected = activeInteractiveLetter === item.symbol;
            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setActiveInteractiveLetter(item.symbol);
                  speakText(item.sound, 'en', 0.9);
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-emerald-950 shadow-md ring-2 ring-yellow-300 scale-[1.02]'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black">{item.symbol}</span>
                <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-900' : 'text-emerald-50'}`}>
                  {item.name}
                </span>
                <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-white/70'}`} />
              </button>
            );
          })}
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

          {singleFeaturedAudio && (
            <div
              onClick={() => onNavigate('audio')}
              className="p-3 rounded-xl bg-purple-900/60 hover:bg-purple-900 border border-purple-600/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm sm:text-base text-white truncate">
                    {language === 'hi' ? singleFeaturedAudio.titleHi : singleFeaturedAudio.titleEn}
                  </p>
                  <p className="text-xs text-purple-300 font-medium">
                    {singleFeaturedAudio.narrator} • ⏱️ {singleFeaturedAudio.duration}
                  </p>
                </div>
              </div>
              <span className="text-xs px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black shrink-0 transition-colors shadow-xs">
                {language === 'hi' ? 'सुनें 🎧' : 'Play'}
              </span>
            </div>
          )}

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

      {/* 6.5 BAALVARTA PRO VIP MEMBERSHIP SHOWCASE SECTION */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-7 text-white shadow-lg border-3 border-amber-300 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>{language === 'hi' ? 'विशेष बालवार्ता प्रो सदस्यता' : 'Special Baalvarta Pro VIP Pass'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {language === 'hi'
                ? 'रोजाना ₹1 से भी कम में — 100% Ad-Free व असीमित ज्ञान!'
                : '100% Ad-Free, Unlimited Worksheets & AI — Under ₹1/day!'}
            </h2>

            <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
              {language === 'hi'
                ? 'अपने बच्चे को दें बिना विज्ञापन का सुरक्षित माहौल, असीमित प्रिंटेबल वर्कशीट्स, ऑडियो कहानियाँ और AI बालमित्र का व्यक्तिगत साथ।'
                : 'Give your child safe ad-free learning, unlimited printable PDF worksheets, audio storybooks, and unlimited AI Baalmitra.'}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs font-bold text-amber-950">
              <span className="px-3 py-1 rounded-xl bg-white/90 shadow-2xs">🚫 100% Ad-Free</span>
              <span className="px-3 py-1 rounded-xl bg-white/90 shadow-2xs">
                {language === 'hi' ? '📥 असीमित PDF' : '📥 Unlimited PDF'}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/90 shadow-2xs">
                {language === 'hi' ? '🎧 ऑडियो बुक्स' : '🎧 Audio Books'}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/90 shadow-2xs">
                {language === 'hi' ? '🤖 AI बालमित्र' : '🤖 AI Baalmitra'}
              </span>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-slate-900 shadow-xl flex flex-col items-center text-center space-y-3 shrink-0 w-full sm:w-80">
            <div className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
              {language === 'hi' ? '👑 सबसे पसंदीदा योजना' : '👑 Most Popular Plan'}
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">
                {language === 'hi' ? 'वार्षिक VIP पास' : 'Annual VIP Pass'}
              </div>
              <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
                <span className="text-3xl font-black text-amber-600">₹299</span>
                <span className="text-sm font-bold text-slate-400 line-through">₹499</span>
                <span className="text-xs font-bold text-slate-600">/ {language === 'hi' ? 'साल' : 'year'}</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-600">
                {language === 'hi' ? 'केवल ₹24/माह (या ₹29/माह प्लान भी उपलब्ध)' : 'Only ~₹24/mo (₹29/mo also available)'}
              </div>
            </div>

            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                if (onOpenProModal) onOpenProModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'hi' ? 'अभी प्रो लें (₹29 से शुरू) 👑' : 'Get Pro (From ₹29) 👑'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
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

      {/* Footer Bottom Ad Banner & Sponsored Direct Ad Slot */}
      <AdBannerSlot format="banner" slotId="home-footer-bottom-ad" className="!my-1 sm:!my-2" />

    </div>
  );
};
