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
  CertificateAwardItem
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
  REVIEWS: 'baalvarta_user_reviews_v1',
  CUSTOM_FOOTER_IMG: 'baalvarta_custom_footer_img',
  ADMIN_PASSWORDS: 'baalvarta_admin_passwords_v2',
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

export function getStoredStories(): Story[] {
  try {
    const data = localStorage.getItem(KEYS.STORIES);
    if (!data) {
      safeLocalStorageSet(KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
      idbSet(KEYS.STORIES, INITIAL_STORIES);
      return INITIAL_STORIES;
    }
    return JSON.parse(data);
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
    return JSON.parse(data);
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

export function getReadingStreak(): { streak: number; totalRead: number; lastDate: string } {
  try {
    const data = localStorage.getItem(KEYS.READING_STREAK);
    if (!data) return { streak: 1, totalRead: 3, lastDate: new Date().toDateString() };
    return JSON.parse(data);
  } catch {
    return { streak: 1, totalRead: 3, lastDate: new Date().toDateString() };
  }
}

export function recordStoryRead(): { streak: number; totalRead: number } {
  const current = getReadingStreak();
  const today = new Date().toDateString();
  let nextStreak = current.streak;

  if (current.lastDate !== today) {
    nextStreak = current.streak + 1;
  }

  const updated = {
    streak: nextStreak,
    totalRead: current.totalRead + 1,
    lastDate: today,
  };

  safeLocalStorageSet(KEYS.READING_STREAK, JSON.stringify(updated));
  idbSet(KEYS.READING_STREAK, updated);
  return updated;
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
    return JSON.parse(data);
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
        const [cloudStories, cloudWorksheets] = await Promise.all([
          fetchStoriesFromFirestore(),
          fetchWorksheetsFromFirestore(),
        ]);
        if ((cloudStories && cloudStories.length > 0) || (cloudWorksheets && cloudWorksheets.length > 0)) {
          const cloudResult: FullDatabaseState = {};
          if (cloudStories && cloudStories.length > 0) {
            cloudResult.stories = cloudStories;
            safeLocalStorageSet(KEYS.STORIES, JSON.stringify(cloudStories));
            idbSet(KEYS.STORIES, cloudStories);
          }
          if (cloudWorksheets && cloudWorksheets.length > 0) {
            cloudResult.worksheets = cloudWorksheets;
            safeLocalStorageSet(KEYS.WORKSHEETS, JSON.stringify(cloudWorksheets));
            idbSet(KEYS.WORKSHEETS, cloudWorksheets);
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
      if (Array.isArray(serverDb.stories)) result.stories = serverDb.stories;
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
      return {
        stories: idbStories,
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
