import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Square,
  Play,
  Type,
  Sun,
  Moon,
  Coffee,
  Heart,
  Bookmark,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Smile,
  Copy,
  Check,
  Maximize2,
  Image as ImageIcon,
  Layers,
  Film,
  Pause,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Story, StoryScene, Language } from '../types';
import {
  getDisplayStoryTitle,
  getDisplayStoryContent,
  getDisplayStorySummary,
  getDisplayStoryMoral,
} from '../utils/storyLanguageHelper';
import { safeCopyToClipboard } from '../utils/clipboard';
import {
  playPopSound,
  playSuccessSound,
  speakText,
  stopSpeech,
  pauseSpeech,
  resumeSpeech,
  isSpeechPaused
} from '../utils/soundEffects';
import { recordStoryRead, getReadingStreak } from '../utils/storage';
import { trackStoryView, trackStoryLike, trackStoryShare } from '../utils/analytics';
import { AdBannerSlot } from './AdBannerSlot';
import { StoryReadingProgressIndicator } from './StoryReadingProgressIndicator';

interface StoryReaderPageProps {
  story: Story;
  allStories: Story[];
  language: Language;
  soundEnabled: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onLikeStory: (id: string) => void;
  onBack: () => void;
  onSelectStory: (story: Story) => void;
  onWatchVideo?: (category?: string, title?: string) => void;
  onLanguageChange?: (lang: Language) => void;
}

