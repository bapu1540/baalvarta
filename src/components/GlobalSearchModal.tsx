import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Story,
  FunFact,
  LearningItem,
  AudioStory,
  VideoStory,
  PrintableWorksheet,
  KidsGameItem,
  ActiveTab,
  Language
} from '../types';
import {
  Search,
  X,
  BookOpen,
  Sparkles,
  Lightbulb,
  Headphones,
  Film,
  Play,
  Trophy,
  Download,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Clock,
  Printer,
  Gamepad2,
  Volume2,
  FileText,
  CheckCircle2,
  Share2,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { downloadOrPrintWorksheet } from '../utils/worksheetPrinter';
import { INITIAL_KIDS_GAMES } from '../data/gamesData';
import { getStoredWorksheets, extractYoutubeThumbnail } from '../utils/storage';
import {
  getDisplayStoryTitle,
  getDisplayStorySummary,
} from '../utils/storyLanguageHelper';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  facts: FunFact[];
  learningItems: LearningItem[];
  audioStories: AudioStory[];
  videoStories?: VideoStory[];
  worksheets?: PrintableWorksheet[];
  games?: KidsGameItem[];
  language: Language;
  soundEnabled: boolean;
  onSelectStory: (story: Story) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenAdmin?: () => void;
  initialQuery?: string;
  initialCategory?: string;
}

