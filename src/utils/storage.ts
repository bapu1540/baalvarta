import {
  Story,
  FunFact,
  LearningItem,
  AudioStory,
  VideoStory,
  QuizSet,
  PrintableWorksheet,
  UserReview,
  KidsGameItem,
  ColoringTemplateItem,
  CertificateAwardItem,
  DailyTaskItem,
  UserProfile,
  StreakMilestone
} from '../types';
import {
  INITIAL_STORIES,
  INITIAL_FUN_FACTS,
  INITIAL_LEARNING_ITEMS,
  INITIAL_AUDIO_STORIES,
  INITIAL_VIDEO_STORIES,
  INITIAL_VIDEO_CATEGORIES,
} from '../data/initialData';
import { INITIAL_QUIZ_SETS, INITIAL_WORKSHEETS } from '../data/quizData';
import {
  INITIAL_KIDS_GAMES,
  INITIAL_COLORING_TEMPLATES,
  INITIAL_CERTIFICATE_AWARDS
} from '../data/gamesData';
import {
  idbGet,
  idbSet,
  safeLocalStorageSet,
  fetchServerDatabase,
  saveToServerDatabase,
} from './dbStorage';
import {
  syncAllStoriesToFirestore,
  syncAllWorksheetsToFirestore,
  fetchStoriesFromFirestore,
  fetchWorksheetsFromFirestore,
  fetchVideoStoriesFromFirestore,
  fetchFunFactsFromFirestore,
  fetchLearningItemsFromFirestore,
  fetchAudioStoriesFromFirestore,
  fetchQuizSetsFromFirestore,
  isFirebaseConfigured,
} from './firebase';

export const KEYS = {
  STORIES: 'baalvarta_stories_v1',
  FUN_FACTS: 'baalvarta_fun_facts_v1',
  LEARNING: 'baalvarta_learning_v1',
  AUDIO: 'baalvarta_audio_v1',
  VIDEOS: 'baalvarta_video_stories_v1',
  VIDEO_CATEGORIES: 'baalvarta_video_categories_v1',
  BOOKMARKS: 'baalvarta_bookmarks_v1',
  LIKED_FACTS: 'baalvarta_liked_facts_v1',
  ADMIN_PIN: 'baalvarta_admin_pin_v1',
  QUIZZES: 'baalvarta_quizzes_v1',
  WORKSHEETS: 'baalvarta_worksheets_v1',
  GAMES: 'baalvarta_games_v1',
  COLORING_TEMPLATES: 'baalvarta_coloring_templates_v1',
  CERTIFICATE_AWARDS: 'baalvarta_certificate_awards_v1',
  READING_STREAK: 'baalvarta_reading_streak_v1',
  USER_PROFILE: 'baalvarta_user_profile_v2',
  DAILY_TASKS: 'baalvarta_daily_tasks_v1',
  REVIEWS: 'baalvarta_user_reviews_v1',
  CUSTOM_FOOTER_IMG: 'baalvarta_custom_footer_img',
  ADMIN_PASSWORDS: 'baalvarta_admin_passwords_v2',
};

export const INITIAL_DAILY_TASKS: DailyTaskItem[] = [
  {
    id: 'task-story-1',
    titleHi: '📖 1 नई नैतिक कहानी पढ़ें',
    titleEn: 'Read 1 Moral Story',
    descHi: 'आज कोई भी एक ज्ञानवर्धक या पंचतंत्र कहानी पूरी पढ़ें।',
    descEn: 'Read any moral or Panchatantra story completely today.',
    category: 'story',
    targetCount: 1,
    rewardStars: 15,
    icon: '📖',
  },
  {
    id: 'task-quiz-1',
    titleHi: '🎯 बाल क्विज़ में भाग लें',
    titleEn: 'Take a Kids Quiz',
    descHi: 'क्विज़ के 5 प्रश्नों के सही उत्तर देकर अपना ज्ञान परखें।',
    descEn: 'Test your wisdom by answering 5 quiz questions.',
    category: 'quiz',
    targetCount: 1,
    rewardStars: 20,
    icon: '🎯',
  },
  {
    id: 'task-fact-1',
    titleHi: '🌟 1 रोचक तथ्य (Fun Fact) सीखें',
    titleEn: 'Learn 1 Fun Fact',
    descHi: 'प्रकृति, विज्ञान या अंतरिक्ष का एक आश्चर्यजनक तथ्य जानें।',
    descEn: 'Discover an amazing fact about science, space or animals.',
    category: 'fact',
    targetCount: 1,
    rewardStars: 10,
    icon: '💡',
  },
  {
    id: 'task-audio-1',
    titleHi: '🎧 1 ऑडियो कहानी सुनें',
    titleEn: 'Listen to 1 Audio Story',
    descHi: 'मधुर आवाज़ में बाल कहानी का आनंद लें।',
    descEn: 'Enjoy a soothing narrated audio tale.',
    category: 'audio',
    targetCount: 1,
    rewardStars: 10,
    icon: '🎧',
  },
  {
    id: 'task-coloring-1',
    titleHi: '🎨 1 डिजिटल चित्र में रंग भरें',
    titleEn: 'Paint 1 Coloring Canvas',
    descHi: 'कलरिंग बुक में जाकर सुंदर रंगों से चित्र सजाएं।',
    descEn: 'Color and paint a cute character illustration.',
    category: 'coloring',
    targetCount: 1,
    rewardStars: 15,
    icon: '🎨',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-default-1',
  name: 'आरव चौहान',
  avatar: '🦁',
  ageGroup: '6-8 वर्ष',
  isPro: false,
  stars: 45,
  totalStoriesRead: 4,
  streakDays: 3,
  completedTasks: ['task-story-1'],
  claimedRewards: [],
  lastActiveDate: new Date().toISOString().split('T')[0],
  earnedCertificates: ['super_reader'],
  quizzesCompleted: 2,
  factsLearned: 5,
  audioStoriesListened: 1,
  coloringPagesFinished: 1,
};

export const AUTHORIZED_ADMIN_EMAILS = [
  'baalvarta@gmail.com',
  'chauhansanjay932@gmail.com',
] as const;

export type AdminEmail = typeof AUTHORIZED_ADMIN_EMAILS[number];

export const PRIMARY_ADMIN_EMAIL: AdminEmail = 'chauhansanjay932@gmail.com';
export const SECONDARY_ADMIN_EMAIL: AdminEmail = 'baalvarta@gmail.com';

export const DEFAULT_ADMIN_PASSWORDS: Record<AdminEmail, string> = {
  'baalvarta@gmail.com': 'Baalvarta@2026',
  'chauhansanjay932@gmail.com': 'Sanjay@2026',
};

export const INITIAL_USER_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    name: 'अनुष्का शर्मा',
    role: 'Parent',
    rating: 5,
    comment: 'बालवार्ता की सचित्र पंचतंत्र कहानियाँ और हिंदी वर्णमाला मेरे 5 साल के बेटे के लिए बहुत उपयोगी हैं! कोई विज्ञापन नहीं है, यह सबसे अच्छी बात है।',
    date: '2026-09-18',
    likes: 14,
  },
  {
    id: 'rev-2',
    name: 'रोहित वर्मा',
    role: 'Teacher',
    rating: 5,
    comment: 'कक्षा में बच्चों को नैतिक मूल्य और कहानियों की सीख समझाने के लिए यह सबसे बेहतरीन भारतीय बाल पोर्टल है। 5-Q क्विज़ भी बहुत मजेदार है।',
    date: '2026-09-20',
    likes: 21,
  },
  {
    id: 'rev-3',
    name: 'प्रिया सिंह',
    role: 'Parent',
    rating: 5,
    comment: 'रात को सोने से पहले बच्चों को ऑडियो कहानियाँ सुनाना हमारा पसंदीदा रूटीन बन गया है। सरल भाषा और सुंदर आवाज!',
    date: '2026-09-21',
    likes: 9,
  },
];

