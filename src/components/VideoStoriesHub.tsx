import React, { useState } from 'react';
import { VideoStory, Language } from '../types';
import {
  Video,
  Play,
  ExternalLink,
  Search,
  Sparkles,
  Clock,
  Eye,
  Filter,
  Layers,
  LayoutList,
  LayoutGrid,
  Film
} from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

interface VideoStoriesHubProps {
  videos: VideoStory[];
  categories: string[];
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
}

export const VideoStoriesHub: React.FC<VideoStoriesHubProps> = ({
  videos,
  categories,
  language,
  soundEnabled,
  onBackToHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    if (selectedCategory !== 'all' && video.category !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      video.titleHi.toLowerCase().includes(q) ||
      video.titleEn.toLowerCase().includes(q) ||
      video.category.toLowerCase().includes(q) ||
      (video.descriptionHi && video.descriptionHi.toLowerCase().includes(q)) ||
      (video.descriptionEn && video.descriptionEn.toLowerCase().includes(q))
    );
  });

  const handleOpenVideo = (video: VideoStory) => {
    if (soundEnabled) playPopSound();
    // Directly open the YouTube video link in a new window/tab
    if (video.youtubeUrl) {
      window.open(video.youtubeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 sm:p-10 shadow-xl border-4 border-red-300/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-rose-100">
            <Film className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'बालवार्ता वीडियो हब' : 'Baalvarta Video Hub'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-xs">
            {language === 'hi'
              ? '🎬 सचित्र वीडियो कहानियाँ व 9:16 शॉर्ट्स'
              : '🎬 Animated Video Stories & 9:16 Shorts'}
          </h1>

          <p className="text-sm sm:text-base text-red-50 max-w-2xl font-medium leading-relaxed">
            {language === 'hi'
              ? 'यहाँ आप बालवार्ता की मनोरंजक और सीख देने वाली वीडियो कहानियाँ 9:16 आकार में देख सकते हैं। किसी भी कहानी पर क्लिक करें और वीडियो का आनंद लें!'
              : 'Watch engaging moral and educational video stories in vertical 9:16 format. Click any story to watch and enjoy!'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-xs text-xs sm:text-sm font-black border border-white/30 flex items-center gap-2">
              📹 {videos.length} {language === 'hi' ? 'वीडियो कहानियाँ उपलब्ध' : 'Video Stories Available'}
            </span>
          </div>
        </div>

        {/* Playful Floating Glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 text-8xl opacity-20 pointer-events-none select-none">
          🎬
        </div>
      </div>

      {/* Filter, Search & Layout Switcher Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 shadow-md border-2 border-red-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'वीडियो कहानी या श्रेणी खोजें (जैसे: शेर, अकबर बीरबल, Shorts)...'
                : 'Search video stories or category (e.g. lion, Akbar Birbal, Shorts)...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-red-50/50 border border-red-200 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 self-end md:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              setViewMode('grid');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '9:16 कार्ड' : '9:16 Cards'}</span>
          </button>
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              setViewMode('list');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लिस्ट व्यू' : 'List View'}</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Pills (Dynamically populated from admin categories) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-red-500" />
            <span>{language === 'hi' ? 'श्रेणियाँ (Categories)' : 'Categories'}</span>
          </span>
          <span className="text-xs text-slate-500 font-bold">
            {filteredVideos.length} {language === 'hi' ? 'कहानियाँ' : 'Stories'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-md scale-105'
                : 'bg-white text-slate-700 hover:bg-red-50 border border-red-200'
            }`}
          >
            <span>{language === 'hi' ? '🌟 सभी वीडियो' : '🌟 All Videos'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'all' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {videos.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = videos.filter((v) => v.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-red-50 border border-red-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Videos Display Area */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-4 border-2 border-dashed border-red-200 max-w-md mx-auto">
          <div className="text-5xl">🎬🌾</div>
          <h3 className="text-lg font-black text-slate-800">
            {language === 'hi' ? 'कोई वीडियो कहानी नहीं मिली' : 'No video stories found'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'कृपया कोई अन्य श्रेणी या खोज शब्द चुनें, या एडमिन मेनू में नई वीडियो जोड़ें।'
              : 'Try selecting another category or add a new video from Admin CMS.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'सभी वीडियो देखें' : 'View All Videos'}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* 9:16 Aspect Ratio Responsive Cards Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border-2 border-red-100 hover:border-red-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5"
            >
              {/* 9:16 Aspect Ratio Thumbnail Container */}
              <div className="relative w-full aspect-[9/16] overflow-hidden bg-slate-950">
                <img
                  src={video.thumbnail}
                  alt={language === 'hi' ? video.titleHi : video.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                  <span className="px-2 py-0.5 rounded-lg bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs shadow-xs">
                    {video.category}
                  </span>
                  {video.duration && (
                    <span className="px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-amber-300" />
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* Center Play Icon Hover Effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-red-600 transition-all duration-300 border-2 border-white/80">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Story Name & YouTube Direct Link Tag */}
                <div className="absolute bottom-0 inset-x-0 p-3 space-y-1 text-white">
                  {video.viewsCount && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-200 font-bold">
                      <Eye className="w-3 h-3" />
                      <span>{video.viewsCount} {language === 'hi' ? 'व्यूज' : 'views'}</span>
                    </div>
                  )}

                  <h3 className="text-xs sm:text-sm font-black leading-tight line-clamp-2 drop-shadow-sm group-hover:text-red-200 transition-colors">
                    {language === 'hi' ? video.titleHi : video.titleEn}
                  </h3>

                  <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-red-300 group-hover:text-white">
                    <span className="flex items-center gap-1">
                      <span>▶️</span> {language === 'hi' ? 'वीडियो देखें' : 'Watch Video'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View (Vertical list with 9:16 thumbnail + Story name list-wise) */
        <div className="space-y-3">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="group flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-white border-2 border-red-100 hover:border-red-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              {/* 9:16 Thumbnail Preview in List */}
              <div className="relative w-16 sm:w-20 aspect-[9/16] rounded-xl overflow-hidden bg-black shrink-0 shadow-sm border border-red-200">
                <img
                  src={video.thumbnail}
                  alt={language === 'hi' ? video.titleHi : video.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Story Title & Meta List-wise */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-black uppercase">
                    {video.category}
                  </span>
                  {video.duration && (
                    <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-500" />
                      {video.duration}
                    </span>
                  )}
                  {video.viewsCount && (
                    <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.viewsCount}
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  {language === 'hi' ? video.titleHi : video.titleEn}
                </h3>

                {(video.descriptionHi || video.descriptionEn) && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {language === 'hi' ? video.descriptionHi : video.descriptionEn}
                  </p>
                )}
              </div>

              {/* Action Button: Direct Video Link */}
              <div className="shrink-0 pl-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenVideo(video);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm group-hover:shadow-md transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline">
                    {language === 'hi' ? 'वीडियो देखें' : 'Watch Video'}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