type SearchCategoryFilter =
  | 'all'
  | 'stories'
  | 'videos'
  | 'worksheets'
  | 'games'
  | 'learning'
  | 'facts'
  | 'audio';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  stories,
  facts,
  learningItems,
  audioStories,
  videoStories = [],
  worksheets: propWorksheets,
  games = INITIAL_KIDS_GAMES,
  language,
  soundEnabled,
  onSelectStory,
  onNavigateTab,
  onOpenAdmin,
  initialQuery = '',
  initialCategory = 'all',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategoryFilter>(
    (initialCategory as SearchCategoryFilter) || 'all'
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fallback to stored worksheets if not provided in props
  const allWorksheets = useMemo(() => {
    if (propWorksheets && propWorksheets.length > 0) return propWorksheets;
    return getStoredWorksheets();
  }, [propWorksheets]);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      if (initialCategory && ['all', 'stories', 'videos', 'worksheets', 'games', 'learning', 'facts', 'audio'].includes(initialCategory)) {
        setActiveCategory(initialCategory as SearchCategoryFilter);
      } else {
        setActiveCategory('all');
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  }, [isOpen, initialQuery, initialCategory]);

  // Quick suggestions chips matching popular kids queries
  const popularKeywords = [
    { label: language === 'hi' ? 'पंचतंत्र कहानियाँ' : 'Panchatantra Stories', query: 'panchatantra' },
    { label: language === 'hi' ? '🎬 वीडियो शॉर्ट्स' : '🎬 Video Shorts', query: 'video' },
    { label: language === 'hi' ? '📄 PDF वर्कशीट' : '📄 PDF Worksheets', query: 'pdf' },
    { label: language === 'hi' ? 'शेर और चूहा' : 'Lion and Mouse', query: 'शेर' },
    { label: language === 'hi' ? '🎨 कलरिंग शीट्स' : 'Coloring Sheets', query: 'coloring' },
    { label: language === 'hi' ? '🎮 बाल गेम्स' : 'Kids Games', query: 'game' },
    { label: language === 'hi' ? 'अकबर बीरबल' : 'Akbar Birbal', query: 'akbar birbal' },
    { label: language === 'hi' ? 'वर्णमाला अ से ज्ञ' : 'Varnamala', query: 'varnamala' },
    { label: language === 'hi' ? '💡 रोचक तथ्य' : 'Fun Facts', query: 'facts' },
  ];

  // Comprehensive Search Results Filtering across entire website
  const results = useMemo(() => {
    const rawQ = query.trim();
    const q = rawQ.toLowerCase();

    // Helper: fuzzy & multi-field text matcher
    const matchesText = (...texts: (string | undefined | null)[]) => {
      if (!q) return false;
      return texts.some((t) => {
        if (!t) return false;
        return t.toLowerCase().includes(q);
      });
    };

    // If query is empty, provide popular discovery items
    if (!q) {
      return {
        stories: stories.slice(0, 6),
        videoStories: videoStories.slice(0, 4),
        worksheets: allWorksheets.slice(0, 4),
        games: games.slice(0, 4),
        learningItems: learningItems.slice(0, 6),
        facts: facts.slice(0, 4),
        audioStories: audioStories.slice(0, 3),
        totalCount: stories.length + videoStories.length + allWorksheets.length,
      };
    }

    const isStoryQuery = matchesText('kahani', 'story', 'katha', 'कथा', 'कहानी', 'कहानियां');
    const isVideoQuery = matchesText('video', 'वीडियो', 'शॉर्ट्स', 'shorts', 'youtube', 'यूट्यूब', 'film');
    const isPdfQuery = matchesText('pdf', 'पीडीएफ', 'worksheet', 'वर्कशीट', 'प्रिंट', 'print', 'download', 'डाउनलोड', 'coloring', 'रंग भरो', 'tracing');
    const isGameQuery = matchesText('game', 'खेल', 'गेम', 'puzzle', 'पहेली', 'balloon', 'गुब्बारा', 'memory');
    const isLearningQuery = matchesText('learning', 'लर्निंग', 'अक्षर', 'वर्णमाला', 'varnamala', 'swar', 'vyanjan', 'abc', 'alphabet', 'गिनती', 'numbers');
    const isFactQuery = matchesText('fact', 'तथ्य', 'रोचक', 'rochak', 'science', 'विज्ञान', 'space', 'ज्ञान');
    const isAudioQuery = matchesText('audio', 'ऑडियो', 'sound', 'mp3', 'सुनें', 'गाना', 'listen');

    // 1. Stories Search
    const matchedStories = stories.filter((s) => {
      if (isStoryQuery) return true;
      return (
        matchesText(
          s.titleHi,
          s.titleEn,
          s.summaryHi,
          s.summaryEn,
          s.contentHi,
          s.contentEn,
          s.moralHi,
          s.moralEn,
          s.category,
          `#${s.number}`,
          String(s.number)
        )
      );
    });

    // 2. Video Stories Search (9:16 Shorts & YouTube)
    const matchedVideos = videoStories.filter((v) => {
      if (isVideoQuery) return true;
      return matchesText(
        v.titleHi,
        v.titleEn,
        v.category,
        v.descriptionHi,
        v.descriptionEn,
        v.youtubeUrl
      );
    });

    // 3. Printable PDF Worksheets Search
    const matchedWorksheets = allWorksheets.filter((w) => {
      if (isPdfQuery) return true;
      return matchesText(
        w.titleHi,
        w.titleEn,
        w.descriptionHi,
        w.descriptionEn,
        w.category,
        w.ageGroup
      );
    });

    // 4. Kids Games Search
    const matchedGames = games.filter((g) => {
      if (isGameQuery) return true;
      return matchesText(
        g.titleHi,
        g.titleEn,
        g.descriptionHi,
        g.descriptionEn,
        g.category,
        g.badge
      );
    });

    // 5. Early Learning Zone Search
    const matchedLearning = learningItems.filter((l) => {
      if (isLearningQuery) return true;
      return matchesText(
        l.name,
        l.symbol,
        l.pronunciation,
        l.module,
        ...(l.words || [])
      );
    });

    // 6. Fun Facts Search
    const matchedFacts = facts.filter((f) => {
      if (isFactQuery) return true;
      return matchesText(
        f.titleHi,
        f.titleEn,
        f.factHi,
        f.factEn,
        f.category
      );
    });

    // 7. Audio Stories Search
    const matchedAudio = audioStories.filter((a) => {
      if (isAudioQuery) return true;
      return matchesText(
        a.titleHi,
        a.titleEn,
        a.descriptionHi,
        a.descriptionEn,
        a.category,
        a.narrator,
        ...(a.tags || [])
      );
    });

    const totalCount =
      matchedStories.length +
      matchedVideos.length +
      matchedWorksheets.length +
      matchedGames.length +
      matchedLearning.length +
      matchedFacts.length +
      matchedAudio.length;

    return {
      stories: matchedStories,
      videoStories: matchedVideos,
      worksheets: matchedWorksheets,
      games: matchedGames,
      learningItems: matchedLearning,
      facts: matchedFacts,
      audioStories: matchedAudio,
      totalCount,
    };
  }, [query, stories, facts, learningItems, audioStories, videoStories, allWorksheets, games]);

  if (!isOpen) return null;

  const handleSelectStoryItem = (story: Story) => {
    if (soundEnabled) playPopSound();
    onSelectStory(story);
    onClose();
  };

  const handleOpenVideo = (video: VideoStory) => {
    if (soundEnabled) playPopSound();
    if (video.youtubeUrl) {
      window.open(video.youtubeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadWorksheet = async (sheet: PrintableWorksheet) => {
    if (soundEnabled) playSuccessSound();
    setDownloadingId(sheet.id);
    await downloadOrPrintWorksheet(sheet, language);
    setTimeout(() => setDownloadingId(null), 1500);
  };

  const handleNavigate = (tab: ActiveTab) => {
    if (soundEnabled) playPopSound();
    onNavigateTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2.5 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-4 sm:my-6 bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Search Area */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-3.5 sm:p-5 text-white shrink-0 shadow-md">
          <div className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🔍</span>
              <div>
                <h3 className="text-base sm:text-xl font-black tracking-tight flex items-center gap-2">
                  <span>{language === 'hi' ? 'बालवार्ता सुपर सर्च' : 'Baalvarta Global Search'}</span>
                  <span className="text-[10px] sm:text-xs bg-white/25 px-2 py-0.5 rounded-full font-bold">
                    {language === 'hi' ? 'पूरी वेबसाइट' : 'Entire Website'}
                  </span>
                </h3>
                <p className="text-[11px] sm:text-xs text-indigo-100 font-medium">
                  {language === 'hi'
                    ? 'कहानियाँ, वीडियो, प्रिंटेबल PDF वर्कशीट्स, बाल गेम्स, अक्षर व सामान्य ज्ञान खोजें'
                    : 'Search 500+ stories, videos, printable PDFs, mini-games & GK'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer shrink-0"
              title="Close Search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center bg-white rounded-2xl p-1 sm:p-1.5 shadow-lg border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-200 transition-all">
            <Search className="w-5 h-5 text-indigo-600 ml-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'जैसे: शेर, पंचतंत्र, वीडियो, PDF, वर्कशीट, खेल, मोर, GK...'
                  : 'E.g., lion, panchatantra, video, pdf, worksheet, games, coloring...'
              }
              className="w-full px-3 py-2 text-sm sm:text-base font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 mr-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="hidden sm:inline-flex text-[11px] font-black px-2.5 py-1 bg-indigo-100 text-indigo-900 rounded-xl mr-1 shrink-0">
              {query ? `${results.totalCount} मिले` : 'सर्च'}
            </span>
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0 no-scrollbar">
          {[
            { id: 'all' as SearchCategoryFilter, labelHi: '🌟 सभी (All)', labelEn: 'All', count: results.totalCount },
            { id: 'stories' as SearchCategoryFilter, labelHi: '📖 कहानियाँ', labelEn: 'Stories', count: results.stories.length },
            { id: 'videos' as SearchCategoryFilter, labelHi: '🎬 वीडियो', labelEn: 'Videos', count: results.videoStories.length },
            { id: 'worksheets' as SearchCategoryFilter, labelHi: '📄 PDF वर्कशीट्स', labelEn: 'PDFs', count: results.worksheets.length },
            { id: 'games' as SearchCategoryFilter, labelHi: '🎮 बाल गेम्स', labelEn: 'Games', count: results.games.length },
            { id: 'learning' as SearchCategoryFilter, labelHi: '🔤 सीखें व GK', labelEn: 'Learning & GK', count: results.learningItems.length },
            { id: 'facts' as SearchCategoryFilter, labelHi: '💡 रोचक तथ्य', labelEn: 'Facts', count: results.facts.length },
            { id: 'audio' as SearchCategoryFilter, labelHi: '🎧 ऑडियो', labelEn: 'Audio', count: results.audioStories.length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (soundEnabled) playPopSound();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200'
              }`}
            >
              <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
              {cat.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === cat.id ? 'bg-indigo-900 text-indigo-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-6">

          {/* Admin CMS Direct Gateway (When search query matches 'admin', 'cms', 'login', etc.) */}
          {(query.toLowerCase().includes('admin') || query.toLowerCase().includes('cms') || query.toLowerCase().includes('login') || query.toLowerCase().includes('व्यवस्थापक')) && onOpenAdmin && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg border-2 border-amber-300 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black flex items-center gap-2">
                    <span>🔐 व्यवस्थापक एडमिन पोर्टल (Admin CMS Portal)</span>
                    <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">2-स्टेप सुरक्षित</span>
                  </h4>
                  <p className="text-xs text-amber-100 font-medium mt-0.5">
                    कहानी, वीडियो, रोचक तथ्य व वर्कशीट्स जोड़ने और प्रबंधित करने के लिए प्रवेश करें।
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (soundEnabled) playSuccessSound();
                  onOpenAdmin();
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs sm:text-sm hover:bg-amber-50 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
              >
                लॉगिन खोलें →
              </button>
            </div>
          )}

          {/* 1. PDF WORKSHEETS SECTION (High Priority User Request) */}
          {(activeCategory === 'all' || activeCategory === 'worksheets') && results.worksheets.length > 0 && (
            <div className="space-y-3 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 p-3 sm:p-4 rounded-3xl border-2 border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-emerald-600 text-white shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                      <span>{language === 'hi' ? '📄 प्रिंटेबल PDF वर्कशीट्स व कलरिंग' : 'Printable PDF Worksheets'}</span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
                        {results.worksheets.length}
                      </span>
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-emerald-800 font-medium">
                      {language === 'hi'
                        ? '1-क्लिक में डाउनलोड करें या प्रिंट करें (100% फ्री)'
                        : 'Instant 1-click high-res print or download'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate('worksheets')}
                  className="text-xs font-black text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{language === 'hi' ? 'सभी वर्कशीट्स देखें' : 'View all worksheets'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.worksheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    className="flex flex-col justify-between p-3 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-emerald-100">
                        <img
                          src={sheet.thumbnailUrl}
                          alt={sheet.titleHi}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-red-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                          PDF
                        </span>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold">
                          {sheet.ageGroup}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mb-1">
                          {sheet.category}
                        </span>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                          {language === 'hi' ? sheet.titleHi : sheet.titleEn}
                        </h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                          {language === 'hi' ? sheet.descriptionHi : sheet.descriptionEn}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadWorksheet(sheet)}
                        disabled={downloadingId === sheet.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {downloadingId === sheet.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
                            <span>{language === 'hi' ? 'डाउनलोड हो रहा है...' : 'Downloading...'}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'डाउनलोड PDF' : 'Download PDF'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleNavigate('worksheets')}
                        title="Worksheets Hub"
                        className="p-1.5 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. VIDEO STORIES SECTION (High Priority User Request) */}
          {(activeCategory === 'all' || activeCategory === 'videos') && results.videoStories.length > 0 && (
            <div className="space-y-3 bg-gradient-to-br from-red-50/70 to-rose-50/50 p-3 sm:p-4 rounded-3xl border-2 border-red-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-red-600 text-white shadow-2xs">
                    <Film className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-red-950 uppercase tracking-wider flex items-center gap-2">
                      <span>{language === 'hi' ? '🎬 वीडियो कहानियाँ (9:16 Shorts)' : 'Video Stories & Shorts'}</span>
                      <span className="px-2 py-0.2 rounded-full bg-red-200 text-red-900 text-[10px] font-black">
                        {results.videoStories.length}
                      </span>
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-red-800 font-medium">
                      {language === 'hi' ? 'रोचक 2D कार्टून व प्रेरणादायक वीडियो' : 'Interactive animated 9:16 video tales'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate('videos')}
                  className="text-xs font-black text-red-700 hover:text-red-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{language === 'hi' ? 'सभी वीडियो देखें' : 'View all videos'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.videoStories.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleOpenVideo(video)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-red-200 hover:border-red-500 hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* 9:16 Portrait Thumbnail with Play Glow */}
                    <div className="relative w-16 aspect-[9/16] rounded-xl overflow-hidden bg-black shrink-0 border border-red-300 shadow-sm group-hover:scale-105 transition-transform">
                      <img
                        src={extractYoutubeThumbnail(video.youtubeUrl, video.thumbnail) || video.thumbnail}
                        alt={video.titleHi}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/75 text-[8px] font-black text-white">
                        9:16
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.2 rounded-md bg-red-100 text-red-900 text-[9px] font-black uppercase">
                          {video.category}
                        </span>
                        {video.duration && (
                          <span className="text-[10px] text-slate-500 font-bold flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-red-500" />
                            {video.duration}
                          </span>
                        )}
                      </div>

                      <h5 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 group-hover:text-red-700 transition-colors">
                        {language === 'hi' ? video.titleHi : (video.titleEn || video.titleHi)}
                      </h5>

                      {video.descriptionHi && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {video.descriptionHi}
                        </p>
                      )}

                      <div className="pt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 group-hover:bg-red-700 text-white text-[11px] font-black shadow-xs transition-colors">
                          <Play className="w-3 h-3 fill-white" />
                          <span>{language === 'hi' ? '▶️ वीडियो देखें' : 'Watch Video'}</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. STORIES SECTION (Core Feature) */}
          {(activeCategory === 'all' || activeCategory === 'stories') && results.stories.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                    <span>{language === 'hi' ? '📖 बाल कहानियाँ (Moral Stories)' : 'Moral Stories'}</span>
                    <span className="px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                      {results.stories.length}
                    </span>
                  </h4>
                </div>

                <button
                  onClick={() => handleNavigate('stories')}
                  className="text-xs font-black text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'hi' ? 'सभी 500+ कहानियाँ' : 'View all stories'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.stories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => handleSelectStoryItem(story)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <img
                      src={story.coverImage}
                      alt={getDisplayStoryTitle(story, language)}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-amber-200 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.2 rounded-md bg-amber-100 text-amber-900 text-[9px] font-black uppercase">
                          {story.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {story.readTime}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          #{story.number}
                        </span>
                      </div>

                      <h5 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {getDisplayStoryTitle(story, language)}
                      </h5>

                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {getDisplayStorySummary(story, language)}
                      </p>

                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[11px] font-black text-amber-800 flex items-center gap-1">
                          <span>📖 {language === 'hi' ? 'पढ़ें' : 'Read'}</span>
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. KIDS MINI GAMES SECTION */}
          {(activeCategory === 'all' || activeCategory === 'games') && results.games.length > 0 && (
            <div className="space-y-3 bg-gradient-to-br from-purple-50/70 to-pink-50/50 p-3 sm:p-4 rounded-3xl border-2 border-purple-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-purple-600 text-white shadow-2xs">
                    <Gamepad2 className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-purple-950 uppercase tracking-wider flex items-center gap-2">
                      <span>{language === 'hi' ? '🎮 बाल खेल व पहेलियाँ (Kids Games)' : 'Kids Mini Games'}</span>
                      <span className="px-2 py-0.2 rounded-full bg-purple-200 text-purple-900 text-[10px] font-black">
                        {results.games.length}
                      </span>
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate('games')}
                  className="text-xs font-black text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{language === 'hi' ? 'गेम्स हब खोलें' : 'Open Games Hub'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {results.games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleNavigate('games')}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <span className="text-3xl shrink-0 group-hover:scale-125 transition-transform">
                      {game.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-black text-purple-800 bg-purple-100 px-2 py-0.2 rounded-md">
                          {game.badge || 'Game'}
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 group-hover:text-purple-800">
                        {language === 'hi' ? game.titleHi : game.titleEn}
                      </h5>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {language === 'hi' ? game.descriptionHi : game.descriptionEn}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. EARLY LEARNING ZONE SECTION */}
          {(activeCategory === 'all' || activeCategory === 'learning') && results.learningItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-emerald-600 text-white shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                    <span>{language === 'hi' ? '🔤 लर्निंग ज़ोन (अक्षर व वर्णमाला)' : 'Early Learning Zone'}</span>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
                      {results.learningItems.length}
                    </span>
                  </h4>
                </div>

                <button
                  onClick={() => handleNavigate('learning')}
                  className="text-xs font-black text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{language === 'hi' ? 'लर्निंग ज़ोन खोलें' : 'Open Learning Hub'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {results.learningItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate('learning')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/70 transition-all text-left cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                      {item.symbol}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold truncate">
                        {item.pronunciation}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. FUN FACTS SECTION */}
          {(activeCategory === 'all' || activeCategory === 'facts') && results.facts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-sky-500 text-white shadow-2xs">
                    <Lightbulb className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-sky-950 uppercase tracking-wider flex items-center gap-2">
                    <span>{language === 'hi' ? '💡 रोचक ज्ञान तथ्य (Fun Facts)' : 'Fun Facts'}</span>
                    <span className="px-2 py-0.2 rounded-full bg-sky-200 text-sky-900 text-[10px] font-black">
                      {results.facts.length}
                    </span>
                  </h4>
                </div>

                <button
                  onClick={() => handleNavigate('facts')}
                  className="text-xs font-black text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{language === 'hi' ? 'सभी तथ्य देखें' : 'View all facts'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.facts.map((fact) => (
                  <div
                    key={fact.id}
                    onClick={() => handleNavigate('facts')}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50/60 border border-sky-200 hover:border-sky-400 hover:bg-sky-100/60 transition-all cursor-pointer group"
                  >
                    <span className="text-2xl shrink-0 group-hover:scale-125 transition-transform">
                      {fact.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-black text-slate-900 truncate group-hover:text-sky-800">
                        {language === 'hi' ? fact.titleHi : fact.titleEn}
                      </h5>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {language === 'hi' ? fact.factHi : fact.factEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. AUDIO STORIES SECTION */}
          {(activeCategory === 'all' || activeCategory === 'audio') && results.audioStories.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-purple-600 text-white shadow-2xs">
                    <Headphones className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-purple-950 uppercase tracking-wider flex items-center gap-2">
                    <span>{language === 'hi' ? '🎧 ऑडियो कहानियाँ (Audio Bedtime)' : 'Audio Stories'}</span>
                    <span className="px-2 py-0.2 rounded-full bg-purple-200 text-purple-900 text-[10px] font-black">
                      {results.audioStories.length}
                    </span>
                  </h4>
                </div>

                <button
                  onClick={() => handleNavigate('audio')}
                  className="text-xs font-black text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{language === 'hi' ? 'ऑडियो हब खोलें' : 'Open Audio Hub'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.audioStories.map((audio) => (
                  <div
                    key={audio.id}
                    onClick={() => handleNavigate('audio')}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-purple-50/60 border border-purple-200 hover:border-purple-400 hover:bg-purple-100/60 transition-all cursor-pointer group"
                  >
                    <img
                      src={audio.coverImage}
                      alt={audio.titleEn}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-purple-200 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[9px] font-black text-purple-700 bg-purple-200/80 px-1.5 py-0.2 rounded-md">
                          {audio.duration}
                        </span>
                      </div>
                      <h5 className="text-xs font-black text-slate-900 truncate group-hover:text-purple-800">
                        {language === 'hi' ? audio.titleHi : audio.titleEn}
                      </h5>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State when no results match */}
          {query.trim() && results.totalCount === 0 && (
            <div className="text-center py-12 px-4 space-y-3 bg-amber-50/60 rounded-3xl border-2 border-dashed border-amber-300">
              <div className="text-5xl animate-bounce">🔍🌾</div>
              <h4 className="text-base sm:text-lg font-black text-slate-800">
                {language === 'hi'
                  ? `"${query}" के लिए कोई परिणाम नहीं मिला`
                  : `No results found for "${query}"`}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {language === 'hi'
                  ? 'कृपया दूसरा शब्द खोजें — जैसे: शेर, पंचतंत्र, वीडियो, PDF, वर्कशीट, खेल, मोर, अकबर बीरबल'
                  : 'Try searching common keywords like: story, lion, video, pdf, worksheet, games, coloring'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-3">
                {popularKeywords.slice(0, 6).map((k, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(k.query)}
                    className="px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2 font-bold text-[11px] sm:text-xs">
            <span>✨ {language === 'hi' ? '500+ कहानियाँ • 9:16 वीडियो • प्रिंटेबल PDF' : '500+ Stories • 9:16 Videos • PDFs'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें (Close)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
