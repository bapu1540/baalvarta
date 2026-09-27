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
    <footer className="mt-16 relative bg-slate-950 text-slate-200 border-t-4 border-amber-500 font-sans overflow-hidden w-full max-w-full">
      {/* Top Banner / Family & Reader Trust Guarantee */}
      <div className="relative z-10 bg-amber-600/95 text-white py-3.5 px-4 sm:px-6 border-b border-amber-500/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0 shadow-xs">
              🛡️
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base">
                {language === 'hi'
                  ? 'परिवार व सभी उम्र के बच्चों के लिए 100% सुरक्षित, ज्ञानवर्धक व नैतिक मंच'
                  : 'Family-Friendly, Safe & Moral Storytelling for All Ages'}
              </p>
              <p className="text-amber-100 text-xs font-medium">
                {language === 'hi'
                  ? 'सदाबहार नैतिक कहानियाँ • भारतीय संस्कृति व संस्कार • वैज्ञानिक रोचक तथ्य व ज्ञान'
                  : 'Timeless Moral Tales • Cultural & Family Values • Science Facts & Early Learning'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold bg-amber-700/80 px-3.5 py-1.5 rounded-xl border border-amber-400/50 shrink-0">
            <Mail className="w-3.5 h-3.5 text-amber-200" />
            <a href="mailto:baalvarta@gmail.com" className="hover:text-amber-100 transition-colors">
              baalvarta@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="w-full flex flex-col space-y-8">
          
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
                  ⭐ 500+ कहानियाँ
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 flex items-center gap-1 shadow-xs">
                  🔤 प्रारंभिक वर्णमाला
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-sky-400 border border-slate-700 flex items-center gap-1 shadow-xs">
                  🎧 ऑडियो बुक्स
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
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
              <div>
                <div className="font-medium text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span>© {new Date().getFullYear()} बालवार्ता (Baalvarta) • ऑल राइट्स रिसर्व्ड।</span>
                  <button
                    onClick={() => {
                      if (onOpenAdmin) onOpenAdmin();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-400 transition-colors cursor-pointer py-0.5 px-2 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700"
                    title="व्यवस्थापक (Admin CMS) लॉगिन"
                  >
                    <Lock className="w-3 h-3 text-slate-500 hover:text-amber-400" />
                    <span>व्यवस्थापक</span>
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