export const StoryReaderPage: React.FC<StoryReaderPageProps> = ({
  story,
  allStories,
  language,
  soundEnabled,
  isBookmarked,
  onToggleBookmark,
  onLikeStory,
  onBack,
  onSelectStory,
  onWatchVideo,
  onLanguageChange,
}) => {
  // Reading preferences
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [theme, setTheme] = useState<'cream' | 'white' | 'warm' | 'dark'>('cream');
  const [fontFamily, setFontFamily] = useState<'noto' | 'baloo' | 'mukta' | 'rozha'>('noto');
  
  // Full View / Distraction Free Mode
  const [isFullViewMode, setIsFullViewMode] = useState(false);

  // TTS State & Speed control (Default 0.78 is soothing bedtime pace)
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.78);
  
  // Feedback states
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);

  // View Mode: 'picture_book' (Photo + Words per scene slider) or 'full_text' (Full page reader)
  const [viewMode, setViewMode] = useState<'picture_book' | 'full_text'>(() => {
    return story.scenes && story.scenes.length > 0 ? 'picture_book' : 'full_text';
  });
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isSceneSpeaking, setIsSceneSpeaking] = useState(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const articleRef = React.useRef<HTMLElement | null>(null);

  // Dynamic reading progress percentage
  const totalStoryScenes = story.scenes?.length || 1;
  const isPictureBook = viewMode === 'picture_book' && !!(story.scenes && story.scenes.length > 0);
  
  const readingProgressPercentage = isCompleted
    ? 100
    : isPictureBook
    ? Math.round(((currentSceneIndex + 1) / totalStoryScenes) * 100)
    : Math.max(5, Math.round(scrollProgress));

  // Track scroll position in full text mode
  useEffect(() => {
    if (isPictureBook) return;

    const handleScroll = () => {
      if (!articleRef.current) return;
      const rect = articleRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height;
      const topOffset = rect.top;

      if (topOffset > windowHeight * 0.5) {
        setScrollProgress(5);
      } else {
        const scrolled = Math.max(0, windowHeight * 0.4 - topOffset);
        const progress = Math.min(100, Math.max(5, (scrolled / Math.max(totalHeight - windowHeight * 0.4, 100)) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPictureBook, isCompleted, story.id]);

  // Scroll to top and track view when story changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsCompleted(false);
    setScrollProgress(5);
    stopSpeech();
    setIsReadingAloud(false);
    setIsPaused(false);
    setIsSceneSpeaking(false);
    setCurrentSceneIndex(0);
    if (story.scenes && story.scenes.length > 0) {
      setViewMode('picture_book');
    } else {
      setViewMode('full_text');
    }
    // Track story view in Firebase Analytics
    trackStoryView(story);
  }, [story.id]);

  const handleSpeakScene = (scene: StoryScene) => {
    if (soundEnabled) playPopSound();
    if (isSceneSpeaking) {
      stopSpeech();
      setIsSceneSpeaking(false);
      return;
    }
    const textToRead = language === 'hi' ? scene.textHi : (scene.textEn || scene.textHi);
    speakText(
      textToRead,
      language,
      0.88,
      () => setIsSceneSpeaking(true),
      () => setIsSceneSpeaking(false)
    );
  };

  const handleNextScene = () => {
    if (!story.scenes) return;
    if (soundEnabled) playPopSound();
    stopSpeech();
    setIsSceneSpeaking(false);
    if (currentSceneIndex < story.scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
    } else {
      handleTriggerConfetti();
    }
  };

  const handlePrevScene = () => {
    if (!story.scenes) return;
    if (soundEnabled) playPopSound();
    stopSpeech();
    setIsSceneSpeaking(false);
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleSpeak = (customRate?: number) => {
    if (soundEnabled) playPopSound();

    if (isReadingAloud && !customRate) {
      // Toggle off / Stop speech
      handleStopSpeech();
      return;
    }

    const rateToUse = customRate ?? speechRate;
    const title = getDisplayStoryTitle(story, language);
    const content = getDisplayStoryContent(story, language);
    const moral = language === 'hi'
      ? `कहानी की सीख: ${getDisplayStoryMoral(story, language)}`
      : `Moral of the Story: ${getDisplayStoryMoral(story, language)}`;
    const fullText = `${title}. ... ${content}. ... ${moral}`;

    speakText(
      fullText,
      language,
      rateToUse,
      () => {
        setIsReadingAloud(true);
        setIsPaused(false);
      },
      () => {
        setIsReadingAloud(false);
        setIsPaused(false);
      },
      () => {
        setIsReadingAloud(false);
        setIsPaused(false);
      }
    );
  };

  const handleStopSpeech = () => {
    if (soundEnabled) playPopSound();
    stopSpeech();
    setIsReadingAloud(false);
    setIsPaused(false);
    setIsSceneSpeaking(false);
  };

  const handlePauseResumeSpeech = () => {
    if (soundEnabled) playPopSound();
    if (isPaused) {
      resumeSpeech();
      setIsPaused(false);
    } else {
      pauseSpeech();
      setIsPaused(true);
    }
  };

  const handleChangeSpeed = (newRate: number) => {
    if (soundEnabled) playPopSound();
    setSpeechRate(newRate);
    if (isReadingAloud) {
      handleSpeak(newRate);
    }
  };

  const [readingStreakInfo, setReadingStreakInfo] = useState<{ streak: number; totalRead: number }>(() => getReadingStreak());

  const handleTriggerConfetti = () => {
    if (soundEnabled) playSuccessSound();
    setIsCompleted(true);
    const updated = recordStoryRead();
    setReadingStreakInfo(updated);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'],
      });
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (soundEnabled) playPopSound();
    const shareTitle = getDisplayStoryTitle(story, language);
    const shareText = getDisplayStorySummary(story, language);
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        trackStoryShare(story.id, shareTitle, 'web_share');
        await navigator.share({
          title: `बालवार्ता - ${shareTitle}`,
          text: `${shareText}\n\nबालवार्ता पर पूरी कहानी पढ़ें:`,
          url: shareUrl,
        });
      } catch {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      trackStoryShare(story.id, shareTitle, 'clipboard');
      copyToClipboard(shareUrl);
    }
  };

  const handleShareWhatsApp = () => {
    if (soundEnabled) playPopSound();
    const shareTitle = getDisplayStoryTitle(story, language);
    const shareMoral = getDisplayStoryMoral(story, language);
    const shareSummary = getDisplayStorySummary(story, language);
    const shareUrl = window.location.origin;

    trackStoryShare(story.id, shareTitle, 'whatsapp');
    const message = `📖 *बालवार्ता (Baalvarta) - ${shareTitle}*\n\n"${shareSummary}"\n\n✨ *कहानी की सीख:* ${shareMoral}\n\n👇 बालवार्ता पर बच्चों के लिए यह सचित्र कहानी पढ़ें:\n${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = async (text: string) => {
    await safeCopyToClipboard(text);
    setShowToast(language === 'hi' ? 'कहानी का लिंक कॉपी हो गया!' : 'Story link copied to clipboard!');
    setTimeout(() => setShowToast(null), 3000);
  };

  // Find next and prev stories
  const currentIndex = allStories.findIndex((s) => s.id === story.id);
  const prevStory = currentIndex > 0 ? allStories[currentIndex - 1] : allStories[allStories.length - 1];
  const nextStory = currentIndex < allStories.length - 1 ? allStories[currentIndex + 1] : allStories[0];

  // Related / recommended stories
  const relatedStories = allStories
    .filter((s) => s.id !== story.id)
    .slice(0, 3);

  // Split content into paragraphs
  const rawContent = getDisplayStoryContent(story, language);
  const paragraphs = rawContent.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  // Get active font family style
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case 'noto':
        return "'Noto Serif Devanagari', Georgia, serif";
      case 'baloo':
        return "'Baloo 2', 'Quicksand', cursive, sans-serif";
      case 'mukta':
        return "'Mukta', system-ui, sans-serif";
      case 'rozha':
        return "'Rozha One', 'Noto Serif Devanagari', serif";
      default:
        return "'Noto Serif Devanagari', serif";
    }
  };

  // Theme styling classes
  const getThemeContainerClass = () => {
    switch (theme) {
      case 'cream':
        return 'bg-[#FFFDF6] text-[#2C2013] border-amber-200/80 shadow-md';
      case 'warm':
        return 'bg-[#FEF7EA] text-[#332008] border-amber-300 shadow-md';
      case 'white':
        return 'bg-white text-slate-900 border-slate-200 shadow-md';
      case 'dark':
        return 'bg-[#181C24] text-slate-100 border-slate-800 shadow-xl';
    }
  };

  const getToolbarClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-900 text-slate-100 border-slate-800 shadow-md';
      case 'warm':
        return 'bg-[#FEF7EA] text-amber-950 border-amber-300 shadow-sm';
      case 'cream':
        return 'bg-[#FFFDF6] text-amber-950 border-amber-200 shadow-sm';
      case 'white':
        return 'bg-white text-slate-900 border-slate-200 shadow-sm';
    }
  };

  return (
    <div className={`font-sans ${isFullViewMode ? 'fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-[#FDFBF7] dark:bg-[#12161F] animate-in fade-in' : 'space-y-3 sm:space-y-4 pb-12'}`}>
      
      {/* Top Floating Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 sm:h-1.5 bg-black/10 dark:bg-white/10 pointer-events-none shadow-xs">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 transition-all duration-300 shadow-xs"
          style={{ width: `${readingProgressPercentage}%` }}
        />
      </div>
      
      {/* Full View Exit Top Banner */}
      {isFullViewMode && (
        <div className="sticky top-1 z-50 mb-3 max-w-4xl mx-auto flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white shadow-xl border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-black">
              📖 {language === 'hi' ? 'डिस्टर्ब-फ्री फुल व्यू (Distraction-Free)' : 'Distraction-Free Full View'}
            </span>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              setIsFullViewMode(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सामान्य दृश्य (Exit)' : 'Exit Full View'}</span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* COMPACT ORGANIZED READING TOOLBAR */}
      <div className={`relative z-10 p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border shadow-sm transition-colors space-y-2.5 ${getToolbarClass()}`}>
        
        {/* Line 1: Audio Narrator, Speed, Font Size & Theme */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
          
          {/* Left: Back, Audio & Speed Group */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                onBack();
              }}
              title={language === 'hi' ? 'कहानियों पर वापस जाएं' : 'Back to Stories'}
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 text-amber-900 dark:text-amber-200 border border-amber-500/40 text-[11px] sm:text-xs font-black flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
            </button>

            <button
              id="tts-read-aloud-btn"
              onClick={() => handleSpeak()}
              className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0 ${
                isReadingAloud
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {isReadingAloud ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>{language === 'hi' ? 'रोकें' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{language === 'hi' ? 'कहानी सुनो' : 'Listen'}</span>
                </>
              )}
            </button>

            {/* Speed Selector (0.7x, 0.8x, 1.0x) */}
            <div className="h-8 sm:h-9 flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleChangeSpeed(0.7)}
                title={language === 'hi' ? 'धीमी गति (0.7x)' : 'Slow pace (0.7x)'}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  speechRate === 0.7 ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                0.7x
              </button>
              <button
                type="button"
                onClick={() => handleChangeSpeed(0.78)}
                title={language === 'hi' ? 'मीठी कहानी गति (0.8x)' : 'Bedtime pace (0.8x)'}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  speechRate === 0.78 ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                0.8x
              </button>
              <button
                type="button"
                onClick={() => handleChangeSpeed(1.0)}
                title={language === 'hi' ? 'सामान्य गति (1.0x)' : 'Normal speed (1.0x)'}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  speechRate === 1.0 ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                1.0x
              </button>
            </div>
          </div>

          {/* Right: Font Switcher, Font Size & Theme Group */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
            {/* Font Family Switcher (Desktop) */}
            <div className="hidden lg:flex items-center gap-0.5 p-0.5 h-8 sm:h-9 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">
              <button
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setFontFamily('noto');
                }}
                className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-colors ${
                  fontFamily === 'noto' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {language === 'hi' ? 'देवनागरी' : 'Serif'}
              </button>
              <button
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setFontFamily('baloo');
                }}
                className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-colors ${
                  fontFamily === 'baloo' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {language === 'hi' ? 'बाल-फ़ॉन्ट' : 'Kids Font'}
              </button>
            </div>

            {/* Language Toggle in Reader */}
            {onLanguageChange && (
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  onLanguageChange(language === 'hi' ? 'en' : 'hi');
                }}
                title={language === 'hi' ? 'Switch story text to English' : 'कहानी हिंदी में पढ़ें'}
                className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-[10px] sm:text-xs shadow-2xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>{language === 'hi' ? 'ENG' : 'हिंदी'}</span>
              </button>
            )}

            {/* Font Size Button */}
            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                setFontSize(
                  fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'huge' : 'normal'
                );
              }}
              title={language === 'hi' ? 'फ़ॉन्ट आकार बदलें' : 'Change font size'}
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 font-black flex items-center gap-1 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-[11px] cursor-pointer"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="font-extrabold text-[10px] sm:text-[11px]">
                {fontSize === 'normal' ? (language === 'hi' ? 'A (छोटा)' : 'A (Small)') : fontSize === 'large' ? (language === 'hi' ? 'A+ (मध्यम)' : 'A+ (Medium)') : (language === 'hi' ? 'A++ (बड़ा)' : 'A++ (Large)')}
              </span>
            </button>

            {/* Theme Palette Toggle */}
            <div className="h-8 sm:h-9 flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">
              <button
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setTheme('cream');
                }}
                title={language === 'hi' ? 'कागज़ी थीम (Cream)' : 'Cream Theme'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  theme === 'cream' ? 'bg-amber-200 text-amber-900 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setTheme('white');
                }}
                title={language === 'hi' ? 'श्वेत दिन मोड (Day White)' : 'Day White Mode'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  theme === 'white' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setTheme('dark');
                }}
                title={language === 'hi' ? 'रात्रि मोड (Night Dark)' : 'Night Dark Mode'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-800 text-amber-300 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Line 2: Actions Bar (Likes, Bookmark, WhatsApp, Share, Full View) */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 pt-1 border-t border-black/5 dark:border-white/10 w-full overflow-x-auto no-scrollbar">
          
          {/* Like */}
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              trackStoryLike(story.id, language === 'hi' ? story.titleHi : story.titleEn, story.category);
              onLikeStory(story.id);
            }}
            title={language === 'hi' ? 'कहानी पसंद करें' : 'Like Story'}
            className="flex-1 min-w-[54px] h-8 sm:h-8.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer text-xs font-black"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>{story.likes}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onToggleBookmark(story.id);
            }}
            title={isBookmarked ? (language === 'hi' ? 'बुकमार्क हटाया' : 'Remove Bookmark') : (language === 'hi' ? 'बुकमार्क करें' : 'Bookmark Story')}
            className={`flex-1 min-w-[54px] h-8 sm:h-8.5 rounded-xl border flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer text-xs font-bold ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-black/10'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            <span className="hidden xs:inline text-[11px] font-black">{isBookmarked ? (language === 'hi' ? 'सहेजा' : 'Saved') : (language === 'hi' ? 'सहेजें' : 'Save')}</span>
          </button>

          {/* WhatsApp Share */}
          <button
            onClick={handleShareWhatsApp}
            title={language === 'hi' ? 'WhatsApp पर शेयर करें' : 'Share on WhatsApp'}
            className="flex-1 min-w-[70px] h-8 sm:h-8.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer font-bold text-xs"
          >
            <span className="text-xs">📲</span>
            <span className="text-[11px] font-black">WhatsApp</span>
          </button>

          {/* Share Link */}
          <button
            onClick={handleShare}
            title={language === 'hi' ? 'कहानी शेयर करें' : 'Share Story'}
            className="flex-1 min-w-[50px] h-8 sm:h-8.5 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-black/10 flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer text-xs font-bold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline text-[11px] font-black">{language === 'hi' ? 'शेयर' : 'Share'}</span>
          </button>

          {/* Distraction-Free Full View Button */}
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              setIsFullViewMode(!isFullViewMode);
            }}
            title={isFullViewMode ? (language === 'hi' ? 'फुल व्यू से बाहर निकलें' : 'Exit Full View') : (language === 'hi' ? 'डिस्टर्ब-फ्री फुल व्यू मोड' : 'Distraction-Free Mode')}
            className={`flex-1 min-w-[65px] h-8 sm:h-8.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95 ${
              isFullViewMode
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
            }`}
          >
            {isFullViewMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-black">{isFullViewMode ? (language === 'hi' ? 'सामान्य' : 'Exit') : (language === 'hi' ? 'फुल व्यू' : 'Full View')}</span>
          </button>
        </div>
      </div>

      {/* MAIN READING PAGE CONTAINER */}
      <article
        ref={articleRef}
        className={`max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border transition-colors ${getThemeContainerClass()}`}
      >
        {/* Visual Reading Progress Indicator at top for children */}
        <StoryReadingProgressIndicator
          progressPercentage={readingProgressPercentage}
          currentScene={currentSceneIndex + 1}
          totalScenes={totalStoryScenes}
          isPictureBookMode={isPictureBook}
          isCompleted={isCompleted}
          language={language}
          soundEnabled={soundEnabled}
          onJumpToScene={(idx) => {
            if (soundEnabled) playPopSound();
            stopSpeech();
            setIsSceneSpeaking(false);
            setCurrentSceneIndex(idx);
          }}
        />
        
        {/* Header Section */}
        <header className="space-y-3 pb-4 border-b border-black/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-xs shadow-xs">
                {language === 'hi' ? 'क्रमांक #' : 'Story #'}{story.number}
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                {story.category}
              </span>
              {story.scenes && story.scenes.length > 0 && (
                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>📸 {language === 'hi' ? `सचित्र दृश्य-कथा (${story.scenes.length} फोटो)` : `Picture Book (${story.scenes.length} Photos)`}</span>
                </span>
              )}
              {story.isFeatured && (
                <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>{language === 'hi' ? 'विशेष बाल कथा' : 'Featured Story'}</span>
                </span>
              )}
            </div>

            {/* View Mode Toggle (If Story has multiple scenes) */}
            {story.scenes && story.scenes.length > 0 && (
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/5 border border-black/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setViewMode('picture_book');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 transition-all ${
                    viewMode === 'picture_book'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>📸 {language === 'hi' ? 'सचित्र दृश्य मोड' : 'Picture Scene Mode'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setViewMode('full_text');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 transition-all ${
                    viewMode === 'full_text'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>📜 {language === 'hi' ? 'सम्पूर्ण पृष्ठ पाठ' : 'Full Page Text'}</span>
                </button>
              </div>
            )}
          </div>

          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight"
            style={{ fontFamily: getFontFamilyStyle() }}
          >
            {getDisplayStoryTitle(story, language)}
          </h1>

          <p className="text-xs sm:text-sm font-semibold opacity-80 leading-relaxed font-sans">
            {getDisplayStorySummary(story, language)}
          </p>
        </header>

        {/* 📸 PICTURE-BOOK SCENE-BY-SCENE READER MODE */}
        {story.scenes && story.scenes.length > 0 && viewMode === 'picture_book' ? (
          <div className="my-6 space-y-6">
            {/* Scene Header & Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-xs">
                  {language === 'hi' ? 'दृश्य' : 'Scene'} {currentSceneIndex + 1} / {story.scenes.length}
                </span>
                <span className="font-bold text-xs sm:text-sm text-amber-950">
                  {story.scenes[currentSceneIndex].captionHi || `${language === 'hi' ? 'दृश्य' : 'Scene'} ${currentSceneIndex + 1}`}
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {story.scenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      stopSpeech();
                      setIsSceneSpeaking(false);
                      setCurrentSceneIndex(idx);
                    }}
                    title={`${language === 'hi' ? 'दृश्य' : 'Scene'} ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSceneIndex
                        ? 'w-7 bg-amber-500'
                        : idx < currentSceneIndex
                        ? 'w-3 bg-amber-300'
                        : 'w-2 bg-amber-200/80 hover:bg-amber-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Scene Image Card (16:9 with Zoom) */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-black/10 bg-slate-900 group">
              <div className="aspect-video w-full overflow-hidden flex items-center justify-center bg-black/10">
                <img
                  src={story.scenes[currentSceneIndex].image}
                  alt={story.scenes[currentSceneIndex].captionHi || `दृश्य ${currentSceneIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-102"
                />
              </div>

              {/* Top/Bottom Badges */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'दृश्य #' : 'Scene #'}{currentSceneIndex + 1}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedZoomImage(story.scenes![currentSceneIndex].image)}
                className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                title={language === 'hi' ? 'फोटो बड़ा करें' : 'Zoom Image'}
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'hi' ? 'बड़ा देखें' : 'View Full'}</span>
              </button>
            </div>

            {/* Story Words for this Photo */}
            <div
              className={`p-6 sm:p-8 rounded-3xl bg-amber-100/40 border-2 border-amber-300/80 shadow-md space-y-4 text-justify ${
                fontSize === 'huge'
                  ? 'text-xl sm:text-2xl leading-loose'
                  : fontSize === 'large'
                  ? 'text-base sm:text-xl leading-relaxed'
                  : 'text-sm sm:text-base leading-normal'
              }`}
              style={{
                fontFamily: getFontFamilyStyle(),
                textAlign: 'justify',
                textJustify: 'inter-word',
              }}
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-200/60">
                <span className="text-xs font-black uppercase text-amber-900 font-sans flex items-center gap-1.5">
                  <span>📖 {language === 'hi' ? 'दृश्य के बोल (Story Words)' : 'Story Words for this Scene'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSpeakScene(story.scenes![currentSceneIndex])}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all ${
                    isSceneSpeaking
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  }`}
                >
                  {isSceneSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'रोकें' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>🔊 {language === 'hi' ? 'यह दृश्य सुनें' : 'Listen to Scene'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="font-semibold leading-relaxed text-slate-900">
                {language === 'hi'
                  ? story.scenes[currentSceneIndex].textHi
                  : story.scenes[currentSceneIndex].textEn || story.scenes[currentSceneIndex].textHi}
              </p>

              {story.scenes[currentSceneIndex].textEn && language === 'hi' && (
                <p className="text-xs sm:text-sm font-sans text-slate-500 italic pt-2 border-t border-amber-200/40">
                  {story.scenes[currentSceneIndex].textEn}
                </p>
              )}
            </div>

            {/* Navigation Buttons: Previous / Next Scene */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={currentSceneIndex === 0}
                onClick={handlePrevScene}
                className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  currentSceneIndex === 0
                    ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800 shadow-sm cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{language === 'hi' ? 'पिछला दृश्य' : 'Previous Scene'}</span>
              </button>

              <div className="text-center">
                <span className="text-xs font-black text-amber-900">
                  {currentSceneIndex + 1} / {story.scenes.length}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextScene}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-102"
              >
                <span>{currentSceneIndex === story.scenes.length - 1 ? (language === 'hi' ? '🎉 कहानी पूर्ण करें' : '🎉 Complete Story') : (language === 'hi' ? 'अगला दृश्य ➔' : 'Next Scene ➔')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Carousel Bar */}
            <div className="p-4 rounded-2xl bg-black/5 border border-black/10 space-y-2">
              <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'hi' ? 'सभी दृश्य (क्लिक करके जाएं):' : 'All Scenes (Click to jump):'}</span>
              </p>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                {story.scenes.map((sc, idx) => (
                  <button
                    key={sc.id || idx}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      stopSpeech();
                      setIsSceneSpeaking(false);
                      setCurrentSceneIndex(idx);
                    }}
                    className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === currentSceneIndex
                        ? 'border-amber-500 ring-2 ring-amber-400 scale-105'
                        : 'border-black/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={sc.image}
                      alt={sc.captionHi || `दृश्य ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/70 text-white text-[9px] font-black">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 📜 FULL TEXT / CONTINUOUS STORY READER (FOR STANDARD STORIES OR FULL TEXT MODE) */
          <>
            {/* Cover Image (Strict 16:9 Aspect Ratio) */}
            {story.coverImage && (
              <div className="my-6 sm:my-8 rounded-3xl overflow-hidden shadow-lg border border-black/10 relative group aspect-video w-full bg-slate-100">
                <img
                  src={story.coverImage}
                  alt={getDisplayStoryTitle(story, language)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-102 duration-300"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold">
                  {language === 'hi' ? 'चित्र:' : 'Photo:'} {getDisplayStoryTitle(story, language)}
                </div>
              </div>
            )}

            {/* If story has scenes and user is viewing full text, render each scene's photo & text together */}
            {story.scenes && story.scenes.length > 0 ? (
              <div className="space-y-8 my-6">
                {story.scenes.map((scene, scIdx) => (
                  <div
                    key={scene.id || scIdx}
                    className="p-5 sm:p-7 rounded-3xl bg-amber-50/40 border border-amber-200/80 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-xs">
                        {language === 'hi' ? 'दृश्य #' : 'Scene #'}{scIdx + 1}
                      </span>
                      {scene.captionHi && (
                        <span className="font-bold text-xs text-amber-950">{scene.captionHi}</span>
                      )}
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-sm border border-black/10 relative group aspect-video w-full bg-slate-100">
                      <img
                        src={scene.image}
                        alt={`${language === 'hi' ? 'दृश्य' : 'Scene'} ${scIdx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover cursor-pointer hover:scale-102 transition-transform duration-300"
                        onClick={() => setSelectedZoomImage(scene.image)}
                      />
                      <div
                        onClick={() => setSelectedZoomImage(scene.image)}
                        className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white p-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <p
                      className={`text-justify leading-relaxed ${
                        fontSize === 'huge'
                          ? 'text-xl sm:text-2xl leading-loose'
                          : fontSize === 'large'
                          ? 'text-base sm:text-xl leading-relaxed'
                          : 'text-sm sm:text-base leading-normal'
                      }`}
                      style={{
                        fontFamily: getFontFamilyStyle(),
                        textAlign: 'justify',
                        textJustify: 'inter-word',
                      }}
                    >
                      {language === 'hi' ? scene.textHi : scene.textEn || scene.textHi}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* STANDARD PARAGRAPHS RENDER */
              <div
                className={`space-y-6 text-justify leading-relaxed ${
                  fontSize === 'huge'
                    ? 'text-xl sm:text-2xl leading-loose'
                    : fontSize === 'large'
                    ? 'text-base sm:text-xl leading-relaxed'
                    : 'text-sm sm:text-base leading-normal'
                }`}
                style={{
                  fontFamily: getFontFamilyStyle(),
                  textAlign: 'justify',
                  textJustify: 'inter-word',
                }}
              >
                {paragraphs.map((para, pIndex) => (
                  <React.Fragment key={pIndex}>
                    <p className="indent-4 sm:indent-6">{para}</p>

                    {/* Inside illustrations */}
                    {story.illustrations && story.illustrations.length > 0 && pIndex === 1 && (
                      <figure className="my-8 rounded-2xl overflow-hidden border border-black/10 bg-black/5 p-2 sm:p-3 text-center shadow-sm">
                        <div
                          className="relative rounded-xl overflow-hidden max-h-80 w-full group cursor-pointer"
                          onClick={() => setSelectedZoomImage(story.illustrations![0])}
                        >
                          <img
                            src={story.illustrations[0]}
                            alt={language === 'hi' ? 'कहानी दृश्य 1' : 'Story Scene 1'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover max-h-80 rounded-lg group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                            <Maximize2 className="w-4 h-4" />
                            <span>{language === 'hi' ? 'बड़ा चित्र देखें' : 'View Full Image'}</span>
                          </div>
                        </div>
                        <figcaption className="mt-2 text-[11px] sm:text-xs font-sans font-bold opacity-75">
                          {language === 'hi' ? 'चित्र 1: कहानी का मुख्य प्रसंग' : 'Illustration 1: Story Scene'}
                        </figcaption>
                      </figure>
                    )}

                    {story.illustrations && story.illustrations.length > 1 && pIndex === Math.floor(paragraphs.length * 0.7) && (
                      <figure className="my-8 rounded-2xl overflow-hidden border border-black/10 bg-black/5 p-2 sm:p-3 text-center shadow-sm">
                        <div
                          className="relative rounded-xl overflow-hidden max-h-80 w-full group cursor-pointer"
                          onClick={() => setSelectedZoomImage(story.illustrations![1])}
                        >
                          <img
                            src={story.illustrations[1]}
                            alt={language === 'hi' ? 'कहानी दृश्य 2' : 'Story Scene 2'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover max-h-80 rounded-lg group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                            <Maximize2 className="w-4 h-4" />
                            <span>{language === 'hi' ? 'बड़ा चित्र देखें' : 'View Full Image'}</span>
                          </div>
                        </div>
                        <figcaption className="mt-2 text-[11px] sm:text-xs font-sans font-bold opacity-75">
                          {language === 'hi' ? 'चित्र 2: कहानी का शिक्षाप्रद मोड़' : 'Illustration 2: Story Climax Scene'}
                        </figcaption>
                      </figure>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        )}

        {/* MORAL OF THE STORY (शिक्षाप्रद बॉक्स) */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-400/80 shadow-md space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base shadow-xs">
              🌟
            </span>
            <h3 className="text-base sm:text-lg font-black text-amber-950 font-sans uppercase tracking-wider">
              {language === 'hi' ? 'इस कहानी की नैतिक सीख (Moral of the Story)' : 'Moral of the Story'}
            </h3>
          </div>

          <p
            className="text-base sm:text-xl font-bold leading-relaxed text-amber-950/90 italic pl-2 border-l-4 border-amber-500"
            style={{ fontFamily: getFontFamilyStyle() }}
          >
            "{getDisplayStoryMoral(story, language)}"
          </p>
        </div>

        {/* Ad Space Slot inside Story Reader */}
        <AdBannerSlot format="banner" slotId="story-reader-moral-banner" />

        {/* FAMILY & PARENT DISCUSSION CORNER (माता-पिता व बच्चों के बीच बातचीत) */}
        <div className="mt-8 p-6 rounded-3xl bg-blue-50/80 border-2 border-blue-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👨‍👩‍👧</span>
            <h3 className="text-base font-extrabold text-blue-900">
              {language === 'hi' ? 'माता-पिता व बच्चों के लिए चर्चा बिंदु (Discussion Prompts)' : 'Parent-Child Discussion Prompts'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'कहानी पढ़ने के बाद अपने बच्चे से ये सरल सवाल पूछें ताकि उनकी कल्पना और नैतिक विचार शक्ति बढ़े:'
              : 'Ask your child these open-ended questions after reading to build reflection and critical thinking:'}
          </p>
          <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-800 list-disc list-inside">
            {language === 'hi' ? (
              <>
                <li>"अगर आप इस कहानी के मुख्य पात्र की जगह होते, तो क्या करते?"</li>
                <li>"इस कहानी में आपको सबसे अच्छी बात या पात्र कौन सा लगा और क्यों?"</li>
                <li>"क्या आपके साथ भी कभी ऐसा हुआ है जब किसी दोस्त ने आपकी मदद की हो?"</li>
              </>
            ) : (
              <>
                <li>"What would you do if you were in the main character's shoes?"</li>
                <li>"Which part of the story did you like the most, and why?"</li>
                <li>"Can you remember a time when a kind friend helped you when you needed it?"</li>
              </>
            )}
          </ul>
        </div>

        {/* STORY FINISHED CELEBRATION */}
        <div className="mt-10 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleTriggerConfetti}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isCompleted
                  ? language === 'hi'
                    ? `शाबाश! कुल पढ़ी गई कहानियाँ: ${readingStreakInfo.totalRead} ⭐`
                    : `Awesome! Total Stories Read: ${readingStreakInfo.totalRead} ⭐`
                  : language === 'hi'
                  ? 'मैंने यह कहानी पूरी पढ़ ली! 🎉'
                  : 'I Finished This Story! 🎉'}
              </span>
            </button>
            {isCompleted && (
              <span className="text-xs font-extrabold px-3 py-1.5 bg-amber-100 text-amber-900 rounded-xl border border-amber-200 animate-pulse">
                🔥 {language === 'hi' ? `${readingStreakInfo.streak} दिन की स्ट्रीक!` : `${readingStreakInfo.streak} Day Streak!`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                onLikeStory(story.id);
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>{language === 'hi' ? 'कहानी पसंद आई' : 'Liked it'} ({story.likes})</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'शेयर करें' : 'Share'}</span>
            </button>

            {/* Direct WhatsApp Button */}
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
            >
              <span className="text-sm">📲</span>
              <span>{language === 'hi' ? 'WhatsApp पर भेजें' : 'Share on WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* 🎬 WATCH VIDEO STORY SINGLE STRIP (यहाँ क्लिक करें (वीडियो देखें)) */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playPopSound();
              stopSpeech();
              setIsReadingAloud(false);
              setIsPaused(false);
              if (onWatchVideo) {
                onWatchVideo(story.category, language === 'hi' ? story.titleHi : story.titleEn);
              }
            }}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md border border-red-400/80 transition-all active:scale-[0.99] cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors shrink-0">
                <Play className="w-3.5 h-3.5 fill-white text-white" />
              </span>
              <span className="truncate">
                {language === 'hi'
                  ? 'यहाँ क्लिक करें (वीडियो देखें)'
                  : 'Click here (Watch Video)'}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-amber-200 shrink-0 flex items-center gap-1">
              <span>🎬 9:16 Shorts</span>
              <span>➔</span>
            </span>
          </button>
        </div>

        {/* BOTTOM STORY PAGING (PREV / NEXT) */}
        <div className="mt-12 pt-8 border-t border-dashed border-black/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onSelectStory(prevStory);
            }}
            className="p-4 rounded-2xl border border-black/10 hover:border-amber-400 bg-black/5 hover:bg-amber-500/10 text-left transition-all group flex items-center gap-3"
          >
            <ChevronLeft className="w-5 h-5 text-amber-600 shrink-0 group-hover:-translate-x-1 transition-transform" />
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">
                {language === 'hi' ? 'पिछली कहानी' : 'Previous Story'}
              </span>
              <p className="font-extrabold text-xs sm:text-sm line-clamp-1">
                #{prevStory.number} {getDisplayStoryTitle(prevStory, language)}
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onSelectStory(nextStory);
            }}
            className="p-4 rounded-2xl border border-black/10 hover:border-amber-400 bg-black/5 hover:bg-amber-500/10 text-right transition-all group flex items-center justify-end gap-3"
          >
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">
                {language === 'hi' ? 'अगली कहानी' : 'Next Story'}
              </span>
              <p className="font-extrabold text-xs sm:text-sm line-clamp-1">
                #{nextStory.number} {getDisplayStoryTitle(nextStory, language)}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-600 shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </article>

      {/* RELATED / MORE STORIES SECTION */}
      <section className="max-w-4xl mx-auto space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>{language === 'hi' ? 'और मजेदार बाल कहानियाँ पढ़ें' : 'Read More Moral Stories'}</span>
          </h2>
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onBack();
            }}
            className="text-xs font-bold text-amber-700 hover:text-amber-900"
          >
            {language === 'hi' ? 'सभी देखें →' : 'View All →'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedStories.map((rel) => (
            <div
              key={rel.id}
              onClick={() => {
                if (soundEnabled) playPopSound();
                onSelectStory(rel);
              }}
              className="bg-white rounded-2xl p-3.5 border-2 border-slate-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="relative rounded-xl overflow-hidden h-32 w-full">
                  <img
                    src={rel.coverImage}
                    alt={getDisplayStoryTitle(rel, language)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-amber-500 text-white font-black text-[10px]">
                    #{rel.number}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                  {getDisplayStoryTitle(rel, language)}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {getDisplayStorySummary(rel, language)}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>{rel.readTime}</span>
                <span className="text-amber-600 group-hover:underline flex items-center gap-0.5">
                  <span>{language === 'hi' ? 'पढ़ें' : 'Read'}</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image Zoom Lightbox Modal */}
      {selectedZoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedZoomImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent">
            <img
              src={selectedZoomImage}
              alt="Zoomed Illustration"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain"
            />
            <button
              onClick={() => setSelectedZoomImage(null)}
              className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-black font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 🔊 DOCKED FLOATING AUDIO STORY NARRATION BAR (कहानी वाचन व गति नियंत्रण) */}
      {isReadingAloud && (
        <aside aria-label="Audio Story Narration Player" className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-50 p-3 sm:p-4 rounded-3xl bg-slate-950/95 backdrop-blur-xl text-white border-2 border-amber-400 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Indicator & Title */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                <Volume2 className="w-5 h-5 animate-bounce" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-black border border-emerald-500/30">
                    {isPaused ? '⏸️ रुका हुआ' : '🔊 मधुर आवाज़ में वाचन चालू'}
                  </span>
                  <span className="text-[10px] text-slate-400">गति: {speechRate}x</span>
                </div>
                <h4 className="text-xs sm:text-sm font-black truncate text-amber-100">
                  {language === 'hi' ? story.titleHi : story.titleEn}
                </h4>
              </div>
            </div>

            {/* Right: Controls & Speed */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              {/* Speed Controls */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => handleChangeSpeed(0.7)}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    speechRate === 0.7 ? 'bg-amber-500 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="धीमी व मीठी गति"
                >
                  0.7x
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeSpeed(0.78)}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    speechRate === 0.78 ? 'bg-amber-500 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="आराम से (कहानी शैली)"
                >
                  0.8x
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeSpeed(1.0)}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    speechRate === 1.0 ? 'bg-amber-500 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="सामान्य गति"
                >
                  1.0x
                </button>
              </div>

              {/* Pause/Resume */}
              <button
                type="button"
                onClick={handlePauseResumeSpeech}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all active:scale-95"
                title={isPaused ? 'फिर से शुरू करें' : 'आवाज़ रोकें'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
              </button>

              {/* STOP BUTTON (RED) */}
              <button
                type="button"
                onClick={handleStopSpeech}
                className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                title="कहानी वाचन बंद करें"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>रोकें (Stop)</span>
              </button>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
};