// --- Synchronous Getters (Fast Initial Render from LocalStorage / Defaults) ---

export function mergeWithInitialStories(stories?: Story[]): Story[] {
  const storyMap = new Map<string, Story>();
  INITIAL_STORIES.forEach((s) => storyMap.set(s.id, s));
  if (Array.isArray(stories)) {
    stories.forEach((s) => {
      if (!storyMap.has(s.id)) {
        storyMap.set(s.id, s);
      } else {
        const def = storyMap.get(s.id)!;
        storyMap.set(s.id, {
          ...def,
          ...s,
          scenes: s.scenes && s.scenes.length > 0 ? s.scenes : def.scenes,
          coverImage: s.coverImage || def.coverImage,
        });
      }
    });
  }

  const getStoryTimestamp = (s: Story): number => {
    if (s.createdAt) return s.createdAt;
    if (typeof s.id === 'string') {
      const match = s.id.match(/\d{10,}/);
      if (match) return parseInt(match[0], 10);
    }
    return 0;
  };

  return Array.from(storyMap.values()).sort((a, b) => {
    const timeA = getStoryTimestamp(a);
    const timeB = getStoryTimestamp(b);
    // Newly uploaded custom stories with timestamps always appear at the very top (newest first)
    if (timeA > 0 || timeB > 0) {
      if (timeA > 0 && timeB > 0) return timeB - timeA;
      return timeA > 0 ? -1 : 1;
    }
    return (a.number || 0) - (b.number || 0);
  });
}

