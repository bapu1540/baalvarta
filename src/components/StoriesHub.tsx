import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Volume2,
  Heart,
  Bookmark,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Story, Language } from '../types';
import { playPopSound } from '../utils/soundEffects';
import { StoryReaderPage } from './StoryReaderPage';
import { AdBannerSlot } from './AdBannerSlot';
import {
  getDisplayStoryTitle,
  getDisplayStorySummary,
  getDisplayStoryMoral,
} from '../utils/storyLanguageHelper';

interface StoriesHubProps {
  stories: Story[];
  language: Language;
  setLanguage?: (lang: Language) => void;
  soundEnabled: boolean;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onLikeStory: (id: string) => void;
  showBookmarksOnly: boolean;
  onResetFilter: () => void;
  initialStory?: Story | null;
  onClearInitialStory?: () => void;
  onWatchVideo?: (category?: string, title?: string) => void;
  initialFormat?: 'all' | 'picture_book' | 'single_image';
}

export const StoriesHub: React.FC<StoriesHubProps> = ({
  stories,
  language,
  setLanguage,
  soundEnabled,
  bookmarks,
  onToggleBookmark,
  onLikeStory,
  showBookmarksOnly,
  onResetFilter,
  initialStory,
  onClearInitialStory,
  onWatchVideo,
  initialFormat = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'picture_book' | 'single_image'>(initialFormat);
  const [activeStory, setActiveStory] = useState<Story | null>(initialStory || null);

  // Sync initialStory when changed
  useEffect(() => {
    if (initialStory) {
      setActiveStory(initialStory);
    }
  }, [initialStory]);

  useEffect(() => {
    if (initialFormat) {
      setSelectedFormat(initialFormat);
    }
  }, [initialFormat]);

  const categories = [
    { id: 'all', labelHi: 'सभी विषय', labelEn: 'All Topics' },
    { id: 'moral', labelHi: '🌟 प्रेरक सीख', labelEn: '🌟 Moral' },
    { id: 'wisdom', labelHi: '🧠 सूझबूझ व अकल', labelEn: '🧠 Wisdom' },
    { id: 'panchatantra', labelHi: '📜 पंचतंत्र कथाएँ', labelEn: '📜 Panchatantra' },
    { id: 'animals', labelHi: '🐾 पशु-पक्षी मित्र', labelEn: '🐾 Animal Fables' },
  ];

  const isStoryPictureBook = (s: Story) => {
    return s.format === 'picture_book' || (Boolean(s.scenes) && (s.scenes?.length || 0) > 1);
  };

  const pictureBooksCount = stories.filter(isStoryPictureBook).length;
  const singleImageCount = stories.filter((s) => !isStoryPictureBook(s)).length;

  const filteredStories = stories.filter((story) => {
    if (showBookmarksOnly && !bookmarks.includes(story.id)) return false;
    
    // Format filtering (Single image vs Picture book)
    const isPB = isStoryPictureBook(story);
    if (selectedFormat === 'picture_book' && !isPB) return false;
    if (selectedFormat === 'single_image' && isPB) return false;

    // Category filtering (Moral, Animals, Panchatantra, etc.)
    if (selectedCategory !== 'all' && story.category !== selectedCategory) return false;
    
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      story.titleHi.toLowerCase().includes(q) ||
      story.titleEn.toLowerCase().includes(q) ||
      story.number.toString() === q ||
      story.summaryHi.toLowerCase().includes(q) ||
      story.summaryEn.toLowerCase().includes(q) ||
      story.contentHi.toLowerCase().includes(q) ||
      story.contentEn.toLowerCase().includes(q) ||
      story.moralHi.toLowerCase().includes(q) ||
      story.moralEn.toLowerCase().includes(q) ||
      story.category.toLowerCase().includes(q) ||
      (story.scenes && story.scenes.some(s => s.textHi.toLowerCase().includes(q) || (s.textEn && s.textEn.toLowerCase().includes(q))))
    );
  });

  const getStoryTimestamp = (s: Story): number => {
    if (s.createdAt) return s.createdAt;
    if (typeof s.id === 'string') {
      const match = s.id.match(/\d{10,}/);
      if (match) return parseInt(match[0], 10);
    }
    return (s.number || 0) * 1000;
  };

  // Sort: Newly uploaded stories automatically appear at the very top (beginning)
  const sortedStories = [...filteredStories].sort((a, b) => {
    if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
      return a.isFeatured ? -1 : 1;
    }
    return getStoryTimestamp(b) - getStoryTimestamp(a);
  });

  const handleOpenStory = (story: Story) => {
    if (soundEnabled) playPopSound();
    setActiveStory(story);
  };

  const handleCloseStory = () => {
    if (soundEnabled) playPopSound();
    setActiveStory(null);
    if (onClearInitialStory) {
      onClearInitialStory();
    }
  };

  // IF A STORY IS ACTIVE, RENDER THE FULL-PAGE STORY READER!
  if (activeStory) {
    return (
      <StoryReaderPage
        story={activeStory}
        allStories={stories}
        language={language}
        soundEnabled={soundEnabled}
        isBookmarked={bookmarks.includes(activeStory.id)}
        onToggleBookmark={onToggleBookmark}
        onLikeStory={onLikeStory}
        onBack={handleCloseStory}
        onSelectStory={(s) => setActiveStory(s)}
        onWatchVideo={onWatchVideo}
        onLanguageChange={setLanguage}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Sleek Compact Category Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white rounded-2xl p-2.5 sm:p-3 border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg sm:text-xl shadow-xs shrink-0">
            📚
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
            {language === 'hi' ? '1. बाल कहानियाँ (Kids Stories)' : '1. Kids Stories Hub'}
          </h1>
        </div>

        {/* Stories Count Badge placed on the right side of title */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black flex items-center gap-1.5 whitespace-nowrap">
            <span>✨</span>
            <span>{language === 'hi' ? `${filteredStories.length} कहानियाँ` : `${filteredStories.length} Stories`}</span>
          </span>
        </div>
      </div>

      {/* TWO PRIMARY STORY FORMAT CATEGORIES (TWO SEPARATE SUB-MENUS) */}
      <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80 rounded-2xl p-3 sm:p-4 border border-amber-200/90 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1">
              <span>📂</span>
              <span>{language === 'hi' ? 'कहानी प्रकार चुनें (Stories Category Menu):' : 'Select Story Format Menu:'}</span>
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-lg border border-amber-200/60 hidden sm:inline">
            {language === 'hi' ? '2 मुख्य श्रेणियाँ' : '2 Core Categories'}
          </span>
        </div>

        {/* Primary 2-Category Format Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {/* Tab 1: All Stories */}
          <button
            type="button"
            id="format-btn-all"
            onClick={() => {
              if (soundEnabled) playPopSound();
              setSelectedFormat('all');
            }}
            className={`p-3 rounded-xl font-black text-xs sm:text-sm text-left transition-all border flex items-center justify-between cursor-pointer ${
              selectedFormat === 'all'
                ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-[1.01]'
                : 'bg-white hover:bg-amber-100/60 text-slate-700 border-amber-200/70'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg shrink-0">✨</span>
              <div className="min-w-0">
                <div className="font-extrabold truncate">
                  {language === 'hi' ? 'सभी कहानियाँ' : 'All Stories'}
                </div>
                <div className={`text-[10px] font-medium truncate ${selectedFormat === 'all' ? 'text-amber-100' : 'text-slate-400'}`}>
                  {language === 'hi' ? 'समस्त बाल कथा संग्रह' : 'Complete Collection'}
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black shrink-0 ${
                selectedFormat === 'all' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
              }`}
            >
              {stories.length}
            </span>
          </button>

          {/* Tab 2: Picture Book with Story (Multi-Scenes) */}
          <button
            type="button"
            id="format-btn-picture-book"
            onClick={() => {
              if (soundEnabled) playPopSound();
              setSelectedFormat('picture_book');
            }}
            className={`p-3 rounded-xl font-black text-xs sm:text-sm text-left transition-all border flex items-center justify-between cursor-pointer ${
              selectedFormat === 'picture_book'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-700 shadow-md scale-[1.01]'
                : 'bg-white hover:bg-purple-50 text-slate-700 border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg shrink-0">🎨</span>
              <div className="min-w-0">
                <div className="font-extrabold truncate flex items-center gap-1">
                  <span>{language === 'hi' ? 'सचित्र कहानियाँ' : 'Picture Stories'}</span>
                </div>
                <div className={`text-[10px] font-medium truncate ${selectedFormat === 'picture_book' ? 'text-purple-100' : 'text-purple-600 font-semibold'}`}>
                  {language === 'hi' ? 'हर दृश्य के रंगीन चित्र' : 'Picture with Story (Scenes)'}
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black shrink-0 ${
                selectedFormat === 'picture_book' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-900'
              }`}
            >
              {pictureBooksCount}
            </span>
          </button>

          {/* Tab 3: Single Image Story */}
          <button
            type="button"
            id="format-btn-single-image"
            onClick={() => {
              if (soundEnabled) playPopSound();
              setSelectedFormat('single_image');
            }}
            className={`p-3 rounded-xl font-black text-xs sm:text-sm text-left transition-all border flex items-center justify-between cursor-pointer ${
              selectedFormat === 'single_image'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-700 shadow-md scale-[1.01]'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg shrink-0">🖼️</span>
              <div className="min-w-0">
                <div className="font-extrabold truncate">
                  {language === 'hi' ? 'एक इमेज वाली कहानी' : 'Single Image Story'}
                </div>
                <div className={`text-[10px] font-medium truncate ${selectedFormat === 'single_image' ? 'text-emerald-100' : 'text-emerald-700 font-semibold'}`}>
                  {language === 'hi' ? '1 मुख्य चित्र व पूरी कहानी' : '1 Cover Photo + Full Story'}
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black shrink-0 ${
                selectedFormat === 'single_image' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {singleImageCount}
            </span>
          </button>
        </div>

        {/* Dynamic Category Helper Sub-Banner */}
        <div className="flex items-center justify-between gap-2.5 pt-1 text-xs">
          <div className="text-slate-700 font-medium flex items-center gap-1.5">
            {selectedFormat === 'picture_book' && (
              <span className="text-purple-900 bg-purple-100/80 px-2.5 py-1 rounded-lg font-bold border border-purple-200">
                🎨 {language === 'hi' ? 'सचित्र कहानियाँ: इनमें हर घटना/सीन के अलग-अलग चित्र और स्लाइडर हैं।' : 'Picture Books: Multiple scene pictures with interactive slide view.'}
              </span>
            )}
            {selectedFormat === 'single_image' && (
              <span className="text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
                🖼️ {language === 'hi' ? 'एक इमेज वाली कहानियाँ: इनमें 1 मुख्य कवर चित्र और एक साथ पूरी कहानी है।' : 'Single Image: Standard format with 1 main cover image and complete text.'}
              </span>
            )}
            {selectedFormat === 'all' && (
              <span className="text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg font-bold border border-amber-200">
                📚 {language === 'hi' ? 'सभी बाल कहानियाँ: सचित्र व एक इमेज वाली सभी कहानियों का संग्रह।' : 'All Kids Stories: Showing both picture books and single image stories.'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Topic Sub-Category Pills (प्रेरक सीख, सूझबूझ, पंचतंत्र, पशु-पक्षी) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => {
                if (soundEnabled) playPopSound();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all active:scale-95 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Bookmarks Toggle / Story Counter */}
        <div className="flex items-center gap-2">
          {showBookmarksOnly && (
            <button
              onClick={onResetFilter}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
            >
              {language === 'hi' ? 'सभी दिखाएं' : 'Show All'}
            </button>
          )}
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            {language === 'hi'
              ? `दिखाई गई कहानियाँ: ${filteredStories.length}`
              : `Showing: ${filteredStories.length}`}
          </span>
        </div>
      </div>

      {/* Ad Space Banner */}
      <AdBannerSlot format="leaderboard" slotId="stories-hub-banner" />

      {/* Story Cards Grid */}
      {sortedStories.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-amber-200 space-y-3">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-lg">
            {language === 'hi' ? 'कोई कहानी नहीं मिली' : 'No Stories Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'hi'
              ? 'कृपया दूसरा शीर्षक या क्रमांक खोजें अथवा सभी श्रेणियों का चयन करें।'
              : 'Try searching with a different keyword or resetting your filter.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedFormat('all');
              onResetFilter();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 cursor-pointer"
          >
            {language === 'hi' ? 'सभी फ़िल्टर हटाएं' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedStories.map((story) => {
            const isBookmarked = bookmarks.includes(story.id);
            const isPB = isStoryPictureBook(story);
            const isNewlyUploaded = Boolean(
              story.createdAt ||
              (typeof story.id === 'string' && story.id.includes('story-') && parseInt(story.id.replace(/\D/g, '')) > 1700000000000)
            );

            return (
              <div
                key={story.id}
                className={`group bg-white rounded-3xl overflow-hidden border-2 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isPB ? 'border-purple-100' : 'border-emerald-100'
                }`}
              >
                {/* Cover Image & Badges (Strict 16:9 Aspect Ratio) */}
                <div
                  className="relative aspect-video w-full overflow-hidden cursor-pointer bg-slate-100"
                  onClick={() => handleOpenStory(story)}
                >
                  <img
                    src={story.coverImage}
                    alt={story.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-between p-3">
                    {/* Top: Story Number Badge & Format Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-black text-xs shadow-md">
                          #{story.number}
                        </span>
                        {/* 2 DISTINCT FORMAT BADGES */}
                        {isPB ? (
                          <span className="px-2 py-0.5 rounded-xl bg-purple-600/90 text-white font-black text-[10px] shadow-sm backdrop-blur-xs flex items-center gap-1">
                            <span>🎨</span>
                            <span>{language === 'hi' ? `सचित्र (${story.scenes?.length || 3} दृश्य)` : 'Picture Book'}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-xl bg-emerald-600/90 text-white font-black text-[10px] shadow-sm backdrop-blur-xs flex items-center gap-1">
                            <span>🖼️</span>
                            <span>{language === 'hi' ? '1 इमेज कहानी' : 'Single Image'}</span>
                          </span>
                        )}
                        {isNewlyUploaded && (
                          <span className="px-2 py-0.5 rounded-xl bg-rose-500 text-white font-black text-[10px] shadow-sm animate-pulse">
                            {language === 'hi' ? '🌟 नई' : '🌟 New'}
                          </span>
                        )}
                      </div>
                      <button
                        id={`bookmark-btn-${story.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (soundEnabled) playPopSound();
                          onToggleBookmark(story.id);
                        }}
                        className={`p-1.5 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-500 text-white'
                            : 'bg-black/30 text-white hover:bg-black/50'
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div
                    className="space-y-1.5 cursor-pointer"
                    onClick={() => handleOpenStory(story)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 tracking-wider">
                          {story.category}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          isPB ? 'text-purple-700 bg-purple-50 border border-purple-200' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        }`}>
                          {isPB ? (language === 'hi' ? '🎨 सचित्र' : 'Picture Story') : (language === 'hi' ? '🖼️ 1 इमेज' : '1 Image')}
                        </span>
                      </div>
                      {story.isFeatured && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{language === 'hi' ? 'विशेष' : 'Featured'}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base sm:text-lg group-hover:text-amber-600 transition-colors line-clamp-1">
                      {story.number}.{' '}
                      {getDisplayStoryTitle(story, language)}
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {getDisplayStorySummary(story, language)}
                    </p>
                  </div>

                  {/* Actions: Read Now Button & Likes */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        id={`like-btn-${story.id}`}
                        onClick={() => {
                          if (soundEnabled) playPopSound();
                          onLikeStory(story.id);
                        }}
                        className="flex items-center gap-1 text-slate-500 hover:text-rose-500 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{story.likes}</span>
                      </button>

                      {/* 1-Click WhatsApp Share for Parents */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (soundEnabled) playPopSound();
                          const title = getDisplayStoryTitle(story, language);
                          const summary = getDisplayStorySummary(story, language);
                          const moral = getDisplayStoryMoral(story, language);
                          const moralLabel = language === 'hi' ? 'कहानी की सीख:' : 'Moral of the Story:';
                          const msg = `📖 *बालवार्ता (Baalvarta) - ${title}*\n\n"${summary}"\n\n✨ *${moralLabel}* ${moral}\n\n👇 बालवार्ता पर बच्चों के लिए यह सचित्र कहानी पढ़ें:\n${window.location.origin}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        title={language === 'hi' ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      >
                        <span>📲</span>
                        <span className="hidden xs:inline">{language === 'hi' ? 'शेयर' : 'Share'}</span>
                      </button>
                    </div>

                    <button
                      id={`read-story-btn-${story.id}`}
                      onClick={() => handleOpenStory(story)}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs sm:text-sm hover:from-amber-600 hover:to-amber-700 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <span>{language === 'hi' ? 'कहानी पढ़ें' : 'Read Story'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

