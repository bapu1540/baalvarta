import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Heart,
  Mail,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  Globe,
  Lock,
  Upload,
  KeyRound,
  PlusCircle,
  Film,
  FileQuestion,
  Trophy,
  Award,
  Flame,
  Download
} from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { getStoredFooterImage } from '../utils/storage';
import { BaalvartaLogo } from './BaalvartaLogo';

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
  return (
    <footer className="mt-2 sm:mt-3 relative bg-slate-950 text-slate-200 border-t-4 border-amber-500 font-sans overflow-hidden w-full max-w-full">
      {/* Top Banner / Email on Left + Instagram & YouTube Channel Logos on Right */}
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

          {/* Right Side: Instagram & YouTube Official Channel Buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 shrink-0">
            <span className="text-xs font-black text-amber-100 hidden lg:inline">
              {language === 'hi' ? 'हमसे जुड़ें:' : 'Follow Us:'}
            </span>

            {/* 1. Instagram Official Channel */}
            <a
              href="https://www.instagram.com/baalvarta?stkn=dmhuNjFoYzNlZ2N2"
              target="_blank"
              rel="noopener noreferrer"
              title={language === 'hi' ? 'बालवार्ता इंस्टाग्राम पेज खोलें' : 'Follow Baalvarta on Instagram'}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/30 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>

            {/* 2. YouTube Official Channel */}
            <a
              href="https://www.youtube.com/@baalvartaofficial"
              target="_blank"
              rel="noopener noreferrer"
              title={language === 'hi' ? 'बालवार्ता यूट्यूब चैनल खोलें' : 'Subscribe to Baalvarta on YouTube'}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all border border-white/30 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="w-full flex flex-col space-y-4 sm:space-y-5">
          
          {/* 1. Brand & Mission */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => {
                  onNavigate('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-transform hover:scale-105 text-left inline-flex"
                title="Baalvarta Home"
              >
                <div className="p-2 sm:p-2.5 rounded-3xl bg-slate-900/80 border-2 border-amber-400/40 inline-flex items-center shadow-xl backdrop-blur-xs">
                  <BaalvartaLogo variant="footer" />
                </div>
              </button>
            </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
                {language === 'hi'
                  ? 'बालवार्ता भारत का प्रमुख 2D सचित्र बाल कहानी एवं प्रारंभिक बाल शिक्षा वेब पोर्टल है। हमारा उद्देश्य बच्चों में नैतिक मूल्य, पढ़ने की आदत और वैज्ञानिक जिज्ञासा को जगाना है।'
                  : 'Baalvarta is India\'s premier 2D illustrated story and early childhood education web portal, nurturing moral values, reading habits, and scientific curiosity.'}
              </p>

              <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 border border-slate-700 flex items-center gap-1 shadow-xs">
                  {language === 'hi' ? '⭐ 500+ कहानियाँ' : '⭐ 500+ Stories'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1 shadow-xs">
                  {language === 'hi' ? '🔤 प्रारंभिक वर्णमाला' : '🔤 Early Alphabets'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-sky-400 border border-slate-700 flex items-center gap-1 shadow-xs">
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
                      <span className="line-clamp-2">{language === 'hi' ? '🎨 किड्स कलरिंग बुक' : '🎨 Kids Coloring Book'}</span>
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

            {/* 3. Bottom Bar: Copyright & Language Switch */}
            <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
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

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'hi' ? 'Change to English' : 'हिंदी में बदलें'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };
