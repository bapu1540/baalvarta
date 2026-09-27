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

interface StoriesHubProps {
  stories: Story[];
  language: Language;
  soundEnabled: boolean;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onLikeStory: (id: string) => void;
  showBookmarksOnly: boolean;
  onResetFilter: () => void;
  initialStory?: Story | null;
  onClearInitialStory?: () => void;
  onWatchVideo?: (category?: string, title?: string) => void;
}

export const StoriesHub: React.FC<StoriesHubProps> = ({
  stories,
  language,
  soundEnabled,
  bookmarks,
  onToggleBookmark,
  onLikeStory,
  showBookmarksOnly,
  onResetFilter,
  initialStory,
  onClearInitialStory,
  onWatchVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStory, setActiveStory] = useState<Story | null>(initialStory || null);

  // Sync initialStory when changed
  useEffect(() => {
    if (initialStory) {
      setActiveStory(initialStory);
    }
  }, [initialStory]);

  const categories = [
    { id: 'all', labelHi: 'सभी कहानियाँ', labelEn: 'All Stories' },
    { id: 'moral', labelHi: 'प्रेरक सीख', labelEn: 'Moral Stories' },
    { id: 'wisdom', labelHi: 'सूझबूझ व अकल', labelEn: 'Wisdom Tales' },
    { id: 'panchatantra', labelHi: 'पंचतंत्र कथाएँ', labelEn: 'Panchatantra' },
    { id: 'animals', labelHi: 'पशु-पक्षी मित्र', labelEn: 'Animal Fables' },
  ];

  const filteredStories = stories.filter((story) => {
    if (showBookmarksOnly && !bookmarks.includes(story.id)) return false;
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
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Sleek Category Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-3.5 sm:p-4 border border-amber-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
            📚
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {language === 'hi' ? '1. बाल कहानियाँ (Kids Stories)' : '1. Kids Stories Hub'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'hi'
                ? `सचित्र बाल कथाएं, पंचतंत्र व ज्ञानवर्धक कहानियाँ`
                : `Illustrated kids stories, Panchatantra & fun tales`}
            </p>
          </div>
        </div>

        {/* Stories Count Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black">
            {language === 'hi' ? `${filteredStories.length} कहानियाँ` : `${filteredStories.length} Stories`}
          </span>
        </div>
      </div>

      {/* Categories & Filter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => {
                if (soundEnabled) playPopSound();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all active:scale-95 ${
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
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
            >
              {language === 'hi' ? 'सभी दिखाएं' : 'Show All'}
            </button>
          )}
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            {language === 'hi'
              ? `कुल ${filteredStories.length} कहानियाँ`
              : `${filteredStories.length} Stories`}
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
              ? 'कृपया दूसरा शीर्षक या क्रमांक खोजें अथवा सभी कहानियों का चयन करें।'
              : 'Try searching with a different keyword or resetting your filter.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              onResetFilter();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600"
          >
            {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedStories.map((story) => {
            const isBookmarked = bookmarks.includes(story.id);
            const isNewlyUploaded = Boolean(
              story.createdAt ||
              (typeof story.id === 'string' && story.id.includes('story-') && parseInt(story.id.replace(/\D/g, '')) > 1700000000000)
            );

            return (
              <div
                key={story.id}
                className="group bg-white rounded-3xl overflow-hidden border-2 border-amber-100 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-3">
                    {/* Top: Story Number Badge & Bookmark Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-black text-xs shadow-md">
                          #{story.number}
                        </span>
                        {isNewlyUploaded && (
                          <span className="px-2 py-0.5 rounded-xl bg-rose-500 text-white font-black text-[10px] shadow-sm animate-pulse">
                            🌟 नई कहानी
                          </span>
                        )}
                        {story.isFeatured && !isNewlyUploaded && (
                          <span className="px-2 py-0.5 rounded-xl bg-amber-400 text-amber-950 font-black text-[10px] shadow-sm">
                            ⭐ फीचर्ड
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
                        className={`p-1.5 rounded-xl backdrop-blur-md transition-colors ${
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

                    {/* Bottom overlay: Read Time and Age Group */}
                    <div className="flex items-center justify-between text-white text-[11px] font-bold">
                      <span className="bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                        ⏱️ {story.readTime}
                      </span>
                      <span className="bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-lg font-black">
                        {story.recommendedAge}
                      </span>
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
                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                        {story.category}
                      </span>
                      {story.isFeatured && (
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>विशेष</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base sm:text-lg group-hover:text-amber-600 transition-colors line-clamp-1">
                      {story.number}.{' '}
                      {language === 'hi' ? story.titleHi : story.titleEn}
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {language === 'hi' ? story.summaryHi : story.summaryEn}
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
                          const title = language === 'hi' ? story.titleHi : story.titleEn;
                          const msg = `📖 *बालवार्ता (Baalvarta) - ${title}*\n\n"${story.summaryHi}"\n\n✨ *कहानी की सीख:* ${story.moralHi}\n\n👇 बालवार्ता पर बच्चों के लिए यह सचित्र कहानी पढ़ें:\n${window.location.origin}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        title="WhatsApp पर शेयर करें"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      >
                        <span>📲</span>
                        <span className="hidden xs:inline">शेयर</span>
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

