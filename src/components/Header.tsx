import React from 'react';
import {
  BookOpen,
  Lightbulb,
  Sparkles,
  Headphones,
  Film,
  Globe,
  Volume2,
  VolumeX,
  ShieldAlert,
  Bookmark
} from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { playPopSound } from '../utils/soundEffects';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenAdmin: () => void;
  showBookmarksOnly: boolean;
  setShowBookmarksOnly: (show: boolean) => void;
  bookmarkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  soundEnabled,
  setSoundEnabled,
  onOpenAdmin,
  showBookmarksOnly,
  setShowBookmarksOnly,
  bookmarkCount,
}) => {
  const tabs = [
    {
      id: 'stories' as ActiveTab,
      labelHi: 'कहानियाँ',
      labelEn: 'Stories',
      icon: BookOpen,
      accent: 'from-amber-400 to-orange-500',
      tag: '1-6',
    },
    {
      id: 'facts' as ActiveTab,
      labelHi: 'रोचक तथ्य',
      labelEn: 'Fun Facts',
      icon: Lightbulb,
      accent: 'from-sky-400 to-blue-500',
      tag: 'Daily',
    },
    {
      id: 'learning' as ActiveTab,
      labelHi: 'अक्षर व गिनती',
      labelEn: 'Early Learning',
      icon: Sparkles,
      accent: 'from-emerald-400 to-teal-500',
      tag: 'Kids',
    },
    {
      id: 'audio' as ActiveTab,
      labelHi: 'ऑडियो कहानी',
      labelEn: 'Audio Stories',
      icon: Headphones,
      accent: 'from-purple-400 to-indigo-500',
      tag: 'Bedtime',
    },
    {
      id: 'reels' as ActiveTab,
      labelHi: 'कार्टून रील्स',
      labelEn: 'Video Reels',
      icon: Film,
      accent: 'from-rose-400 to-pink-500',
      tag: 'Shorts',
    },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    if (soundEnabled) playPopSound();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200/70 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* 5 Main Tabs matching PDF Presentation Slides */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 no-scrollbar flex-1 min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all select-none ${
                    isActive
                      ? 'bg-amber-950 text-white shadow-md scale-[1.02]'
                      : 'bg-white/80 text-slate-700 border border-amber-200/80 hover:bg-amber-50/80 hover:text-amber-900'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-800' : 'bg-amber-100 text-amber-800'}`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span>{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive ? 'bg-amber-800 text-amber-200' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {tab.tag}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Lang Toggle, Bookmarks, Sound FX, Admin CMS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Bookmark Filter */}
            <button
              id="bookmark-filter-button"
              onClick={() => {
                if (soundEnabled) playPopSound();
                setShowBookmarksOnly(!showBookmarksOnly);
              }}
              title="Saved Stories"
              className={`relative px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'पसंदीदा' : 'Saved'}
              </span>
              {bookmarkCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  showBookmarksOnly ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'
                }`}>
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              id="language-toggle-button"
              onClick={() => {
                if (soundEnabled) playPopSound();
                setLanguage(language === 'hi' ? 'en' : 'hi');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold hover:bg-orange-100 transition-colors shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-orange-600" />
              <span>{language === 'hi' ? 'ENG' : 'हिंदी'}</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              id="sound-toggle-button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playPopSound();
              }}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Admin CMS Access */}
            <button
              id="admin-cms-open-button"
              onClick={() => {
                if (soundEnabled) playPopSound();
                onOpenAdmin();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-sm hover:from-rose-600 hover:to-amber-600 transition-all active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin CMS</span>
              <span className="sm:hidden">CMS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
