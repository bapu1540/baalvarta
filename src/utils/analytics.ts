/**
 * Firebase Analytics & Engagement Tracker for Baalvarta
 * Tracks popular stories, user engagement, and content strategy metrics
 */

import { Analytics, getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { doc, setDoc, increment, collection, addDoc } from 'firebase/firestore';
import { getFirebaseAppInstance, getFirestoreDb, checkAndSetQuotaExhausted } from './firebase';
import { Story } from '../types';

let analyticsInstance: Analytics | null = null;
let isAnalyticsInitialized = false;

/**
 * Initialize Firebase Analytics safely in browser environments
 */
export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (isAnalyticsInitialized) return analyticsInstance;
  isAnalyticsInitialized = true;

  if (typeof window === 'undefined') return null;

  try {
    const supported = await isSupported();
    if (supported) {
      const app = getFirebaseAppInstance();
      if (app) {
        analyticsInstance = getAnalytics(app);
        console.log('✅ Firebase Analytics initialized successfully');
      }
    }
  } catch (err) {
    console.warn('Firebase Analytics initialization skipped or not supported in this environment:', err);
  }

  return analyticsInstance;
}

// Local storage fallback key for engagement stats
const LOCAL_ANALYTICS_KEY = 'baalvarta_local_analytics_v1';

export interface AnalyticsSummary {
  totalStoryViews: number;
  totalLikes: number;
  totalQuizCompletions: number;
  totalWorksheetDownloads: number;
  popularStories: { [storyId: string]: { id: string; title: string; views: number; likes: number; category: string } };
  topCategories: { [category: string]: number };
}

/**
 * Retrieve local engagement summary
 */
export function getLocalAnalyticsSummary(): AnalyticsSummary {
  try {
    const saved = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Failed to read local analytics summary:', err);
  }

  return {
    totalStoryViews: 0,
    totalLikes: 0,
    totalQuizCompletions: 0,
    totalWorksheetDownloads: 0,
    popularStories: {},
    topCategories: {},
  };
}

/**
 * Save updated analytics summary locally
 */
function saveLocalAnalyticsSummary(summary: AnalyticsSummary) {
  try {
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(summary));
  } catch (err) {
    console.warn('Failed to save local analytics summary:', err);
  }
}

/**
 * Record an analytics event to Firestore & Firebase Analytics
 */
async function recordEngagementEvent(
  eventType: 'story_view' | 'story_like' | 'story_share' | 'quiz_complete' | 'worksheet_download' | 'audio_play' | 'video_watch',
  targetId: string,
  targetTitle: string,
  category: string,
  extraParams: Record<string, any> = {}
) {
  // 1. Log event to standard Firebase Analytics SDK
  initFirebaseAnalytics().then((analytics) => {
    if (analytics) {
      logEvent(analytics, eventType, {
        item_id: targetId,
        item_name: targetTitle,
        item_category: category,
        content_type: eventType,
        ...extraParams,
      });
    }
  });

  // 2. Update local summary stats
  const summary = getLocalAnalyticsSummary();
  if (!summary.popularStories[targetId]) {
    summary.popularStories[targetId] = {
      id: targetId,
      title: targetTitle,
      views: 0,
      likes: 0,
      category,
    };
  }

  if (eventType === 'story_view') {
    summary.totalStoryViews += 1;
    summary.popularStories[targetId].views += 1;
  } else if (eventType === 'story_like') {
    summary.totalLikes += 1;
    summary.popularStories[targetId].likes += 1;
  } else if (eventType === 'quiz_complete') {
    summary.totalQuizCompletions += 1;
  } else if (eventType === 'worksheet_download') {
    summary.totalWorksheetDownloads += 1;
  }

  summary.topCategories[category] = (summary.topCategories[category] || 0) + 1;
  saveLocalAnalyticsSummary(summary);

  // 3. Persist event document and increment counters in Firestore
  const db = getFirestoreDb();
  if (db) {
    try {
      const eventDocRef = doc(collection(db, 'analytics_events'));
      setDoc(eventDocRef, {
        id: eventDocRef.id,
        eventType,
        targetId,
        targetTitle,
        category,
        timestamp: Date.now(),
        ...extraParams,
      }).catch((err) => checkAndSetQuotaExhausted(err));

      // If story view or like, increment viewsCount/likes on story document
      if (eventType === 'story_view') {
        const storyRef = doc(db, 'stories', targetId);
        setDoc(storyRef, { viewsCount: increment(1) }, { merge: true }).catch((err) =>
          checkAndSetQuotaExhausted(err)
        );
      }
    } catch (err: any) {
      checkAndSetQuotaExhausted(err);
    }
  }
}