export function getStoredStories(): Story[] {
  try {
    const data = localStorage.getItem(KEYS.STORIES);
    if (!data) {
      safeLocalStorageSet(KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
      idbSet(KEYS.STORIES, INITIAL_STORIES);
      return INITIAL_STORIES;
    }
    const parsed: Story[] = JSON.parse(data);
    const existingIds = new Set(parsed.map((s) => s.id));
    const missingAnyInitial = INITIAL_STORIES.some((s) => !existingIds.has(s.id));
    const hasOldDuplicate = parsed?.some((s) => s.id === 'story-20' && s.titleHi.includes('ईमानदार लकड़हारा'));
    const isOldStory1Cover = parsed?.some((s) => s.id === 'story-1' && s.coverImage.includes('1579783902614'));

    if (!parsed || parsed.length < INITIAL_STORIES.length || missingAnyInitial || hasOldDuplicate || isOldStory1Cover) {
      const merged = mergeWithInitialStories(parsed);
      safeLocalStorageSet(KEYS.STORIES, JSON.stringify(merged));
      idbSet(KEYS.STORIES, merged);
      return merged;
    }
    return parsed;
  } catch {
    return INITIAL_STORIES;
  }
}

export function saveStoredStories(stories: Story[]) {
  safeLocalStorageSet(KEYS.STORIES, JSON.stringify(stories));
  idbSet(KEYS.STORIES, stories);
  saveToServerDatabase({ stories });
}

export function getStoredFunFacts(): FunFact[] {
  try {
    const data = localStorage.getItem(KEYS.FUN_FACTS);
    if (!data) {
      safeLocalStorageSet(KEYS.FUN_FACTS, JSON.stringify(INITIAL_FUN_FACTS));
      idbSet(KEYS.FUN_FACTS, INITIAL_FUN_FACTS);
      return INITIAL_FUN_FACTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_FUN_FACTS;
  }
}

export function saveStoredFunFacts(facts: FunFact[]) {
  safeLocalStorageSet(KEYS.FUN_FACTS, JSON.stringify(facts));
  idbSet(KEYS.FUN_FACTS, facts);
  saveToServerDatabase({ fun_facts: facts });
}

export function getStoredLearningItems(): LearningItem[] {
  try {
    const data = localStorage.getItem(KEYS.LEARNING);
    if (!data) {
      safeLocalStorageSet(KEYS.LEARNING, JSON.stringify(INITIAL_LEARNING_ITEMS));
      idbSet(KEYS.LEARNING, INITIAL_LEARNING_ITEMS);
      return INITIAL_LEARNING_ITEMS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_LEARNING_ITEMS;
  }
}

export function saveStoredLearningItems(items: LearningItem[]) {
  safeLocalStorageSet(KEYS.LEARNING, JSON.stringify(items));
  idbSet(KEYS.LEARNING, items);
  saveToServerDatabase({ early_learning: items });
}

export function getStoredQuizSets(): QuizSet[] {
  try {
    const data = localStorage.getItem(KEYS.QUIZZES);
    if (!data) {
      safeLocalStorageSet(KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZ_SETS));
      idbSet(KEYS.QUIZZES, INITIAL_QUIZ_SETS);
      return INITIAL_QUIZ_SETS;
    }
    const parsed: QuizSet[] = JSON.parse(data);
    // If cached quiz data is old or contains outdated question images (like the old sun image), refresh
    const scienceQuiz = parsed?.find((q) => q.id === 'quiz-science');
    const isOldScienceImage = scienceQuiz?.questions?.some((q) => q.id === 'q2-1' && q.image.includes('1532693322450'));
    if (!parsed || parsed.length < INITIAL_QUIZ_SETS.length || !parsed.some((q) => q.id === 'quiz-fruits') || isOldScienceImage) {
      safeLocalStorageSet(KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZ_SETS));
      idbSet(KEYS.QUIZZES, INITIAL_QUIZ_SETS);
      return INITIAL_QUIZ_SETS;
    }
    return parsed;
  } catch {
    return INITIAL_QUIZ_SETS;
  }
}

export function saveStoredQuizSets(quizzes: QuizSet[]) {
  safeLocalStorageSet(KEYS.QUIZZES, JSON.stringify(quizzes));
  idbSet(KEYS.QUIZZES, quizzes);
  saveToServerDatabase({ quizzes });
}

export function getStoredWorksheets(): PrintableWorksheet[] {
  try {
    const data = localStorage.getItem(KEYS.WORKSHEETS);
    if (!data) {
      safeLocalStorageSet(KEYS.WORKSHEETS, JSON.stringify(INITIAL_WORKSHEETS));
      idbSet(KEYS.WORKSHEETS, INITIAL_WORKSHEETS);
      return INITIAL_WORKSHEETS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_WORKSHEETS;
  }
}

export function saveStoredWorksheets(worksheets: PrintableWorksheet[]) {
  safeLocalStorageSet(KEYS.WORKSHEETS, JSON.stringify(worksheets));
  idbSet(KEYS.WORKSHEETS, worksheets);
  saveToServerDatabase({ worksheets });
}

export function getStoredAudioStories(): AudioStory[] {
  try {
    const data = localStorage.getItem(KEYS.AUDIO);
    if (!data) {
      safeLocalStorageSet(KEYS.AUDIO, JSON.stringify(INITIAL_AUDIO_STORIES));
      idbSet(KEYS.AUDIO, INITIAL_AUDIO_STORIES);
      return INITIAL_AUDIO_STORIES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_AUDIO_STORIES;
  }
}

export function saveStoredAudioStories(audio: AudioStory[]) {
  safeLocalStorageSet(KEYS.AUDIO, JSON.stringify(audio));
  idbSet(KEYS.AUDIO, audio);
  saveToServerDatabase({ audio_stories: audio });
}

export function getStoredVideoStories(): VideoStory[] {
  try {
    const data = localStorage.getItem(KEYS.VIDEOS);
    if (!data) {
      safeLocalStorageSet(KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEO_STORIES));
      idbSet(KEYS.VIDEOS, INITIAL_VIDEO_STORIES);
      return INITIAL_VIDEO_STORIES;
    }
    const parsed: VideoStory[] = JSON.parse(data);
    return parsed.map((v) => ({
      ...v,
      category: v.category === 'YouTube Shorts' ? 'एनिमेटेड शॉर्ट्स' : v.category,
    }));
  } catch {
    return INITIAL_VIDEO_STORIES;
  }
}

export function saveStoredVideoStories(videos: VideoStory[]) {
  safeLocalStorageSet(KEYS.VIDEOS, JSON.stringify(videos));
  idbSet(KEYS.VIDEOS, videos);
  saveToServerDatabase({ video_stories: videos });
}

export function getStoredVideoCategories(): string[] {
  try {
    const data = localStorage.getItem(KEYS.VIDEO_CATEGORIES);
    if (!data) {
      safeLocalStorageSet(KEYS.VIDEO_CATEGORIES, JSON.stringify(INITIAL_VIDEO_CATEGORIES));
      idbSet(KEYS.VIDEO_CATEGORIES, INITIAL_VIDEO_CATEGORIES);
      return INITIAL_VIDEO_CATEGORIES;
    }
    const parsed: string[] = JSON.parse(data);
    return parsed.map((c) => (c === 'YouTube Shorts' ? 'एनिमेटेड शॉर्ट्स' : c));
  } catch {
    return INITIAL_VIDEO_CATEGORIES;
  }
}

export function saveStoredVideoCategories(categories: string[]) {
  safeLocalStorageSet(KEYS.VIDEO_CATEGORIES, JSON.stringify(categories));
  idbSet(KEYS.VIDEO_CATEGORIES, categories);
  saveToServerDatabase({ video_categories: categories });
}

export function getBookmarks(): string[] {
  try {
    const data = localStorage.getItem(KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(id: string): string[] {
  const current = getBookmarks();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  safeLocalStorageSet(KEYS.BOOKMARKS, JSON.stringify(next));
  idbSet(KEYS.BOOKMARKS, next);
  return next;
}

export interface ReadingStreakData {
  streak: number;
  totalRead: number;
  lastDate: string; // ISO format 'YYYY-MM-DD'
  activeDays: string[]; // List of YYYY-MM-DD
  claimedMilestones: string[];
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 1,
    badgeId: 'streak-1',
    titleHi: '🌱 शुरुआत स्पार्क (Day 1 Spark)',
    titleEn: 'Day 1 Spark',
    badgeIcon: '🔥',
    rewardStars: 10,
    flameLevel: 'spark',
    descriptionHi: 'दैनिक पठन की यात्रा शुरू करने पर प्रथम स्ट्रीक बैज!',
    descriptionEn: 'First streak badge for starting daily reading journey!',
  },
  {
    days: 3,
    badgeId: 'streak-3',
    titleHi: '🥉 3-दिवसीय पठन सितारा (3-Day Reading Star)',
    titleEn: '3-Day Reading Star',
    badgeIcon: '🥉',
    rewardStars: 25,
    flameLevel: 'spark',
    descriptionHi: 'लगातार 3 दिन कहानी पढ़कर नियमित पठन की आदत बनाई!',
    descriptionEn: 'Formed a consistent reading habit for 3 consecutive days!',
  },
  {
    days: 7,
    badgeId: 'streak-7',
    titleHi: '🥈 7-दिवसीय साप्ताहिक योद्धा (7-Day Weekly Hero)',
    titleEn: '7-Day Weekly Hero',
    badgeIcon: '🥈',
    rewardStars: 50,
    flameLevel: 'flame',
    descriptionHi: 'पूरा 1 सप्ताह लगातार हर दिन नैतिक कहानी पढ़ने का गौरव!',
    descriptionEn: 'Completed 1 full week of daily moral story reading!',
  },
  {
    days: 14,
    badgeId: 'streak-14',
    titleHi: '🥇 14-दिवसीय सुपर स्कॉलर (14-Day Super Scholar)',
    titleEn: '14-Day Super Scholar',
    badgeIcon: '🥇',
    rewardStars: 100,
    flameLevel: 'blaze',
    descriptionHi: 'लगातार 2 सप्ताह की स्ट्रीक! ज्ञान व बुद्धि का प्रतीक।',
    descriptionEn: '2 weeks continuous streak! A true knowledge seeker.',
  },
  {
    days: 30,
    badgeId: 'streak-30',
    titleHi: '👑 30-दिवसीय बालवार्ता लेजेंड (30-Day Legend of Baalvarta)',
    titleEn: '30-Day Legend of Baalvarta',
    badgeIcon: '👑',
    rewardStars: 250,
    flameLevel: 'cosmic',
    descriptionHi: 'पूरे 1 महीने तक हर दिन कहानी पढ़ने का सर्वोच्च सम्मान!',
    descriptionEn: 'The ultimate reading achievement for 30 consecutive days!',
  },
];

export function getReadingStreak(): ReadingStreakData {
  const todayIso = new Date().toISOString().split('T')[0];
  const yesterdayIso = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  try {
    const data = localStorage.getItem(KEYS.READING_STREAK);
    if (!data) {
      const initial: ReadingStreakData = {
        streak: 1,
        totalRead: 3,
        lastDate: todayIso,
        activeDays: [todayIso],
        claimedMilestones: ['streak-1'],
      };
      safeLocalStorageSet(KEYS.READING_STREAK, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(data);
    let streak = parsed.streak || 0;
    const lastDate = parsed.lastDate || '';
    const activeDays = Array.isArray(parsed.activeDays) ? parsed.activeDays : [];
    const claimedMilestones = Array.isArray(parsed.claimedMilestones) ? parsed.claimedMilestones : [];

    // Check if streak was broken (last active date was older than yesterday)
    if (lastDate && lastDate !== todayIso && lastDate !== yesterdayIso) {
      // Streak broken, if they read today it will restart at 1, otherwise 0
      streak = 0;
    }

    return {
      streak: Math.max(0, streak),
      totalRead: parsed.totalRead || 0,
      lastDate,
      activeDays,
      claimedMilestones,
    };
  } catch {
    return {
      streak: 1,
      totalRead: 3,
      lastDate: todayIso,
      activeDays: [todayIso],
      claimedMilestones: ['streak-1'],
    };
  }
}

export function recordStoryRead(): { streak: number; totalRead: number; isNewStreakDay: boolean } {
  const current = getReadingStreak();
  const todayIso = new Date().toISOString().split('T')[0];
  const yesterdayIso = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let nextStreak = current.streak;
  let isNewStreakDay = false;

  if (current.lastDate === todayIso) {
    // Already counted today's streak, just keep streak
    nextStreak = Math.max(1, current.streak);
  } else if (current.lastDate === yesterdayIso) {
    // Read yesterday! Consecutive day streak increment
    nextStreak = current.streak + 1;
    isNewStreakDay = true;
  } else {
    // Started fresh today
    nextStreak = 1;
    isNewStreakDay = true;
  }

  const nextActiveDays = Array.from(new Set([...current.activeDays, todayIso])).slice(-30);
  const nextTotalRead = current.totalRead + 1;

  const updated: ReadingStreakData = {
    streak: nextStreak,
    totalRead: nextTotalRead,
    lastDate: todayIso,
    activeDays: nextActiveDays,
    claimedMilestones: current.claimedMilestones,
  };

  safeLocalStorageSet(KEYS.READING_STREAK, JSON.stringify(updated));
  idbSet(KEYS.READING_STREAK, updated);

  // Synchronize with UserProfile
  try {
    const profile = getUserProfile();
    const updatedProfile: UserProfile = {
      ...profile,
      streakDays: nextStreak,
      totalStoriesRead: nextTotalRead,
      stars: profile.stars + 10, // 10 stars bonus for reading a story
      completedTasks: Array.from(new Set([...(profile.completedTasks || []), 'task-story-1'])),
      streakHistory: nextActiveDays,
      lastActiveDate: todayIso,
    };
    saveUserProfile(updatedProfile);
  } catch (err) {
    console.warn('Sync profile error in recordStoryRead:', err);
  }

  return { streak: nextStreak, totalRead: nextTotalRead, isNewStreakDay };
}

export function claimStreakMilestone(badgeId: string): { success: boolean; starsAdded: number; milestone?: StreakMilestone } {
  const current = getReadingStreak();
  const milestone = STREAK_MILESTONES.find((m) => m.badgeId === badgeId);
  if (!milestone) return { success: false, starsAdded: 0 };

  if (current.streak < milestone.days) {
    return { success: false, starsAdded: 0 };
  }

  if (current.claimedMilestones.includes(badgeId)) {
    return { success: false, starsAdded: 0 };
  }

  const updatedMilestones = [...current.claimedMilestones, badgeId];
  const updatedStreakData: ReadingStreakData = {
    ...current,
    claimedMilestones: updatedMilestones,
  };
  safeLocalStorageSet(KEYS.READING_STREAK, JSON.stringify(updatedStreakData));
  idbSet(KEYS.READING_STREAK, updatedStreakData);

  // Add stars to User Profile
  const profile = getUserProfile();
  const updatedProfile: UserProfile = {
    ...profile,
    stars: profile.stars + milestone.rewardStars,
    claimedMilestones: updatedMilestones,
  };
  saveUserProfile(updatedProfile);

  return { success: true, starsAdded: milestone.rewardStars, milestone };
}

// Helper to normalize Hindi digits & unicode spaces
function normalizeInputString(str: string): string {
  if (!str) return '';
  const hindiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  let res = str.trim();
  for (let i = 0; i < 10; i++) {
    res = res.split(hindiDigits[i]).join(i.toString());
  }
  // Replace zero-width spaces and multiple spaces
  return res.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

export function getAdminPasswords(): Record<string, string> {
  try {
    const data = localStorage.getItem(KEYS.ADMIN_PASSWORDS);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        'baalvarta@gmail.com': parsed['baalvarta@gmail.com'] || DEFAULT_ADMIN_PASSWORDS['baalvarta@gmail.com'],
        'chauhansanjay932@gmail.com': parsed['chauhansanjay932@gmail.com'] || DEFAULT_ADMIN_PASSWORDS['chauhansanjay932@gmail.com'],
      };
    }
  } catch {
    // fallback
  }
  return { ...DEFAULT_ADMIN_PASSWORDS };
}

export function saveAdminPassword(email: string, newPass: string) {
  const current = getAdminPasswords();
  const normalizedKey = email.toLowerCase().trim();
  current[normalizedKey] = newPass.trim();
  safeLocalStorageSet(KEYS.ADMIN_PASSWORDS, JSON.stringify(current));
  idbSet(KEYS.ADMIN_PASSWORDS, current);
  saveToServerDatabase({ admin_passwords: current });
}

export function resetAdminPasswordsToDefault() {
  safeLocalStorageSet(KEYS.ADMIN_PASSWORDS, JSON.stringify(DEFAULT_ADMIN_PASSWORDS));
  idbSet(KEYS.ADMIN_PASSWORDS, DEFAULT_ADMIN_PASSWORDS);
  saveToServerDatabase({ admin_passwords: DEFAULT_ADMIN_PASSWORDS });
  return { ...DEFAULT_ADMIN_PASSWORDS };
}

export function verifyAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  const normalizedEmail = email.toLowerCase().trim();
  const rawPass = pass.trim();
  const normalizedPass = normalizeInputString(rawPass);

  // Check authorized email list (Strictly the two admin accounts)
  const isAuthorized = normalizedEmail === 'baalvarta@gmail.com' || normalizedEmail === 'chauhansanjay932@gmail.com';
  if (!isAuthorized) return false;

  const passwords = getAdminPasswords();
  const storedPass = normalizeInputString(
    passwords[normalizedEmail] || DEFAULT_ADMIN_PASSWORDS[normalizedEmail as AdminEmail] || ''
  );

  // Exact or case-insensitive match with the configured password for this email
  if (storedPass && (normalizedPass === storedPass || normalizedPass.toLowerCase() === storedPass.toLowerCase())) {
    return true;
  }

  return false;
}

export function getAdminPin(): string {
  const passwords = getAdminPasswords();
  return passwords[PRIMARY_ADMIN_EMAIL] || 'Sanjay@2026';
}

export function setAdminPin(pin: string) {
  saveAdminPassword(PRIMARY_ADMIN_EMAIL, pin);
}

// --- Games Storage Engine ---
export function getStoredGames(): KidsGameItem[] {
  try {
    const data = localStorage.getItem(KEYS.GAMES);
    if (!data) {
      safeLocalStorageSet(KEYS.GAMES, JSON.stringify(INITIAL_KIDS_GAMES));
      idbSet(KEYS.GAMES, INITIAL_KIDS_GAMES);
      return INITIAL_KIDS_GAMES;
    }
    const parsed: KidsGameItem[] = JSON.parse(data);
    // If stored games are old obsolete games (memory, puzzle, etc.) or don't include new piano, reset to INITIAL_KIDS_GAMES
    const hasNewGames = parsed.some((g) => g.id === 'game-piano');
    if (!hasNewGames) {
      safeLocalStorageSet(KEYS.GAMES, JSON.stringify(INITIAL_KIDS_GAMES));
      idbSet(KEYS.GAMES, INITIAL_KIDS_GAMES);
      return INITIAL_KIDS_GAMES;
    }
    return parsed.length > 0 ? parsed : INITIAL_KIDS_GAMES;
  } catch {
    return INITIAL_KIDS_GAMES;
  }
}

export function saveStoredGames(games: KidsGameItem[]) {
  safeLocalStorageSet(KEYS.GAMES, JSON.stringify(games));
  idbSet(KEYS.GAMES, games);
  saveToServerDatabase({ games });
}

export function addStoredGame(game: Omit<KidsGameItem, 'id'>): KidsGameItem[] {
  const current = getStoredGames();
  const newGame: KidsGameItem = {
    ...game,
    id: `game-${Date.now()}`,
  };
  const updated = [...current, newGame];
  saveStoredGames(updated);
  return updated;
}

export function deleteStoredGame(id: string): KidsGameItem[] {
  const current = getStoredGames();
  const updated = current.filter((g) => g.id !== id);
  saveStoredGames(updated);
  return updated;
}

// --- Coloring Templates Storage Engine ---
export function getStoredColoringTemplates(): ColoringTemplateItem[] {
  try {
    const data = localStorage.getItem(KEYS.COLORING_TEMPLATES);
    if (!data) {
      safeLocalStorageSet(KEYS.COLORING_TEMPLATES, JSON.stringify(INITIAL_COLORING_TEMPLATES));
      idbSet(KEYS.COLORING_TEMPLATES, INITIAL_COLORING_TEMPLATES);
      return INITIAL_COLORING_TEMPLATES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_COLORING_TEMPLATES;
  }
}

export function saveStoredColoringTemplates(templates: ColoringTemplateItem[]) {
  safeLocalStorageSet(KEYS.COLORING_TEMPLATES, JSON.stringify(templates));
  idbSet(KEYS.COLORING_TEMPLATES, templates);
  saveToServerDatabase({ coloring_templates: templates });
}

export function addStoredColoringTemplate(tpl: Omit<ColoringTemplateItem, 'id'>): ColoringTemplateItem[] {
  const current = getStoredColoringTemplates();
  const newTpl: ColoringTemplateItem = {
    ...tpl,
    id: `tpl-${Date.now()}`,
  };
  const updated = [...current, newTpl];
  saveStoredColoringTemplates(updated);
  return updated;
}

export function deleteStoredColoringTemplate(id: string): ColoringTemplateItem[] {
  const current = getStoredColoringTemplates();
  const updated = current.filter((t) => t.id !== id);
  saveStoredColoringTemplates(updated);
  return updated;
}

// --- Certificate Awards Storage Engine ---
export function getStoredCertificateAwards(): CertificateAwardItem[] {
  try {
    const data = localStorage.getItem(KEYS.CERTIFICATE_AWARDS);
    if (!data) {
      safeLocalStorageSet(KEYS.CERTIFICATE_AWARDS, JSON.stringify(INITIAL_CERTIFICATE_AWARDS));
      idbSet(KEYS.CERTIFICATE_AWARDS, INITIAL_CERTIFICATE_AWARDS);
      return INITIAL_CERTIFICATE_AWARDS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CERTIFICATE_AWARDS;
  }
}

export function saveStoredCertificateAwards(awards: CertificateAwardItem[]) {
  safeLocalStorageSet(KEYS.CERTIFICATE_AWARDS, JSON.stringify(awards));
  idbSet(KEYS.CERTIFICATE_AWARDS, awards);
  saveToServerDatabase({ certificate_awards: awards });
}

export function addStoredCertificateAward(award: Omit<CertificateAwardItem, 'id'>): CertificateAwardItem[] {
  const current = getStoredCertificateAwards();
  const newAward: CertificateAwardItem = {
    ...award,
    id: `award-${Date.now()}`,
  };
  const updated = [...current, newAward];
  saveStoredCertificateAwards(updated);
  return updated;
}

export function deleteStoredCertificateAward(id: string): CertificateAwardItem[] {
  const current = getStoredCertificateAwards();
  const updated = current.filter((a) => a.id !== id);
  saveStoredCertificateAwards(updated);
  return updated;
}

export function getStoredReviews(): UserReview[] {
  try {
    const data = localStorage.getItem(KEYS.REVIEWS);
    if (!data) {
      safeLocalStorageSet(KEYS.REVIEWS, JSON.stringify(INITIAL_USER_REVIEWS));
      idbSet(KEYS.REVIEWS, INITIAL_USER_REVIEWS);
      return INITIAL_USER_REVIEWS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USER_REVIEWS;
  }
}

export function saveStoredReviews(reviews: UserReview[]) {
  safeLocalStorageSet(KEYS.REVIEWS, JSON.stringify(reviews));
  idbSet(KEYS.REVIEWS, reviews);
  saveToServerDatabase({ user_reviews: reviews });
}

export function addStoredReview(review: Omit<UserReview, 'id' | 'date'>): UserReview[] {
  const current = getStoredReviews();
  const newReview: UserReview = {
    ...review,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
  };
  const updated = [newReview, ...current];
  saveStoredReviews(updated);
  return updated;
}

export function deleteStoredReview(id: string): UserReview[] {
  const current = getStoredReviews();
  const updated = current.filter((r) => r.id !== id);
  saveStoredReviews(updated);
  return updated;
}

export function getStoredFooterImage(): string | null {
  try {
    return localStorage.getItem(KEYS.CUSTOM_FOOTER_IMG);
  } catch {
    return null;
  }
}

export function saveStoredFooterImage(dataUrl: string | null) {
  if (dataUrl) {
    safeLocalStorageSet(KEYS.CUSTOM_FOOTER_IMG, dataUrl);
    idbSet(KEYS.CUSTOM_FOOTER_IMG, dataUrl);
    saveToServerDatabase({ footer_image: dataUrl });
  } else {
    try {
      localStorage.removeItem(KEYS.CUSTOM_FOOTER_IMG);
    } catch {
      // ignore
    }
    idbSet(KEYS.CUSTOM_FOOTER_IMG, null);
    saveToServerDatabase({ footer_image: null });
  }
}

// --- User Profile & Learner Passport Storage Engine ---
export function getUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(KEYS.USER_PROFILE);
    if (!data) {
      safeLocalStorageSet(KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
      idbSet(KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
      return INITIAL_USER_PROFILE;
    }
    const parsed = JSON.parse(data);
    return { ...INITIAL_USER_PROFILE, ...parsed };
  } catch {
    return INITIAL_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile) {
  safeLocalStorageSet(KEYS.USER_PROFILE, JSON.stringify(profile));
  idbSet(KEYS.USER_PROFILE, profile);
  saveToServerDatabase({ user_profile: profile });
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated: UserProfile = {
    ...current,
    ...updates,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
  saveUserProfile(updated);
  return updated;
}

export function incrementUserStat(
  key: 'totalStoriesRead' | 'quizzesCompleted' | 'factsLearned' | 'audioStoriesListened' | 'coloringPagesFinished',
  amount = 1
): UserProfile {
  const current = getUserProfile();
  const currentVal = current[key] || 0;
  const updated: UserProfile = {
    ...current,
    [key]: currentVal + amount,
    stars: current.stars + (key === 'totalStoriesRead' ? 10 : key === 'quizzesCompleted' ? 15 : 5),
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
  saveUserProfile(updated);
  return updated;
}

export function getStoredDailyTasks(): DailyTaskItem[] {
  try {
    const data = localStorage.getItem(KEYS.DAILY_TASKS);
    if (!data) {
      safeLocalStorageSet(KEYS.DAILY_TASKS, JSON.stringify(INITIAL_DAILY_TASKS));
      idbSet(KEYS.DAILY_TASKS, INITIAL_DAILY_TASKS);
      return INITIAL_DAILY_TASKS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_DAILY_TASKS;
  }
}

export function saveStoredDailyTasks(tasks: DailyTaskItem[]) {
  safeLocalStorageSet(KEYS.DAILY_TASKS, JSON.stringify(tasks));
  idbSet(KEYS.DAILY_TASKS, tasks);
  saveToServerDatabase({ daily_tasks: tasks });
}

export function addStoredDailyTask(task: Omit<DailyTaskItem, 'id'>): DailyTaskItem[] {
  const current = getStoredDailyTasks();
  const newTask: DailyTaskItem = {
    ...task,
    id: `task-${Date.now()}`,
  };
  const updated = [...current, newTask];
  saveStoredDailyTasks(updated);
  return updated;
}

export function deleteStoredDailyTask(id: string): DailyTaskItem[] {
  const current = getStoredDailyTasks();
  const updated = current.filter((t) => t.id !== id);
  saveStoredDailyTasks(updated);
  return updated;
}

export function claimDailyTaskReward(taskId: string): { success: boolean; starsAdded: number; profile: UserProfile } {
  const profile = getUserProfile();
  const tasks = getStoredDailyTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return { success: false, starsAdded: 0, profile };
  }

  const alreadyClaimed = (profile.claimedRewards || []).includes(taskId);
  if (alreadyClaimed) {
    return { success: false, starsAdded: 0, profile };
  }

  const starsToAdd = task.rewardStars || 10;
  const updatedProfile: UserProfile = {
    ...profile,
    stars: profile.stars + starsToAdd,
    claimedRewards: [...(profile.claimedRewards || []), taskId],
    completedTasks: Array.from(new Set([...(profile.completedTasks || []), taskId])),
  };

  saveUserProfile(updatedProfile);
  return { success: true, starsAdded: starsToAdd, profile: updatedProfile };
}

export function resetAllDataToDefault() {
  saveStoredStories(INITIAL_STORIES);
  saveStoredFunFacts(INITIAL_FUN_FACTS);
  saveStoredLearningItems(INITIAL_LEARNING_ITEMS);
  saveStoredAudioStories(INITIAL_AUDIO_STORIES);
  saveStoredVideoStories(INITIAL_VIDEO_STORIES);
  saveStoredVideoCategories(INITIAL_VIDEO_CATEGORIES);
  saveStoredQuizSets(INITIAL_QUIZ_SETS);
  saveStoredWorksheets(INITIAL_WORKSHEETS);
  saveStoredReviews(INITIAL_USER_REVIEWS);
  saveUserProfile(INITIAL_USER_PROFILE);
  saveStoredDailyTasks(INITIAL_DAILY_TASKS);
  saveStoredFooterImage(null);
}

// --- Asynchronous Universal Multi-Tier Sync Engine ---

export interface FullDatabaseState {
  stories?: Story[];
  fun_facts?: FunFact[];
  early_learning?: LearningItem[];
  audio_stories?: AudioStory[];
  video_stories?: VideoStory[];
  video_categories?: string[];
  quizzes?: QuizSet[];
  worksheets?: PrintableWorksheet[];
  user_reviews?: UserReview[];
  footer_image?: string | null;
  admin_passwords?: Record<string, string>;
}

/**
 * Loads data asynchronously from Server Database -> IndexedDB -> LocalStorage.
 * Ensures that if a user added a story on another device or if localStorage quota
 * was exceeded, the data is never lost.
 */
export async function loadPersistentData(): Promise<FullDatabaseState | null> {
  try {
    // 1. Check Firebase Firestore first (highest priority for multi-device live sync)
    if (isFirebaseConfigured()) {
      try {
        const [
          cloudStories,
          cloudWorksheets,
          cloudVideos,
          cloudFacts,
          cloudLearning,
          cloudAudio,
          cloudQuizzes,
        ] = await Promise.all([
          fetchStoriesFromFirestore(),
          fetchWorksheetsFromFirestore(),
          fetchVideoStoriesFromFirestore(),
          fetchFunFactsFromFirestore(),
          fetchLearningItemsFromFirestore(),
          fetchAudioStoriesFromFirestore(),
          fetchQuizSetsFromFirestore(),
        ]);
        if (
          (cloudStories && cloudStories.length > 0) ||
          (cloudWorksheets && cloudWorksheets.length > 0) ||
          (cloudVideos && cloudVideos.length > 0)
        ) {
          const cloudResult: FullDatabaseState = {};
          if (cloudStories && cloudStories.length > 0) {
            const mergedCloud = mergeWithInitialStories(cloudStories);
            cloudResult.stories = mergedCloud;
            safeLocalStorageSet(KEYS.STORIES, JSON.stringify(mergedCloud));
            idbSet(KEYS.STORIES, mergedCloud);
          }
          if (cloudWorksheets && cloudWorksheets.length > 0) {
            cloudResult.worksheets = cloudWorksheets;
            safeLocalStorageSet(KEYS.WORKSHEETS, JSON.stringify(cloudWorksheets));
            idbSet(KEYS.WORKSHEETS, cloudWorksheets);
          }
          if (cloudVideos && cloudVideos.length > 0) {
            cloudResult.video_stories = cloudVideos;
            safeLocalStorageSet(KEYS.VIDEOS, JSON.stringify(cloudVideos));
            idbSet(KEYS.VIDEOS, cloudVideos);
          }
          if (cloudFacts && cloudFacts.length > 0) {
            cloudResult.fun_facts = cloudFacts;
            safeLocalStorageSet(KEYS.FUN_FACTS, JSON.stringify(cloudFacts));
            idbSet(KEYS.FUN_FACTS, cloudFacts);
          }
          if (cloudLearning && cloudLearning.length > 0) {
            cloudResult.early_learning = cloudLearning;
            safeLocalStorageSet(KEYS.LEARNING, JSON.stringify(cloudLearning));
            idbSet(KEYS.LEARNING, cloudLearning);
          }
          if (cloudAudio && cloudAudio.length > 0) {
            cloudResult.audio_stories = cloudAudio;
            safeLocalStorageSet(KEYS.AUDIO, JSON.stringify(cloudAudio));
            idbSet(KEYS.AUDIO, cloudAudio);
          }
          if (cloudQuizzes && cloudQuizzes.length > 0) {
            cloudResult.quizzes = cloudQuizzes;
            safeLocalStorageSet(KEYS.QUIZZES, JSON.stringify(cloudQuizzes));
            idbSet(KEYS.QUIZZES, cloudQuizzes);
          }
          return cloudResult;
        }
      } catch (fbErr) {
        console.warn('Firestore load attempt notice:', fbErr);
      }
    }

    // 2. Check Server Database
    const serverDb = await fetchServerDatabase();
    if (serverDb && typeof serverDb === 'object') {
      const result: FullDatabaseState = {};
      if (Array.isArray(serverDb.stories)) result.stories = mergeWithInitialStories(serverDb.stories);
      if (Array.isArray(serverDb.fun_facts)) result.fun_facts = serverDb.fun_facts;
      if (Array.isArray(serverDb.early_learning)) result.early_learning = serverDb.early_learning;
      if (Array.isArray(serverDb.audio_stories)) result.audio_stories = serverDb.audio_stories;
      if (Array.isArray(serverDb.video_stories)) result.video_stories = serverDb.video_stories;
      if (Array.isArray(serverDb.video_categories)) result.video_categories = serverDb.video_categories;
      if (Array.isArray(serverDb.quizzes)) result.quizzes = serverDb.quizzes;
      if (Array.isArray(serverDb.worksheets)) result.worksheets = serverDb.worksheets;
      if (Array.isArray(serverDb.user_reviews)) result.user_reviews = serverDb.user_reviews;
      if (serverDb.footer_image !== undefined) result.footer_image = serverDb.footer_image;
      if (serverDb.admin_passwords) result.admin_passwords = serverDb.admin_passwords;

      // Sync server data to local caches
      if (result.stories) {
        safeLocalStorageSet(KEYS.STORIES, JSON.stringify(result.stories));
        idbSet(KEYS.STORIES, result.stories);
      }
      if (result.video_stories) {
        safeLocalStorageSet(KEYS.VIDEOS, JSON.stringify(result.video_stories));
        idbSet(KEYS.VIDEOS, result.video_stories);
      }
      if (result.quizzes) {
        safeLocalStorageSet(KEYS.QUIZZES, JSON.stringify(result.quizzes));
        idbSet(KEYS.QUIZZES, result.quizzes);
      }
      if (result.worksheets) {
        safeLocalStorageSet(KEYS.WORKSHEETS, JSON.stringify(result.worksheets));
        idbSet(KEYS.WORKSHEETS, result.worksheets);
      }

      return result;
    }

    // 2. Check IndexedDB if server is offline or empty
    const idbStories = await idbGet<Story[]>(KEYS.STORIES);
    const idbVideos = await idbGet<VideoStory[]>(KEYS.VIDEOS);
    const idbQuizzes = await idbGet<QuizSet[]>(KEYS.QUIZZES);
    const idbWorksheets = await idbGet<PrintableWorksheet[]>(KEYS.WORKSHEETS);

    if (idbStories && idbStories.length > 0) {
      const mergedIdb = mergeWithInitialStories(idbStories);
      return {
        stories: mergedIdb,
        video_stories: idbVideos || undefined,
        quizzes: idbQuizzes || undefined,
        worksheets: idbWorksheets || undefined,
      };
    }
  } catch (err) {
    console.warn('loadPersistentData error:', err);
  }
  return null;
}

/**
 * Exports complete database to JSON for 1-click backup
 */
export function exportFullDatabaseJson(currentData: {
  stories: Story[];
  videoStories: VideoStory[];
  videoCategories: string[];
  facts: FunFact[];
  learningItems: LearningItem[];
  audioStories: AudioStory[];
  reviews: UserReview[];
  quizSets: QuizSet[];
  worksheets: PrintableWorksheet[];
}): string {
  const exportPayload = {
    app: 'Baalvarta Portal',
    version: '2.0.0',
    exportTimestamp: new Date().toISOString(),
    collections: {
      stories: currentData.stories,
      video_stories: currentData.videoStories,
      video_categories: currentData.videoCategories,
      fun_facts: currentData.facts,
      early_learning: currentData.learningItems,
      audio_stories: currentData.audioStories,
      user_reviews: currentData.reviews,
      quizzes: currentData.quizSets,
      worksheets: currentData.worksheets,
    },
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Imports and permanently saves database from a JSON backup string
 */
export function importFullDatabaseJson(jsonString: string): {
  success: boolean;
  message: string;
  data?: FullDatabaseState;
} {
  try {
    const parsed = JSON.parse(jsonString);
    const collections = parsed.collections || parsed;

    const result: FullDatabaseState = {};

    if (Array.isArray(collections.stories) && collections.stories.length > 0) {
      result.stories = collections.stories;
      saveStoredStories(collections.stories);
    }
    if (Array.isArray(collections.video_stories)) {
      result.video_stories = collections.video_stories;
      saveStoredVideoStories(collections.video_stories);
    }
    if (Array.isArray(collections.video_categories)) {
      result.video_categories = collections.video_categories;
      saveStoredVideoCategories(collections.video_categories);
    }
    if (Array.isArray(collections.fun_facts)) {
      result.fun_facts = collections.fun_facts;
      saveStoredFunFacts(collections.fun_facts);
    }
    if (Array.isArray(collections.early_learning)) {
      result.early_learning = collections.early_learning;
      saveStoredLearningItems(collections.early_learning);
    }
    if (Array.isArray(collections.audio_stories)) {
      result.audio_stories = collections.audio_stories;
      saveStoredAudioStories(collections.audio_stories);
    }
    if (Array.isArray(collections.quizzes)) {
      result.quizzes = collections.quizzes;
      saveStoredQuizSets(collections.quizzes);
    }
    if (Array.isArray(collections.worksheets)) {
      result.worksheets = collections.worksheets;
      saveStoredWorksheets(collections.worksheets);
    }
    if (Array.isArray(collections.user_reviews)) {
      result.user_reviews = collections.user_reviews;
      saveStoredReviews(collections.user_reviews);
    }

    return {
      success: true,
      message: 'डेटाबेस बैकअप सफलतापूर्वक रिस्टोर हो गया और हमेशा के लिए सुरक्षित हो गया!',
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'अमान्य बैकअप JSON फ़ाइल: ' + (err?.message || 'गलत प्रारूप'),
    };
  }
}
