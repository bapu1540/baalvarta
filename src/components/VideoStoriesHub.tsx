import React, { useState } from 'react';
import { VideoStory, Language } from '../types';
import {
  Video,
  Play,
  ExternalLink,
  Sparkles,
  Clock,
  Eye,
  Filter,
  Film
} from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';
import { extractYoutubeThumbnail } from '../utils/storage';

interface VideoStoriesHubProps {
  videos: VideoStory[];
  categories: string[];
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
  searchQuery?: string;
}

export const VideoStoriesHub: React.FC<VideoStoriesHubProps> = ({
  videos,
  categories,
  language,
  soundEnabled,
  onBackToHome,
  searchQuery = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter videos based on selected category and external/contextual search query
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
    <div className="space-y-4 animate-in fade-in duration-300 pb-12">
      {/* Sleek Category Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white rounded-2xl p-2.5 sm:p-3 border border-rose-200/80 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600 text-white flex items-center justify-center text-lg sm:text-xl shadow-xs shrink-0">
            🎬
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
            {language === 'hi' ? '6. वीडियो कहानियाँ (Video Stories)' : '6. Animated Video Stories'}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-xl bg-red-50 text-red-900 border border-red-200 text-xs font-black whitespace-nowrap">
            {language === 'hi' ? `${filteredVideos.length} वीडियो उपलब्ध` : `${filteredVideos.length} Videos`}
          </span>
        </div>
      </div>

      {/* Categories Filter Pills */}
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

      {/* Videos Automatic 16:9 Grid Display */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-4 border-2 border-dashed border-red-200 max-w-md mx-auto">
          <div className="text-5xl">🎬🌾</div>
          <h3 className="text-lg font-black text-slate-800">
            {language === 'hi' ? 'कोई वीडियो कहानी नहीं मिली' : 'No video stories found'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'कृपया कोई अन्य श्रेणी चुनें, या एडमिन मेनू में नई वीडियो जोड़ें।'
              : 'Try selecting another category or add a new video from Admin CMS.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'सभी वीडियो देखें' : 'View All Videos'}
          </button>
        </div>
      ) : (
        /* Automatic Responsive 16:9 Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border-2 border-red-100 hover:border-red-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5"
            >
              {/* 16:9 Aspect Ratio Thumbnail Container */}
              <div className="relative w-full aspect-video overflow-hidden bg-slate-950">
                <img
                  src={extractYoutubeThumbnail(video.youtubeUrl, video.thumbnail) || video.thumbnail}
                  alt={language === 'hi' ? video.titleHi : video.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Gradient Overlays */}
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

                {/* Center YouTube Play Icon Hover Effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-red-700 transition-all duration-300 border-2 border-white/90">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Story Name & YouTube Direct Link Tag */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 space-y-1 text-white">
                  {video.viewsCount && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-200 font-bold">
                      <Eye className="w-3 h-3" />
                      <span>{video.viewsCount} {language === 'hi' ? 'व्यूज' : 'views'}</span>
                    </div>
                  )}

                  <h3 className="text-xs sm:text-sm font-black leading-tight line-clamp-2 drop-shadow-sm group-hover:text-red-200 transition-colors">
                    {language === 'hi' ? video.titleHi : (video.titleEn || video.titleHi)}
                  </h3>
                  {video.titleEn && video.titleEn !== video.titleHi && language === 'hi' && (
                    <p className="text-[10px] text-red-200/90 font-medium line-clamp-1">
                      {video.titleEn}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-red-300 group-hover:text-white">
                    <span className="flex items-center gap-1">
                      <span>▶️</span> {language === 'hi' ? 'यूट्यूब पर देखें' : 'Watch on YouTube'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
