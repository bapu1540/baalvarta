import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUp, Home } from 'lucide-react';
import { Language } from '../types';
import { playPopSound } from '../utils/soundEffects';

interface FloatingBackButtonProps {
  onBackToHome: () => void;
  language: Language;
  soundEnabled: boolean;
  show: boolean;
  isReadingStory?: boolean;
}

export const FloatingBackButton: React.FC<FloatingBackButtonProps> = ({
  onBackToHome,
  language,
  soundEnabled,
  show,
  isReadingStory = false,
}) => {
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

  const handleBack = () => {
    if (soundEnabled) playPopSound();
    onBackToHome();
  };

  // If not on an inner page and not reading story, only show scroll-to-top if scrolled (positioned nicely above floating AI widget)
  if (!show && !isReadingStory) {
    if (!scrolledDown) return null;
    return (
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 animate-in fade-in zoom-in duration-200">
        <button
          onClick={scrollToTop}
          className="p-2.5 sm:p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-xl hover:shadow-2xl border-2 border-amber-300 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          title={language === 'hi' ? 'ऊपर जाएं' : 'Scroll to top'}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-3 sm:bottom-5 sm:left-6 z-40 flex items-center gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-[calc(100vw-100px)]">
      {/* Primary Fixed Back Button */}
      <button
        id="floating-back-to-home-btn"
        onClick={handleBack}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl border-2 border-amber-200 hover:border-white transition-all active:scale-95 cursor-pointer backdrop-blur-md shrink-0"
        title={language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Go back to Home page'}
      >
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] animate-pulse" />
        <span className="tracking-tight whitespace-nowrap text-[11px] sm:text-xs">
          {language === 'hi'
            ? isReadingStory
              ? '← कहानियों पर'
              : '← होम पर'
            : isReadingStory
              ? '← Stories'
              : '← Home'}
        </span>
      </button>

      {/* Floating Scroll-To-Top Button right beside it when scrolled */}
      {scrolledDown && (
        <button
          onClick={scrollToTop}
          className="p-2 sm:p-2.5 rounded-full bg-slate-900/90 hover:bg-black text-white shadow-xl border-2 border-slate-700 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0"
          title={language === 'hi' ? 'ऊपर जाएं' : 'Scroll to top'}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
};
