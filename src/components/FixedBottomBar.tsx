import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, ArrowUp, Sparkles, User, Crown } from 'lucide-react';
import { Language, ActiveTab } from '../types';
import { playPopSound } from '../utils/soundEffects';

interface FixedBottomBarProps {
  onBack: () => void;
  onHome: () => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  language: Language;
  soundEnabled: boolean;
  activeTab: ActiveTab;
  isReadingStory?: boolean;
  isPro?: boolean;
}

export const FixedBottomBar: React.FC<FixedBottomBarProps> = ({
  onBack,
  onHome,
  onOpenProfile,
  onOpenChat,
  language,
  soundEnabled,
  activeTab,
  isReadingStory = false,
  isPro = false,
}) => {
  const isHi = language === 'hi';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    if (soundEnabled) playPopSound();
    onBack();
  };

  const handleHome = () => {
    if (soundEnabled) playPopSound();
    onHome();
  };

  const handleProfile = () => {
    if (soundEnabled) playPopSound();
    onOpenProfile();
  };

  const handleScrollToTop = () => {
    if (soundEnabled) playPopSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChat = () => {
    if (soundEnabled) playPopSound();
    onOpenChat();
  };

  const isHomeActive = activeTab === 'home' && !isReadingStory;
  const isProfileActive = activeTab === 'profile';

  return (
    <div
      role="navigation"
      aria-label="Fixed Bottom Navigation Bar"
      className="fixed bottom-2 sm:bottom-3 left-0 right-0 z-[80] flex justify-center items-center pointer-events-none px-2 select-none"
    >
      <nav className="pointer-events-auto w-full max-w-md sm:max-w-lg bg-slate-950/98 backdrop-blur-xl border-2 border-amber-400/90 rounded-2xl sm:rounded-full p-1 sm:p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] ring-2 ring-amber-400/30 transition-all">
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 items-center">
          
          {/* 1. Back Button */}
          <button
            id="bottom-bar-back-btn"
            type="button"
            onClick={handleBack}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 py-1 sm:py-1.5 px-1 rounded-xl sm:rounded-full transition-all duration-150 cursor-pointer active:scale-95 group bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 hover:text-white border border-amber-500/40 min-w-0 shadow-xs"
            title={isHi ? 'पिछला पेज / पीछे जाएं' : 'Go back to previous page'}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5] shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] sm:text-xs font-black tracking-tight truncate">
              {isReadingStory
                ? (isHi ? 'कहानियां' : 'Stories')
                : (isHi ? 'पीछे' : 'Back')}
            </span>
          </button>

          {/* 2. Home Button */}
          <button
            id="bottom-bar-home-btn"
            type="button"
            onClick={handleHome}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 py-1 sm:py-1.5 px-1 rounded-xl sm:rounded-full transition-all duration-150 cursor-pointer active:scale-95 group min-w-0 shadow-xs ${
              isHomeActive
                ? 'bg-blue-600 text-white font-black border border-blue-300 shadow-md scale-102'
                : 'bg-blue-500/20 hover:bg-blue-500/35 text-blue-300 hover:text-white border border-blue-500/40'
            }`}
            title={isHi ? 'मुख्य होम पेज पर जाएं' : 'Go to Home'}
          >
            <Home className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span className="text-[10px] sm:text-xs font-black tracking-tight truncate">
              {isHi ? 'होम' : 'Home'}
            </span>
          </button>

          {/* 3. Kids Profile (PRO Exclusive) */}
          <button
            id="bottom-bar-profile-btn"
            type="button"
            onClick={handleProfile}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 py-1 sm:py-1.5 px-1 rounded-xl sm:rounded-full transition-all duration-150 cursor-pointer active:scale-95 group relative min-w-0 shadow-xs ${
              isProfileActive
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black border border-white shadow-lg scale-105'
                : 'bg-gradient-to-r from-amber-500/30 to-yellow-500/25 hover:from-amber-500/45 hover:to-yellow-500/40 text-amber-300 hover:text-white border border-amber-400/60'
            }`}
            title={isHi ? 'बाल प्रोफ़ाइल व रिपोर्ट कार्ड (PRO VIP)' : 'Kids Profile & Report Card (PRO VIP)'}
          >
            <div className="relative flex items-center justify-center shrink-0">
              <User className="w-4 h-4 stroke-[2.5]" />
              <Crown className="w-2.5 h-2.5 fill-amber-400 text-amber-400 absolute -top-1.5 -right-1.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-black tracking-tight truncate">
              {isHi ? 'प्रोफ़ाइल' : 'Profile'}
            </span>
          </button>

          {/* 4. Upper / Scroll to Top Button */}
          <button
            id="bottom-bar-upper-btn"
            type="button"
            onClick={handleScrollToTop}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 py-1 sm:py-1.5 px-1 rounded-xl sm:rounded-full transition-all duration-150 cursor-pointer active:scale-95 group min-w-0 shadow-xs ${
              scrolled
                ? 'bg-emerald-500/35 hover:bg-emerald-500/50 text-emerald-200 border border-emerald-400'
                : 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 hover:text-white border border-emerald-500/40'
            }`}
            title={isHi ? 'पेज के सबसे ऊपर जाएं' : 'Scroll to top'}
          >
            <ArrowUp className={`w-4 h-4 stroke-[2.5] shrink-0 ${scrolled ? 'text-emerald-300 animate-bounce' : ''}`} />
            <span className="text-[10px] sm:text-xs font-black tracking-tight truncate">
              {isHi ? 'ऊपर' : 'Top'}
            </span>
          </button>

          {/* 5. Chatbot (AI बालमित्र) Button */}
          <button
            id="bottom-bar-chatbot-btn"
            type="button"
            onClick={handleChat}
            className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 py-1 sm:py-1.5 px-1 rounded-xl sm:rounded-full transition-all duration-150 cursor-pointer active:scale-95 group bg-purple-500/25 hover:bg-purple-500/40 text-purple-200 hover:text-white border border-purple-500/50 relative min-w-0 shadow-xs"
            title={isHi ? 'AI बालमित्र से बातचीत करें' : 'Chat with AI Baalmitra'}
          >
            <span className="text-xs sm:text-sm leading-none shrink-0">🤖</span>
            <span className="text-[10px] sm:text-xs font-black tracking-tight truncate flex items-center gap-0.5">
              <span>{isHi ? 'बालमित्र' : 'Chat'}</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-spin shrink-0 hidden sm:inline" />
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>

        </div>
      </nav>
    </div>
  );
};
