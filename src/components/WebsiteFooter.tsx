import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Mail,
  ChevronRight,
  Lock,
  Trophy,
  Award,
  Flame,
  Download,
  Eye,
} from 'lucide-react';
import { ActiveTab, Language } from '../types';
import {
  getStoredFooterImage,
  getTotalSubscriberCount,
  getStoredVisitorCount,
  recordSiteVisit,
  BASELINE_SUBSCRIBERS_COUNT,
} from '../utils/storage';
import {
  subscribeToFirestoreNewsletterSubscribers,
  subscribeToFirestoreVisitorCount,
} from '../utils/firebase';
import { BaalvartaLogo } from './BaalvartaLogo';
import { playSuccessSound, playPopSound } from '../utils/soundEffects';

interface WebsiteFooterProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenAdmin: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  customFooterImage?: string | null;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({
  onNavigate,
  onOpenAdmin,
  language,
  setLanguage,
  customFooterImage,
}) => {
  const currentFooterImage = customFooterImage !== undefined ? customFooterImage : getStoredFooterImage();
  const [subscribersCount, setSubscribersCount] = useState<number>(() => getTotalSubscriberCount());
  const [visitorCount, setVisitorCount] = useState<number>(() => getStoredVisitorCount());

  // Record site visit on mount and subscribe to real-time updates
  useEffect(() => {
    // Record visit (safe once per session)
    const current = recordSiteVisit();
    setVisitorCount(current);

    // Sync live listeners
    const handleSubUpdate = () => {
      setSubscribersCount(getTotalSubscriberCount());
    };
    const handleVisUpdate = () => {
      setVisitorCount(getStoredVisitorCount());
    };

    window.addEventListener('baalvarta_subscribers_updated', handleSubUpdate);
    window.addEventListener('baalvarta_visitor_count_updated', handleVisUpdate);
    window.addEventListener('storage', handleSubUpdate);

    const unsubFirestoreSubs = subscribeToFirestoreNewsletterSubscribers((subs) => {
      if (subs && subs.length > 0) {
        setSubscribersCount(BASELINE_SUBSCRIBERS_COUNT + subs.length);
      }
    });

    const unsubFirestoreVis = subscribeToFirestoreVisitorCount((count) => {
      if (typeof count === 'number' && count > 0) {
        setVisitorCount(count);
      }
    });

    return () => {
      window.removeEventListener('baalvarta_subscribers_updated', handleSubUpdate);
      window.removeEventListener('baalvarta_visitor_count_updated', handleVisUpdate);
      window.removeEventListener('storage', handleSubUpdate);
      if (unsubFirestoreSubs) unsubFirestoreSubs();
      if (unsubFirestoreVis) unsubFirestoreVis();
    };
  }, []);

  return (
    <footer className="mt-2 sm:mt-3 relative bg-slate-950 text-slate-200 border-t-4 border-amber-500 font-sans overflow-hidden w-full max-w-full">
      {/* Top Banner / Email on Left + Instagram, YouTube, WhatsApp & Total Visitors on Right */}
      <div className="relative z-10 bg-amber-600/95 text-white py-2.5 px-3 sm:px-6 border-b border-amber-500/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          {/* Left Side: Email Address & Safe Guarantee */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3.5">
            <a
              href="mailto:baalvarta@gmail.com"
              className="flex items-center gap-2 text-xs sm:text-sm font-extrabold bg-amber-700/90 hover:bg-amber-800 text-white px-3.5 py-1.5 rounded-xl border border-amber-400/60 shadow-xs transition-all hover:scale-102 group cursor-pointer"
              title={language === 'hi' ? 'बालवार्ता ईमेल करें' : 'Email Baalvarta'}
            >
              <Mail className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-amber-100 font-bold hidden xs:inline">{language === 'hi' ? 'ईमेल:' : 'Email:'}</span>
              <span className="font-black text-white hover:text-amber-200 transition-colors">baalvarta@gmail.com</span>
            </a>

            <div className="flex items-center gap-1.5 text-xs text-amber-100 font-semibold">
              <span className="text-base shrink-0">🛡️</span>
              <span className="hidden sm:inline">
                {language === 'hi'
                  ? 'परिवार व बच्चों के लिए 100% सुरक्षित, ज्ञानवर्धक व नैतिक मंच'
                  : '100% Kid-Safe & Moral Storytelling Platform'}
              </span>
              <span className="sm:hidden">
                {language === 'hi' ? '100% सुरक्षित मंच' : '100% Kid-Safe'}
              </span>
            </div>
          </div>

          {/* Right Side: Instagram, YouTube, WhatsApp Channel AND Total Visitors with Live Counter */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 shrink-0">
            {/* 1. Instagram Official Channel */}
            <a
              href="https://www.instagram.com/baalvarta?stkn=dmhuNjFoYzNlZ2N2"
              target="_blank"
              rel="noopener noreferrer"
              title={language === 'hi' ? 'बालवार्ता इंस्टाग्राम पेज खोलें (रील्स व अपडेट्स)' : 'Follow Baalvarta on Instagram for Daily Reels'}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/40 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[11px] font-black">{language === 'hi' ? '📸 इंस्टाग्राम फॉलो' : '📸 Instagram'}</span>
                <span className="block text-[9px] text-pink-100 font-bold">{language === 'hi' ? 'रील्स व अपडेट्स ➔' : 'Reels ➔'}</span>
              </div>
            </a>

            {/* 2. YouTube Official Channel */}
            <a
              href="https://www.youtube.com/@baalvartaofficial"
              target="_blank"
              rel="noopener noreferrer"
              title={language === 'hi' ? 'बालवार्ता यूट्यूब चैनल सब्सक्राइब करें' : 'Subscribe to Baalvarta on YouTube'}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/40 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[11px] font-black">{language === 'hi' ? '▶️ यूट्यूब सब्सक्राइब' : '▶️ YouTube'}</span>
                <span className="block text-[9px] text-red-100 font-bold">{language === 'hi' ? 'वीडियो कहानियाँ ➔' : 'Videos ➔'}</span>
              </div>
            </a>

            {/* 3. WhatsApp Official Channel */}
            <a
              href="https://whatsapp.com/channel/0029VbD1k2lDJ6Gyz6uimY1w"
              target="_blank"
              rel="noopener noreferrer"
              title={language === 'hi' ? 'बालवार्ता आधिकारिक व्हाट्सएप चैनल से जुड़ें' : 'Join Baalvarta Official WhatsApp Channel'}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border border-emerald-300/60 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.983.54 1.776.78 2.791.78h.001c3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.766-5.769-5.766zm3.376 8.21c-.144.405-.837.774-1.17.824-.312.045-.698.075-2.021-.476-1.572-.656-2.584-2.253-2.663-2.357-.078-.104-.639-.851-.639-1.624 0-.773.405-1.155.549-1.311.144-.156.312-.195.416-.195.104 0 .208.001.299.006.096.005.225-.036.351.268.13.312.442 1.077.481 1.155.039.078.065.169.013.273-.052.104-.078.169-.156.26-.078.091-.164.203-.234.273-.078.078-.16.162-.069.318.091.156.403.666.865 1.078.594.529 1.096.693 1.252.771.156.078.247.065.338-.039.091-.104.39-.455.494-.611.104-.156.208-.13.351-.078.143.052.91.429 1.066.507.156.078.26.117.299.182.039.065.039.377-.105.782z"/>
                </svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[11px] font-black">{language === 'hi' ? '🟢 व्हाट्सएप चैनल' : '🟢 WhatsApp'}</span>
                <span className="block text-[9px] text-emerald-100 font-bold">{language === 'hi' ? 'फ्री अपडेट्स ➔' : 'Join Free ➔'}</span>
              </div>
            </a>

            {/* 4. Total Website Visitors Badge with Live Counter (Same Loved Button Layout) */}
            <div
              title={language === 'hi' ? 'बालवार्ता कुल वेबसाइट विज़िटर्स संख्या' : 'Baalvarta Total Website Visitors'}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white text-xs font-black shadow-md border-2 border-amber-400/70"
            >
              <div className="w-5 h-5 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="block text-[11px] font-black text-amber-200">
                    {language === 'hi' ? '👥 कुल विज़िटर्स' : '👥 Total Visitors'}
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs font-mono">
                    {visitorCount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="block text-[9px] text-amber-300/90 font-bold">
                  {language === 'hi' ? 'लाइव विज़िटर ट्रैकर ✓' : 'Live Site Visits ✓'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-7">
        <div className="w-full flex flex-col space-y-6">
          
          {/* 1. Brand & Mission: PERFECTLY CENTERED FOR MOBILE, TABLET & COMPUTER */}
          <div className="w-full flex flex-col items-center justify-center text-center space-y-3 py-1">
            <div className="flex items-center justify-center w-full">
              <button
                onClick={() => {
                  onNavigate('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-transform hover:scale-105 inline-flex items-center justify-center mx-auto"
                title="Baalvarta Home"
              >
                <div className="p-2.5 sm:p-3.5 rounded-3xl bg-slate-900/90 border-2 border-amber-400/50 inline-flex items-center justify-center shadow-2xl backdrop-blur-xs mx-auto ring-2 ring-amber-500/20">
                  <BaalvartaLogo variant="footer" />
                </div>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto text-center px-2">
              {language === 'hi'
                ? 'बालवार्ता भारत का प्रमुख 2D सचित्र बाल कहानी एवं प्रारंभिक बाल शिक्षा वेब पोर्टल है। हमारा उद्देश्य बच्चों में नैतिक मूल्य, पढ़ने की आदत और वैज्ञानिक जिज्ञासा को जगाना है।'
                : 'Baalvarta is India\'s premier 2D illustrated story and early childhood education web portal, nurturing moral values, reading habits, and scientific curiosity.'}
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold mx-auto">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 border border-slate-800 flex items-center gap-1 shadow-xs">
                {language === 'hi' ? '⭐ 500+ कहानियाँ' : '⭐ 500+ Stories'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800 flex items-center gap-1 shadow-xs">
                {language === 'hi' ? '🔤 प्रारंभिक वर्णमाला' : '🔤 Early Alphabets'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-sky-400 border border-slate-800 flex items-center gap-1 shadow-xs">
                {language === 'hi' ? '🎧 ऑडियो बुक्स' : '🎧 Audio Books'}
              </span>
            </div>
          </div>

          {/* 2. Four Navigation Columns: Strictly 2-Column (2x2 Grid) on both Mobile and Desktop */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:gap-6 pt-4 border-t border-slate-800/80">
              
              {/* Row 1, Left: Story Library */}
              <div className="space-y-2 sm:space-y-3 bg-slate-900/60 p-2.5 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border border-slate-800/80 hover:border-amber-500/40 transition-all">
                <h4 className="text-[11px] sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-1 sm:gap-2 pb-1.5 sm:pb-2 border-b border-slate-800">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-400 truncate">{language === 'hi' ? 'कहानी श्रेणियाँ' : 'Story Library'}</span>
                  <span className="hidden md:inline text-[10px] text-slate-400 font-normal">({language === 'hi' ? 'Story Library' : 'Categories'})</span>
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('stories');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'पंचतंत्र की कहानियाँ' : 'Panchatantra Stories'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('stories');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'नैतिक शिक्षा कथाएं' : 'Moral Value Tales'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('stories');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'पशु-पक्षी की बातें' : 'Animal Stories'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('stories');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'मनपसंद ऑडियो कहानियाँ' : 'Audio Stories'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('facts');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'रोचक तथ्य (Did You Know?)' : 'Science Fun Facts'}</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Row 1, Right: Learning & Media */}
              <div className="space-y-2 sm:space-y-3 bg-slate-900/60 p-2.5 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition-all">
                <h4 className="text-[11px] sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-1 sm:gap-2 pb-1.5 sm:pb-2 border-b border-slate-800">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 truncate">{language === 'hi' ? 'लर्निंग व मीडिया' : 'Learning & Media'}</span>
                  <span className="hidden md:inline text-[10px] text-slate-400 font-normal">({language === 'hi' ? 'Learning & Media' : 'Tools'})</span>
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('learning');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'वर्णमाला (अ से ज्ञ)' : 'Hindi Varnamala'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('learning');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'अंग्रेजी अक्षर (A to Z)' : 'English ABC Phonics'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('learning');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'गिनती व गणित (1 to 100)' : 'Numbers & Math'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('audio');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'ऑडियो स्टोरी प्लेयर' : 'Audio Story Corner'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('coloring');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold text-amber-300 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? '🎨 आर्ट, कलरिंग व पेपर क्राफ्ट' : '🎨 Art, Colouring & Origami'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('games');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold text-purple-300 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-purple-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? '🧩 मिनी गेम्स (Memory & Puzzle)' : '🧩 Kids Mini Games'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('certificates');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold text-yellow-300 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-yellow-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? '🏆 बाल पाठक प्रमाण पत्र' : '🏆 Reader Certificate'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('worksheets');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold text-teal-300 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-teal-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? '🖨️ प्रिंटेबल वर्कशीट्स' : '🖨️ Printable Worksheets'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('videos');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? '🎬 वीडियो कहानियाँ (Shorts)' : '🎬 Video Stories'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('quizzes');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? '🏆 बाल क्विज़ खेल' : 'Kids Quiz Games'}</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Row 2, Left: Parent & Info */}
              <div className="space-y-2 sm:space-y-3 bg-slate-900/60 p-2.5 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border border-slate-800/80 hover:border-sky-500/40 transition-all">
                <h4 className="text-[11px] sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-1 sm:gap-2 pb-1.5 sm:pb-2 border-b border-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
                  <span className="text-sky-400 truncate">{language === 'hi' ? 'अभिभावक व संस्था' : 'Parent & Info'}</span>
                  <span className="hidden md:inline text-[10px] text-slate-400 font-normal">({language === 'hi' ? 'Parent & Info' : 'About'})</span>
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('parent-guide');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-sky-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-sky-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'मुफ्त वर्कशीट PDF' : 'Free Worksheets'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('about');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-sky-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-sky-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'हमारे बारे में' : 'About Baalvarta'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-sky-400 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                    >
                      <ChevronRight className="w-3 h-3 text-sky-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="line-clamp-2">{language === 'hi' ? 'फीडबैक व संपर्क' : 'Contact & Feedback'}</span>
                    </button>
                  </li>
                  <li className="pt-0.5">
                    <a
                      href="mailto:baalvarta@gmail.com"
                      className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-300 leading-tight"
                    >
                      <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="font-bold text-[9px] sm:text-xs truncate">baalvarta@gmail.com</span>
                    </a>
                  </li>
                  <li className="pt-0.5 flex items-center gap-1 text-[9px] sm:text-[11px] text-emerald-400/90 font-medium leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="truncate">{language === 'hi' ? '100% बाल-सुरक्षित' : '100% Kid-Safe'}</span>
                  </li>
                </ul>
              </div>

              {/* Row 2, Right: Kids Certificate Awards Hub */}
              <div className="space-y-2 sm:space-y-3 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-amber-950/20 p-2.5 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border border-amber-500/30 hover:border-amber-400/60 transition-all flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] sm:text-sm font-black text-white uppercase tracking-wider flex items-center justify-between gap-1 pb-1.5 sm:pb-2 border-b border-slate-800">
                    <span className="flex items-center gap-1 sm:gap-2 truncate">
                      <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                      <span className="text-amber-400 truncate">{language === 'hi' ? 'बाल सम्मान पत्र' : 'Award Certificates'}</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      PDF
                    </span>
                  </h4>

                  <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs mt-2 sm:mt-3">
                    <li>
                      <button
                        onClick={() => {
                          onNavigate('certificates');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-amber-400 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                      >
                        <Award className="w-3 h-3 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="line-clamp-2">{language === 'hi' ? 'सुपर स्टोरी रीडर अवॉर्ड' : 'Super Reader Award'}</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onNavigate('certificates');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-amber-400 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="line-clamp-2">{language === 'hi' ? 'क्विज़ चैंपियन सम्मान पत्र' : 'Quiz Champion Certificate'}</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-amber-400 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer text-left w-full group leading-tight"
                      >
                        <Flame className="w-3 h-3 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="line-clamp-2">{language === 'hi' ? 'लर्नर पासपोर्ट व स्ट्रीक' : 'Learner Passport & Streak'}</span>
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 sm:pt-3 border-t border-slate-800/80 mt-1 sm:mt-2">
                  <button
                    onClick={() => {
                      onNavigate('certificates');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-center py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950 shrink-0" />
                    <span className="truncate">{language === 'hi' ? 'सर्टिफिकेट डाउनलोड करें' : 'Download Certificates'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* 3. Bottom Bar: Copyright */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
              
              {/* Copyright & Admin Link */}
              <div>
                <div className="font-medium text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span>© {new Date().getFullYear()} बालवार्ता (Baalvarta) • {language === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All Rights Reserved.'}</span>
                  <button
                    onClick={() => {
                      if (onOpenAdmin) onOpenAdmin();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-400 transition-colors cursor-pointer py-0.5 px-2 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700"
                    title={language === 'hi' ? 'व्यवस्थापक (Admin CMS) लॉगिन' : 'Admin CMS Login'}
                  >
                    <Lock className="w-3 h-3 text-slate-500 hover:text-amber-400" />
                    <span>{language === 'hi' ? 'व्यवस्थापक' : 'Admin'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === 'hi'
                    ? 'भारतीय बच्चों और परिवारों के लिए प्रेम और शिक्षा के साथ समर्पित।'
                    : 'Dedicated to children and families across India and beyond.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      </footer>
    );
  };
