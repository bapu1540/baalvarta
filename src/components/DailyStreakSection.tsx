import React, { useState } from 'react';
import { Flame, Trophy, Award, Sparkles, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Calendar, HelpCircle, Star, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserProfile, StreakMilestone } from '../types';
import {
  ReadingStreakData,
  STREAK_MILESTONES,
  claimStreakMilestone,
  getReadingStreak,
} from '../utils/storage';
import { playStarChime, playPopSound, playSuccessSound } from '../utils/soundEffects';

interface DailyStreakSectionProps {
  language: Language;
  soundEnabled?: boolean;
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  onNavigateTab: (tab: any) => void;
}

export const DailyStreakSection: React.FC<DailyStreakSectionProps> = ({
  language,
  soundEnabled = true,
  userProfile,
  onProfileUpdate,
  onNavigateTab,
}) => {
  const isHi = language === 'hi';
  const [streakData, setStreakData] = useState<ReadingStreakData>(() => getReadingStreak());
  const [showExplanation, setShowExplanation] = useState(false);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const streakDays = streakData.streak;
  const todayIso = new Date().toISOString().split('T')[0];
  const hasReadToday = streakData.lastDate === todayIso;

  // Flame tier styling
  const getFlameTier = (streak: number) => {
    if (streak >= 30) {
      return {
        nameHi: '👑 कॉस्मिक लेजेंड लौ (Cosmic Fire)',
        nameEn: 'Cosmic Legend Flame',
        gradient: 'from-amber-400 via-rose-500 to-purple-600',
        bgGlow: 'bg-rose-500/20',
        borderColor: 'border-amber-400',
        textColor: 'text-amber-400',
        icon: '👑🔥',
        description: 'अविश्वसनीय! 30+ दिनों की अटूट पठन तपस्या!',
      };
    }
    if (streak >= 14) {
      return {
        nameHi: '⚡ महा ज्वाला (Blazing Inferno)',
        nameEn: 'Blazing Inferno',
        gradient: 'from-orange-500 via-red-500 to-pink-600',
        bgGlow: 'bg-red-500/20',
        borderColor: 'border-orange-400',
        textColor: 'text-orange-500',
        icon: '⚡🔥',
        description: 'अद्भुत! 2 सप्ताह से अधिक की निरंतर स्ट्रीक!',
      };
    }
    if (streak >= 7) {
      return {
        nameHi: '🔥 साप्ताहिक प्रज्वलित लौ (Weekly Blaze)',
        nameEn: 'Weekly Blaze',
        gradient: 'from-amber-500 to-orange-600',
        bgGlow: 'bg-orange-500/20',
        borderColor: 'border-orange-300',
        textColor: 'text-orange-500',
        icon: '🔥',
        description: 'शानदार! 1 पूरा सप्ताह बिना रुके कहानी पढ़ी!',
      };
    }
    if (streak >= 3) {
      return {
        nameHi: '✨ पठन चिंगारी (Reading Spark)',
        nameEn: 'Reading Spark',
        gradient: 'from-yellow-400 to-amber-500',
        bgGlow: 'bg-yellow-400/20',
        borderColor: 'border-yellow-300',
        textColor: 'text-amber-500',
        icon: '✨🔥',
        description: 'बहुत बढ़िया! लगातार 3 दिन की आदत बन रही है!',
      };
    }
    return {
      nameHi: '🌱 नव पठन ज्योति (Fresh Spark)',
      nameEn: 'Fresh Spark',
      gradient: 'from-emerald-400 to-teal-500',
      bgGlow: 'bg-emerald-500/20',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-500',
      icon: '🌱🔥',
      description: 'यात्रा शुरू हो चुकी है! हर दिन 1 कहानी पढ़ें।',
    };
  };

  const currentTier = getFlameTier(streakDays);

  // Generate last 7 days representation
  const getLast7Days = () => {
    const days = [];
    const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const iso = d.toISOString().split('T')[0];
      const dayIndex = d.getDay();
      const isToday = iso === todayIso;
      const isRead = streakData.activeDays.includes(iso);

      days.push({
        iso,
        dayName: isHi ? dayNamesHi[dayIndex] : dayNamesEn[dayIndex],
        dateNum: d.getDate(),
        isToday,
        isRead,
      });
    }
    return days;
  };

  const recentDays = getLast7Days();

  // Handle claiming milestone reward
  const handleClaim = (milestone: StreakMilestone) => {
    if (soundEnabled) playStarChime();
    const result = claimStreakMilestone(milestone.badgeId);

    if (result.success) {
      setStreakData(getReadingStreak());
      onProfileUpdate({
        ...userProfile,
        stars: userProfile.stars + milestone.rewardStars,
        claimedMilestones: [...(userProfile.claimedMilestones || []), milestone.badgeId],
      });

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

      setClaimedNotice(
        isHi
          ? `🎉 बधाई! आपने "${milestone.titleHi}" बैज व +${milestone.rewardStars} ⭐ स्टार्स प्राप्त किए!`
          : `🎉 Congrats! Claimed "${milestone.titleEn}" badge & +${milestone.rewardStars} ⭐ Stars!`
      );
      setTimeout(() => setClaimedNotice(null), 4000);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-slate-900 dark:to-slate-800/80 border-2 border-orange-300/80 dark:border-orange-500/30 p-5 sm:p-7 shadow-lg space-y-6">
      
      {/* 1. STREAK HEADER & FLAME BANNER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Animated Glowing Flame Circle */}
          <div className="relative group">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${currentTier.gradient} text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 border-white dark:border-slate-800 animate-pulse`}>
              🔥
            </div>
            {streakDays > 0 && (
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-black text-[10px] border border-amber-400 shadow-md">
                {streakDays}D
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{isHi ? 'दैनिक पठन स्ट्रीक' : 'Daily Reading Streak'}</span>
                <span className="text-orange-500 font-black">({streakDays} {isHi ? 'दिन' : 'Days'} 🔥)</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
              {isHi ? currentTier.nameHi : currentTier.nameEn} • {currentTier.description}
            </p>
          </div>
        </div>

        {/* Explain Streak Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playPopSound();
            setShowExplanation(!showExplanation);
          }}
          className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-200 dark:border-slate-700 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{isHi ? 'स्ट्रीक क्या है?' : 'What is Streak?'}</span>
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. EXPLANATION ACCORDION (ये क्या है और कैसे काम करता है) */}
      {showExplanation && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-black text-sm">
            <Flame className="w-4 h-4" />
            <span>{isHi ? '🔥 डेली स्ट्रीक (Daily Streak) क्या है और यह क्यों महत्वपूर्ण है?' : '🔥 What is Daily Streak and How It Works?'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-slate-900/50 border border-orange-100 dark:border-slate-700 space-y-1">
              <h4 className="font-black text-orange-950 dark:text-orange-200 flex items-center gap-1">
                <span>📖 1. हर दिन 1 कहानी पढ़ें:</span>
              </h4>
              <p>
                {isHi
                  ? 'जब बच्चा ऐप खोलकर रोज़ाना कम से कम 1 कहानी पूरा पढ़ता है, तो उस दिन की स्ट्रीक सक्रिय हो जाती है।'
                  : 'When the child reads at least 1 story completely every day, the streak for that day is unlocked.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-slate-900/50 border border-amber-100 dark:border-slate-700 space-y-1">
              <h4 className="font-black text-amber-950 dark:text-amber-200 flex items-center gap-1">
                <span>🔥 2. लगातार दिनों की लौ (Streak):</span>
              </h4>
              <p>
                {isHi
                  ? 'आज 1 दिन, कल 2 दिन, परसों 3 दिन... लगातार बिना नागा किए पढ़ने पर स्ट्रीक का नंबर और लौ का रंग बढ़ता है।'
                  : 'Consecutive reading days increase your streak count (1, 2, 3... days) and flame intensity!'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-slate-900/50 border border-emerald-100 dark:border-slate-700 space-y-1">
              <h4 className="font-black text-emerald-950 dark:text-emerald-200 flex items-center gap-1">
                <span>⭐ 3. बैज और बोनस स्टार्स:</span>
              </h4>
              <p>
                {isHi
                  ? '3 दिन, 7 दिन, 14 दिन और 30 दिन की स्ट्रीक पूरी होने पर विशेष "स्ट्रीक बैज" और ढेर सारे बोनस स्टार्स मिलते हैं!'
                  : 'Reach 3, 7, 14, and 30 day milestones to claim unique Streak Badges & large bonus star rewards.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-slate-900/50 border border-rose-100 dark:border-slate-700 space-y-1">
              <h4 className="font-black text-rose-950 dark:text-rose-200 flex items-center gap-1">
                <span>⚠️ 4. अगर एक दिन भी छूटा तो?</span>
              </h4>
              <p>
                {isHi
                  ? 'यदि एक दिन भी कहानी नहीं पढ़ी गई, तो स्ट्रीक टूटकर फिर से 1 से शुरू होती है। इसलिए रोज़ाना 5 मिनट पढ़ना ज़रूरी है!'
                  : 'If a day is missed without reading, the streak resets. This builds a powerful lifelong reading discipline!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Claimed Toast Banner */}
      {claimedNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm text-center shadow-lg border border-emerald-300 animate-in fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-200" />
          <span>{claimedNotice}</span>
        </div>
      )}

      {/* 3. 7-DAY ACTIVITY WEEKLY TRACKER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {isHi ? 'साप्ताहिक पठन प्रगति (Last 7 Days Activity):' : 'Weekly Reading Activity (Last 7 Days):'}
            </span>
          </div>

          <span className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400">
            {hasReadToday
              ? (isHi ? '✅ आज की कहानी पूरी हो चुकी है!' : '✅ Today\'s reading completed!')
              : (isHi ? '⏳ आज की कहानी अभी बाकी है' : '⏳ Today\'s story pending')}
          </span>
        </div>

        {/* 7 Days Circles */}
        <div className="grid grid-cols-7 gap-2">
          {recentDays.map((day) => (
            <div
              key={day.iso}
              className={`p-2 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                day.isRead
                  ? 'bg-gradient-to-b from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/30 border-orange-400 dark:border-orange-600 shadow-xs'
                  : day.isToday
                  ? 'bg-amber-50 dark:bg-slate-800 border-dashed border-2 border-orange-400 animate-pulse'
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 opacity-70'
              }`}
            >
              <span className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400">
                {day.dayName}
              </span>

              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-black shadow-2xs">
                {day.isRead ? (
                  <span className="text-base select-none animate-bounce">🔥</span>
                ) : day.isToday ? (
                  <span className="text-xs text-orange-500 font-black">आज</span>
                ) : (
                  <span className="text-xs text-slate-400 font-bold">{day.dateNum}</span>
                )}
              </div>

              <span className="text-[9px] font-bold">
                {day.isRead ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">✓ पूर्ण</span>
                ) : day.isToday ? (
                  <span className="text-orange-600 dark:text-orange-400 font-black">बाकी</span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Reading CTA if not read today */}
        {!hasReadToday && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-center sm:text-left">
              <Flame className="w-5 h-5 text-yellow-300 animate-bounce" />
              <span>
                {isHi
                  ? 'अपनी स्ट्रीक सुरक्षित रखने के लिए आज 1 कहानी ज़रूर पढ़ें!'
                  : 'Read at least 1 story today to keep your streak alive!'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('stories')}
              className="px-4 py-1.5 rounded-xl bg-white text-orange-950 font-black text-xs flex items-center gap-1.5 shadow-xs hover:bg-orange-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span>{isHi ? 'कहानी पढ़ें ➔' : 'Read Story ➔'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. STREAK MILESTONE BADGES SHOWCASE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {isHi ? 'स्ट्रीक मील के पत्थर व सम्मान बैज (Streak Badges):' : 'Streak Milestone Badges:'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {streakData.claimedMilestones.length} / {STREAK_MILESTONES.length} {isHi ? 'प्राप्त' : 'Claimed'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STREAK_MILESTONES.map((milestone) => {
            const isUnlocked = streakDays >= milestone.days;
            const isClaimed = streakData.claimedMilestones.includes(milestone.badgeId);

            return (
              <div
                key={milestone.badgeId}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isClaimed
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                    : isUnlocked
                    ? 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-400 dark:border-amber-600 shadow-md ring-2 ring-amber-300/50'
                    : 'bg-white dark:bg-slate-800/80 border-black/10 dark:border-white/10 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Badge Icon Circle */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md ${
                      isClaimed
                        ? 'bg-emerald-500 text-white'
                        : isUnlocked
                        ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white animate-bounce'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {milestone.badgeIcon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                        {isHi ? milestone.titleHi : milestone.titleEn}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {isHi ? milestone.descriptionHi : milestone.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Bottom Reward Row & Claim Button */}
                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>+{milestone.rewardStars} ⭐</span>
                  </div>

                  <div>
                    {isClaimed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isHi ? 'प्राप्त' : 'Claimed'}</span>
                      </span>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleClaim(milestone)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer animate-pulse"
                      >
                        {isHi ? 'दावा करें ⭐' : 'Claim ⭐'}
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/5">
                        {streakDays} / {milestone.days} {isHi ? 'दिन' : 'Days'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
