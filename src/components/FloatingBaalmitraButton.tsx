import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { Language } from '../types';
import { playPopSound } from '../utils/soundEffects';

interface FloatingBaalmitraButtonProps {
  onOpenChat: () => void;
  language: Language;
  soundEnabled: boolean;
}

export const FloatingBaalmitraButton: React.FC<FloatingBaalmitraButtonProps> = ({
  onOpenChat,
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center group font-sans">
      {/* Tooltip bubble */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-purple-600 text-purple-900 text-xs font-black shadow-lg mr-2 transform transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 pointer-events-none select-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
        <span>{isHi ? 'AI बालमित्र से बात करें!' : 'Chat with AI Baalmitra!'}</span>
      </div>

      {/* Main Floating Button */}
      <button
        onClick={() => {
          if (soundEnabled) playPopSound();
          onOpenChat();
        }}
        className="relative flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-2 sm:border-3 border-slate-900 shadow-xl hover:shadow-2xl transform active:scale-95 transition-all duration-200"
        title={isHi ? 'AI बालमित्र (ज्ञान साथी)' : 'AI Baalmitra (Kids Guide)'}
      >
        {/* Animated Bot Badge */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-white/30">
          🤖
        </div>

        <div className="text-left hidden sm:block pr-1">
          <div className="text-xs font-black text-white leading-tight flex items-center gap-1">
            <span>{isHi ? 'AI बालमित्र' : 'AI Baalmitra'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="text-[10px] text-amber-200 font-bold leading-tight">
            {isHi ? 'ज्ञान साथी 🌟' : 'Kids Smart AI 🌟'}
          </div>
        </div>

        {/* Mobile Mini Badge */}
        <span className="sm:hidden absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
      </button>
    </div>
  );
};
