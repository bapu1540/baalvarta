/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Language, Story, FunFact, LearningItem, AudioStory, VideoStory, UserReview, QuizSet, PrintableWorksheet } from './types';
import {
  getStoredStories,
  saveStoredStories,
  getStoredFunFacts,
  saveStoredFunFacts,
  getStoredLearningItems,
  saveStoredLearningItems,
  getStoredAudioStories,
  saveStoredAudioStories,
  getStoredVideoStories,
  saveStoredVideoStories,
  getStoredVideoCategories,
  saveStoredVideoCategories,
  getStoredQuizSets,
  saveStoredQuizSets,
  getStoredWorksheets,
  saveStoredWorksheets,
  getBookmarks,
  toggleBookmark,
  resetAllDataToDefault,
  getStoredReviews,
  deleteStoredReview,
  loadPersistentData,
  mergeWithInitialStories,
  recordSiteVisit,
  addRecentlyReadStory,
  syncDeletedDocIdsFromFirestore,
  getDeletedDocIds,
} from './utils/storage';
import { saveToServerDatabase } from './utils/dbStorage';
import { WebsiteHeader } from './components/WebsiteHeader';
import { WebsiteFooter } from './components/WebsiteFooter';
import { WebsiteHome } from './components/WebsiteHome';
import { StoriesHub } from './components/StoriesHub';
import { FunFactsHub } from './components/FunFactsHub';
import { EarlyLearningZone } from './components/EarlyLearningZone';
import { AudioStoryPlayer } from './components/AudioStoryPlayer';
import { VideoStoriesHub } from './components/VideoStoriesHub';
import { KidsQuizHub } from './components/KidsQuizHub';
import { ParentGuidePage } from './components/ParentGuidePage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactPage } from './components/ContactPage';
import { ParentalGateModal } from './components/ParentalGateModal';
import { AdminCMS } from './components/AdminCMS';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { FixedBottomBar } from './components/FixedBottomBar';
import { ThemeAndFontModal } from './components/ThemeAndFontModal';
import { KidsColoringBook } from './components/KidsColoringBook';
import { KidsMiniGamesHub } from './components/KidsMiniGamesHub';
import { KidsCertificateHub } from './components/KidsCertificateHub';
import { KidProfileHub } from './components/KidProfileHub';
import { PrintableWorksheetsHub } from './components/PrintableWorksheetsHub';
import { GeneralKnowledgeHub } from './components/GeneralKnowledgeHub';
import { SpaceUniverseHub } from './components/SpaceUniverseHub';
import { GreatHeroesChildhoodHub } from './components/GreatHeroesChildhoodHub';
import { BaalmitraChatModal } from './components/BaalmitraChatModal';
import { BaalvartaProModal } from './components/BaalvartaProModal';
import { ContentSkeletonLoader } from './components/ContentSkeletonLoader';
import {
  ThemeSettings,
  getStoredThemeSettings,
  saveStoredThemeSettings,
  applyThemeToDOM
} from './utils/themeManager';
import { ArrowLeft, Home } from 'lucide-react';
import { playPopSound, stopSpeech } from './utils/soundEffects';
import {
  subscribeToFirestoreStories,
  subscribeToFirestoreWorksheets,
  subscribeToFirestoreVideoStories,
  subscribeToFirestoreFunFacts,
  subscribeToFirestoreLearningItems,
  subscribeToFirestoreAudioStories,
  subscribeToFirestoreQuizSets,
  testConnectionOnBoot,
  seedInitialFirestoreDataIfNeeded,
  fetchStoriesFromFirestore,
  fetchWorksheetsFromFirestore,
  fetchVideoStoriesFromFirestore,
  fetchFunFactsFromFirestore,
  fetchLearningItemsFromFirestore,
  fetchAudioStoriesFromFirestore,
  fetchQuizSetsFromFirestore,
  syncAllStoriesToFirestore,
  syncAllVideoStoriesToFirestore,
  syncAllFunFactsToFirestore,
  syncAllLearningItemsToFirestore,
  syncAllAudioStoriesToFirestore,
} from './utils/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>(['home']);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('baalvarta_language_v1');
    return (saved === 'hi' || saved === 'en') ? saved : 'hi';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [selectedStoryForReader, setSelectedStoryForReader] = useState<Story | null>(null);
  const [storiesInitialFormat, setStoriesInitialFormat] = useState<'all' | 'picture_book' | 'single_image'>('all');
  const [worksheetCategory, setWorksheetCategory] = useState<string>('all');
  const [worksheetCertificateType, setWorksheetCertificateType] = useState<string>('super_reader');

  // Global Search State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [searchModalQuery, setSearchModalQuery] = useState<string>('');
  const [searchModalCategory, setSearchModalCategory] = useState<string>('all');

  // Theme & Font Settings State
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => getStoredThemeSettings());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Gemini AI Baalmitra Chatbot State
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);

  // Baalvarta Pro Membership State
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  // Tab Transition & Data Fetching Loading State
  const [isTabTransitioning, setIsTabTransitioning] = useState<boolean>(false);

  useEffect(() => {
    applyThemeToDOM(themeSettings);
  }, [themeSettings]);

  const handleUpdateThemeSettings = (newSettings: ThemeSettings) => {
    setThemeSettings(newSettings);
    saveStoredThemeSettings(newSettings);
  };

  const handleOpenSearch = (query: string = '', category: string = 'all') => {
    if (soundEnabled) playPopSound();
    setSearchModalQuery(query);
    setSearchModalCategory(category);
    setIsSearchModalOpen(true);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('baalvarta_language_v1', lang);
    } catch {
      // ignore
    }
  };

  // Core Data Collections
  const [stories, setStories] = useState<Story[]>(() => getStoredStories());
  const [facts, setFacts] = useState<FunFact[]>(() => getStoredFunFacts());
  const [learningItems, setLearningItems] = useState<LearningItem[]>(() => getStoredLearningItems());
  const [audioStories, setAudioStories] = useState<AudioStory[]>(() => getStoredAudioStories());
  const [videoStories, setVideoStories] = useState<VideoStory[]>(() => getStoredVideoStories());
  const [videoCategories, setVideoCategories] = useState<string[]>(() => getStoredVideoCategories());
  const [quizSets, setQuizSets] = useState<QuizSet[]>(() => getStoredQuizSets());
  const [worksheets, setWorksheets] = useState<PrintableWorksheet[]>(() => getStoredWorksheets());
  const [reviews, setReviews] = useState<UserReview[]>(() => getStoredReviews());
  const [bookmarks, setBookmarks] = useState<string[]>(() => getBookmarks());

  // Asynchronously sync with persistent Server Database and IndexedDB
  useEffect(() => {
    // Record page visit for total visitors counter
    recordSiteVisit();

    // 0. Sync deleted doc IDs from Firestore across all devices
    syncDeletedDocIdsFromFirestore().then(() => {
      const deletedIds = getDeletedDocIds();
      if (deletedIds.size > 0) {
        setStories((prev) => prev.filter((s) => !deletedIds.has(s.id)));
        setFacts((prev) => prev.filter((f) => !deletedIds.has(f.id)));
        setVideoStories((prev) => prev.filter((v) => !deletedIds.has(v.id)));
        setAudioStories((prev) => prev.filter((a) => !deletedIds.has(a.id)));
        setWorksheets((prev) => prev.filter((w) => !deletedIds.has(w.id)));
        setQuizSets((prev) => prev.filter((q) => !deletedIds.has(q.id)));
      }
    });

    loadPersistentData().then((persistent) => {
      if (!persistent) return;
      if (persistent.stories && persistent.stories.length > 0) {
        const merged = mergeWithInitialStories(persistent.stories);
        setStories(merged);
      }
      if (persistent.video_stories && persistent.video_stories.length > 0) {
        setVideoStories(persistent.video_stories);
      }
      if (persistent.video_categories && persistent.video_categories.length > 0) {
        setVideoCategories(persistent.video_categories);
      }
      if (persistent.worksheets && persistent.worksheets.length > 0) {
        setWorksheets(persistent.worksheets);
      }
      if (persistent.fun_facts && persistent.fun_facts.length > 0) {
        setFacts(persistent.fun_facts);
      }
      if (persistent.early_learning && persistent.early_learning.length > 0) {
        setLearningItems(persistent.early_learning);
      }
      if (persistent.audio_stories && persistent.audio_stories.length > 0) {
        setAudioStories(persistent.audio_stories);
      }
      if (persistent.quizzes && persistent.quizzes.length > 0) {
        setQuizSets(persistent.quizzes);
      }
      if (persistent.user_reviews && persistent.user_reviews.length > 0) {
        setReviews(persistent.user_reviews);
      }
    });

    // Validate connection to Firebase and auto-seed initial data if Firestore is empty
    testConnectionOnBoot().then((connected) => {
      if (connected) {
        seedInitialFirestoreDataIfNeeded(
          getStoredStories(),
          getStoredWorksheets(),
          getStoredVideoStories(),
          getStoredFunFacts(),
          getStoredLearningItems(),
          getStoredAudioStories(),
          getStoredQuizSets()
        );

        // Fetch all collections immediately for fresh multi-device state
        fetchStoriesFromFirestore().then((cloudStories) => {
          if (cloudStories && Array.isArray(cloudStories)) {
            const deletedIds = getDeletedDocIds();
            const merged = mergeWithInitialStories(cloudStories).filter((s) => !deletedIds.has(s.id));
            setStories(merged);
            saveStoredStories(merged);
          }
        });
        fetchWorksheetsFromFirestore().then((cloudWs) => {
          if (cloudWs && Array.isArray(cloudWs)) {
            const deletedIds = getDeletedDocIds();
            const filtered = cloudWs.filter((w) => !deletedIds.has(w.id));
            setWorksheets(filtered);
            saveStoredWorksheets(filtered);
          }
        });
        fetchVideoStoriesFromFirestore().then((cloudVids) => {
          if (cloudVids && Array.isArray(cloudVids)) {
            const deletedIds = getDeletedDocIds();
            const filtered = cloudVids.filter((v) => !deletedIds.has(v.id));
            setVideoStories(filtered);
            saveStoredVideoStories(filtered);
          }
        });
        fetchFunFactsFromFirestore().then((cloudFacts) => {
          if (cloudFacts && Array.isArray(cloudFacts)) {
            const deletedIds = getDeletedDocIds();
            const filtered = cloudFacts.filter((f) => !deletedIds.has(f.id));
            setFacts(filtered);
            saveStoredFunFacts(filtered);
          }
        });
        fetchLearningItemsFromFirestore().then((cloudItems) => {
          if (cloudItems && Array.isArray(cloudItems)) {
            const deletedIds = getDeletedDocIds();
            const filtered = cloudItems.filter((item) => !deletedIds.has(item.id));
            setLearningItems(filtered);
            saveStoredLearningItems(filtered);
          }
        });
        fetchAudioStoriesFromFirestore().then((cloudAudio) => {
          if (cloudAudio && Array.isArray(cloudAudio)) {
            const deletedIds = getDeletedDocIds();
            const filtered = cloudAudio.filter((a) => !deletedIds.has(a.id));
            setAudioStories(filtered);
            saveStoredAudioStories(filtered);
          }
        });
        fetchQuizSetsFromFirestore().then((cloudQuizzes) => {
          if (cloudQuizzes && Array.isArray(cloudQuizzes)) {
            const deletedIds = getDeletedDocIds();
            const filtered = cloudQuizzes.filter((q) => !deletedIds.has(q.id));
            setQuizSets(filtered);
            saveStoredQuizSets(filtered);
          }
        });
      }
    });

    // Real-time synchronization with Firebase Firestore across all devices
    const unsubStories = subscribeToFirestoreStories((cloudStories) => {
      if (cloudStories && Array.isArray(cloudStories)) {
        const deletedIds = getDeletedDocIds();
        const merged = mergeWithInitialStories(cloudStories).filter((s) => !deletedIds.has(s.id));
        setStories(merged);
        saveStoredStories(merged);
        saveToServerDatabase({ stories: merged });
      }
    });

    const unsubWorksheets = subscribeToFirestoreWorksheets((cloudWorksheets) => {
      if (cloudWorksheets && Array.isArray(cloudWorksheets)) {
        const deletedIds = getDeletedDocIds();
        const filtered = cloudWorksheets.filter((w) => !deletedIds.has(w.id));
        setWorksheets(filtered);
        saveStoredWorksheets(filtered);
        saveToServerDatabase({ worksheets: filtered });
      }
    });

    const unsubVideos = subscribeToFirestoreVideoStories((cloudVideos) => {
      if (cloudVideos && Array.isArray(cloudVideos)) {
        const deletedIds = getDeletedDocIds();
        const filtered = cloudVideos.filter((v) => !deletedIds.has(v.id));
        setVideoStories(filtered);
        saveStoredVideoStories(filtered);
        saveToServerDatabase({ video_stories: filtered });
      }
    });

    const unsubFacts = subscribeToFirestoreFunFacts((cloudFacts) => {
      if (cloudFacts && Array.isArray(cloudFacts)) {
        const deletedIds = getDeletedDocIds();
        const filtered = cloudFacts.filter((f) => !deletedIds.has(f.id));
        setFacts(filtered);
        saveStoredFunFacts(filtered);
        saveToServerDatabase({ fun_facts: filtered });
      }
    });

    const unsubLearning = subscribeToFirestoreLearningItems((cloudItems) => {
      if (cloudItems && Array.isArray(cloudItems)) {
        const deletedIds = getDeletedDocIds();
        const filtered = cloudItems.filter((i) => !deletedIds.has(i.id));
        setLearningItems(filtered);
        saveStoredLearningItems(filtered);
        saveToServerDatabase({ early_learning: filtered });
      }
    });

    const unsubAudio = subscribeToFirestoreAudioStories((cloudAudio) => {
      if (cloudAudio && Array.isArray(cloudAudio)) {
        const deletedIds = getDeletedDocIds();
        const filtered = cloudAudio.filter((a) => !deletedIds.has(a.id));
        setAudioStories(filtered);
        saveStoredAudioStories(filtered);
        saveToServerDatabase({ audio_stories: filtered });
      }
    });

    const unsubQuizzes = subscribeToFirestoreQuizSets((cloudQuizzes) => {
      if (cloudQuizzes && Array.isArray(cloudQuizzes)) {
        const deletedIds = getDeletedDocIds();
        const filtered = cloudQuizzes.filter((q) => !deletedIds.has(q.id));
        setQuizSets(filtered);
        saveStoredQuizSets(filtered);
        saveToServerDatabase({ quizzes: filtered });
      }
    });

    return () => {
      if (unsubStories) unsubStories();
      if (unsubWorksheets) unsubWorksheets();
      if (unsubVideos) unsubVideos();
      if (unsubFacts) unsubFacts();
      if (unsubLearning) unsubLearning();
      if (unsubAudio) unsubAudio();
      if (unsubQuizzes) unsubQuizzes();
    };
  }, []);

  const handleDataRestored = (restored: any) => {
    if (!restored) return;
    if (restored.stories) setStories(restored.stories);
    if (restored.video_stories) setVideoStories(restored.video_stories);
    if (restored.video_categories) setVideoCategories(restored.video_categories);
    if (restored.fun_facts) setFacts(restored.fun_facts);
    if (restored.early_learning) setLearningItems(restored.early_learning);
    if (restored.audio_stories) setAudioStories(restored.audio_stories);
    if (restored.quizzes) setQuizSets(restored.quizzes);
    if (restored.user_reviews) setReviews(restored.user_reviews);
  };

  // Admin Modals & Auth State
  const [isParentalGateOpen, setIsParentalGateOpen] = useState<boolean>(false);
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('chauhansanjay932@gmail.com');

  // Secret #admin URL Route Listener - 100% Robust Detection (Supports #admin, /#admin, #admin/, ?admin, /admin, etc.)
  useEffect(() => {
    const checkAndTriggerAdminRoute = () => {
      try {
        const hash = (window.location.hash || '').toLowerCase();
        const search = (window.location.search || '').toLowerCase();
        const path = (window.location.pathname || '').toLowerCase();
        const href = (window.location.href || '').toLowerCase();

        const isAdminRequested =
          hash.includes('admin') ||
          hash.includes('cms') ||
          search.includes('admin') ||
          search.includes('cms') ||
          path.includes('/admin') ||
          path.includes('/cms') ||
          href.includes('admin');

        if (isAdminRequested) {
          setIsParentalGateOpen(true);
        }
      } catch {
        // ignore safely
      }
    };

    // 1. Immediate execution on mount
    checkAndTriggerAdminRoute();

    // 2. Delayed execution to catch iframe / late hydration URL resolution
    const t1 = setTimeout(checkAndTriggerAdminRoute, 100);
    const t2 = setTimeout(checkAndTriggerAdminRoute, 500);
    const t3 = setTimeout(checkAndTriggerAdminRoute, 1200);

    // 3. Native event listeners
    window.addEventListener('hashchange', checkAndTriggerAdminRoute);
    window.addEventListener('popstate', checkAndTriggerAdminRoute);

    // 4. Secret Admin Keyboard Shortcut: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsParentalGateOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 5. Expose global window helper for easy programmatic opening
    (window as any).openAdminLogin = () => setIsParentalGateOpen(true);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('hashchange', checkAndTriggerAdminRoute);
      window.removeEventListener('popstate', checkAndTriggerAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseAdminCMS = () => {
    setIsAdminCMSOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleCloseParentalGate = () => {
    setIsParentalGateOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Sync helpers
  const handleToggleBookmark = (id: string) => {
    const updated = toggleBookmark(id);
    setBookmarks(updated);
  };

  const handleLikeStory = (id: string) => {
    const updated = stories.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s));
    setStories(updated);
    saveStoredStories(updated);
  };

  const handleLikeFact = (id: string) => {
    const updated = facts.map((f) => (f.id === id ? { ...f, likes: f.likes + 1 } : f));
    setFacts(updated);
    saveStoredFunFacts(updated);
  };

  const handleSaveStories = (newStories: Story[]) => {
    setStories(newStories);
    saveStoredStories(newStories);
    saveToServerDatabase({ stories: newStories });
    syncAllStoriesToFirestore(newStories);
  };

  const handleSaveFacts = (newFacts: FunFact[]) => {
    setFacts(newFacts);
    saveStoredFunFacts(newFacts);
    saveToServerDatabase({ fun_facts: newFacts });
    syncAllFunFactsToFirestore(newFacts);
  };

  const handleSaveLearning = (newItems: LearningItem[]) => {
    setLearningItems(newItems);
    saveStoredLearningItems(newItems);
    saveToServerDatabase({ early_learning: newItems });
    syncAllLearningItemsToFirestore(newItems);
  };

  const handleSaveAudio = (newAudio: AudioStory[]) => {
    setAudioStories(newAudio);
    saveStoredAudioStories(newAudio);
    saveToServerDatabase({ audio_stories: newAudio });
    syncAllAudioStoriesToFirestore(newAudio);
  };

  const handleSaveVideos = (newVideos: VideoStory[]) => {
    setVideoStories(newVideos);
    saveStoredVideoStories(newVideos);
    saveToServerDatabase({ video_stories: newVideos });
    syncAllVideoStoriesToFirestore(newVideos);
  };

  const handleSaveVideoCategories = (newCategories: string[]) => {
    setVideoCategories(newCategories);
    saveStoredVideoCategories(newCategories);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updated = deleteStoredReview(reviewId);
    setReviews(updated);
  };

  const handleResetAllData = () => {
    resetAllDataToDefault();
    setStories(getStoredStories());
    setFacts(getStoredFunFacts());
    setLearningItems(getStoredLearningItems());
    setAudioStories(getStoredAudioStories());
    setVideoStories(getStoredVideoStories());
    setVideoCategories(getStoredVideoCategories());
    setQuizSets(getStoredQuizSets());
    setReviews(getStoredReviews());
    setBookmarks([]);
  };

  // Navigation history & smart step-by-step back management
  const pushNavState = (stateObj: any) => {
    try {
      window.history.pushState(stateObj, '');
    } catch {
      // ignore
    }
  };

  const handleNavigateTab = (
    tab: ActiveTab,
    format?: 'all' | 'picture_book' | 'single_image',
    category?: string,
    certType?: string
  ) => {
    stopSpeech();
    if (format) {
      setStoriesInitialFormat(format);
    }
    if (category) {
      setWorksheetCategory(category);
    }
    if (certType) {
      setWorksheetCertificateType(certType);
    }
    if (tab !== activeTab) {
      setTabHistory((prev) => [...prev, tab]);
      setIsTabTransitioning(true);
      setTimeout(() => {
        setIsTabTransitioning(false);
      }, 150);
    }
    pushNavState({ view: 'tab', tab });
    setActiveTab(tab);
    setShowBookmarksOnly(false);
    setSelectedStoryForReader(null);
  };

  const handleSelectStory = (story: Story) => {
    stopSpeech();
    addRecentlyReadStory(story.id);
    setSelectedStoryForReader(story);
    setTabHistory((prev) => [...prev, 'stories']);
    setActiveTab('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSmartBack = () => {
    if (soundEnabled) playPopSound();
    stopSpeech();

    if (selectedStoryForReader) {
      // Step 1: Return from story reading to stories list
      setSelectedStoryForReader(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabHistory.length > 1) {
      // Step 2: Return to previous visited tab
      const newHistory = [...tabHistory];
      newHistory.pop();
      const prevTab = newHistory[newHistory.length - 1] || 'home';
      setTabHistory(newHistory);
      setActiveTab(prevTab);
      setShowBookmarksOnly(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeTab !== 'home') {
      // Step 3: Return to home
      setActiveTab('home');
      setTabHistory(['home']);
      setShowBookmarksOnly(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDirectHome = () => {
    if (soundEnabled) playPopSound();
    stopSpeech();
    setSelectedStoryForReader(null);
    setShowBookmarksOnly(false);
    setTabHistory(['home']);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hardware Back Button (Android / Mobile browser back) Listener
  useEffect(() => {
    // Set initial baseline state if not present
    if (!window.history.state) {
      window.history.replaceState({ view: 'home' }, '');
    }

    const handlePopState = () => {
      stopSpeech();

      // Priority 1: If search modal is open, close it
      if (isSearchModalOpen) {
        setIsSearchModalOpen(false);
        return;
      }

      // Priority 2: If Admin CMS is open, close it
      if (isAdminCMSOpen) {
        setIsAdminCMSOpen(false);
        return;
      }

      // Priority 3: If Parental Gate is open, close it
      if (isParentalGateOpen) {
        setIsParentalGateOpen(false);
        return;
      }

      // Priority 4: If currently reading a story, return to stories list
      if (selectedStoryForReader) {
        setSelectedStoryForReader(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Priority 5: If in history / inner tab, step back
      if (tabHistory.length > 1) {
        const newHistory = [...tabHistory];
        newHistory.pop();
        const prevTab = newHistory[newHistory.length - 1] || 'home';
        setTabHistory(newHistory);
        setActiveTab(prevTab);
        setShowBookmarksOnly(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (activeTab !== 'home') {
        setActiveTab('home');
        setTabHistory(['home']);
        setShowBookmarksOnly(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSearchModalOpen, isAdminCMSOpen, isParentalGateOpen, selectedStoryForReader, activeTab, tabHistory]);

  const handleSelectStoryFromHome = (story: Story) => {
    stopSpeech();
    addRecentlyReadStory(story.id);
    if (activeTab !== 'stories') {
      setTabHistory((prev) => [...prev, 'stories']);
    }
    pushNavState({ view: 'story', storyId: story.id });
    setSelectedStoryForReader(story);
    setActiveTab('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    handleSmartBack();
  };

  const handleWatchVideoFromStory = (category?: string, title?: string) => {
    stopSpeech();
    if (soundEnabled) playPopSound();
    if (activeTab !== 'videos') {
      setTabHistory((prev) => [...prev, 'videos']);
    }
    pushNavState({ view: 'tab', tab: 'videos' });
    setActiveTab('videos');
    setSelectedStoryForReader(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col font-sans selection:bg-amber-200 overflow-x-hidden w-full max-w-full pb-14 sm:pb-16">
      
      {/* Modern Responsive Navigation Header */}
      <WebsiteHeader
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        language={language}
        setLanguage={setLanguage}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAdmin={() => setIsParentalGateOpen(true)}
        showBookmarksOnly={showBookmarksOnly}
        setShowBookmarksOnly={setShowBookmarksOnly}
        bookmarkCount={bookmarks.length}
        onQuickSearchClick={(q) => handleOpenSearch(q || '')}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        stories={stories}
        videoStories={videoStories}
        worksheets={worksheets}
        onSelectStory={handleSelectStoryFromHome}
        onSelectStoryFormat={(fmt) => setStoriesInitialFormat(fmt)}
      />

      {/* Main Portal View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 py-2 sm:py-4 overflow-x-hidden min-h-[50vh]">
        
        {isTabTransitioning ? (
          <ContentSkeletonLoader language={language} />
        ) : (
          <>
            {activeTab === 'home' && (
              <WebsiteHome
                onNavigate={handleNavigateTab}
                stories={stories}
                facts={facts}
                learningItems={learningItems}
                audioStories={audioStories}
                language={language}
                soundEnabled={soundEnabled}
                onOpenAdmin={() => setIsParentalGateOpen(true)}
                onSelectStory={handleSelectStoryFromHome}
                onOpenSearch={(q) => handleOpenSearch(q || '')}
                onOpenProModal={() => setIsProModalOpen(true)}
              />
            )}

        {activeTab === 'stories' && (
          <StoriesHub
            stories={stories}
            language={language}
            setLanguage={setLanguage}
            soundEnabled={soundEnabled}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onLikeStory={handleLikeStory}
            showBookmarksOnly={showBookmarksOnly}
            onResetFilter={() => setShowBookmarksOnly(false)}
            initialStory={selectedStoryForReader}
            onClearInitialStory={() => setSelectedStoryForReader(null)}
            onWatchVideo={handleWatchVideoFromStory}
            initialFormat={storiesInitialFormat}
          />
        )}

        {activeTab === 'facts' && (
          <FunFactsHub
            facts={facts}
            language={language}
            soundEnabled={soundEnabled}
            onLikeFact={handleLikeFact}
          />
        )}

        {activeTab === 'learning' && (
          <EarlyLearningZone
            items={learningItems}
            language={language}
            soundEnabled={soundEnabled}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'gk' && (
          <GeneralKnowledgeHub
            language={language}
            soundEnabled={soundEnabled}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'space' && (
          <SpaceUniverseHub
            language={language}
            soundEnabled={soundEnabled}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'heroes' && (
          <GreatHeroesChildhoodHub
            language={language}
            soundEnabled={soundEnabled}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'quizzes' && (
          <KidsQuizHub
            language={language}
            soundEnabled={soundEnabled}
            onNavigateTab={(tab) => handleNavigateTab(tab || 'home')}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'audio' && (
          <AudioStoryPlayer
            audioStories={audioStories}
            language={language}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'videos' && (
          <VideoStoriesHub
            videos={videoStories}
            categories={videoCategories}
            language={language}
            soundEnabled={soundEnabled}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'coloring' && (
          <KidsColoringBook
            language={language}
            soundEnabled={soundEnabled}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'games' && (
          <KidsMiniGamesHub
            language={language}
            soundEnabled={soundEnabled}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'certificates' && (
          <KidsCertificateHub
            language={language}
            soundEnabled={soundEnabled}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'profile' && (
          <KidProfileHub
            language={language}
            soundEnabled={soundEnabled}
            onNavigateTab={handleNavigateTab}
            onSelectStory={handleSelectStory}
            onOpenProModal={() => setIsProModalOpen(true)}
          />
        )}

        {activeTab === 'worksheets' && (
          <PrintableWorksheetsHub
            worksheets={worksheets}
            language={language}
            soundEnabled={soundEnabled}
            initialCategory={worksheetCategory}
            initialCertificateType={worksheetCertificateType}
            onBackToHome={handleBackToHome}
            onOpenProModal={() => setIsProModalOpen(true)}
          />
        )}

        {activeTab === 'parent-guide' && (
          <ParentGuidePage
            language={language}
            soundEnabled={soundEnabled}
            onBackToHome={handleBackToHome}
          />
        )}

        {activeTab === 'about' && (
          <AboutUsPage
            language={language}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage
            language={language}
            soundEnabled={soundEnabled}
          />
        )}
          </>
        )}
      </main>

      {/* Comprehensive Modern Web Footer */}
      <WebsiteFooter
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsParentalGateOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Strict 2-Step 2FA Admin Authentication Modal */}
      <ParentalGateModal
        isOpen={isParentalGateOpen}
        onClose={handleCloseParentalGate}
        onSuccess={(email) => {
          setAdminEmail(email);
          setIsParentalGateOpen(false);
          setIsAdminCMSOpen(true);
        }}
        soundEnabled={soundEnabled}
      />

      {/* Admin CMS Full Screen Hub */}
      <AdminCMS
        isOpen={isAdminCMSOpen}
        onClose={handleCloseAdminCMS}
        language={language}
        soundEnabled={soundEnabled}
        adminEmail={adminEmail}
        stories={stories}
        onSaveStories={handleSaveStories}
        facts={facts}
        onSaveFacts={handleSaveFacts}
        learningItems={learningItems}
        onSaveLearning={handleSaveLearning}
        audioStories={audioStories}
        onSaveAudio={handleSaveAudio}
        videoStories={videoStories}
        onSaveVideos={handleSaveVideos}
        videoCategories={videoCategories}
        onSaveVideoCategories={handleSaveVideoCategories}
        reviews={reviews}
        onDeleteReview={handleDeleteReview}
        onResetAllData={handleResetAllData}
        onDataRestored={handleDataRestored}
      />

      {/* Persistent Fixed Bottom Navigation Bar (Back, Home, Profile, Upper/ScrollToTop, Chatbot) */}
      <FixedBottomBar
        onBack={handleSmartBack}
        onHome={handleDirectHome}
        onOpenProfile={() => handleNavigateTab('profile')}
        onOpenChat={() => setIsChatModalOpen(true)}
        language={language}
        soundEnabled={soundEnabled}
        activeTab={activeTab}
        isReadingStory={selectedStoryForReader !== null}
      />

      {/* Global Comprehensive Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        stories={stories}
        facts={facts}
        learningItems={learningItems}
        audioStories={audioStories}
        videoStories={videoStories}
        worksheets={worksheets}
        language={language}
        soundEnabled={soundEnabled}
        onSelectStory={handleSelectStoryFromHome}
        onNavigateTab={(tab) => {
          handleNavigateTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setIsSearchModalOpen(false);
          setIsParentalGateOpen(true);
        }}
        initialQuery={searchModalQuery}
        initialCategory={searchModalCategory}
      />

      {/* Theme, Font & Text Size Customization Modal */}
      <ThemeAndFontModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        settings={themeSettings}
        onUpdateSettings={handleUpdateThemeSettings}
        soundEnabled={soundEnabled}
      />

      {/* Gemini AI Baalmitra Chatbot Modal */}
      <BaalmitraChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        language={language}
        soundEnabled={soundEnabled}
      />

      {/* Baalvarta Pro VIP Membership Modal */}
      <BaalvartaProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        language={language}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
