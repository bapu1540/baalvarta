import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ActiveTab,
  Language,
  Story,
  VideoStory,
  PrintableWorksheet,
  KidsGameItem
} from '../types';
import {
  BookOpen,
  Sparkles,
  Lightbulb,
  Headphones,
  Search,
  Bookmark,
  Volume2,
  VolumeX,
  Globe,
  MoreVertical,
  X,
  ShieldCheck,
  Award,
  Mail,
  Home,
  Trophy,
  Download,
  ChevronRight,
  Film,
  Palette,
  Gamepad2,
  Play,
  Printer,
  ExternalLink,
  FileText,
  Crown,
  Zap
} from 'lucide-react';
import { BaalvartaLogo } from './BaalvartaLogo';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { downloadOrPrintWorksheet } from '../utils/worksheetPrinter';
import { INITIAL_KIDS_GAMES } from '../data/gamesData';
import { getStoredWorksheets } from '../utils/storage';
import { getProSubscription } from '../utils/proManager';

interface WebsiteHeaderProps {
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
  onQuickSearchClick?: (query?: string) => void;
  onOpenThemeModal?: () => void;
  onOpenProModal?: () => void;
  stories?: Story[];
  videoStories?: VideoStory[];
  worksheets?: PrintableWorksheet[];
  games?: KidsGameItem[];
  onSelectStory?: (story: Story) => void;
  onSelectStoryFormat?: (format: 'all' | 'picture_book' | 'single_image') => void;
}

