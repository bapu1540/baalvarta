export type Language = 'hi' | 'en';

export interface StoryScene {
  id: string;
  sceneNumber: number;
  image: string;
  textHi: string;
  textEn?: string;
  captionHi?: string;
}

export interface Story {
  id: string;
  number: number;
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  contentHi: string;
  contentEn: string;
  moralHi: string;
  moralEn: string;
  category: 'moral' | 'animals' | 'panchatantra' | 'bedtime' | 'wisdom';
  coverImage: string;
  readTime: string;
  recommendedAge: string;
  likes: number;
  isFeatured?: boolean;
  originalLanguage?: 'hi' | 'en';
  format?: 'standard' | 'picture_book';
  createdAt?: number;
  scenes?: StoryScene[];
  illustrations?: string[];
  vocabulary?: Array<{ word: string; meaningHi: string; meaningEn: string }>;
  discussionQuestions?: string[];
}

export interface FunFact {
  id: string;
  titleHi: string;
  titleEn: string;
  factHi: string;
  factEn: string;
  category: 'space' | 'animals' | 'nature' | 'human_body' | 'science';
  image: string;
  emoji: string;
  likes: number;
}

export interface LearningItem {
  id: string;
  module: 'alphabet' | 'numbers' | 'colors_shapes' | 'animals' | 'birds' | 'gk' | 'vocabulary' | 'custom';
  symbol: string;
  name: string; // En only
  pronunciation: string;
  color: string;
  imageOrEmoji: string;
  
  // Extended Rich Media Content
  audioUrl?: string; // mp3/wav
  videoUrl?: string; // mp4/youtube embed
  pdfUrl?: string; // pdf link
  imageUrl?: string; // high-res image
  words?: string[]; // array of words like ["Ant", "Axe", "Alligator"]
  story?: string; // short text story
  gameUrl?: string; // interactive game iframe embed
}

export interface QuizQuestion {
  id: string;
  questionHi: string;
  questionEn: string;
  image?: string;
  options: [string, string, string, string]; // 4 options in Hindi
  optionsEn?: [string, string, string, string]; // 4 options in English
  correctIndex: number; // 0, 1, 2, 3
  explanationHi: string; // क्यों सही है? (Hindi)
  explanationEn: string; // Why is this correct? (English)
  explanationImage?: string; // Explanatory illustration
}

export interface QuizSet {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  category: 'animals' | 'science' | 'moral' | 'nature' | 'stories' | 'gk' | 'fruits' | 'vehicles' | 'india';
  icon: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[]; // 5 questions per quiz
}

export interface PrintableWorksheet {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'coloring' | 'tracing' | 'puzzle' | 'craft';
  thumbnailUrl: string;
  printUrl: string;
  ageGroup: string;
  descriptionHi: string;
  descriptionEn: string;
  createdAt?: number;
}

export interface PaymentSettings {
  upiId: string;
  upiName: string;
  upiQrCodeUrl?: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  whatsappNumber: string;
  instructionsHi?: string;
  instructionsEn?: string;
  monthlyPrice: number;
  annualPrice: number;
  lifetimePrice?: number;
  isPaymentEnabled: boolean;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
  databaseURL?: string;
  measurementId?: string;
}

export interface AdConfig {
  enabled: boolean;
  adSenseClientId?: string;
  adSlots?: {
    homeLeaderboard?: string;
    storyReaderBanner?: string;
    storiesHubBanner?: string;
    quizHubBanner?: string;
  };
  customCodeSnippet?: string;
}

export interface AudioStory {
  id: string;
  titleHi: string;
  titleEn: string;
  narrator: string;
  duration: string;
  durationSeconds: number;
  coverImage: string;
  audioUrl: string;
  descriptionHi: string;
  descriptionEn: string;
  tags: string[];
}

export interface VideoStory {
  id: string;
  titleHi: string;
  titleEn: string;
  youtubeUrl: string; // Full YouTube video / Shorts URL or video ID
  thumbnail: string; // 9:16 aspect ratio thumbnail URL or base64 image
  category: string; // e.g. 'पंचतंत्र', 'अकबर बीरबल', 'Shorts', 'नैतिक शिक्षा', etc.
  duration?: string; // e.g. '0:58', '1:20', 'Shorts'
  viewsCount?: string; // e.g. '15K+'
  descriptionHi?: string;
  descriptionEn?: string;
  isFeatured?: boolean;
}

export interface UserReview {
  id: string;
  name: string;
  role: 'Parent' | 'Teacher' | 'Student' | 'Story Lover';
  rating: number; // 1 to 5
  comment: string;
  date: string;
  storyTitle?: string;
  likes?: number;
}

export interface KidsGameItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'piano' | 'bubble' | 'glow_draw' | 'counting' | 'shadow_match' | 'snake' | 'rocket' | 'tractor' | 'custom';
  descriptionHi: string;
  descriptionEn: string;
  emoji: string;
  color: string;
  badge: string;
  isFeatured?: boolean;
}

export interface ColoringTemplateItem {
  id: string;
  nameHi: string;
  nameEn: string;
  emoji: string;
  imageUrl?: string;
  image?: string;
  category?: string;
  svgPathData?: string;
  builtInKey?: string;
}

export interface CustomGameItem {
  id: string;
  titleHi: string;
  titleEn: string;
  gameType: string;
  emoji: string;
  difficulty?: string;
  descriptionHi: string;
  descriptionEn: string;
  imageUrl?: string;
  category?: string;
}

export interface CertificateAwardItem {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  color: string;
  icon?: string;
}

export interface DailyTaskItem {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  category: 'story' | 'quiz' | 'fact' | 'audio' | 'coloring' | 'streak';
  targetCount: number;
  rewardStars: number;
  icon: string;
}

export interface StreakMilestone {
  days: number;
  badgeId: string;
  titleHi: string;
  titleEn: string;
  badgeIcon: string;
  rewardStars: number;
  flameLevel: 'spark' | 'flame' | 'blaze' | 'cosmic';
  descriptionHi: string;
  descriptionEn: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
  source?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  ageGroup: string;
  isPro: boolean;
  proPlanType?: 'monthly' | 'yearly' | 'lifetime';
  proExpiryDate?: string;
  stars: number;
  totalStoriesRead: number;
  streakDays: number;
  completedTasks: string[]; // task IDs completed today
  claimedRewards: string[]; // task IDs whose rewards were claimed
  claimedMilestones?: string[]; // streak milestone IDs claimed e.g. ['streak-3', 'streak-7']
  streakHistory?: string[]; // list of dates (YYYY-MM-DD) when a story was read
  lastActiveDate: string;
  earnedCertificates: string[];
  quizzesCompleted: number;
  factsLearned: number;
  audioStoriesListened: number;
  coloringPagesFinished: number;
}

export type ActiveTab = 
  | 'home' 
  | 'stories' 
  | 'learning'
  | 'facts' 
  | 'gk'
  | 'audio' 
  | 'videos' 
  | 'games' 
  | 'quizzes' 
  | 'space'
  | 'heroes'
  | 'coloring' 
  | 'certificates' 
  | 'profile'
  | 'worksheets' 
  | 'parent-guide' 
  | 'about' 
  | 'contact';

