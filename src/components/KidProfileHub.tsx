import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Crown,
  Download,
  Flame,
  Heart,
  HelpCircle,
  Lightbulb,
  Music,
  Palette,
  Play,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  Star,
  Trophy,
  User,
  UserCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Story, UserProfile, DailyTaskItem } from '../types';
import {
  getUserProfile,
  saveUserProfile,
  getStoredDailyTasks,
  claimDailyTaskReward,
  getStoredStories,
  getBookmarks,
  getReadingStreak
} from '../utils/storage';
import { playPopSound, playSuccessSound, playStarChime } from '../utils/soundEffects';
import { DailyStreakSection } from './DailyStreakSection';

interface KidProfileHubProps {
  language: Language;
  soundEnabled: boolean;
  onNavigateTab: (tab: any) => void;
  onSelectStory: (story: Story) => void;
  onOpenProModal: () => void;
}

const AVATAR_OPTIONS = [
  { emoji: '🦁', nameHi: 'बहादुर शेर', nameEn: 'Brave Lion' },
  { emoji: '🚀', nameHi: 'नन्हा एस्ट्रोनॉट', nameEn: 'Space Explorer' },
  { emoji: '🦉', nameHi: 'बुद्धिमान उल्लू', nameEn: 'Wise Owl' },
  { emoji: '🐼', nameHi: 'प्यारा पांडा', nameEn: 'Cute Panda' },
  { emoji: '🦄', nameHi: 'जादुई यूनिकॉर्न', nameEn: 'Magic Unicorn' },
  { emoji: '🦊', nameHi: 'चतुर लोमड़ी', nameEn: 'Clever Fox' },
  { emoji: '🐘', nameHi: 'दोस्त हाथी', nameEn: 'Friendly Elephant' },
  { emoji: '🌟', nameHi: 'चमकता सितारा', nameEn: 'Shining Star' },
  { emoji: '🐯', nameHi: 'तेजस्वी बाघ', nameEn: 'Playful Tiger' },
  { emoji: '🐬', nameHi: 'खुशमिजाज डॉल्फिन', nameEn: 'Joyful Dolphin' },
];