/**
 * Track when a user views/reads a story
 */
export function trackStoryView(story: Story): void {
  recordEngagementEvent('story_view', story.id, story.titleHi || story.titleEn, story.category, {
    number: story.number,
    readTime: story.readTime,
    recommendedAge: story.recommendedAge,
  });
}

/**
 * Track when a user likes a story
 */
export function trackStoryLike(storyId: string, titleHi: string, category: string = 'story'): void {
  recordEngagementEvent('story_like', storyId, titleHi, category);
}

/**
 * Track when a story is shared
 */
export function trackStoryShare(storyId: string, titleHi: string, channel: string): void {
  recordEngagementEvent('story_share', storyId, titleHi, 'share', { method: channel });
}

/**
 * Track completion of a Kids Quiz
 */
export function trackQuizComplete(quizTitle: string, score: number, total: number, category: string): void {
  recordEngagementEvent('quiz_complete', `quiz_${category}`, quizTitle, category, {
    score,
    total,
    percentage: Math.round((score / total) * 100),
  });
}

/**
 * Track download/print of a Worksheet
 */
export function trackWorksheetDownload(worksheetId: string, titleHi: string, category: string): void {
  recordEngagementEvent('worksheet_download', worksheetId, titleHi, category);
}

/**
 * Track play of an Audio Story
 */
export function trackAudioStoryPlay(audioId: string, titleHi: string): void {
  recordEngagementEvent('audio_play', audioId, titleHi, 'audio');
}

/**
 * Track watch of a Video Story
 */
export function trackVideoWatch(videoId: string, titleHi: string): void {
  recordEngagementEvent('video_watch', videoId, titleHi, 'video');
}

/**
 * Get top popular stories based on views + likes engagement
 */
export function getPopularStories(allStories: Story[], limitCount = 5): Story[] {
  const summary = getLocalAnalyticsSummary();

  const scoredStories = allStories.map((s) => {
    const stats = summary.popularStories[s.id] || { views: 0, likes: 0 };
    // Score formula = (views * 1) + (likes * 3) + (base story likes * 2)
    const engagementScore = (stats.views * 1) + (stats.likes * 3) + (s.likes * 2);
    return { story: s, score: engagementScore };
  });

  scoredStories.sort((a, b) => b.score - a.score);
  return scoredStories.slice(0, limitCount).map((item) => item.story);
}

/**
 * Get comprehensive analytics insight report for Content Strategy optimization
 */
export function getAnalyticsStrategyReport() {
  const summary = getLocalAnalyticsSummary();

  const sortedStories = Object.values(summary.popularStories).sort(
    (a, b) => b.views + b.likes * 3 - (a.views + a.likes * 3)
  );

  const sortedCategories = Object.entries(summary.topCategories).sort((a, b) => b[1] - a[1]);

  return {
    totalStoryViews: summary.totalStoryViews,
    totalLikes: summary.totalLikes,
    totalQuizCompletions: summary.totalQuizCompletions,
    totalWorksheetDownloads: summary.totalWorksheetDownloads,
    topPerformingStories: sortedStories.slice(0, 5),
    mostPopularCategories: sortedCategories.slice(0, 5),
  };
}
