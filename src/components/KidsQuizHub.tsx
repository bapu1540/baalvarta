import React from 'react';
import { Trophy, Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { Language, QuizSet } from '../types';
import { playPopSound } from '../utils/soundEffects';

interface KidsQuizHubProps {
  quizSets?: QuizSet[];
  language: Language;
  soundEnabled: boolean;
  onNavigateTab?: (tab: any, category?: string, certType?: string) => void;
  onBackToHome?: () => void;
}

export const KidsQuizHub: React.FC<KidsQuizHubProps> = ({
  language,
  soundEnabled,
  onNavigateTab,
}) => {
  const isHi = language === 'hi';

  return (
    <div className="pb-12 max-w-5xl mx-auto font-sans space-y-4 px-2 sm:px-4">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl sm:text-2xl shrink-0">🏆</span>
          <h1 className="font-black text-sm sm:text-base md:text-lg tracking-tight truncate">
            {isHi ? '8. बाल क्विज़ (Kids Quiz)' : '8. Kids Quiz Zone'}
          </h1>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-[10px] sm:text-xs font-black shrink-0 border border-white/20">
          Quiz Zone 🎯
        </span>
      </div>

      {/* Clean Empty Placeholder (Ready for new additions tomorrow) */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-rose-200">
          🏆
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black border border-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>{isHi ? 'नया क्विज़ ज़ोन जल्द आ रहा है' : 'New Quiz Zone Coming Soon'}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            {isHi ? 'यहाँ जल्द ही नए और मजेदार क्विज़ जोड़े जाएंगे!' : 'Exciting New Quizzes Coming Soon!'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {isHi
              ? 'बच्चों के लिए बिल्कुल नए, सचित्र और ज्ञानवर्धक क्विज़ गेम्स तैयार किए जा रहे हैं।'
              : 'Brand new, illustrated, and rewarding kids quiz games will be added here soon.'}
          </p>
        </div>

        {onNavigateTab && (
          <div className="pt-2">
            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                onNavigateTab('home');
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isHi ? '🏠 होमपेज पर वापस जाएं' : 'Back to Home'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
