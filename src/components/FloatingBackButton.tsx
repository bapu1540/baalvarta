import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUp, Home } from 'lucide-react';
import { Language } from '../types';
import { playPopSound } from '../utils/soundEffects';

interface FloatingBackButtonProps {
  onBack: () => void;
  onHome: () => void;
  language: Language;
  soundEnabled: boolean;
  show: boolean;
  isReadingStory?: boolean;
}

export const FloatingBackButton: React.FC<FloatingBackButtonProps> = ({
  onBack,
  onHome,
  language,
  soundEnabled,
  show,
  isReadingStory = false,
}) => {
  const isHi = language === 'hi';
  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 180) {
        setScrolledDown(true);
      } else {
        setScrolledDown(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (soundEnabled) playPopSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    if (soundEnabled) playPopSound();
    onBack();
  };

  const handleHomeClick = () => {
    if (soundEnabled) playPopSound();
    onHome();
  };

  // If not on an inner page and not reading story, only show scroll-to-top if scrolled
  if (!show && !isReadingStory) {
    if (!scrolledDown) return null;
    return (
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 animate-in fade-in zoom-in duration-200">
        <button
          onClick={scrollToTop}
          className="p-2.5 sm:p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-xl hover:shadow-2xl border-2 border-amber-300 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          title={isHi ? 'ऊपर जाएं' : 'Scroll to top'}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3.5 left-2.5 sm:bottom-5 sm:left-6 z-40 flex items-center gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[calc(100vw-90px)]">
      {/* 1. Dedicated Back Button (Step-by-step previous) */}
      <button
        id="floating-back-btn"
        onClick={handleBackClick}
        className="flex items-center gap-1 sm:gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl border-2 border-amber-200 hover:border-white transition-all active:scale-95 cursor-pointer backdrop-blur-md shrink-0"
        title={isHi ? 'पिछला पेज / वापस' : 'Go back to previous page'}
      >
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        <span className="tracking-tight whitespace-nowrap text-[11px] sm:text-xs">
          {isHi
            ? isReadingStory
              ? '← कहानियों पर'
              : '← पीछे'
            : isReadingStory
              ? '← Stories'
              : '← Back'}
        </span>
      </button>

      {/* 2. Dedicated Direct Home Button */}
      <button
        id="floating-direct-home-btn"
        onClick={handleHomeClick}
        className="flex items-center gap-1 sm:gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl border-2 border-blue-200 hover:border-white transition-all active:scale-95 cursor-pointer backdrop-blur-md shrink-0"
        title={isHi ? 'सीधे होम पेज पर जाएं' : 'Go directly to Home'}
      >
        <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        <span className="tracking-tight whitespace-nowrap text-[11px] sm:text-xs">
          {isHi ? 'होम' : 'Home'}
        </span>
      </button>

      {/* 3. Floating Scroll-To-Top Button when scrolled */}
      {scrolledDown && (
        <button
          onClick={scrollToTop}
          className="p-2 sm:p-2.5 rounded-full bg-slate-900/90 hover:bg-black text-white shadow-xl border-2 border-slate-700 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0"
          title={isHi ? 'ऊपर जाएं' : 'Scroll to top'}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
};
