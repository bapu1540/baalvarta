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
import { FloatingBackButton } from './components/FloatingBackButton';
import { ThemeAndFontModal } from './components/ThemeAndFontModal';
import { KidsColoringBook } from './components/KidsColoringBook';
import { KidsMiniGamesHub } from './components/KidsMiniGamesHub';
import { KidsCertificateHub } from './components/KidsCertificateHub';
import { PrintableWorksheetsHub } from './components/PrintableWorksheetsHub';
import { GeneralKnowledgeHub } from './components/GeneralKnowledgeHub';
import { BaalmitraChatModal } from './components/BaalmitraChatModal';
import { FloatingBaalmitraButton } from './components/FloatingBaalmitraButton';
import { BaalvartaProModal } from './components/BaalvartaProModal';
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
  testConnectionOnBoot,
  seedInitialFirestoreDataIfNeeded,
  fetchStoriesFromFirestore,
  fetchWorksheetsFromFirestore,
} from './utils/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('baalvarta_language_v1');
    return (saved === 'hi' || saved === 'en') ? saved : 'hi';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [selectedStoryForReader, setSelectedStoryForReader] = useState<Story | null>(null);

  // Global Search State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [searchModalQuery, setSearchModalQuery] = useState<string>('');

  // Theme & Font Settings State
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => getStoredThemeSettings());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Gemini AI Baalmitra Chatbot State
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);

  // Baalvarta Pro Membership State
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  useEffect(() => {
    applyThemeToDOM(themeSettings);
  }, [themeSettings]);

  const handleUpdateThemeSettings = (newSettings: ThemeSettings) => {
    setThemeSettings(newSettings);
    saveStoredThemeSettings(newSettings);
  };

  const handleOpenSearch = (query: string = '') => {
    if (soundEnabled) playPopSound();
    setSearchModalQuery(query);
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
    loadPersistentData().then((persistent) => {
      if (!persistent) return;
      if (persistent.stories && persistent.stories.length > 0) {
        setStories(persistent.stories);
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
        seedInitialFirestoreDataIfNeeded(getStoredStories(), getStoredWorksheets());
        // Directly fetch once to ensure immediate multi-device fresh state
        fetchStoriesFromFirestore().then((cloudStories) => {
          if (cloudStories && cloudStories.length > 0) {
            const sorted = [...cloudStories].sort((a, b) => (a.number || 0) - (b.number || 0));
            setStories(sorted);
            saveStoredStories(sorted);
          }
        });
        fetchWorksheetsFromFirestore().then((cloudWorksheets) => {
          if (cloudWorksheets && cloudWorksheets.length > 0) {
            setWorksheets(cloudWorksheets);
            saveStoredWorksheets(cloudWorksheets);
          }
        });
      }
    });

    // Real-time synchronization with Firebase Firestore across all devices
    const unsubStories = subscribeToFirestoreStories((cloudStories) => {
      if (cloudStories && cloudStories.length > 0) {
        const sorted = [...cloudStories].sort((a, b) => (a.number || 0) - (b.number || 0));
        setStories(sorted);
        saveStoredStories(sorted);
        saveToServerDatabase({ stories: sorted });
      }
    });

    const unsubWorksheets = subscribeToFirestoreWorksheets((cloudWorksheets) => {
      if (cloudWorksheets && cloudWorksheets.length > 0) {
        setWorksheets(cloudWorksheets);
        saveStoredWorksheets(cloudWorksheets);
        saveToServerDatabase({ worksheets: cloudWorksheets });
      }
    });

    return () => {
      if (unsubStories) unsubStories();
      if (unsubWorksheets) unsubWorksheets();
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
  };

  const handleSaveFacts = (newFacts: FunFact[]) => {
    setFacts(newFacts);
    saveStoredFunFacts(newFacts);
  };

  const handleSaveLearning = (newItems: LearningItem[]) => {
    setLearningItems(newItems);
    saveStoredLearningItems(newItems);
  };

  const handleSaveAudio = (newAudio: AudioStory[]) => {
    setAudioStories(newAudio);
    saveStoredAudioStories(newAudio);
  };

  const handleSaveVideos = (newVideos: VideoStory[]) => {
    setVideoStories(newVideos);
    saveStoredVideoStories(newVideos);
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

  const handleSmartBack = () => {
    if (soundEnabled) playPopSound();
    stopSpeech();

    if (selectedStoryForReader) {
      // Step 1: Return from story reading to stories list
      setSelectedStoryForReader(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activeTab !== 'home') {
      // Step 2: Return from tab to home
      setActiveTab('home');
      setShowBookmarksOnly(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

      // Priority 5: If in an inner tab, return to home
      if (activeTab !== 'home') {
        setActiveTab('home');
        setShowBookmarksOnly(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSearchModalOpen, isAdminCMSOpen, isParentalGateOpen, selectedStoryForReader, activeTab]);

  const handleSelectStoryFromHome = (story: Story) => {
    stopSpeech();
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
    pushNavState({ view: 'tab', tab: 'videos' });
    setActiveTab('videos');
    setSelectedStoryForReader(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col font-sans selection:bg-amber-200 overflow-x-hidden w-full max-w-full">
      
      {/* Modern Responsive Navigation Header */}
      <WebsiteHeader
        activeTab={activeTab}
        setActiveTab={(tab) => {
          stopSpeech();
          pushNavState({ view: 'tab', tab });
          setActiveTab(tab);
          setShowBookmarksOnly(false);
          setSelectedStoryForReader(null);
        }}
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
      />

      {/* Main Portal View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-5 overflow-x-hidden">
        
        {activeTab === 'home' && (
          <WebsiteHome
            onNavigate={(tab) => {
              stopSpeech();
              pushNavState({ view: 'tab', tab });
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            soundEnabled={soundEnabled}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onLikeStory={handleLikeStory}
            showBookmarksOnly={showBookmarksOnly}
            onResetFilter={() => setShowBookmarksOnly(false)}
            initialStory={selectedStoryForReader}
            onClearInitialStory={() => setSelectedStoryForReader(null)}
            onWatchVideo={handleWatchVideoFromStory}
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
          />
        )}

        {activeTab === 'gk' && (
          <GeneralKnowledgeHub
            language={language}
            soundEnabled={soundEnabled}
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

        {activeTab === 'quizzes' && (
          <KidsQuizHub
            quizSets={quizSets}
            language={language}
            soundEnabled={soundEnabled}
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

        {activeTab === 'worksheets' && (
          <PrintableWorksheetsHub
            worksheets={worksheets}
            language={language}
            soundEnabled={soundEnabled}
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
        onClose={() => setIsParentalGateOpen(false)}
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
        onClose={() => setIsAdminCMSOpen(false)}
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

      {/* Persistent Floating Back Button on Scroll */}
      <FloatingBackButton
        onBackToHome={handleBackToHome}
        language={language}
        soundEnabled={soundEnabled}
        show={activeTab !== 'home'}
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
          setActiveTab(tab);
          setShowBookmarksOnly(false);
          setSelectedStoryForReader(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        initialQuery={searchModalQuery}
      />

      {/* Theme, Font & Text Size Customization Modal */}
      <ThemeAndFontModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        settings={themeSettings}
        onUpdateSettings={handleUpdateThemeSettings}
        soundEnabled={soundEnabled}
      />

      {/* Floating AI Baalmitra Assistant Button */}
      <FloatingBaalmitraButton
        onOpenChat={() => setIsChatModalOpen(true)}
        language={language}
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