export const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({
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
  onQuickSearchClick,
  onOpenThemeModal,
  onOpenProModal,
  stories = [],
  videoStories = [],
  worksheets: propWorksheets,
  games = INITIAL_KIDS_GAMES,
  onSelectStory,
  onSelectStoryFormat,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');
  const [isLiveDropdownOpen, setIsLiveDropdownOpen] = useState(false);
  const [downloadingSheetId, setDownloadingSheetId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean>(() => getProSubscription().isPro);

  useEffect(() => {
    const handleProChange = () => {
      setIsPro(getProSubscription().isPro);
    };
    window.addEventListener('baalvarta_pro_status_change', handleProChange);
    window.addEventListener('storage', handleProChange);
    return () => {
      window.removeEventListener('baalvarta_pro_status_change', handleProChange);
      window.removeEventListener('storage', handleProChange);
    };
  }, []);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const allWorksheets = useMemo(() => {
    if (propWorksheets && propWorksheets.length > 0) return propWorksheets;
    return getStoredWorksheets();
  }, [propWorksheets]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsLiveDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fast live search results preview
  const liveResults = useMemo(() => {
    const q = headerQuery.trim().toLowerCase();
    if (!q) return { stories: [], videos: [], worksheets: [], games: [], total: 0 };

    const matches = (...texts: (string | undefined | null)[]) => {
      return texts.some((t) => t && t.toLowerCase().includes(q));
    };

    const isVideo = matches('video', 'वीडियो', 'shorts', 'youtube');
    const isPdf = matches('pdf', 'वर्कशीट', 'print', 'coloring', 'sheet', 'swar', 'vyanjan');
    const isGame = matches('game', 'खेल', 'puzzle', 'balloon', 'memory');
    const isStory = matches('story', 'kahani', 'कहानी', 'katha');

    const matchedStories = stories
      .filter((s) => isStory || matches(s.titleHi, s.titleEn, s.category, s.moralHi, `#${s.number}`))
      .slice(0, 3);

    const matchedVideos = videoStories
      .filter((v) => isVideo || matches(v.titleHi, v.titleEn, v.category, v.descriptionHi))
      .slice(0, 2);

    const matchedWorksheets = allWorksheets
      .filter((w) => isPdf || matches(w.titleHi, w.titleEn, w.category, w.descriptionHi))
      .slice(0, 2);

    const matchedGames = games
      .filter((g) => isGame || matches(g.titleHi, g.titleEn, g.category, g.descriptionHi))
      .slice(0, 2);

    const total =
      matchedStories.length +
      matchedVideos.length +
      matchedWorksheets.length +
      matchedGames.length;

    return {
      stories: matchedStories,
      videos: matchedVideos,
      worksheets: matchedWorksheets,
      games: matchedGames,
      total,
    };
  }, [headerQuery, stories, videoStories, allWorksheets, games]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (soundEnabled) playPopSound();
    setIsLiveDropdownOpen(false);
    if (onQuickSearchClick) {
      onQuickSearchClick(headerQuery);
    }
  };

  const handleSelectStoryItem = (story: Story) => {
    if (soundEnabled) playPopSound();
    setIsLiveDropdownOpen(false);
    if (onSelectStory) {
      onSelectStory(story);
    } else {
      setActiveTab('stories');
    }
  };

  const handleDownloadWorksheetFromHeader = async (sheet: PrintableWorksheet, e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playSuccessSound();
    setDownloadingSheetId(sheet.id);
    await downloadOrPrintWorksheet(sheet, language);
    setTimeout(() => setDownloadingSheetId(null), 1500);
  };

  // Quick navigation tabs
  const quickDesktopLinks = [
    {
      id: 'home' as ActiveTab,
      labelHi: 'होम',
      labelEn: 'Home',
      icon: Home,
    },
    {
      id: 'stories' as ActiveTab,
      labelHi: 'कहानियाँ',
      labelEn: 'Stories',
      icon: BookOpen,
      badge: '500+',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'videos' as ActiveTab,
      labelHi: 'वीडियो कहानियाँ',
      labelEn: 'Videos',
      icon: Film,
      badge: 'Videos',
      badgeColor: 'bg-red-100 text-red-900 border-red-300',
    },
    {
      id: 'worksheets' as ActiveTab,
      labelHi: 'PDF वर्कशीट्स',
      labelEn: 'PDFs',
      icon: Download,
      badgeHi: 'मुफ्त',
      badgeEn: 'Free',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    {
      id: 'games' as ActiveTab,
      labelHi: 'बाल खेल',
      labelEn: 'Games',
      icon: Gamepad2,
      badgeHi: 'मज़ा',
      badgeEn: 'Fun',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    },
    {
      id: 'profile' as ActiveTab,
      labelHi: 'प्रोफ़ाइल',
      labelEn: 'Profile',
      icon: Award,
      badgeHi: '⭐ VIP',
      badgeEn: '⭐ VIP',
      badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-400',
    },
  ];

  // Full category list for 3-dot drawer (1 to 10 exact order)
  const allNavLinks = [
    {
      id: 'home' as ActiveTab,
      labelHi: '🏠 होम पेज (Home)',
      labelEn: '🏠 Home Page',
      icon: Home,
      color: 'from-amber-500 to-orange-500',
      badgeHi: null,
      badgeEn: null,
    },
    {
      id: 'profile' as ActiveTab,
      labelHi: '👤 बाल प्रोफ़ाइल व रिपोर्ट कार्ड (My Profile)',
      labelEn: '👤 Kid Profile & Report Card',
      icon: Award,
      color: 'from-amber-500 via-orange-500 to-amber-600',
      badgeHi: '⭐ VIP',
      badgeEn: '⭐ VIP',
    },
    {
      id: 'stories' as ActiveTab,
      labelHi: '1. कहानियाँ (Stories)',
      labelEn: '1. Stories',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      badgeHi: '500+',
      badgeEn: '500+',
    },
    {
      id: 'learning' as ActiveTab,
      labelHi: '2. सीखें (Learning)',
      labelEn: '2. Learning',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      badgeHi: 'ABC 🔤',
      badgeEn: 'ABC 🔤',
    },
    {
      id: 'facts' as ActiveTab,
      labelHi: '3. रोचक तथ्य (Fun Facts)',
      labelEn: '3. Fun Facts',
      icon: Lightbulb,
      color: 'from-sky-500 to-blue-600',
      badgeHi: 'ज्ञान 💡',
      badgeEn: 'Facts 💡',
    },
    {
      id: 'gk' as ActiveTab,
      labelHi: '4. सामान्य ज्ञान व क्विज़ (GK & Quiz)',
      labelEn: '4. General Knowledge & Quiz',
      icon: Globe,
      color: 'from-indigo-500 to-blue-700',
      badgeHi: 'GK + 🏆',
      badgeEn: 'GK + 🏆',
    },
    {
      id: 'audio' as ActiveTab,
      labelHi: '5. ऑडियो कहानियाँ (Audio Stories)',
      labelEn: '5. Audio Stories',
      icon: Headphones,
      color: 'from-purple-500 to-indigo-600',
      badgeHi: 'ऑडियो 🎧',
      badgeEn: 'Audio 🎧',
    },
    {
      id: 'videos' as ActiveTab,
      labelHi: '6. वीडियो कहानियाँ (Video Stories)',
      labelEn: '6. Video Stories',
      icon: Film,
      color: 'from-red-500 to-rose-600',
      badgeHi: 'Videos',
      badgeEn: 'Videos',
    },
    {
      id: 'games' as ActiveTab,
      labelHi: '7. मिनी गेम्स (Mini Games)',
      labelEn: '7. Mini Games',
      icon: Gamepad2,
      color: 'from-purple-500 to-indigo-600',
      badgeHi: '8 गेम्स 🎮',
      badgeEn: '8 Games 🎮',
    },
    {
      id: 'quizzes' as ActiveTab,
      labelHi: '8. बाल क्विज़ गेम्स (Kids Quiz)',
      labelEn: '8. Kids Quiz Games',
      icon: Trophy,
      color: 'from-rose-500 to-pink-600',
      badgeHi: '🎯 खेलें',
      badgeEn: '🎯 Play',
    },
    {
      id: 'coloring' as ActiveTab,
      labelHi: '9. आर्ट व पेपर क्राफ्ट (Art, Colouring & Origami)',
      labelEn: '9. Art, Colouring & Origami',
      icon: Palette,
      color: 'from-amber-400 to-orange-500',
      badgeHi: 'कलर + ✂️',
      badgeEn: 'Art + ✂️',
    },
    {
      id: 'worksheets' as ActiveTab,
      labelHi: '10. फ्री डाउनलोड (Free Download)',
      labelEn: '10. Free Download',
      icon: Download,
      color: 'from-teal-500 via-cyan-500 to-blue-600',
      badgeHi: 'PDF + 🎖️',
      badgeEn: 'PDF + 🎖️',
    },
    {
      id: 'about' as ActiveTab,
      labelHi: 'हमारे बारे में (About Us)',
      labelEn: 'About Baalvarta',
      icon: Award,
      color: 'from-slate-600 to-slate-800',
      badge: null,
    },
    {
      id: 'contact' as ActiveTab,
      labelHi: 'संपर्क व सुझाव (Contact)',
      labelEn: 'Contact Us',
      icon: Mail,
      color: 'from-slate-600 to-slate-800',
      badge: null,
    },
  ];

  const handleNavClick = (tab: ActiveTab, isAdmin?: boolean) => {
    if (soundEnabled) playPopSound();
    setIsMenuOpen(false);
    if (isAdmin || (tab as string) === 'admin') {
      onOpenAdmin();
      return;
    }
    setActiveTab(tab);
    setShowBookmarksOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs transition-all w-full max-w-full">
      {/* Main Navbar Row (Zero horizontal overflow, clean & prominent) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-1 sm:py-1.5 w-full">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 w-full">
          
          {/* Custom Baalvarta Logo (Slimmer border, large, bold & high-visibility) */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer select-none shrink-0 py-0.5 group flex items-center"
            title="बालवार्ता Baalvarta - Home"
          >
            <BaalvartaLogo variant="header" />
          </div>

          {/* Quick Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {quickDesktopLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id && !showBookmarksOnly;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-950 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-amber-50 hover:text-amber-950'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{language === 'hi' ? link.labelHi : link.labelEn}</span>
                  {(link.badgeHi || (link as any).badge) && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold border ${
                        isActive ? 'bg-amber-800 text-amber-200 border-amber-700' : link.badgeColor
                      }`}
                    >
                      {link.badgeHi ? (language === 'hi' ? link.badgeHi : link.badgeEn) : (link as any).badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop & Tablet Integrated Search Bar with Live Instant Autocomplete */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-sm hidden md:flex items-center">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center bg-slate-100 hover:bg-white focus-within:bg-white rounded-xl p-1 border border-slate-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all shadow-2xs">
                <Search className="w-4 h-4 text-amber-600 ml-2 shrink-0" />
                <input
                  type="text"
                  value={headerQuery}
                  onChange={(e) => {
                    setHeaderQuery(e.target.value);
                    setIsLiveDropdownOpen(true);
                  }}
                  onFocus={() => setIsLiveDropdownOpen(true)}
                  placeholder={
                    language === 'hi'
                      ? 'कहानी, वीडियो, PDF खोजें...'
                      : 'Search stories, videos, PDFs...'
                  }
                  className="w-full px-2 py-1 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
                {headerQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeaderQuery('');
                      setIsLiveDropdownOpen(false);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 mr-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-black text-white text-[11px] font-black transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  {language === 'hi' ? 'खोजें' : 'Go'}
                </button>
              </div>
            </form>

            {/* Live Autocomplete Popover Dropdown */}
            {isLiveDropdownOpen && headerQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 sm:-left-12 sm:w-[420px] mt-2 bg-white rounded-2xl shadow-2xl border-2 border-amber-300 p-3 z-50 max-h-[75vh] overflow-y-auto space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <span>🔍</span>
                    <span>
                      {language === 'hi'
                        ? `"${headerQuery}" के लिए ${liveResults.total} परिणाम`
                        : `${liveResults.total} results for "${headerQuery}"`}
                    </span>
                  </span>
                  <button
                    onClick={() => setIsLiveDropdownOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 1. PDF Worksheets Preview */}
                {liveResults.worksheets.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                      <FileText className="w-3 h-3 text-emerald-600" />
                      <span>{language === 'hi' ? '📄 प्रिंटेबल PDF वर्कशीट्स' : 'PDF Worksheets'}</span>
                    </span>
                    {liveResults.worksheets.map((sheet) => (
                      <div
                        key={sheet.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={sheet.thumbnailUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-emerald-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h6 className="text-xs font-black text-slate-900 truncate">
                              {language === 'hi' ? sheet.titleHi : sheet.titleEn}
                            </h6>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-200/70 px-1.5 py-0.2 rounded-md">
                              {sheet.ageGroup} • PDF
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDownloadWorksheetFromHeader(sheet, e)}
                          disabled={downloadingSheetId === sheet.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>{language === 'hi' ? 'डाउनलोड PDF' : 'PDF'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Video Stories Preview */}
                {liveResults.videos.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-red-800 tracking-wider flex items-center gap-1">
                      <Film className="w-3 h-3 text-red-600" />
                      <span>{language === 'hi' ? '🎬 वीडियो कहानियाँ (9:16 Shorts)' : 'Video Shorts'}</span>
                    </span>
                    {liveResults.videos.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => {
                          if (vid.youtubeUrl) window.open(vid.youtubeUrl, '_blank');
                        }}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-red-50/60 hover:bg-red-100/60 border border-red-200 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative w-8 aspect-[9/16] rounded-md overflow-hidden bg-black shrink-0">
                            <img src={vid.thumbnail} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="w-2.5 h-2.5 fill-white text-white" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h6 className="text-xs font-black text-slate-900 truncate group-hover:text-red-700">
                              {language === 'hi' ? vid.titleHi : vid.titleEn}
                            </h6>
                            <span className="text-[9px] font-bold text-red-700">
                              {vid.category}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-black text-red-600 flex items-center gap-0.5 shrink-0">
                          <span>{language === 'hi' ? 'देखें' : 'Watch'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Stories Preview */}
                {liveResults.stories.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-600" />
                      <span>{language === 'hi' ? '📖 बाल कहानियाँ' : 'Stories'}</span>
                    </span>
                    {liveResults.stories.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => handleSelectStoryItem(story)}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={story.coverImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-amber-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h6 className="text-xs font-black text-slate-900 truncate group-hover:text-amber-700">
                              {language === 'hi' ? story.titleHi : story.titleEn}
                            </h6>
                            <span className="text-[9px] text-slate-500 font-bold">
                              #{story.number} • {story.category}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Action: Open Full Global Search Modal */}
                <button
                  onClick={() => handleSearchSubmit()}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {language === 'hi'
                      ? `"${headerQuery}" के सभी परिणाम देखें (Enter ↵)`
                      : `View all results for "${headerQuery}"`}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Action Utilities (Language Switcher, Saved, Fixed 3-Dot Menu) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Baalvarta Pro VIP Button (Header Action) */}
            {onOpenProModal && (
              <button
                id="header-pro-modal-btn"
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  onOpenProModal();
                }}
                title={
                  isPro
                    ? (language === 'hi' ? 'आप सक्रिय प्रो वीआईपी सदस्य हैं 👑' : 'Active Pro VIP Member 👑')
                    : (language === 'hi' ? 'बालवार्ता प्रो - ₹29/माह (100% विज्ञापन-मुक्त व असीमित)' : 'Upgrade to Baalvarta Pro - ₹29/mo')
                }
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer shadow-xs border shrink-0 ${
                  isPro
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400'
                    : 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-white border-amber-300 ring-2 ring-amber-400/40 animate-pulse'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 shrink-0" />
                <span className="hidden sm:inline">
                  {isPro ? (language === 'hi' ? 'VIP सदस्य' : 'VIP Pro') : (language === 'hi' ? 'प्रो (₹29)' : 'Pro (₹29)')}
                </span>
                <span className="sm:hidden">
                  {isPro ? 'VIP' : 'PRO'}
                </span>
              </button>
            )}

            {/* Saved Bookmarks Button */}
            <button
              id="header-saved-button"
              onClick={() => {
                if (soundEnabled) playPopSound();
                setShowBookmarksOnly(!showBookmarksOnly);
                if (activeTab !== 'stories') {
                  setActiveTab('stories');
                }
              }}
              title="Saved Stories"
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border cursor-pointer shrink-0 ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-white text-white' : 'text-amber-700'}`} />
              <span className="hidden md:inline text-[11px] font-black">
                {language === 'hi' ? 'पसंदीदा' : 'Saved'}
              </span>
              {bookmarkCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                    showBookmarksOnly ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Sound FX Toggle (Desktop/Tablet, also inside 3-dot menu for mobile) */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl text-xs font-bold transition-colors border cursor-pointer shrink-0 ${
                soundEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Theme & Font Customizer Button (Desktop) */}
            {onOpenThemeModal && (
              <button
                id="header-theme-toggle-btn"
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  onOpenThemeModal();
                }}
                title={language === 'hi' ? 'रंग व फ़ॉन्ट सेटिंग्स (Theme & Font)' : 'Change Theme & Font'}
                className="hidden lg:flex p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Palette className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-black">
                  {language === 'hi' ? 'रंग' : 'Theme'}
                </span>
              </button>
            )}

            {/* Language Switcher - Clear 2-State Pill (ENG / हिंदी) */}
            <button
              id="header-language-toggle-btn"
              onClick={() => {
                if (soundEnabled) playPopSound();
                setLanguage(language === 'hi' ? 'en' : 'hi');
              }}
              title={language === 'hi' ? 'Switch website to English' : 'वेबसाइट हिंदी में करें'}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white border-2 border-indigo-300 text-[11px] sm:text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
              aria-label="Toggle language between Hindi and English"
            >
              <Globe className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow shrink-0" />
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black">
                <span className={language === 'hi' ? 'text-amber-300 font-extrabold underline decoration-amber-300 decoration-2' : 'text-indigo-200'}>
                  हिंदी
                </span>
                <span className="text-white/40">|</span>
                <span className={language === 'en' ? 'text-amber-300 font-extrabold underline decoration-amber-300 decoration-2' : 'text-indigo-200'}>
                  ENG
                </span>
              </div>
            </button>

            {/* 3-Dot (तीन डॉट) Menu Button - ALWAYS FIXED ON RIGHT, NEVER HIDDEN */}
            <div className="relative shrink-0" ref={menuRef}>
              <button
                id="header-three-dot-menu-btn"
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`p-1.5 sm:p-2 rounded-xl transition-all border-2 flex items-center justify-center cursor-pointer shrink-0 shadow-xs ${
                  isMenuOpen
                    ? 'bg-amber-900 text-white border-amber-950 shadow-md'
                    : 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500 font-extrabold'
                }`}
                title={language === 'hi' ? 'सभी श्रेणियाँ व मेनू (तीन डॉट)' : 'All Menus & Categories (3-Dots)'}
                aria-label="All Categories Menu"
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <div className="flex items-center gap-0.5">
                    <MoreVertical className="w-4 h-4 text-amber-950" />
                    <span className="text-[11px] font-black hidden md:inline ml-0.5">
                      {language === 'hi' ? 'मेनू' : 'Menu'}
                    </span>
                  </div>
                )}
              </button>

              {/* 3-Dot Dropdown Drawer Menu */}
              {isMenuOpen && (
                <div
                  id="header-dropdown-menu"
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <span>🌟</span>
                        <span>{language === 'hi' ? 'बालवार्ता संपूर्ण मेनू' : 'All Sections'}</span>
                      </span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                        {language === 'hi' ? '13 हब्स' : '13 Hubs'}
                      </span>
                    </div>

                    {/* Language Switcher Bar inside 3-Dot Drawer */}
                    <div className="mt-2.5 pt-2 border-t border-white/20">
                      <div className="flex items-center justify-between gap-1.5 bg-black/25 p-1 rounded-xl">
                        <span className="text-[11px] font-black pl-1 text-amber-200 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>{language === 'hi' ? 'भाषा:' : 'Lang:'}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (soundEnabled) playPopSound();
                              setLanguage('hi');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              language === 'hi'
                                ? 'bg-amber-400 text-slate-950 shadow-xs scale-102 ring-1 ring-white'
                                : 'text-white/80 hover:bg-white/15'
                            }`}
                          >
                            🇮🇳 हिंदी
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (soundEnabled) playPopSound();
                              setLanguage('en');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              language === 'en'
                                ? 'bg-amber-400 text-slate-950 shadow-xs scale-102 ring-1 ring-white'
                                : 'text-white/80 hover:bg-white/15'
                            }`}
                          >
                            🇬🇧 English
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Quick Utility Controls inside 3-Dot Drawer */}
                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between gap-2 sm:hidden">
                      <button
                        onClick={() => {
                          setSoundEnabled(!soundEnabled);
                          if (!soundEnabled) playPopSound();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-bold"
                      >
                        {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{soundEnabled ? (language === 'hi' ? 'ध्वनि चालू' : 'Sound ON') : (language === 'hi' ? 'ध्वनि बंद' : 'Sound OFF')}</span>
                      </button>

                      {onOpenThemeModal && (
                        <button
                          onClick={() => {
                            if (soundEnabled) playPopSound();
                            setIsMenuOpen(false);
                            onOpenThemeModal();
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-bold"
                        >
                          <Palette className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'रंग व फ़ॉन्ट' : 'Themes'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-2 max-h-[65vh] overflow-y-auto space-y-1">
                    {/* Baalvarta Pro VIP Banner in Menu */}
                    {onOpenProModal && (
                      <div
                        onClick={() => {
                          if (soundEnabled) playPopSound();
                          setIsMenuOpen(false);
                          onOpenProModal();
                        }}
                        className={`p-2.5 mb-2 rounded-2xl cursor-pointer transition-all border-2 flex items-center justify-between gap-2 shadow-xs ${
                          isPro
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-600'
                            : 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white border-amber-400 hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg shrink-0">
                            👑
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black truncate">
                              {isPro ? (language === 'hi' ? 'बालवार्ता वीआईपी सदस्य' : 'Baalvarta VIP Member') : (language === 'hi' ? 'बालवार्ता प्रो (₹29/माह)' : 'Baalvarta Pro Pass')}
                            </div>
                            <div className="text-[10px] text-amber-100 font-semibold truncate">
                              {isPro ? (language === 'hi' ? 'सभी सुविधाएं सक्रिय ✓' : 'All Features Active ✓') : (language === 'hi' ? '100% Ad-Free • असीमित PDF' : 'Ad-Free • Unlimited')}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/20 font-black shrink-0 border border-white/30">
                          {isPro ? 'VIP' : (language === 'hi' ? 'देखें ↗' : 'View ↗')}
                        </span>
                      </div>
                    )}
                    {allNavLinks.map((link: any) => {
                      const Icon = link.icon;
                      const isActive = activeTab === link.id && !showBookmarksOnly;
                      return (
                        <React.Fragment key={link.id}>
                          <button
                            onClick={() => handleNavClick(link.id, link.isAdmin)}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                              isActive
                                ? 'bg-amber-100 text-amber-950 font-black border border-amber-300 shadow-2xs'
                                : 'hover:bg-amber-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${link.color} text-white flex items-center justify-center shrink-0 shadow-2xs`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs sm:text-sm font-black truncate block text-slate-800">
                                  {language === 'hi' ? link.labelHi : link.labelEn}
                                </span>
                              </div>
                            </div>
                            {(link.badgeHi || link.badge) && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-amber-100 text-amber-950 shrink-0">
                                {link.badgeHi ? (language === 'hi' ? link.badgeHi : link.badgeEn) : link.badge}
                              </span>
                            )}
                          </button>

                          {/* 2 Sub-Categories under Stories in Drawer */}
                          {link.id === 'stories' && (
                            <div className="grid grid-cols-2 gap-1.5 pl-10 pr-1 py-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (soundEnabled) playPopSound();
                                  setIsMenuOpen(false);
                                  if (onSelectStoryFormat) onSelectStoryFormat('picture_book');
                                  setActiveTab('stories');
                                }}
                                className="px-2 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-black text-left flex items-center gap-1 transition-colors"
                              >
                                <span>🎨</span>
                                <span className="truncate">{language === 'hi' ? 'सचित्र कथाएँ' : 'Picture Stories'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (soundEnabled) playPopSound();
                                  setIsMenuOpen(false);
                                  if (onSelectStoryFormat) onSelectStoryFormat('single_image');
                                  setActiveTab('stories');
                                }}
                                className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-black text-left flex items-center gap-1 transition-colors"
                              >
                                <span>🖼️</span>
                                <span className="truncate">{language === 'hi' ? '1 इमेज कथाएँ' : 'Single Image'}</span>
                              </button>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Integrated Search Bar (Clean crisp styling, zero yellow tint) */}
        <div className="md:hidden pt-1 pb-1">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-50 focus-within:bg-white rounded-xl p-0.5 border border-slate-200 focus-within:border-amber-500 transition-all shadow-2xs">
            <Search className="w-4 h-4 text-amber-600 ml-2 shrink-0" />
            <input
              type="text"
              value={headerQuery}
              onChange={(e) => {
                setHeaderQuery(e.target.value);
                setIsLiveDropdownOpen(true);
              }}
              onFocus={() => setIsLiveDropdownOpen(true)}
              placeholder={
                language === 'hi'
                  ? 'कहानी, वीडियो, PDF खोजें...'
                  : 'Search stories, videos, PDFs...'
              }
              className="w-full px-2 py-1 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            {headerQuery && (
              <button
                type="button"
                onClick={() => {
                  setHeaderQuery('');
                  setIsLiveDropdownOpen(false);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-amber-950 text-white text-[11px] font-black shrink-0 cursor-pointer shadow-xs"
            >
              {language === 'hi' ? 'खोजें' : 'Search'}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};