export const KidProfileHub: React.FC<KidProfileHubProps> = ({
  language,
  soundEnabled,
  onNavigateTab,
  onSelectStory,
  onOpenProModal,
}) => {
  const isHi = language === 'hi';

  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());
  const [dailyTasks, setDailyTasks] = useState<DailyTaskItem[]>(() => getStoredDailyTasks());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name || 'आरव चौहान');
  const [ageGroupInput, setAgeGroupInput] = useState(profile.ageGroup || '6-8 वर्ष');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [bookmarkedStories, setBookmarkedStories] = useState<Story[]>([]);
  const [streakInfo, setStreakInfo] = useState<{ streak: number; totalRead: number }>(() => getReadingStreak());

  // Load Bookmarks & Sync data
  useEffect(() => {
    const currentProfile = getUserProfile();
    setProfile(currentProfile);
    setNameInput(currentProfile.name);
    setAgeGroupInput(currentProfile.ageGroup);

    const allStories = getStoredStories();
    const bookmarkIds = getBookmarks();
    const filtered = allStories.filter((s) => bookmarkIds.includes(s.id));
    setBookmarkedStories(filtered);
    setStreakInfo(getReadingStreak());
  }, []);

  // Level Progression Calculation
  const getLevelInfo = (stars: number) => {
    if (stars >= 300) {
      return {
        level: 4,
        titleHi: '👑 बाल महा-विद्वान (Grand Master Scholar)',
        titleEn: 'Grand Master Scholar',
        badgeColor: 'from-amber-500 via-purple-600 to-pink-500',
        nextMilestone: 500,
        progress: 100,
      };
    }
    if (stars >= 150) {
      return {
        level: 3,
        titleHi: '🥇 ज्ञान अन्वेषक (Wisdom Seeker)',
        titleEn: 'Wisdom Seeker',
        badgeColor: 'from-amber-400 to-amber-600',
        nextMilestone: 300,
        progress: Math.round(((stars - 150) / 150) * 100),
      };
    }
    if (stars >= 50) {
      return {
        level: 2,
        titleHi: '🥈 कहानी खोजी मित्र (Story Explorer)',
        titleEn: 'Story Explorer',
        badgeColor: 'from-blue-400 to-indigo-600',
        nextMilestone: 150,
        progress: Math.round(((stars - 50) / 100) * 100),
      };
    }
    return {
      level: 1,
      titleHi: '🥉 नन्हा उत्साही पाठक (Junior Reader)',
      titleEn: 'Junior Reader',
      badgeColor: 'from-emerald-400 to-teal-600',
      nextMilestone: 50,
      progress: Math.round((stars / 50) * 100),
    };
  };

  const currentLevel = getLevelInfo(profile.stars);

  const handleSaveProfileInfo = () => {
    if (soundEnabled) playPopSound();
    const updated: UserProfile = {
      ...profile,
      name: nameInput.trim() || 'नन्हा पाठक',
      ageGroup: ageGroupInput,
    };
    saveUserProfile(updated);
    setProfile(updated);
    setIsEditingName(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const handleSelectAvatar = (avatarEmoji: string) => {
    if (soundEnabled) playPopSound();
    const updated: UserProfile = {
      ...profile,
      avatar: avatarEmoji,
    };
    saveUserProfile(updated);
    setProfile(updated);
  };

  const handleClaimReward = (taskId: string) => {
    if (soundEnabled) playStarChime();
    const res = claimDailyTaskReward(taskId);
    if (res.success) {
      setProfile(res.profile);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handleSharePassport = () => {
    if (soundEnabled) playPopSound();
    const shareText = isHi
      ? `🌟 *बालवार्ता लर्नर पासपोर्ट - ${profile.name}*\n` +
        `🏆 स्तर: ${currentLevel.titleHi}\n` +
        `⭐ कुल स्टार्स: ${profile.stars} Stars\n` +
        `📖 पढ़ी गई कहानियाँ: ${streakInfo.totalRead || profile.totalStoriesRead}\n` +
        `🔥 डेली स्ट्रीक: ${streakInfo.streak} दिन!\n\n` +
        `आप भी अपने बच्चे को दें नैतिक संस्कार व सुंदर कहानियाँ: https://baalvarta.com`
      : `🌟 *Baalvarta Learner Passport - ${profile.name}*\n` +
        `🏆 Level: ${currentLevel.titleEn}\n` +
        `⭐ Stars: ${profile.stars}\n` +
        `📖 Stories Read: ${streakInfo.totalRead || profile.totalStoriesRead}\n` +
        `🔥 Streak: ${streakInfo.streak} Days!\n\n` +
        `Explore moral stories for kids: https://baalvarta.com`;

    if (navigator.share) {
      navigator.share({
        title: `${profile.name} का बालवार्ता रिपोर्ट कार्ड`,
        text: shareText,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleToggleProDemo = () => {
    if (soundEnabled) playSuccessSound();
    const updated = {
      ...profile,
      isPro: !profile.isPro,
    };
    saveUserProfile(updated);
    setProfile(updated);
    if (updated.isPro) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
        });
      } catch {
        // ignore
      }
    }
  };

  // 🔒 IF NOT PRO MEMBER: SHOW VIP LOCK WALL
  if (!profile.isPro) {
    return (
      <div className="space-y-4 sm:space-y-5 animate-in fade-in pb-36 sm:pb-28 font-sans max-w-4xl mx-auto">
        {/* VIP Lock Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-4 sm:p-6 shadow-xl border-2 border-amber-400/80 text-center space-y-3.5">
          {/* Glowing Accents */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* VIP Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg border border-yellow-200 animate-pulse">
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>👑 केवल बालवार्ता PRO मेंबर्स के लिए (VIP EXCLUSIVE)</span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {isHi
                ? 'बच्चे का व्यक्तिगत लर्नर पासपोर्ट व रिपोर्ट कार्ड अनलॉक करें!'
                : 'Unlock Child\'s Personal Learner Passport & Report Card!'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed">
              {isHi
                ? 'बाल प्रोफ़ाइल में बच्चे की पठन प्रगति, दैनिक टास्क, अर्जित स्टार्स, और नाम सहित प्रिंट करने योग्य प्रमाण पत्र सुरक्षित रहते हैं।'
                : 'Track reading milestones, daily quests, earned stars, and download verified award certificates with child\'s name.'}
            </p>
          </div>

          {/* Top Quick Upgrade Button (Instant Access on Mobile) */}
          <div className="pt-1 max-w-md mx-auto">
            <button
              type="button"
              onClick={onOpenProModal}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all border-2 border-white ring-4 ring-amber-400/30 animate-bounce"
            >
              <Crown className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>{isHi ? '🌟 अभी PRO मेंबरशिप अनलॉक करें (₹29/माह)' : '🌟 Unlock PRO Membership Now'}</span>
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 hover:border-amber-400 transition-colors">
              <span className="text-2xl block">🦁</span>
              <h4 className="font-extrabold text-xs text-white">10+ 3D कार्टून अवतार</h4>
              <p className="text-[11px] text-slate-300">बहादुर शेर, एस्ट्रोनॉट व जादुई यूनिकॉर्न अवतार चुनें।</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 hover:border-amber-400 transition-colors">
              <span className="text-2xl block">📜</span>
              <h4 className="font-extrabold text-xs text-white">प्रमाणपत्र डाउनलोड व प्रिंट</h4>
              <p className="text-[11px] text-slate-300">बच्चे के नाम व तारीख के साथ सुपर रीडर अवॉर्ड्स।</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 hover:border-amber-400 transition-colors">
              <span className="text-2xl block">🎯</span>
              <h4 className="font-extrabold text-xs text-white">दैनिक टास्क व स्टार्स रिवॉर्ड्स</h4>
              <p className="text-[11px] text-slate-300">रोज़ाना नए मिशन पूरे करें और स्टार्स जमा करें।</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 hover:border-amber-400 transition-colors">
              <span className="text-2xl block">🔥</span>
              <h4 className="font-extrabold text-xs text-white">रीडिंग स्ट्रीक व स्तर</h4>
              <p className="text-[11px] text-slate-300">नन्हा पाठक से लेकर बाल महा-विद्वान तक का सफर।</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 hover:border-amber-400 transition-colors">
              <span className="text-2xl block">🚫</span>
              <h4 className="font-extrabold text-xs text-white">100% विज्ञापन-मुक्त</h4>
              <p className="text-[11px] text-slate-300">बिना किसी विज्ञापन के सुरक्षित व शांत वातावरण।</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1.5 hover:border-amber-400 transition-colors">
              <span className="text-2xl block">📲</span>
              <h4 className="font-extrabold text-xs text-white">WhatsApp रिपोर्ट शेयरिंग</h4>
              <p className="text-[11px] text-slate-300">परिवार व दोस्तों के साथ बच्चे की सफलता शेयर करें।</p>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-white/15">
            <button
              type="button"
              onClick={onOpenProModal}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all transform hover:scale-102"
            >
              <Crown className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>{isHi ? '🌟 अभी बालवार्ता PRO मेंबरशिप अनलॉक करें' : '🌟 Unlock Baalvarta PRO Now'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleProDemo}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isHi ? '✨ प्रोफ़ाइल डेमो टेस्ट करें' : '✨ Test PRO Profile Preview'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in pb-36 sm:pb-28 font-sans">
      
      {/* Toast */}
      {showSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isHi ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* 🌟 HERO PROFILE & PASSPORT CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-5 sm:p-8 shadow-xl border border-amber-300/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            
            {/* Avatar Circle */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/80 shadow-2xl flex items-center justify-center text-5xl sm:text-6xl transform group-hover:scale-105 transition-transform select-none">
                {profile.avatar || '🦁'}
              </div>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                title={isHi ? 'अवतार बदलें' : 'Change Avatar'}
                className="absolute -bottom-2 -right-2 bg-white text-slate-800 p-1.5 rounded-full shadow-lg border border-amber-300 text-xs font-bold hover:scale-110 transition-transform cursor-pointer"
              >
                ✏️
              </button>
            </div>

            {/* Name, Level & Pro Badge */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                  {profile.name}
                </h1>

                {profile.isPro ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-950 font-black text-xs shadow-md border border-white">
                    <Crown className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                    <span>PRO SCHOLAR VIP</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenProModal}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-xs shadow-xs border border-white/40 cursor-pointer active:scale-95 transition-all"
                  >
                    <Crown className="w-3.5 h-3.5 text-yellow-300" />
                    <span>{isHi ? '🌟 PRO में अपग्रेड करें' : '🌟 Upgrade to PRO'}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-amber-100 font-bold">
                <span className="px-2.5 py-0.5 rounded-lg bg-black/20 border border-white/20">
                  {isHi ? '🌟 बालवार्ता पाठक' : '🌟 Baalvarta Scholar'}
                </span>
                <span>•</span>
                <span className="font-extrabold text-white">
                  {currentLevel.titleHi}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingName(!isEditingName)}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{isHi ? 'प्रोफ़ाइल बदलें' : 'Edit Profile'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSharePassport}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isHi ? 'पासपोर्ट शेयर करें' : 'Share Passport'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stars & Level Badge Card */}
          <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:justify-center p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 text-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-300 to-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-md">
                ⭐
              </div>
              <div className="text-left">
                <span className="text-xs text-amber-200 font-bold block">
                  {isHi ? 'कुल अर्जित स्टार्स' : 'Total Stars'}
                </span>
                <span className="text-2xl font-black text-white">
                  {profile.stars} ⭐
                </span>
              </div>
            </div>

            <div className="w-full text-left md:text-center">
              <div className="flex justify-between text-[11px] font-bold text-amber-200 mb-1">
                <span>लेवल {currentLevel.level} प्रगति</span>
                <span>{currentLevel.progress}%</span>
              </div>
              <div className="w-full md:w-44 h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-emerald-400 transition-all duration-500"
                  style={{ width: `${currentLevel.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar & Name Edit Panel Drawer (Modal-like section) */}
        {isEditingName && (
          <div className="mt-6 pt-6 border-t border-white/20 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>🎨 अपना पसंदीदा अवतार व नाम चुनें:</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="text-xs text-white/80 hover:text-white underline cursor-pointer"
              >
                बंद करें ✕
              </button>
            </div>

            {/* Avatar Selector Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.emoji}
                  type="button"
                  onClick={() => handleSelectAvatar(av.emoji)}
                  title={av.nameHi}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center text-2xl transition-all cursor-pointer ${
                    profile.avatar === av.emoji
                      ? 'bg-white text-slate-900 ring-4 ring-yellow-300 scale-110 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span>{av.emoji}</span>
                </button>
              ))}
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-amber-100 mb-1">
                  बच्चे का नाम (Child's Name):
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="उदा. आरव चौहान"
                  className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 text-sm font-bold border border-amber-300 shadow-inner focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-100 mb-1">
                  {isHi ? 'पसंदीदा विषय (Favorite Topic):' : 'Favorite Topic:'}
                </label>
                <select
                  value={ageGroupInput}
                  onChange={(e) => setAgeGroupInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 text-sm font-bold border border-amber-300 shadow-inner focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="🌟 प्रेरक कहानियाँ">🌟 प्रेरक कहानियाँ (Moral Stories)</option>
                  <option value="🧠 सामान्य ज्ञान व क्विज़">🧠 सामान्य ज्ञान व क्विज़ (GK & Quiz)</option>
                  <option value="🚀 अंतरिक्ष व ब्रह्मांड">🚀 अंतरिक्ष व ब्रह्मांड (Space Explorer)</option>
                  <option value="👑 महान विभूतियों का बचपन">👑 महान विभूतियों का बचपन (Great Legends)</option>
                  <option value="🎨 आर्ट व क्राफ्ट">🎨 आर्ट व क्राफ्ट (Art & Craft)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveProfileInfo}
                className="px-5 py-2 rounded-xl bg-white text-amber-900 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>सहेजें (Save Changes)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 📊 LEARNING REPORT CARD & STATS DASHBOARD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Stat 1: Stories Read */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              STORIES
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
              {streakInfo.totalRead || profile.totalStoriesRead}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isHi ? 'कहानियाँ पढ़ीं' : 'Stories Read'}
            </span>
          </div>
        </div>

        {/* Stat 2: Daily Streak */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Flame className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              STREAK
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 block">
              {streakInfo.streak} {isHi ? 'दिन 🔥' : 'Days 🔥'}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isHi ? 'लगातार पढ़ने की स्ट्रीक' : 'Active Reading Streak'}
            </span>
          </div>
        </div>

        {/* Stat 3: Quizzes Solved */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Zap className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              QUIZZES
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
              {profile.quizzesCompleted}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isHi ? 'क्विज़ हल किए' : 'Quizzes Solved'}
            </span>
          </div>
        </div>

        {/* Stat 4: Fun Facts Learned */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Lightbulb className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              WISDOM
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
              {profile.factsLearned}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isHi ? 'रोचक तथ्य सीखे' : 'Facts Learned'}
            </span>
          </div>
        </div>
      </div>

      {/* 🔥 DAILY STREAK COUNTER & MILESTONE BADGES HUB */}
      <DailyStreakSection
        language={language}
        soundEnabled={soundEnabled}
        userProfile={profile}
        onProfileUpdate={(updated) => setProfile(updated)}
        onNavigateTab={onNavigateTab}
      />

      {/* 🎯 DAILY QUESTS & REWARDS (दैनिक कार्य व रिवार्ड्स) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-900 dark:to-slate-900/60 border-2 border-amber-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-xs">
              🎯
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHi ? 'आज के दैनिक कार्य व मिशन (Daily Tasks)' : 'Today\'s Daily Missions'}
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {isHi ? 'कार्य पूरे करें और बोनस स्टार्स ⭐ अर्जित करें!' : 'Complete missions & earn bonus stars!'}
              </p>
            </div>
          </div>

          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-200/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300">
            {profile.claimedRewards.length} / {dailyTasks.length} {isHi ? 'पूर्ण' : 'Done'}
          </span>
        </div>

        {/* Task Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dailyTasks.map((task) => {
            const isClaimed = (profile.claimedRewards || []).includes(task.id);
            const isDone = isClaimed || (profile.completedTasks || []).includes(task.id);

            return (
              <div
                key={task.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isClaimed
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                    : isDone
                    ? 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700'
                    : 'bg-white dark:bg-slate-800/80 border-black/5 dark:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl sm:text-3xl shrink-0 select-none">
                    {task.icon || '⭐'}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                      {isHi ? task.titleHi : task.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {isHi ? task.descHi : task.descEn}
                    </p>
                  </div>
                </div>

                {/* Claim or Action Button */}
                <div className="shrink-0">
                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-black text-xs shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isHi ? 'प्राप्त ⭐' : 'Claimed'}</span>
                    </span>
                  ) : isDone ? (
                    <button
                      type="button"
                      onClick={() => handleClaimReward(task.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer animate-bounce"
                    >
                      +{task.rewardStars} ⭐ लें!
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (task.category === 'story') onNavigateTab('stories');
                        else if (task.category === 'quiz') onNavigateTab('quizzes');
                        else if (task.category === 'fact') onNavigateTab('facts');
                        else if (task.category === 'audio') onNavigateTab('audio');
                        else if (task.category === 'coloring') onNavigateTab('coloring');
                        else onNavigateTab('stories');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {isHi ? 'शुरू करें ➔' : 'Start ➔'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📜 CERTIFICATES & AWARDS CORNER (सर्टिफिकेट डाउनलोड केंद्र) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-xs">
              🏆
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHi ? 'मेरे डिजिटल प्रमाणपत्र (My Certificates)' : 'My Award Certificates'}
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {isHi ? 'बच्चे के नाम व तारीख के साथ सम्मान पत्र डाउनलोड व प्रिंट करें' : 'Download & print verified certificates with child\'s name'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('certificates')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{isHi ? 'सर्टिफिकेट हब खोलें ➔' : 'Open Certificate Hub ➔'}</span>
          </button>
        </div>

        {/* Certificate Previews Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/20 dark:to-amber-900/20 border-2 border-amber-300 dark:border-amber-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🌟</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white">
                READING
              </span>
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-amber-950 dark:text-amber-200">
              सुपर स्टोरी रीडर अवॉर्ड
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              50+ सचित्र नैतिक कहानियाँ पढ़ने का विशेष प्रमाणपत्र।
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('certificates')}
              className="w-full mt-1 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>डाउनलोड / प्रिंट</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/60 dark:from-purple-950/20 dark:to-purple-900/20 border-2 border-purple-300 dark:border-purple-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🎯</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-600 text-white">
                QUIZ MASTER
              </span>
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-purple-950 dark:text-purple-200">
              बाल क्विज़ चैंपियन अवॉर्ड
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              विज्ञान, प्रकृति व सामान्य ज्ञान क्विज़ में सफलता हेतु।
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('certificates')}
              className="w-full mt-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>डाउनलोड / प्रिंट</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 dark:from-rose-950/20 dark:to-rose-900/20 border-2 border-rose-300 dark:border-rose-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📖</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white">
                PANCHATANTRA
              </span>
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-rose-950 dark:text-rose-200">
              पंचतंत्र नीति ज्ञान मास्टर
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              पंचतंत्र की कहानियों से सदाचार व बुद्धि सीखने हेतु।
            </p>
            <button
              type="button"
              onClick={() => onNavigateTab('certificates')}
              className="w-full mt-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>डाउनलोड / प्रिंट</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🔖 MY BOOKMARKS (सहेजी गई कहानियाँ) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-black/10 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-lg shadow-xs">
              🔖
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHi ? 'मेरी पसंदीदा सहेजी गई कहानियाँ (Bookmarks)' : 'My Bookmarked Stories'}
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {isHi ? `${bookmarkedStories.length} कहानियाँ सहेजी गई हैं` : `${bookmarkedStories.length} stories saved`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('stories')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {isHi ? 'सभी कहानियाँ देखें ➔' : 'View All Stories ➔'}
          </button>
        </div>

        {bookmarkedStories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed border-black/10 text-slate-500 dark:text-slate-400 space-y-2">
            <span className="text-4xl block">📖</span>
            <p className="text-xs font-bold">
              {isHi ? 'अभी कोई कहानी बुकमार्क नहीं की गई है।' : 'No stories bookmarked yet.'}
            </p>
            <p className="text-[11px]">
              {isHi ? 'कहानी पढ़ते समय 🔖 बुकमार्क बटन दबाकर यहाँ सहेजें।' : 'Click the bookmark icon on any story to save it here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {bookmarkedStories.map((story) => (
              <div
                key={story.id}
                onClick={() => onSelectStory(story)}
                className="p-3 rounded-2xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer flex gap-3 items-center group shadow-2xs hover:shadow-sm"
              >
                <img
                  src={story.coverImage}
                  alt={story.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                    {story.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                    {isHi ? story.titleHi : story.titleEn}
                  </h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    पढ़ें ➔
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
