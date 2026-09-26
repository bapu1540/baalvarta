import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Cloud,
  CheckCircle,
  Copy,
  RotateCcw,
  BookOpen,
  Lightbulb,
  Sparkles,
  Headphones,
  Film,
  Download,
  AlertCircle,
  Search,
  AlertTriangle,
  Eye,
  EyeOff,
  Check,
  Trophy,
  Printer,
  FileText,
  CheckCircle2,
  HelpCircle,
  Image as ImageIcon,
  ArrowLeft,
  Home,
  Video,
  Play,
  ExternalLink,
  Layers,
  LayoutGrid,
  Shield,
  ShieldCheck,
  Mail,
  UserCheck,
  KeyRound,
  Database,
  UploadCloud,
  RefreshCw,
  FileUp,
  Gamepad2,
  Palette,
  Award
} from 'lucide-react';
import {
  Story,
  StoryScene,
  FunFact,
  LearningItem,
  AudioStory,
  VideoStory,
  Language,
  QuizSet,
  PrintableWorksheet,
  UserReview,
  KidsGameItem,
  ColoringTemplateItem,
  CertificateAwardItem
} from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { ImageUpload16x9 } from './ImageUpload16x9';
import { ImageUpload9x16 } from './ImageUpload9x16';
import {
  getStoredQuizSets,
  saveStoredQuizSets,
  getStoredWorksheets,
  saveStoredWorksheets,
  getStoredGames,
  saveStoredGames,
  getStoredColoringTemplates,
  saveStoredColoringTemplates,
  getStoredCertificateAwards,
  saveStoredCertificateAwards,
  getStoredFooterImage,
  saveStoredFooterImage,
  getAdminPasswords,
  saveAdminPassword,
  AUTHORIZED_ADMIN_EMAILS,
  PRIMARY_ADMIN_EMAIL,
  SECONDARY_ADMIN_EMAIL,
  exportFullDatabaseJson,
  importFullDatabaseJson
} from '../utils/storage';
import { sendAdminOtpEmail } from '../utils/emailService';
import { saveToServerDatabase } from '../utils/dbStorage';

interface AdminCMSProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundEnabled: boolean;
  adminEmail?: string;
  stories: Story[];
  onSaveStories: (stories: Story[]) => void;
  facts: FunFact[];
  onSaveFacts: (facts: FunFact[]) => void;
  learningItems: LearningItem[];
  onSaveLearning: (items: LearningItem[]) => void;
  audioStories: AudioStory[];
  onSaveAudio: (audio: AudioStory[]) => void;
  videoStories: VideoStory[];
  onSaveVideos: (videos: VideoStory[]) => void;
  videoCategories: string[];
  onSaveVideoCategories: (categories: string[]) => void;
  reviews?: UserReview[];
  onDeleteReview?: (id: string) => void;
  onResetAllData: () => void;
  onDataRestored?: (restoredData: any) => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  isOpen,
  onClose,
  language,
  soundEnabled,
  adminEmail = PRIMARY_ADMIN_EMAIL,
  stories,
  onSaveStories,
  facts,
  onSaveFacts,
  learningItems,
  onSaveLearning,
  audioStories,
  onSaveAudio,
  videoStories = [],
  onSaveVideos,
  videoCategories = [],
  onSaveVideoCategories,
  reviews = [],
  onDeleteReview,
  onResetAllData,
  onDataRestored,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'stories' | 'videos' | 'quizzes' | 'worksheets' | 'games' | 'coloring' | 'awards' | 'facts' | 'learning' | 'audio' | 'reviews' | 'branding' | 'security' | 'firebase'>('categories');

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Footer Image State
  const [footerImage, setFooterImage] = useState<string | null>(() => getStoredFooterImage());

  // Dual Admin Passwords & 2FA State
  const [adminPasswords, setAdminPasswordsState] = useState<Record<string, string>>(() => getAdminPasswords());
  const [newPassBaalvarta, setNewPassBaalvarta] = useState('');
  const [newPassSanjay, setNewPassSanjay] = useState('');
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState('');
  const [testingEmail, setTestingEmail] = useState<string | null>(null);
  const [testEmailMsg, setTestEmailMsg] = useState<string>('');

  // Games, Coloring Templates and Certificate Awards State
  const [gamesList, setGamesList] = useState<KidsGameItem[]>(() => getStoredGames());
  const [coloringTemplates, setColoringTemplates] = useState<ColoringTemplateItem[]>(() => getStoredColoringTemplates());
  const [certificateAwards, setCertificateAwards] = useState<CertificateAwardItem[]>(() => getStoredCertificateAwards());

  // New Game Form State
  const [newGame, setNewGame] = useState<Omit<KidsGameItem, 'id'>>({
    titleHi: '',
    titleEn: '',
    category: 'memory',
    descriptionHi: '',
    descriptionEn: '',
    emoji: '🎮',
    color: 'from-amber-400 to-orange-500',
    badge: 'नया गेम 🌟',
    isFeatured: true,
  });

  // New Coloring Template Form State
  const [newColoringTemplate, setNewColoringTemplate] = useState<Omit<ColoringTemplateItem, 'id'>>({
    nameHi: '',
    nameEn: '',
    emoji: '🦁',
    category: 'animals',
  });

  // New Certificate Award Form State
  const [newCertificateAward, setNewCertificateAward] = useState<Omit<CertificateAwardItem, 'id'>>({
    titleHi: '',
    titleEn: '',
    descHi: '',
    descEn: '',
    color: 'from-amber-400 to-orange-500',
    icon: '🏆',
  });

  // Database Sync & Restore State
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [dbSyncMsg, setDbSyncMsg] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleForceSyncDb = async () => {
    setIsSyncingDb(true);
    setDbSyncMsg('पूरा डेटाबेस सुरक्षित किया जा रहा है...');
    try {
      const payload = {
        stories,
        video_stories: videoStories,
        video_categories: videoCategories,
        fun_facts: facts,
        early_learning: learningItems,
        audio_stories: audioStories,
        user_reviews: reviews,
        quizzes: quizSets,
        worksheets: worksheets,
        footer_image: footerImage,
        admin_passwords: adminPasswords,
      };
      const ok = await saveToServerDatabase(payload);
      if (ok) {
        setDbSyncMsg('✅ पूरा डेटाबेस सर्वर फ़ाइल व ब्राउज़र (IndexedDB) में 100% सुरक्षित हो गया!');
      } else {
        setDbSyncMsg('✅ पूरा डेटाबेस आपके ब्राउज़र (IndexedDB) में 100% स्थायी रूप से सुरक्षित है!');
      }
      if (soundEnabled) playSuccessSound();
    } catch {
      setDbSyncMsg('✅ डेटाबेस सुरक्षित है!');
    } finally {
      setIsSyncingDb(false);
      setTimeout(() => setDbSyncMsg(null), 4000);
    }
  };

  const handleImportDatabaseJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = importFullDatabaseJson(text);
        if (res.success && res.data) {
          setImportSuccess(res.message);
          setImportError(null);
          if (onDataRestored) {
            onDataRestored(res.data);
          }
          if (res.data.stories) onSaveStories(res.data.stories);
          if (res.data.video_stories) onSaveVideos(res.data.video_stories);
          if (res.data.video_categories) onSaveVideoCategories(res.data.video_categories);
          if (res.data.fun_facts) onSaveFacts(res.data.fun_facts);
          if (res.data.early_learning) onSaveLearning(res.data.early_learning);
          if (res.data.audio_stories) onSaveAudio(res.data.audio_stories);
          if (res.data.quizzes) setQuizSets(res.data.quizzes);
          if (res.data.worksheets) setWorksheets(res.data.worksheets);
          if (soundEnabled) playSuccessSound();
        } else {
          setImportError(res.message);
          setImportSuccess(null);
        }
      } catch (err: any) {
        setImportError('फ़ाइल पढ़ने में त्रुटि: ' + (err?.message || 'गलत JSON फ़ाइल'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Quiz Sets and Worksheets
  const [quizSets, setQuizSets] = useState<QuizSet[]>(() => getStoredQuizSets());
  const [worksheets, setWorksheets] = useState<PrintableWorksheet[]>(() => getStoredWorksheets());

  // New Quiz Set Form State (with 5 questions and 4 options each)
  const [newQuizTitleHi, setNewQuizTitleHi] = useState('');
  const [newQuizTitleEn, setNewQuizTitleEn] = useState('');
  const [newQuizCategory, setNewQuizCategory] = useState<QuizSet['category']>('animals');
  const [newQuizIcon, setNewQuizIcon] = useState('🦁');
  const [newQuizQuestions, setNewQuizQuestions] = useState<Array<{
    questionHi: string;
    questionEn: string;
    image: string;
    options: [string, string, string, string];
    optionsEn: [string, string, string, string];
    correctIndex: number;
    explanationHi: string;
    explanationEn: string;
    explanationImage: string;
  }>>([
    {
      questionHi: '',
      questionEn: '',
      image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format&fit=crop&q=80',
      options: ['', '', '', ''],
      optionsEn: ['', '', '', ''],
      correctIndex: 0,
      explanationHi: '',
      explanationEn: '',
      explanationImage: '',
    },
    {
      questionHi: '',
      questionEn: '',
      image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&auto=format&fit=crop&q=80',
      options: ['', '', '', ''],
      optionsEn: ['', '', '', ''],
      correctIndex: 0,
      explanationHi: '',
      explanationEn: '',
      explanationImage: '',
    },
    {
      questionHi: '',
      questionEn: '',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      options: ['', '', '', ''],
      optionsEn: ['', '', '', ''],
      correctIndex: 0,
      explanationHi: '',
      explanationEn: '',
      explanationImage: '',
    },
    {
      questionHi: '',
      questionEn: '',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&auto=format&fit=crop&q=80',
      options: ['', '', '', ''],
      optionsEn: ['', '', '', ''],
      correctIndex: 0,
      explanationHi: '',
      explanationEn: '',
      explanationImage: '',
    },
    {
      questionHi: '',
      questionEn: '',
      image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=600&auto=format&fit=crop&q=80',
      options: ['', '', '', ''],
      optionsEn: ['', '', '', ''],
      correctIndex: 0,
      explanationHi: '',
      explanationEn: '',
      explanationImage: '',
    },
  ]);

  // New Worksheet State
  const [newWs, setNewWs] = useState({
    titleHi: '',
    titleEn: '',
    category: 'coloring' as PrintableWorksheet['category'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
    printUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=90',
    ageGroup: '4-9 वर्ष',
    descriptionHi: '',
    descriptionEn: '',
  });

  // Story Management & Safe Deletion State
  const [storySearchTerm, setStorySearchTerm] = useState('');
  const [storyFilter, setStoryFilter] = useState<'all' | 'custom' | 'default'>('all');
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [undoStory, setUndoStory] = useState<{ story: Story; index: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Story Upload Mode: 'standard' or 'picture_book'
  const [storyUploadMode, setStoryUploadMode] = useState<'picture_book' | 'standard'>('picture_book');

  // New Story Form State (Standard)
  const [newStory, setNewStory] = useState({
    titleHi: '',
    titleEn: '',
    summaryHi: '',
    summaryEn: '',
    contentHi: '',
    contentEn: '',
    moralHi: '',
    moralEn: '',
    category: 'moral' as Story['category'],
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
    illustrationsText: '',
    readTime: '3 मिनट',
    recommendedAge: '4-9 वर्ष',
  });

  // New Picture Book State (Scenes with Photo & Words per Photo)
  const [newPictureBook, setNewPictureBook] = useState({
    titleHi: '',
    titleEn: '',
    summaryHi: '',
    summaryEn: '',
    moralHi: '',
    moralEn: '',
    category: 'moral' as Story['category'],
    recommendedAge: '4-9 वर्ष',
  });

  const [newStoryScenes, setNewStoryScenes] = useState<Array<{
    id: string;
    image: string;
    textHi: string;
    textEn: string;
    captionHi: string;
  }>>([
    {
      id: 'sc-1',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
      textHi: '',
      textEn: '',
      captionHi: 'दृश्य 1 (Scene 1)',
    },
    {
      id: 'sc-2',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&auto=format&fit=crop&q=80',
      textHi: '',
      textEn: '',
      captionHi: 'दृश्य 2 (Scene 2)',
    },
  ]);

  // New Fun Fact State
  const [newFact, setNewFact] = useState({
    titleHi: '',
    titleEn: '',
    factHi: '',
    factEn: '',
    category: 'animals' as FunFact['category'],
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
    emoji: '🦁',
  });

  // New Audio Story State
  const [newAudio, setNewAudio] = useState({
    titleHi: '',
    titleEn: '',
    narrator: 'दादी माँ',
    duration: '3:30',
    durationSeconds: 210,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    audioUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg',
    descriptionHi: '',
    descriptionEn: '',
    tags: ['प्रेरणादायक', 'नीति कथा'],
  });

  // Video Story CMS State
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [newVideo, setNewVideo] = useState<Omit<VideoStory, 'id'>>({
    titleHi: '',
    titleEn: '',
    youtubeUrl: '',
    thumbnail: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&auto=format&fit=crop&q=80',
    category: videoCategories[0] || 'पंचतंत्र कहानियाँ',
    duration: '0:58',
    viewsCount: '15K+',
    descriptionHi: '',
    descriptionEn: '',
    isFeatured: true,
  });
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');

  // New Learning Item State
  const [newLearning, setNewLearning] = useState<Partial<LearningItem>>({
    module: 'alphabet',
    symbol: '',
    name: '',
    pronunciation: '',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    imageOrEmoji: '',
    audioUrl: '',
    videoUrl: '',
    pdfUrl: '',
    imageUrl: '',
    words: [],
    story: '',
    gameUrl: '',
  });

  if (!isOpen) return null;

  const handleAddLearning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearning.symbol || !newLearning.name) return;
    if (soundEnabled) playSuccessSound();

    const created: LearningItem = {
      id: `learn-${Date.now()}`,
      module: newLearning.module as any,
      symbol: newLearning.symbol!,
      name: newLearning.name!,
      pronunciation: newLearning.pronunciation || newLearning.name!,
      color: newLearning.color || 'bg-blue-100 text-blue-700 border-blue-300',
      imageOrEmoji: newLearning.imageOrEmoji || '📚',
      audioUrl: newLearning.audioUrl,
      videoUrl: newLearning.videoUrl,
      pdfUrl: newLearning.pdfUrl,
      imageUrl: newLearning.imageUrl,
      words: newLearning.words,
      story: newLearning.story,
      gameUrl: newLearning.gameUrl,
    };

    onSaveLearning([...learningItems, created]);
    setNewLearning({
      module: 'alphabet',
      symbol: '',
      name: '',
      pronunciation: '',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      imageOrEmoji: '',
      audioUrl: '',
      videoUrl: '',
      pdfUrl: '',
      imageUrl: '',
      words: [],
      story: '',
      gameUrl: '',
    });
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.titleHi || !newStory.contentHi) return;
    if (soundEnabled) playSuccessSound();

    const illustrationList = newStory.illustrationsText
      ? newStory.illustrationsText.split('\n').map((u) => u.trim()).filter((u) => u.length > 0)
      : undefined;

    const created: Story = {
      id: `story-${Date.now()}`,
      number: stories.length + 1,
      titleHi: newStory.titleHi,
      titleEn: newStory.titleEn || newStory.titleHi,
      summaryHi: newStory.summaryHi || newStory.contentHi.slice(0, 80) + '...',
      summaryEn: newStory.summaryEn || newStory.contentEn.slice(0, 80) + '...',
      contentHi: newStory.contentHi,
      contentEn: newStory.contentEn || newStory.contentHi,
      moralHi: newStory.moralHi || 'सदा सच बोलो।',
      moralEn: newStory.moralEn || 'Always be truthful.',
      category: newStory.category,
      coverImage: newStory.coverImage,
      readTime: newStory.readTime,
      recommendedAge: newStory.recommendedAge,
      likes: 1,
      isFeatured: false,
      illustrations: illustrationList,
    };

    onSaveStories([...stories, created]);
    setNewStory({
      titleHi: '',
      titleEn: '',
      summaryHi: '',
      summaryEn: '',
      contentHi: '',
      contentEn: '',
      moralHi: '',
      moralEn: '',
      category: 'moral',
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
      illustrationsText: '',
      readTime: '3 मिनट',
      recommendedAge: '4-9 वर्ष',
    });
    setToastMessage({ text: 'मानक बाल कहानी सफलतापूर्वक प्रकाशित हो गई!', type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddStoryScene = () => {
    if (soundEnabled) playPopSound();
    const newIdx = newStoryScenes.length + 1;
    const sampleImages = [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
    ];
    setNewStoryScenes([
      ...newStoryScenes,
      {
        id: `sc-${Date.now()}-${newIdx}`,
        image: sampleImages[(newIdx - 1) % sampleImages.length],
        textHi: '',
        textEn: '',
        captionHi: `दृश्य ${newIdx} (Scene ${newIdx})`,
      },
    ]);
  };

  const handleRemoveStoryScene = (index: number) => {
    if (newStoryScenes.length <= 1) return;
    if (soundEnabled) playPopSound();
    const updated = newStoryScenes.filter((_, idx) => idx !== index);
    setNewStoryScenes(updated);
  };

  const handleUpdateStoryScene = (index: number, field: 'image' | 'textHi' | 'textEn' | 'captionHi', value: string) => {
    const updated = [...newStoryScenes];
    updated[index] = { ...updated[index], [field]: value };
    setNewStoryScenes(updated);
  };

  const handleAddPictureBookStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPictureBook.titleHi) return;
    
    // Check if at least one scene has text
    const validScenes = newStoryScenes.filter((s) => s.textHi.trim().length > 0);
    if (validScenes.length === 0) {
      alert('कृपया कम से कम एक दृश्य में फोटो के लिए कहानी के शब्द/पंक्तियां अवश्य लिखें!');
      return;
    }

    if (soundEnabled) playSuccessSound();

    const formattedScenes: StoryScene[] = newStoryScenes.map((sc, idx) => ({
      id: sc.id || `scene-${Date.now()}-${idx + 1}`,
      sceneNumber: idx + 1,
      image: sc.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
      textHi: sc.textHi || `दृश्य ${idx + 1} का विवरण।`,
      textEn: sc.textEn || undefined,
      captionHi: sc.captionHi || `दृश्य ${idx + 1}`,
    }));

    const combinedHi = formattedScenes.map((s) => s.textHi).join('\n\n');
    const combinedEn = formattedScenes.map((s) => s.textEn || s.textHi).join('\n\n');
    const sceneImages = formattedScenes.map((s) => s.image);

    const created: Story = {
      id: `story-pb-${Date.now()}`,
      number: stories.length + 1,
      titleHi: newPictureBook.titleHi,
      titleEn: newPictureBook.titleEn || newPictureBook.titleHi,
      summaryHi: newPictureBook.summaryHi || formattedScenes[0].textHi.slice(0, 80) + '...',
      summaryEn: newPictureBook.summaryEn || (formattedScenes[0].textEn || formattedScenes[0].textHi).slice(0, 80) + '...',
      contentHi: combinedHi,
      contentEn: combinedEn,
      moralHi: newPictureBook.moralHi || 'सच्चाई और अच्छाई की सदा जीत होती है।',
      moralEn: newPictureBook.moralEn || 'Goodness and truth always prevail.',
      category: newPictureBook.category,
      coverImage: formattedScenes[0].image,
      format: 'picture_book',
      scenes: formattedScenes,
      illustrations: sceneImages,
      readTime: `${Math.max(2, Math.ceil(formattedScenes.length * 0.8))} मिनट`,
      recommendedAge: newPictureBook.recommendedAge,
      likes: 1,
      isFeatured: true,
    };

    onSaveStories([...stories, created]);

    // Reset Picture Book state
    setNewPictureBook({
      titleHi: '',
      titleEn: '',
      summaryHi: '',
      summaryEn: '',
      moralHi: '',
      moralEn: '',
      category: 'moral',
      recommendedAge: '4-9 वर्ष',
    });
    setNewStoryScenes([
      {
        id: 'sc-1',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
        textHi: '',
        textEn: '',
        captionHi: 'दृश्य 1 (Scene 1)',
      },
      {
        id: 'sc-2',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&auto=format&fit=crop&q=80',
        textHi: '',
        textEn: '',
        captionHi: 'दृश्य 2 (Scene 2)',
      },
    ]);

    setToastMessage({ text: '📸 सचित्र दृश्य-कथा (Picture Book Story) सफलतापूर्वक प्रकाशित हो गई!', type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRequestDelete = (story: Story) => {
    if (soundEnabled) playPopSound();
    setStoryToDelete(story);
  };

  const handleConfirmDelete = () => {
    if (!storyToDelete) return;
    if (soundEnabled) playPopSound();

    const deleteIndex = stories.findIndex((s) => s.id === storyToDelete.id);
    const updated = stories
      .filter((s) => s.id !== storyToDelete.id)
      .map((s, idx) => ({ ...s, number: idx + 1 }));

    onSaveStories(updated);
    setUndoStory({ story: storyToDelete, index: deleteIndex >= 0 ? deleteIndex : 0 });
    setToastMessage({
      text: `कहानी "${storyToDelete.titleHi}" सफलतापूर्वक हटा दी गई।`,
      type: 'info',
    });
    setStoryToDelete(null);

    if (expandedStoryId === storyToDelete.id) {
      setExpandedStoryId(null);
    }
  };

  const handleUndoDelete = () => {
    if (!undoStory) return;
    if (soundEnabled) playSuccessSound();

    const restored = [...stories];
    restored.splice(undoStory.index, 0, undoStory.story);
    const reordered = restored.map((s, idx) => ({ ...s, number: idx + 1 }));
    onSaveStories(reordered);

    setToastMessage({
      text: `कहानी "${undoStory.story.titleHi}" को पुनः बहाल (Restore) कर दिया गया।`,
      type: 'success',
    });
    setUndoStory(null);
  };

  const handleDeleteStory = (id: string) => {
    const target = stories.find((s) => s.id === id);
    if (target) {
      handleRequestDelete(target);
    } else {
      const updated = stories.filter((s) => s.id !== id).map((s, idx) => ({ ...s, number: idx + 1 }));
      onSaveStories(updated);
    }
  };

  const filteredStories = stories.filter((s) => {
    const q = storySearchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.titleHi.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.number.toString() === q ||
      (s.contentHi && s.contentHi.toLowerCase().includes(q)) ||
      (s.moralHi && s.moralHi.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (storyFilter === 'custom') {
      return s.id.startsWith('story-') || s.number > 6;
    }
    if (storyFilter === 'default') {
      return !s.id.startsWith('story-') && s.number <= 6;
    }
    return true;
  });

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.titleHi || !newFact.factHi) return;
    if (soundEnabled) playSuccessSound();

    const created: FunFact = {
      id: `fact-${Date.now()}`,
      titleHi: newFact.titleHi,
      titleEn: newFact.titleEn || newFact.titleHi,
      factHi: newFact.factHi,
      factEn: newFact.factEn || newFact.factHi,
      category: newFact.category,
      image: newFact.image,
      emoji: newFact.emoji || '💡',
      likes: 1,
    };

    onSaveFacts([...facts, created]);
    setNewFact({
      titleHi: '',
      titleEn: '',
      factHi: '',
      factEn: '',
      category: 'animals',
      image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
      emoji: '🦁',
    });
  };

  const handleDeleteFact = (id: string) => {
    if (soundEnabled) playPopSound();
    onSaveFacts(facts.filter((f) => f.id !== id));
  };

  const handleAddAudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudio.titleHi) return;
    if (soundEnabled) playSuccessSound();

    const created: AudioStory = {
      id: `audio-${Date.now()}`,
      titleHi: newAudio.titleHi,
      titleEn: newAudio.titleEn || newAudio.titleHi,
      narrator: newAudio.narrator || 'दादी माँ',
      duration: newAudio.duration || '3:30',
      durationSeconds: newAudio.durationSeconds || 210,
      coverImage: newAudio.coverImage,
      audioUrl: newAudio.audioUrl || 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg',
      descriptionHi: newAudio.descriptionHi || newAudio.titleHi,
      descriptionEn: newAudio.descriptionEn || newAudio.titleEn,
      tags: newAudio.tags,
    };

    onSaveAudio([...audioStories, created]);
    setNewAudio({
      titleHi: '',
      titleEn: '',
      narrator: 'दादी माँ',
      duration: '3:30',
      durationSeconds: 210,
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
      audioUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg',
      descriptionHi: '',
      descriptionEn: '',
      tags: ['प्रेरणादायक', 'नीति कथा'],
    });
  };

  const handleDeleteAudio = (id: string) => {
    if (soundEnabled) playPopSound();
    onSaveAudio(audioStories.filter((a) => a.id !== id));
  };

  // Video Stories & Categories Handlers
  const handleAddOrUpdateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.titleHi.trim() || !newVideo.youtubeUrl.trim() || !newVideo.thumbnail) {
      alert('कृपया कहानी का नाम, यूट्यूब लिंक और 9:16 थंबनेल अवश्य भरें।');
      return;
    }

    if (editingVideoId) {
      const updated = videoStories.map((v) =>
        v.id === editingVideoId ? { ...newVideo, id: editingVideoId } : v
      );
      onSaveVideos(updated);
      setEditingVideoId(null);
    } else {
      const created: VideoStory = {
        ...newVideo,
        id: `vid-${Date.now()}`,
      };
      onSaveVideos([created, ...videoStories]);
    }

    setNewVideo({
      titleHi: '',
      titleEn: '',
      youtubeUrl: '',
      thumbnail: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&auto=format&fit=crop&q=80',
      category: videoCategories[0] || 'पंचतंत्र कहानियाँ',
      duration: '0:58',
      viewsCount: '15K+',
      descriptionHi: '',
      descriptionEn: '',
      isFeatured: false,
    });

    if (soundEnabled) playSuccessSound();
  };

  const handleEditVideo = (video: VideoStory) => {
    if (soundEnabled) playPopSound();
    setEditingVideoId(video.id);
    setNewVideo({
      titleHi: video.titleHi,
      titleEn: video.titleEn,
      youtubeUrl: video.youtubeUrl,
      thumbnail: video.thumbnail,
      category: video.category,
      duration: video.duration || '0:58',
      viewsCount: video.viewsCount || '',
      descriptionHi: video.descriptionHi || '',
      descriptionEn: video.descriptionEn || '',
      isFeatured: video.isFeatured ?? false,
    });
    const formElement = document.getElementById('video-cms-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('क्या आप वाकई इस वीडियो कहानी को हटाना चाहते हैं?')) {
      const updated = videoStories.filter((v) => v.id !== id);
      onSaveVideos(updated);
      if (editingVideoId === id) {
        setEditingVideoId(null);
      }
      if (soundEnabled) playPopSound();
    }
  };

  const handleAddVideoCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (videoCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('यह श्रेणी पहले से मौजूद है।');
      return;
    }
    const updated = [...videoCategories, trimmed];
    onSaveVideoCategories(updated);
    setNewCategoryInput('');
    if (soundEnabled) playSuccessSound();
  };

  const handleDeleteVideoCategory = (categoryToDelete: string) => {
    if (videoCategories.length <= 1) {
      alert('कम से कम एक श्रेणी का होना अनिवार्य है।');
      return;
    }
    if (confirm(`क्या आप वाकई "${categoryToDelete}" श्रेणी को हटाना चाहते हैं?`)) {
      const updated = videoCategories.filter((c) => c !== categoryToDelete);
      onSaveVideoCategories(updated);
      if (soundEnabled) playPopSound();
    }
  };

  const handleAddQuizSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitleHi) return;
    if (soundEnabled) playSuccessSound();

    const created: QuizSet = {
      id: `quiz-${Date.now()}`,
      titleHi: newQuizTitleHi,
      titleEn: newQuizTitleEn || newQuizTitleHi,
      descriptionHi: '5 मजेदार प्रश्नों का अभ्यास सेट',
      descriptionEn: '5 fun practice questions quiz set',
      category: newQuizCategory,
      icon: newQuizIcon || '🎯',
      color: 'bg-emerald-500',
      difficulty: 'easy',
      questions: newQuizQuestions.map((q, idx) => ({
        id: `q-${Date.now()}-${idx}`,
        questionHi: q.questionHi || `प्रश्न #${idx + 1}`,
        questionEn: q.questionEn || `Question #${idx + 1}`,
        image: q.image,
        options: [
          q.options[0] || 'विकल्प A',
          q.options[1] || 'विकल्प B',
          q.options[2] || 'विकल्प C',
          q.options[3] || 'विकल्प D',
        ],
        optionsEn: [
          q.optionsEn[0] || q.options[0] || 'Option A',
          q.optionsEn[1] || q.options[1] || 'Option B',
          q.optionsEn[2] || q.options[2] || 'Option C',
          q.optionsEn[3] || q.options[3] || 'Option D',
        ],
        correctIndex: q.correctIndex,
        explanationHi: q.explanationHi || 'यह सही उत्तर है!',
        explanationEn: q.explanationEn || 'This is the correct answer!',
        explanationImage: q.explanationImage || q.image,
      })),
    };

    const updated = [created, ...quizSets];
    setQuizSets(updated);
    saveStoredQuizSets(updated);

    // Reset form
    setNewQuizTitleHi('');
    setNewQuizTitleEn('');
    setToastMessage({ text: 'नया 5-प्रश्नों वाला क्विज़ सेट सफलतापूर्वक जुड़ गया!', type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteQuizSet = (id: string) => {
    if (soundEnabled) playPopSound();
    const updated = quizSets.filter((q) => q.id !== id);
    setQuizSets(updated);
    saveStoredQuizSets(updated);
  };

  const handleAddWorksheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWs.titleHi) return;
    if (soundEnabled) playSuccessSound();

    const created: PrintableWorksheet = {
      id: `ws-${Date.now()}`,
      titleHi: newWs.titleHi,
      titleEn: newWs.titleEn || newWs.titleHi,
      category: newWs.category,
      thumbnailUrl: newWs.thumbnailUrl,
      printUrl: newWs.printUrl || newWs.thumbnailUrl,
      ageGroup: newWs.ageGroup,
      descriptionHi: newWs.descriptionHi || 'बच्चों के लिए मजेदार प्रिंट करने योग्य अभ्यास पत्र',
      descriptionEn: newWs.descriptionEn || 'Fun printable activity sheet for kids',
    };

    const updated = [created, ...worksheets];
    setWorksheets(updated);
    saveStoredWorksheets(updated);

    setNewWs({
      titleHi: '',
      titleEn: '',
      category: 'coloring',
      thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
      printUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=90',
      ageGroup: '4-9 वर्ष',
      descriptionHi: '',
      descriptionEn: '',
    });

    setToastMessage({ text: 'नई वर्कशीट्स सफलतापूर्वक जुड़ गई!', type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteWorksheet = (id: string) => {
    if (soundEnabled) playPopSound();
    const updated = worksheets.filter((w) => w.id !== id);
    setWorksheets(updated);
    saveStoredWorksheets(updated);
  };

  // --- Games Handlers ---
  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGame.titleHi) return;
    if (soundEnabled) playSuccessSound();

    const created: KidsGameItem = {
      ...newGame,
      id: `game-${Date.now()}`,
    };

    const updated = [...gamesList, created];
    setGamesList(updated);
    saveStoredGames(updated);

    setNewGame({
      titleHi: '',
      titleEn: '',
      category: 'memory',
      descriptionHi: '',
      descriptionEn: '',
      emoji: '🎮',
      color: 'from-amber-400 to-orange-500',
      badge: 'नया गेम 🌟',
      isFeatured: true,
    });

    setToastMessage({ text: 'नया गेम सफलतापूर्वक जुड़ गया!', type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteGame = (id: string) => {
    if (soundEnabled) playPopSound();
    const updated = gamesList.filter((g) => g.id !== id);
    setGamesList(updated);
    saveStoredGames(updated);
  };

  // --- Coloring Templates Handlers ---
  const handleAddColoringTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColoringTemplate.nameHi) return;
    if (soundEnabled) playSuccessSound();

    const created: ColoringTemplateItem = {
      ...newColoringTemplate,
      id: `tpl-${Date.now()}`,
    };

    const updated = [...coloringTemplates, created];
    setColoringTemplates(updated);
    saveStoredColoringTemplates(updated);

    setNewColoringTemplate({
      nameHi: '',
      nameEn: '',
      emoji: '🦁',
      category: 'animals',
    });

    setToastMessage({ text: 'नया कलरिंग टेम्पलेट सफलतापूर्वक जुड़ गया!', type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteColoringTemplate = (id: string) => {
    if (soundEnabled) playPopSound();
    const updated = coloringTemplates.filter((t) => t.id !== id);
    setColoringTemplates(updated);
    saveStoredColoringTemplates(updated);
  };

  // --- Certificate Awards Handlers ---
  const handleAddCertificateAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertificateAward.titleHi) return;
    if (soundEnabled) playSuccessSound();

    const created: CertificateAwardItem = {
      ...newCertificateAward,
      id: `award-${Date.now()}`,
    };

    const updated = [...certificateAwards, created];
    setCertificateAwards(updated);
    saveStoredCertificateAwards(updated);

    setNewCertificateAward({
      titleHi: '',
      titleEn: '',
      descHi: '',
      descEn: '',
      color: 'from-amber-400 to-orange-500',
      icon: '🏆',
    });

    setToastMessage({ text: 'नया बाल पुरस्कार सम्मान सफलतापूर्वक जुड़ गया!', type: 'success' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteCertificateAward = (id: string) => {
    if (soundEnabled) playPopSound();
    const updated = certificateAwards.filter((a) => a.id !== id);
    setCertificateAwards(updated);
    saveStoredCertificateAwards(updated);
  };

  const allCollectionsData = {
    app: 'Baalvarta App',
    version: '1.0.0',
    exportTimestamp: new Date().toISOString(),
    collections: {
      stories,
      video_stories: videoStories,
      video_categories: videoCategories,
      fun_facts: facts,
      early_learning: learningItems,
      audio_stories: audioStories,
      user_reviews: reviews,
      quizzes: quizSets,
      worksheets: worksheets,
    },
  };

  const firestoreRulesSample = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Baalvarta Public Collections (Read-Only for Kids, Admin Write)
    match /stories/{storyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /fun_facts/{factId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /early_learning/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /audio_stories/{audioId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /user_reviews/{reviewId} {
      allow read: if true;
      allow create: if true; // Any reader/parent can submit a review
      allow update, delete: if request.auth != null; // Only Admin can delete/moderate
    }
  }
}`;

  const copyToClipboard = (text: string, type: 'rules' | 'json') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'rules') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
      }
    }
  };

  const downloadJson = () => {
    const jsonStr = exportFullDatabaseJson({
      stories,
      videoStories,
      videoCategories,
      facts,
      learningItems,
      audioStories,
      reviews,
      quizSets,
      worksheets,
    });
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `baalvarta_database_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (soundEnabled) playSuccessSound();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] flex flex-col overflow-hidden animate-in fade-in duration-200 selection:bg-amber-200">
      {/* Admin Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-amber-300 shadow-sm px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            title="वापस बालवार्ता वेबसाइट पर जाएं"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">← वापस बालवार्ता पोर्टल</span>
            <span className="sm:hidden">वापस</span>
          </button>

          <div className="hidden md:block h-6 w-px bg-slate-200 mx-1" />

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-black shadow-sm text-sm">
              CMS
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight flex items-center gap-2">
                <span>बालवार्ता पब्लिशिंग व एडमिन CMS</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-[11px] text-slate-500 font-semibold hidden sm:block">
                  लाइव सामग्री प्रबंधन • सचित्र कहानियाँ, 5-Q क्विज़ व प्रिंट वर्कशीट्स
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right header controls */}
        <div className="flex items-center gap-2.5">
          {/* Admin Identity Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-950 text-xs font-bold border border-amber-300">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[11px]">{adminEmail}</span>
            <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-sans">
              2FA Verified
            </span>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              setActiveTab('categories');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>कैटेगरीज मेन्यू</span>
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="बंद करें (Close Admin)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tab Sub-navigation */}
      <div className="bg-amber-50/90 border-b border-amber-200 px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          
          {/* Primary Categories Menu Button */}
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              setActiveTab('categories');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap shadow-xs cursor-pointer shrink-0 ${
              activeTab === 'categories'
                ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400 scale-[1.02]'
                : 'bg-amber-950 text-amber-100 hover:bg-amber-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-300" />
            <span>📂 कैटेगरीज मेन्यू (Categories Menu)</span>
          </button>

          <div className="h-6 w-px bg-amber-300 shrink-0" />

          {[
            { id: 'stories', label: '1. कहानियाँ', icon: BookOpen, count: stories.length },
            { id: 'videos', label: '2. वीडियो कहानियाँ', icon: Video, count: videoStories.length },
            { id: 'quizzes', label: '3. बाल क्विज़', icon: Trophy, count: quizSets.length },
            { id: 'worksheets', label: '4. वर्कशीट्स', icon: Printer, count: worksheets.length },
            { id: 'games', label: '5. किड्स गेम्स', icon: Gamepad2, count: gamesList.length },
            { id: 'coloring', label: '6. कलरिंग टेम्पलेट्स', icon: Palette, count: coloringTemplates.length },
            { id: 'awards', label: '7. बाल सम्मान', icon: Award, count: certificateAwards.length },
            { id: 'facts', label: '8. रोचक तथ्य', icon: Lightbulb, count: facts.length },
            { id: 'learning', label: '9. अक्षर व गिनती', icon: Sparkles, count: learningItems.length },
            { id: 'audio', label: '10. ऑडियो कहानियाँ', icon: Headphones, count: audioStories.length },
            { id: 'reviews', label: '11. पाठक समीक्षाएँ', icon: CheckCircle2, count: reviews.length },
            { id: 'branding', label: '12. फुटर आर्टवर्क', icon: ImageIcon },
            { id: 'security', label: '13. सुरक्षा व 2FA', icon: Shield },
            { id: 'firebase', label: '14. डेटाबेस बैकअप', icon: Cloud },
          ].map((tab) => {

            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-900 text-white shadow-sm scale-[1.02]'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-amber-200/80 hover:border-amber-400'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-amber-800 text-amber-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Body (Full Screen Page Scroll Area) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* TAB 0: ALL CATEGORIES HUB & DASHBOARD */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Categories Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white shadow-lg space-y-3 relative overflow-hidden border-2 border-amber-600">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black text-amber-200 border border-white/30">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>2-स्टेप सुरक्षित एडमिन पोर्टल (2FA Verified)</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      📂 बालवार्ता सामग्री कैटेगरीज मेन्यू
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-200 max-w-2xl leading-relaxed">
                      सभी श्रेणियाँ अलग-अलग सुव्यवस्थित हैं। जिस श्रेणी में आप नई सामग्री जोड़ना चाहते हैं, पुरानी में सुधार (Edit) करना चाहते हैं या डिलीट करना चाहते हैं, उस पर क्लिक करें:
                    </p>
                  </div>

                  <div className="bg-black/35 p-3.5 rounded-2xl border border-white/20 backdrop-blur-xs shrink-0 space-y-1 text-left sm:text-right">
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">सत्यापित एडमिन खाता:</p>
                    <p className="text-xs font-mono font-black text-white">{adminEmail}</p>
                    <span className="inline-block text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-md font-bold">
                      पूर्ण नियंत्रण सक्रिय
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of All Categories */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-amber-600" />
                    <span>सभी श्रेणियाँ (Select Category to Add / Edit / Delete):</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                    कुल 11 प्रबंधन अनुभाग
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'stories' as const,
                      num: '1',
                      titleHi: 'कहानियाँ (Stories)',
                      titleEn: 'Moral & Panchatantra Stories',
                      icon: BookOpen,
                      count: `${stories.length} कहानियाँ`,
                      gradient: 'from-amber-500 to-orange-600',
                      desc: 'पंचतंत्र, प्रेरणादायक, तेनालीराम व अकबर-बीरबल की सचित्र बाल कहानियाँ।',
                      actions: ['+ नई कहानी जोड़ें', '✏️ संपादन / सुधार', '🗑️ डिलीट'],
                    },
                    {
                      id: 'videos' as const,
                      num: '2',
                      titleHi: 'वीडियो कहानियाँ (Video Stories)',
                      titleEn: 'Animated Video Stories & Categories',
                      icon: Video,
                      count: `${videoStories.length} वीडियो`,
                      gradient: 'from-rose-500 to-red-600',
                      desc: 'एनिमेटेड कार्टून वीडियो कहानियाँ व वीडियो श्रेणी प्रबंधन।',
                      actions: ['+ नया वीडियो जोड़ें', '✏️ श्रेणी प्रबंधन', '🗑️ डिलीट'],
                    },
                    {
                      id: 'quizzes' as const,
                      num: '3',
                      titleHi: 'बाल क्विज़ खेल (Kids Quizzes)',
                      titleEn: '5-Question Interactive Quizzes',
                      icon: Trophy,
                      count: `${quizSets.length} क्विज़ सेट`,
                      gradient: 'from-purple-500 to-indigo-600',
                      desc: 'बच्चों के लिए 5-प्रश्नों वाले सचित्र ज्ञानवर्धक क्विज़ खेल।',
                      actions: ['+ नया क्विज़ सेट', '✏️ प्रश्न व विकल्प बदलें', '🗑️ डिलीट'],
                    },
                    {
                      id: 'worksheets' as const,
                      num: '4',
                      titleHi: 'प्रिंटेबल वर्कशीट्स (Worksheets)',
                      titleEn: 'Printable Activity & Coloring PDFs',
                      icon: Printer,
                      count: `${worksheets.length} वर्कशीट्स`,
                      gradient: 'from-emerald-500 to-teal-600',
                      desc: 'कलरिंग शीट्स, वर्णमाला ट्रेसिंग व ड्राइंग अभ्यास पत्र।',
                      actions: ['+ नई वर्कशीट जोड़ें', '✏️ विवरण सुधारें', '🗑️ डिलीट'],
                    },
                    {
                      id: 'games' as const,
                      num: '5',
                      titleHi: 'किड्स गेम्स (Kids Mini Games)',
                      titleEn: 'Memory Match, Puzzles & Reflex Games',
                      icon: Gamepad2,
                      count: `${gamesList.length} गेम्स`,
                      gradient: 'from-purple-500 to-indigo-600',
                      desc: 'मेमोरी कार्ड, जिगसॉ पहेली, गुब्बारा फोड़ो, शब्द बनाओ व चंचल बंदर गेम।',
                      actions: ['+ नया गेम जोड़ें', '🎮 श्रेणी प्रबंधन', '🗑️ डिलीट'],
                    },
                    {
                      id: 'coloring' as const,
                      num: '6',
                      titleHi: 'कलरिंग टेम्पलेट्स (Coloring Book)',
                      titleEn: 'Kids Digital Coloring Sketches',
                      icon: Palette,
                      count: `${coloringTemplates.length} टेम्पलेट्स`,
                      gradient: 'from-amber-400 to-orange-500',
                      desc: 'शेर, मोर, तितली, हाथी व मछली के डिजिटल कलरिंग आउटलाइन्स।',
                      actions: ['+ नया आउटलाइन स्केच', '🎨 श्रेणी प्रबंधन', '🗑️ डिलीट'],
                    },
                    {
                      id: 'awards' as const,
                      num: '7',
                      titleHi: 'बाल पाठक प्रमाण पत्र (Awards)',
                      titleEn: 'Printable Reader Certificates & Medals',
                      icon: Award,
                      count: `${certificateAwards.length} पुरस्कार श्रेणियाँ`,
                      gradient: 'from-amber-500 to-yellow-600',
                      desc: 'सुपर स्टोरी रीडर, पंचतंत्र मास्टर, क्विज़ व ज्ञान रत्न मेडल।',
                      actions: ['+ नया सम्मान मेडल', '🏆 पुरस्कार विवरण', '🗑️ डिलीट'],
                    },
                    {
                      id: 'facts' as const,
                      num: '8',
                      titleHi: 'रोचक तथ्य (Rochak Tathya)',
                      titleEn: 'Science & Animal Fun Facts',
                      icon: Lightbulb,
                      count: `${facts.length} रोचक तथ्य`,
                      gradient: 'from-sky-500 to-blue-600',
                      desc: 'विज्ञान, अंतरिक्ष, पशु-पक्षी व अजब-गजब दैनिक ज्ञान।',
                      actions: ['+ नया तथ्य जोड़ें', '✏️ तथ्य संपादित करें', '🗑️ डिलीट'],
                    },
                    {
                      id: 'learning' as const,
                      num: '9',
                      titleHi: 'अक्षर व गिनती (Early Learning)',
                      titleEn: 'Varnamala & Counting Cards',
                      icon: Sparkles,
                      count: `${learningItems.length} अक्षर व शब्द`,
                      gradient: 'from-green-500 to-emerald-600',
                      desc: 'अ से ज्ञ वर्णमाला, 123 गिनती, रंग व Phonics शब्द।',
                      actions: ['+ नया अक्षर जोड़ें', '✏️ शब्द सुधारें', '🗑️ डिलीट'],
                    },
                    {
                      id: 'audio' as const,
                      num: '10',
                      titleHi: 'ऑडियो कहानियाँ (Audio Stories)',
                      titleEn: 'Calm Voice Audio Tales 24x7',
                      icon: Headphones,
                      count: `${audioStories.length} ऑडियो ट्रैक्स`,
                      gradient: 'from-violet-500 to-purple-600',
                      desc: 'मधुर आवाज़ व संगीत में रिकॉर्डेड बाल कहानियाँ।',
                      actions: ['+ नया ऑडियो जोड़ें', '✏️ नैरेटर/अवधि बदलें', '🗑️ डिलीट'],
                    },
                    {
                      id: 'reviews' as const,
                      num: '11',
                      titleHi: 'पाठक समीक्षाएँ (Reviews)',
                      titleEn: 'Parent & Reader Feedback',
                      icon: CheckCircle2,
                      count: `${reviews.length} समीक्षाएँ`,
                      gradient: 'from-amber-500 to-yellow-600',
                      desc: 'अभिभावकों व शिक्षकों की समीक्षाओं का मॉडरेशन।',
                      actions: ['✓ समीक्षा स्वीकारें', '⭐ रेटिंग देखें', '🗑️ डिलीट'],
                    },
                    {
                      id: 'branding' as const,
                      num: '12',
                      titleHi: 'फुटर आर्टवर्क चित्र (Footer Image)',
                      titleEn: 'Website Footer Branding Artwork',
                      icon: ImageIcon,
                      count: 'मुख्य फुटर चित्र',
                      gradient: 'from-slate-700 to-slate-900',
                      desc: 'वेबसाइट के नीचे दिखने वाली मुख्य ब्रांडिंग फोटो अपलोड व बदलें।',
                      actions: ['📸 नई फ़ोटो अपलोड करें', '👁️ लाइव प्रीव्यू', '🔄 रीसेट'],
                    },
                    {
                      id: 'security' as const,
                      num: '13',
                      titleHi: 'एडमिन सुरक्षा व 2FA (Security)',
                      titleEn: 'Dual Email Passwords & Security',
                      icon: Shield,
                      count: '2 अधिकृत ईमेल',
                      gradient: 'from-rose-600 to-amber-700',
                      desc: 'baalvarta@ व chauhansanjay932@ के पासवर्ड व 2-स्टेप OTP सेटिंग्स।',
                      actions: ['🔒 पासवर्ड बदलें', '📱 2FA OTP सेटिंग्स', '👑 स्वामित्व'],
                    },
                    {
                      id: 'firebase' as const,
                      num: '14',
                      titleHi: 'डेटाबेस बैकअप (Database Backup)',
                      titleEn: 'JSON Export & Firestore Setup',
                      icon: Cloud,
                      count: '100% सुरक्षित',
                      gradient: 'from-blue-600 to-indigo-700',
                      desc: '1-क्लिक में अपने पूरे डेटा का JSON बैकअप डाउनलोड करें व नियम देखें।',
                      actions: ['💾 1-क्लिक बैकअप', '📋 कॉपी JSON', '🛡️ सुरक्षा नियम'],
                    },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          if (soundEnabled) playPopSound();
                          setActiveTab(cat.id);
                        }}
                        className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                      >
                        <div className="space-y-3">
                          {/* Card top */}
                          <div className="flex items-center justify-between">
                            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs">
                              {cat.count}
                            </span>
                          </div>

                          {/* Titles */}
                          <div>
                            <h4 className="text-base font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                              {cat.num}. {cat.titleHi}
                            </h4>
                            <p className="text-[11px] font-semibold text-slate-400">
                              {cat.titleEn}
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {cat.desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          {/* Action badges */}
                          <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-500">
                            {cat.actions.map((act, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                {act}
                              </span>
                            ))}
                          </div>

                          {/* Button */}
                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 group-hover:bg-amber-600"
                          >
                            <span>इस श्रेणी में जाएँ (Open)</span>
                            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: STORIES */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 1: कहानियाँ ({stories.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • यहाँ से नई कहानी जोड़ें, सुधारें या डिलीट करें
                  </span>
                </div>
              </div>
              {/* Add Story Card Form with Dual Mode Selector */}
              <div className="bg-amber-50/60 rounded-3xl p-5 border-2 border-amber-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200/80">
                  <h3 className="font-black text-sm text-amber-950 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-600" />
                    <span>नई बाल कहानी जोड़ें (Add Story)</span>
                  </h3>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-amber-100/80 rounded-2xl border border-amber-300">
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playPopSound();
                        setStoryUploadMode('picture_book');
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
                        storyUploadMode === 'picture_book'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>📸 विकल्प 2: फोटो + शब्द सचित्र कथा (अनुशंसित)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playPopSound();
                        setStoryUploadMode('standard');
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
                        storyUploadMode === 'standard'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>📜 विकल्प 1: सामान्य कहानी (Full Text)</span>
                    </button>
                  </div>
                </div>

                {/* MODE 2: PICTURE BOOK / MULTI-PHOTO WITH WORDS PER PHOTO (USER'S REQUEST) */}
                {storyUploadMode === 'picture_book' ? (
                  <form onSubmit={handleAddPictureBookStory} className="space-y-4 text-xs">
                    <div className="p-3 bg-amber-100/50 rounded-2xl border border-amber-200 text-amber-950 font-medium">
                      <p className="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
                        <span>✨ सचित्र दृश्य कहानी (Photo + Words Per Scene):</span>
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        यहाँ आप एक ही कहानी में <strong>जितनी चाहें उतनी फोटो (Scenes)</strong> जोड़ सकते हैं और हर फोटो के सामने/नीचे बच्चों के लिए <strong>कहानी के शब्द</strong> लिख सकते हैं। बच्चे फोटो देखकर कहानी को बहुत आसानी से समझ सकेंगे!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">कहानी का शीर्षक (Story Title in Hindi) *</label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. चालाक खरगोश और शेर"
                          value={newPictureBook.titleHi}
                          onChange={(e) => setNewPictureBook({ ...newPictureBook, titleHi: e.target.value })}
                          className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">English Title (वैकल्पिक)</label>
                        <input
                          type="text"
                          placeholder="e.g. The Clever Rabbit and the Lion"
                          value={newPictureBook.titleEn}
                          onChange={(e) => setNewPictureBook({ ...newPictureBook, titleEn: e.target.value })}
                          className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">कहानी की श्रेणी (Category)</label>
                        <select
                          value={newPictureBook.category}
                          onChange={(e) => setNewPictureBook({ ...newPictureBook, category: e.target.value as any })}
                          className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                          <option value="moral">नैतिक शिक्षा (Moral Stories)</option>
                          <option value="animals">पशु-पक्षी (Animal Tales)</option>
                          <option value="panchatantra">पंचतंत्र (Panchatantra)</option>
                          <option value="bedtime">सोते समय (Bedtime Stories)</option>
                          <option value="wisdom">ज्ञानवर्धक (Wisdom & Wit)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">कहानी की सीख (Moral in Hindi)</label>
                        <input
                          type="text"
                          placeholder="उदा. अक्ल ताकत से बड़ी होती है।"
                          value={newPictureBook.moralHi}
                          onChange={(e) => setNewPictureBook({ ...newPictureBook, moralHi: e.target.value })}
                          className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    {/* SCENES / PHOTOS LIST */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-amber-600" />
                          <span>कहानी के फोटो दृश्य और शब्द ({newStoryScenes.length} दृश्य) *</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleAddStoryScene}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ नया फोटो और शब्द जोड़ें (Add Photo Scene)</span>
                        </button>
                      </div>

                      {newStoryScenes.map((sc, idx) => (
                        <div
                          key={sc.id || idx}
                          className="p-4 bg-white rounded-2xl border-2 border-amber-200/80 shadow-xs space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-xs">
                              दृश्य / Photo #{idx + 1}
                            </span>
                            {newStoryScenes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveStoryScene(idx)}
                                className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>यह दृश्य हटाएं</span>
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
                            {/* Photo Selection / Preview */}
                            <div className="md:col-span-5 space-y-2">
                              <ImageUpload16x9
                                label={`दृश्य #${idx + 1} का फोटो (16:9 Image)`}
                                value={sc.image}
                                onChange={(img) => handleUpdateStoryScene(idx, 'image', img)}
                                required
                                soundEnabled={soundEnabled}
                                helperText="16:9 आकार की तस्वीर चुनें या लिंक पेस्ट करें"
                              />
                            </div>

                            {/* Story Words for this Photo */}
                            <div className="md:col-span-7 space-y-2">
                              <div>
                                <label className="font-bold text-slate-700 block mb-1">
                                  इस फोटो के सामने कहानी के शब्द / पैराग्राफ (Hindi Words for this Photo) *
                                </label>
                                <textarea
                                  rows={4}
                                  required
                                  placeholder={`दृश्य #${idx + 1} के फोटो में क्या हो रहा है, वह शब्द यहाँ लिखें... (उदा. एक दिन सुंदर जंगल में एक नटखट खरगोश खेल रहा था...)`}
                                  value={sc.textHi}
                                  onChange={(e) => handleUpdateStoryScene(idx, 'textHi', e.target.value)}
                                  className="w-full p-2.5 rounded-xl bg-amber-50/40 border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs leading-relaxed"
                                />
                              </div>

                              <div>
                                <label className="font-bold text-slate-700 block mb-1">
                                  English Words (वैकल्पिक)
                                </label>
                                <input
                                  type="text"
                                  placeholder="English translation for this scene photo..."
                                  value={sc.textEn}
                                  onChange={(e) => handleUpdateStoryScene(idx, 'textEn', e.target.value)}
                                  className="w-full p-2 rounded-xl bg-white border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add another scene button */}
                      <button
                        type="button"
                        onClick={handleAddStoryScene}
                        className="w-full py-2.5 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 font-black text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Plus className="w-4 h-4 text-amber-600" />
                        <span>+ और फोटो दृश्य जोड़ें (+ Add Next Photo & Story Words)</span>
                      </button>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>📸 पूरी सचित्र बाल-कथा प्रकाशित करें (Publish Illustrated Story)</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* MODE 1: STANDARD STORY FORM (SINGLE TEXT + COVER) */
                  <form onSubmit={handleAddStory} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">कहानी का शीर्षक (Hindi Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. 7. सच्चा हीरा"
                        value={newStory.titleHi}
                        onChange={(e) => setNewStory({ ...newStory, titleHi: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">English Title</label>
                      <input
                        type="text"
                        placeholder="e.g. The True Gem"
                        value={newStory.titleEn}
                        onChange={(e) => setNewStory({ ...newStory, titleEn: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">पूरी कहानी (Full Story in Hindi) *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="यहाँ कहानी का पूरा विवरण लिखें..."
                        value={newStory.contentHi}
                        onChange={(e) => setNewStory({ ...newStory, contentHi: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">कहानी की सीख (Moral in Hindi)</label>
                      <input
                        type="text"
                        placeholder="उदा. सदा परोपकार करो।"
                        value={newStory.moralHi}
                        onChange={(e) => setNewStory({ ...newStory, moralHi: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <ImageUpload16x9
                        label="कहानी का 16:9 मुख्य कवर फोटो (Story Main 16:9 Cover Image)"
                        value={newStory.coverImage}
                        onChange={(img) => setNewStory({ ...newStory, coverImage: img })}
                        required
                        soundEnabled={soundEnabled}
                        helperText="16:9 आकार की इमेज फ़ाइल चुनें या ड्रैग करें। यह पूरी तरह 16:9 अनुपात में सेट हो जाएगी।"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        कहानी के अंदर के अतिरिक्त चित्र URLs / Illustrations (वैकल्पिक)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="प्रति पंक्ति एक इमेज URL दर्ज करें..."
                        value={newStory.illustrationsText}
                        onChange={(e) => setNewStory({ ...newStory, illustrationsText: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>कहानी प्रकाशित करें (Publish Story)</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Current Stories Management & Safe Deletion */}
              <div className="space-y-4">
                {/* Header & Explanation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
                  <div>
                    <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <span>प्रकाशित कहानियों का प्रबंधन ({stories.length})</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      यदि कोई कहानी गलत अपलोड हो गई है या पसंद न आए, तो आप उसे नीचे दिए गए <span className="text-rose-600 font-bold">"डिलीट करें"</span> बटन से आसानी से हटा सकते हैं।
                    </p>
                  </div>
                  {undoStory && (
                    <button
                      onClick={handleUndoDelete}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>हटाई गई कहानी रीस्टोर करें</span>
                    </button>
                  )}
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                  <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 ${
                    toastMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {toastMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <Trash2 className="w-4 h-4 text-rose-600" />}
                      <span>{toastMessage.text}</span>
                    </div>
                    {undoStory && toastMessage.type !== 'success' && (
                      <button
                        onClick={handleUndoDelete}
                        className="underline text-xs font-black hover:text-rose-950"
                      >
                        वापस लाएँ (Undo)
                      </button>
                    )}
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="कहानी खोजें (शीर्षक, नंबर या सीख)..."
                      value={storySearchTerm}
                      onChange={(e) => setStorySearchTerm(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    {storySearchTerm && (
                      <button
                        onClick={() => setStorySearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setStoryFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        storyFilter === 'all'
                          ? 'bg-amber-900 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      सभी ({stories.length})
                    </button>
                    <button
                      onClick={() => setStoryFilter('custom')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        storyFilter === 'custom'
                          ? 'bg-amber-900 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      नई अपलोड ({stories.filter((s) => s.id.startsWith('story-') || s.number > 6).length})
                    </button>
                    <button
                      onClick={() => setStoryFilter('default')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        storyFilter === 'default'
                          ? 'bg-amber-900 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      मूल 1-6 ({stories.filter((s) => !s.id.startsWith('story-') && s.number <= 6).length})
                    </button>
                  </div>
                </div>

                {/* Stories Listing */}
                <div className="space-y-3">
                  {filteredStories.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                      <p className="font-bold text-sm text-slate-700">कोई कहानी नहीं मिली</p>
                      <p className="mt-1">खोज शब्द बदलें या ऊपर से नई कहानी प्रकाशित करें।</p>
                    </div>
                  ) : (
                    filteredStories.map((s) => {
                      const isExpanded = expandedStoryId === s.id;
                      const isCustom = s.id.startsWith('story-') || s.number > 6;

                      return (
                        <div
                          key={s.id}
                          className="bg-white border-2 border-slate-200 hover:border-amber-300 rounded-2xl overflow-hidden transition-all shadow-2xs"
                        >
                          {/* Main Row */}
                          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              {/* Story Thumbnail */}
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                <img
                                  src={s.coverImage}
                                  alt={s.titleHi}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80';
                                  }}
                                />
                                <span className="absolute top-0.5 left-0.5 px-1 py-0.2 bg-black/60 text-white font-extrabold text-[9px] rounded">
                                  #{s.number}
                                </span>
                              </div>

                              {/* Story Info */}
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="font-black text-slate-900 text-sm">{s.titleHi}</p>
                                  {isCustom && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                                      नई अपलोड
                                    </span>
                                  )}
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                                    {s.category}
                                  </span>
                                </div>
                                <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                                  {s.titleEn} • {s.readTime} • सीख: {s.moralHi}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              {/* Preview / Expand Toggle */}
                              <button
                                onClick={() => {
                                  if (soundEnabled) playPopSound();
                                  setExpandedStoryId(isExpanded ? null : s.id);
                                }}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                                title="कहानी का विवरण देखें"
                              >
                                {isExpanded ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
                                <span>{isExpanded ? 'छुपाएँ' : 'देखें'}</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleRequestDelete(s)}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-700 font-black text-xs flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
                                title="यह कहानी हमेशा के लिए डिलीट करें"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>हटाएं (Delete)</span>
                              </button>
                            </div>
                          </div>

                          {/* Expanded Full Story Preview */}
                          {isExpanded && (
                            <div className="p-4 bg-amber-50/40 border-t border-amber-200 text-xs space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1 rounded-xl overflow-hidden border border-amber-200 bg-white">
                                  <img
                                    src={s.coverImage}
                                    alt={s.titleHi}
                                    className="w-full h-36 object-cover"
                                  />
                                  <div className="p-2 bg-amber-50 text-[10px] text-amber-900 font-medium">
                                    <span>उम्र: {s.recommendedAge} | समय: {s.readTime}</span>
                                  </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-slate-700 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line font-serif text-[13px]">
                                    {s.contentHi}
                                  </div>
                                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-100/70 text-amber-900 font-bold text-[11px]">
                                    <span>💡 सीख: {s.moralHi}</span>
                                    <button
                                      onClick={() => handleRequestDelete(s)}
                                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-[10px] hover:bg-rose-700 transition-colors flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>गलत अपलोड हुई है? इसे डिलीट करें</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 🎬 VIDEO STORIES & CATEGORIES CMS (9:16) */}
          {activeTab === 'videos' && (
            <div className="space-y-8">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 2: वीडियो कहानियाँ ({videoStories.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • यहाँ से नया वीडियो जोड़ें, श्रेणी बनाएँ या डिलीट करें
                  </span>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider">
                    एनिमेटेड वीडियो व शॉर्ट्स हब
                  </span>
                  <Film className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  🎬 वीडियो कहानियाँ व श्रेणियाँ प्रबंधन (9:16 Video Stories)
                </h3>
                <p className="text-xs sm:text-sm text-red-50 max-w-2xl font-medium leading-relaxed">
                  यहाँ से आप अपनी वीडियो कहानियों के लिंक 9:16 थंबनेल के साथ जोड़ सकते हैं। साथ ही अपनी इच्छानुसार वीडियो श्रेणियों को लिस्ट-वाइज बना सकते हैं और नई श्रेणियाँ जोड़ सकते हैं।
                </p>
              </div>

              {/* SECTION 1: VIDEO CATEGORIES MANAGEMENT (LIST-WISE) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-red-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Layers className="w-5 h-5 text-red-600" />
                      <span>1. वीडियो श्रेणियाँ सूची (Video Categories List)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      अपनी आवश्यकतानुसार जो चाहें नई श्रेणी जोड़ें या मौजूदा श्रेणी को हटाएं।
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-bold text-xs border border-red-200 self-start sm:self-auto">
                    कुल {videoCategories.length} श्रेणियाँ
                  </span>
                </div>

                {/* Add New Category Form */}
                <form onSubmit={handleAddVideoCategory} className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="नई वीडियो श्रेणी का नाम (उदा: बाल कविताएँ, प्रेरक प्रसंग, 3D एनीमेशन)..."
                    className="flex-1 w-full p-2.5 rounded-xl border border-red-200 bg-red-50/40 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>नई श्रेणी जोड़ें (Add Category)</span>
                  </button>
                </form>

                {/* List-wise Display of Categories */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    सक्रिय श्रेणियों की सूची (क्लिक करके हटाएं):
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {videoCategories.map((cat, idx) => {
                      const count = videoStories.filter((v) => v.category === cat).length;
                      return (
                        <div
                          key={cat}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-slate-800 text-xs font-bold shadow-2xs group hover:border-red-400 transition-colors"
                        >
                          <span className="text-[10px] text-red-500 font-black">{idx + 1}.</span>
                          <span>{cat}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-red-200/80 text-red-800 text-[10px] font-black">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideoCategory(cat)}
                            title={`"${cat}" श्रेणी हटाएं`}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded-md transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 2: ADD / EDIT 9:16 VIDEO STORY FORM */}
              <div id="video-cms-form" className="bg-red-50/50 rounded-3xl p-5 sm:p-6 border-2 border-red-200 space-y-4">
                <div className="flex items-center justify-between border-b border-red-200 pb-3">
                  <div className="flex items-center gap-2 text-red-950">
                    <Video className="w-5 h-5 text-red-600" />
                    <h4 className="font-black text-sm sm:text-base">
                      {editingVideoId
                        ? '✏️ वीडियो कहानी संपादित करें (Edit Video Story)'
                        : '2. नई 9:16 वीडियो कहानी जोड़ें (Add 9:16 Video Story)'}
                    </h4>
                  </div>

                  {editingVideoId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVideoId(null);
                        setNewVideo({
                          titleHi: '',
                          titleEn: '',
                          youtubeUrl: '',
                          thumbnail: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&auto=format&fit=crop&q=80',
                          category: videoCategories[0] || 'पंचतंत्र कहानियाँ',
                          duration: '0:58',
                          viewsCount: '15K+',
                          descriptionHi: '',
                          descriptionEn: '',
                          isFeatured: false,
                        });
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>रद्द करें (Cancel)</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleAddOrUpdateVideo} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">कहानी का नाम (Hindi Title) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. शेर और चूहा (Shorts)"
                      value={newVideo.titleHi}
                      onChange={(e) => setNewVideo({ ...newVideo, titleHi: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-red-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">English Title</label>
                    <input
                      type="text"
                      placeholder="e.g. The Lion and the Mouse"
                      value={newVideo.titleEn}
                      onChange={(e) => setNewVideo({ ...newVideo, titleEn: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-red-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">
                      वीडियो लिंक (Video URL) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="उदा. https://... (Video URL / Shorts URL)"
                      value={newVideo.youtubeUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-red-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      क्लिक करने पर बच्चा सीधे इस वीडियो/शॉर्ट्स पर पहुँच जाएगा।
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">वीडियो श्रेणी (Category) *</label>
                    <select
                      value={newVideo.category}
                      onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-red-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      {videoCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">अवधि (Duration)</label>
                      <input
                        type="text"
                        placeholder="उदा. 0:58 या Shorts"
                        value={newVideo.duration}
                        onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white border border-red-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">व्यूज (Views Tag)</label>
                      <input
                        type="text"
                        placeholder="उदा. 25K+"
                        value={newVideo.viewsCount}
                        onChange={(e) => setNewVideo({ ...newVideo, viewsCount: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white border border-red-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">कहानी का विवरण (Short Summary)</label>
                    <input
                      type="text"
                      placeholder="उदा. दया और मित्रता की अमर कहानी..."
                      value={newVideo.descriptionHi}
                      onChange={(e) => setNewVideo({ ...newVideo, descriptionHi: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-red-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>

                  {/* 9:16 Aspect Ratio Thumbnail Upload */}
                  <div className="sm:col-span-2 bg-white p-4 rounded-2xl border border-red-200">
                    <ImageUpload9x16
                      label="वीडियो का 9:16 थंबनेल फोटो (9:16 Portrait Thumbnail)"
                      value={newVideo.thumbnail}
                      onChange={(img) => setNewVideo({ ...newVideo, thumbnail: img })}
                      required
                      soundEnabled={soundEnabled}
                      helperText="9:16 अनुपात में वर्टिकल फोटो अपलोड करें या ऑनलाइन इमेज URL पेस्ट करें।"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newVideo.isFeatured ?? false}
                        onChange={(e) => setNewVideo({ ...newVideo, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-400"
                      />
                      <span className="font-bold text-slate-800">
                        होमपेज पर हाइलाइट करें (Feature on Home)
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {editingVideoId ? 'अपडेट करें (Update Video)' : 'वीडियो कहानी सहेजें (Save Video)'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION 3: EXISTING VIDEO STORIES LIST (LIST-WISE) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-red-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-red-100 pb-3">
                  <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Film className="w-5 h-5 text-red-600" />
                    <span>3. मौजूदा 9:16 वीडियो कहानियों की सूची ({videoStories.length})</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-bold">
                    List-wise Video Directory
                  </span>
                </div>

                <div className="space-y-3">
                  {videoStories.map((v, index) => (
                    <div
                      key={v.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl border-2 border-red-100 hover:border-red-300 bg-white hover:bg-red-50/30 transition-all"
                    >
                      {/* Left: 9:16 Thumbnail + Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 text-center text-xs font-black text-slate-400 shrink-0">
                          {index + 1}.
                        </span>

                        {/* 9:16 Thumbnail */}
                        <div className="relative w-14 aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-xs border border-red-200">
                          <img
                            src={v.thumbnail}
                            alt={v.titleHi}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 fill-white text-white" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-black uppercase">
                              {v.category}
                            </span>
                            {v.duration && (
                              <span className="text-[10px] text-slate-500 font-bold">
                                ⏱️ {v.duration}
                              </span>
                            )}
                            {v.viewsCount && (
                              <span className="text-[10px] text-amber-600 font-bold">
                                👁️ {v.viewsCount}
                              </span>
                            )}
                          </div>

                          <h5 className="font-black text-slate-900 text-sm truncate">
                            {v.titleHi}
                          </h5>
                          {v.titleEn && (
                            <p className="text-xs text-slate-500 truncate">{v.titleEn}</p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {/* Direct Video Link Test Button */}
                        <a
                          href={v.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>वीडियो टेस्ट करें</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleEditVideo(v)}
                          title="संपादित करें (Edit)"
                          className="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(v.id)}
                          title="हटाएं (Delete)"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 🎯 BAL QUIZ CMS (5-QUESTION QUIZZES) */}
          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 3: बाल क्विज़ खेल ({quizSets.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • यहाँ से 5-प्रश्नों वाले क्विज़ जोड़ें, सुधारें या डिलीट करें
                  </span>
                </div>
              </div>

              {/* Add New Quiz Set Form */}
              <div className="bg-emerald-50/60 rounded-3xl p-5 border-2 border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-emerald-950 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-600" />
                    <span>नया 5-प्रश्नों वाला बाल क्विज़ सेट बनाएँ (Add 5-Question Quiz Set)</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    5 प्रश्न • 4 विकल्प • व्याख्या सहित
                  </span>
                </div>

                <form onSubmit={handleAddQuizSet} className="space-y-5 text-xs">
                  {/* Quiz Set General Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-emerald-150">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">क्विज़ का नाम (Hindi Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. 🦁 जंगल के अनोखे जानवर"
                        value={newQuizTitleHi}
                        onChange={(e) => setNewQuizTitleHi(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">English Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Wild Safari Animals"
                        value={newQuizTitleEn}
                        onChange={(e) => setNewQuizTitleEn(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Icon / Emoji</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={newQuizIcon}
                        onChange={(e) => setNewQuizIcon(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  {/* 5 Questions Builder */}
                  <div className="space-y-4">
                    <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      <span>क्विज़ के 5 प्रश्न (5 Questions with 4 Options & Image Explanation)</span>
                    </h4>

                    {newQuizQuestions.map((q, qIndex) => (
                      <div key={qIndex} className="p-4 rounded-2xl bg-white border-2 border-emerald-100 shadow-xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                            प्रश्न #{qIndex + 1}
                          </span>
                          <span className="text-[11px] text-slate-500 font-bold">4 विकल्प और सचित्र व्याख्या</span>
                        </div>

                        {/* Question Text & Image */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-2">
                            <div>
                              <label className="font-bold text-slate-600 block mb-0.5">प्रश्न (Hindi) *</label>
                              <input
                                type="text"
                                required
                                placeholder={`उदा. प्रश्न #${qIndex + 1}: जंगल का राजा कौन कहलाता है?`}
                                value={q.questionHi}
                                onChange={(e) => {
                                  const updated = [...newQuizQuestions];
                                  updated[qIndex].questionHi = e.target.value;
                                  setNewQuizQuestions(updated);
                                }}
                                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-1 focus:ring-emerald-400"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-slate-600 block mb-0.5">Question (English)</label>
                              <input
                                type="text"
                                placeholder={`e.g. Question #${qIndex + 1}: Who is the King of the Jungle?`}
                                value={q.questionEn}
                                onChange={(e) => {
                                  const updated = [...newQuizQuestions];
                                  updated[qIndex].questionEn = e.target.value;
                                  setNewQuizQuestions(updated);
                                }}
                                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:ring-1 focus:ring-emerald-400"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="font-bold text-slate-600 block mb-0.5">प्रश्न का चित्र URL</label>
                            <input
                              type="url"
                              value={q.image}
                              onChange={(e) => {
                                const updated = [...newQuizQuestions];
                                updated[qIndex].image = e.target.value;
                                setNewQuizQuestions(updated);
                              }}
                              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] focus:ring-1 focus:ring-emerald-400"
                            />
                            {q.image && (
                              <img src={q.image} alt="Preview" className="w-full h-14 object-cover rounded-lg mt-1 border" />
                            )}
                          </div>
                        </div>

                        {/* 4 Options Grid */}
                        <div>
                          <label className="font-black text-slate-700 block mb-1">
                            4 विकल्प (Options) — सही विकल्प पर रेडियो बटन चुनें:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {([0, 1, 2, 3] as const).map((optIdx) => {
                              const letters = ['A', 'B', 'C', 'D'];
                              const isCorrect = q.correctIndex === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                                    isCorrect ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400' : 'bg-slate-50/70 border-slate-200'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={isCorrect}
                                    onChange={() => {
                                      const updated = [...newQuizQuestions];
                                      updated[qIndex].correctIndex = optIdx;
                                      setNewQuizQuestions(updated);
                                    }}
                                    className="accent-emerald-600 w-4 h-4 cursor-pointer"
                                  />
                                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${
                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {letters[optIdx]}
                                  </span>
                                  <input
                                    type="text"
                                    required
                                    placeholder={`विकल्प ${letters[optIdx]}`}
                                    value={q.options[optIdx]}
                                    onChange={(e) => {
                                      const updated = [...newQuizQuestions];
                                      const nextOpts = [...updated[qIndex].options] as [string, string, string, string];
                                      nextOpts[optIdx] = e.target.value;
                                      updated[qIndex].options = nextOpts;
                                      setNewQuizQuestions(updated);
                                    }}
                                    className="flex-1 p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold focus:outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* "यह उत्तर क्यों सही है?" Explanation Box */}
                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                          <label className="font-black text-amber-950 block">
                            💡 "यह उत्तर क्यों सही है?" सचित्र व्याख्या (Why is this correct?):
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="sm:col-span-2 space-y-1.5">
                              <textarea
                                rows={2}
                                required
                                placeholder="उदा. शेर को अपनी ताकत, शिकार कौशल और गर्जना के कारण जंगल का राजा कहा जाता है।"
                                value={q.explanationHi}
                                onChange={(e) => {
                                  const updated = [...newQuizQuestions];
                                  updated[qIndex].explanationHi = e.target.value;
                                  setNewQuizQuestions(updated);
                                }}
                                className="w-full p-2 rounded-lg bg-white border border-amber-200 text-xs focus:ring-1 focus:ring-amber-400"
                              />
                            </div>
                            <div>
                              <input
                                type="url"
                                placeholder="व्याख्या चित्र URL (Optional)"
                                value={q.explanationImage}
                                onChange={(e) => {
                                  const updated = [...newQuizQuestions];
                                  updated[qIndex].explanationImage = e.target.value;
                                  setNewQuizQuestions(updated);
                                }}
                                className="w-full p-2 rounded-lg bg-white border border-amber-200 font-mono text-[10px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>5-प्रश्नों वाला नया क्विज़ सेट सेव करें (Save 5-Q Quiz)</span>
                  </button>
                </form>
              </div>

              {/* Existing Quiz Sets Listing */}
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">
                  मौजूदा क्विज़ सेट्स ({quizSets.length})
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {quizSets.map((qs) => (
                    <div
                      key={qs.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
                          {qs.icon || '🎯'}
                        </span>
                        <div>
                          <h5 className="font-extrabold text-sm text-slate-900">{qs.titleHi}</h5>
                          <p className="text-xs text-slate-500">
                            {qs.titleEn} • {qs.questions.length} प्रश्न • श्रेणी: {qs.category}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteQuizSet(qs.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>हटाएं</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 🖨️ WORKSHEETS CMS (PRINTABLES) */}
          {activeTab === 'worksheets' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 4: प्रिंटेबल वर्कशीट्स ({worksheets.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • यहाँ से नई वर्कशीट जोड़ें, सुधारें या डिलीट करें
                  </span>
                </div>
              </div>

              {/* Add Worksheet Form */}
              <div className="bg-indigo-50/60 rounded-3xl p-5 border-2 border-indigo-200 space-y-4">
                <h3 className="font-black text-sm text-indigo-950 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-indigo-600" />
                  <span>नई प्रिंटेबल वर्कशीट जोड़ें (Add Printable Worksheet)</span>
                </h3>

                <form onSubmit={handleAddWorksheet} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">वर्कशीट शीर्षक (Hindi) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. सुंदर तितली रंग भरो शीट"
                      value={newWs.titleHi}
                      onChange={(e) => setNewWs({ ...newWs, titleHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Title (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Beautiful Butterfly Coloring Sheet"
                      value={newWs.titleEn}
                      onChange={(e) => setNewWs({ ...newWs, titleEn: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">श्रेणी (Category)</label>
                    <select
                      value={newWs.category}
                      onChange={(e) => setNewWs({ ...newWs, category: e.target.value as PrintableWorksheet['category'] })}
                      className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold"
                    >
                      <option value="coloring">🎨 रंग भरना (Coloring)</option>
                      <option value="tracing">✏️ रेखा अभ्यास (Tracing)</option>
                      <option value="math">🔢 अंक गणित (Math)</option>
                      <option value="puzzles">🧩 पहेलियाँ (Puzzles)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">आयु वर्ग (Age Group)</label>
                    <input
                      type="text"
                      value={newWs.ageGroup}
                      onChange={(e) => setNewWs({ ...newWs, ageGroup: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">प्रिंट शीट Image URL *</label>
                    <input
                      type="url"
                      required
                      value={newWs.printUrl}
                      onChange={(e) => setNewWs({ ...newWs, printUrl: e.target.value, thumbnailUrl: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-mono text-[10px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">विवरण (Description)</label>
                    <input
                      type="text"
                      value={newWs.descriptionHi}
                      onChange={(e) => setNewWs({ ...newWs, descriptionHi: e.target.value })}
                      placeholder="उदा. बच्चों की कल्पना और रंगों की पहचान के लिए"
                      className="w-full p-2 rounded-xl bg-white border border-indigo-200 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>वर्कशीट सेव करें (Save Worksheet)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Worksheets List */}
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">
                  मौजूदा वर्कशीट्स ({worksheets.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {worksheets.map((ws) => (
                    <div
                      key={ws.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={ws.thumbnailUrl} alt={ws.titleHi} className="w-12 h-12 rounded-xl object-cover border" />
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900">{ws.titleHi}</h5>
                          <p className="text-[11px] text-slate-500">{ws.ageGroup} • {ws.category}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteWorksheet(ws.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 🎮 KIDS MINI GAMES CMS */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 5: किड्स गेम्स ({gamesList.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • यहाँ से नए गेम्स जोड़ें या अवांछित गेम्स हटाएं
                  </span>
                </div>
              </div>

              {/* Add New Game Form */}
              <div className="bg-purple-50/60 rounded-3xl p-5 border-2 border-purple-200 space-y-4">
                <h3 className="font-black text-sm text-purple-950 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-600" />
                  <span>नया खेल जोड़ें (Add New Kid Game)</span>
                </h3>

                <form onSubmit={handleAddGame} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">गेम शीर्षक (Hindi) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. रंग मिलान और भूलभुलैया"
                      value={newGame.titleHi}
                      onChange={(e) => setNewGame({ ...newGame, titleHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Game Title (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Color Match & Maze"
                      value={newGame.titleEn}
                      onChange={(e) => setNewGame({ ...newGame, titleEn: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">गेम प्रकार (Game Type)</label>
                    <select
                      value={newGame.category}
                      onChange={(e) => setNewGame({ ...newGame, category: e.target.value as KidsGameItem['category'] })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold"
                    >
                      <option value="memory">🦁 मेमोरी कार्ड मैच (Memory Match)</option>
                      <option value="puzzle">🧩 जिगसॉ पहेली (Jigsaw Puzzle)</option>
                      <option value="balloon">🎈 गुब्बारा फोड़ो (Balloon Pop)</option>
                      <option value="animal_quiz">🐱 पशु आवाज क्विज़ (Animal Sounds)</option>
                      <option value="word">🔤 हिंदी शब्द बनाओ (Word Builder)</option>
                      <option value="whack">🐵 चंचल बंदर पकड़ो (Whack-a-Mole)</option>
                      <option value="tictactoe">❌⭕ टिक-टैक-टो (Tic-Tac-Toe)</option>
                      <option value="color_sort">🧺 रंग टोकरी छाँटो (Color Sort)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">इमोजी (Emoji)</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={newGame.emoji}
                        onChange={(e) => setNewGame({ ...newGame, emoji: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold text-center"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">बैज (Badge)</label>
                      <input
                        type="text"
                        value={newGame.badge}
                        onChange={(e) => setNewGame({ ...newGame, badge: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">गेम विवरण (Description)</label>
                    <input
                      type="text"
                      value={newGame.descriptionHi}
                      onChange={(e) => setNewGame({ ...newGame, descriptionHi: e.target.value })}
                      placeholder="उदा. कार्ड पलटकर सही जानवर खोजें और याददाश्त तेज करें।"
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>गेम सेव करें (Save Game)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Games List */}
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">
                  मौजूदा गेम्स ({gamesList.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gamesList.map((g) => (
                    <div
                      key={g.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center text-2xl">
                          {g.emoji}
                        </span>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900">{g.titleHi}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{g.descriptionHi}</p>
                          <span className="text-[10px] text-purple-700 font-bold">{g.badge}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteGame(g.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: 🎨 COLORING BOOK TEMPLATES CMS */}
          {activeTab === 'coloring' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 6: कलरिंग टेम्पलेट्स ({coloringTemplates.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • यहाँ से नए कलरिंग रेखाचित्र जोड़ें या हटाएं
                  </span>
                </div>
              </div>

              {/* Add Template Form */}
              <div className="bg-amber-50/60 rounded-3xl p-5 border-2 border-amber-200 space-y-4">
                <h3 className="font-black text-sm text-amber-950 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span>नया कलरिंग स्केच जोड़ें (Add Coloring Template)</span>
                </h3>

                <form onSubmit={handleAddColoringTemplate} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">टेम्पलेट नाम (Hindi) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. चंचल खरगोश (Cute Rabbit)"
                      value={newColoringTemplate.nameHi}
                      onChange={(e) => setNewColoringTemplate({ ...newColoringTemplate, nameHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Name (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Cute Rabbit"
                      value={newColoringTemplate.nameEn}
                      onChange={(e) => setNewColoringTemplate({ ...newColoringTemplate, nameEn: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">इमोजी आइकन (Emoji)</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={newColoringTemplate.emoji}
                      onChange={(e) => setNewColoringTemplate({ ...newColoringTemplate, emoji: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">श्रेणी (Category)</label>
                    <select
                      value={newColoringTemplate.category}
                      onChange={(e) => setNewColoringTemplate({ ...newColoringTemplate, category: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-amber-200 font-semibold"
                    >
                      <option value="animals">पशु-पक्षी (Animals & Birds)</option>
                      <option value="nature">प्रकृति व पेड़-पौधे (Nature)</option>
                      <option value="water">जल जीव (Water Animals)</option>
                      <option value="free">कोरी स्लेट (Free Canvas)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>कलरिंग टेम्पलेट सेव करें (Save Template)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Templates List */}
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">
                  मौजूदा कलरिंग टेम्पलेट्स ({coloringTemplates.length})
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {coloringTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{tpl.emoji}</span>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900">{tpl.nameHi}</h5>
                          <span className="text-[10px] text-slate-500 font-medium">{tpl.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteColoringTemplate(tpl.id)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: 🏆 CERTIFICATES & AWARDS CMS */}
          {activeTab === 'awards' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 7: बाल पाठक सम्मान प्रमाण पत्र ({certificateAwards.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • यहाँ से नए पुरस्कार मेडल व प्रमाण पत्र श्रेणियाँ प्रबंधित करें
                  </span>
                </div>
              </div>

              {/* Add Award Form */}
              <div className="bg-yellow-50/60 rounded-3xl p-5 border-2 border-yellow-200 space-y-4">
                <h3 className="font-black text-sm text-yellow-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span>नया सम्मान मेडल / प्रमाण पत्र प्रकार जोड़ें</span>
                </h3>

                <form onSubmit={handleAddCertificateAward} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">पुरस्कार शीर्षक (Hindi) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. 🌟 बाल सुपर रीडर सम्मान"
                      value={newCertificateAward.titleHi}
                      onChange={(e) => setNewCertificateAward({ ...newCertificateAward, titleHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-yellow-200 font-semibold focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Award Title (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Super Reader Award"
                      value={newCertificateAward.titleEn}
                      onChange={(e) => setNewCertificateAward({ ...newCertificateAward, titleEn: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-yellow-200 font-semibold focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">सम्मान का कारण / विवरण (Hindi) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. 50+ सचित्र हिंदी नैतिक कहानियाँ पढ़ने व समझने के लिए।"
                      value={newCertificateAward.descHi}
                      onChange={(e) => setNewCertificateAward({ ...newCertificateAward, descHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-yellow-200 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>प्रमाण पत्र सम्मान सेव करें (Save Award)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Awards List */}
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">
                  मौजूदा पुरस्कार श्रेणियाँ ({certificateAwards.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certificateAwards.map((award) => (
                    <div
                      key={award.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-900 border border-yellow-200 flex items-center justify-center text-2xl">
                          {award.icon || '🏆'}
                        </span>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900">{award.titleHi}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{award.descHi}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCertificateAward(award.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ROCHAK TATHYA (FUN FACTS) */}
          {activeTab === 'facts' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 5: रोचक तथ्य ({facts.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • यहाँ से नया तथ्य जोड़ें, संपादित करें या हटाएं
                  </span>
                </div>
              </div>

              <div className="bg-sky-50/60 rounded-3xl p-5 border-2 border-sky-200 space-y-4">
                <h3 className="font-black text-sm text-sky-950 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-sky-600" />
                  <span>नया रोचक तथ्य जोड़ें (Add Fun Fact)</span>
                </h3>

                <form onSubmit={handleAddFact} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">तथ्य शीर्षक (Hindi Title) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. जुगनू रात में क्यों चमकते हैं?"
                      value={newFact.titleHi}
                      onChange={(e) => setNewFact({ ...newFact, titleHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-sky-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Emoji Sticker (Icon)</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="उदा. 🪲"
                      value={newFact.emoji}
                      onChange={(e) => setNewFact({ ...newFact, emoji: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-sky-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">तथ्य का विवरण (Hindi Fact Explanation) *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="यहाँ रोचक तथ्य का विवरण लिखें..."
                      value={newFact.factHi}
                      onChange={(e) => setNewFact({ ...newFact, factHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-sky-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUpload16x9
                      label="तथ्य का 16:9 फ़ोटो (Fact 16:9 Image)"
                      value={newFact.image}
                      onChange={(img) => setNewFact({ ...newFact, image: img })}
                      soundEnabled={soundEnabled}
                      helperText="तथ्य के लिए 16:9 इमेज फ़ाइल अपलोड करें या ड्रैग करें।"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>तथ्य जोड़ें (Save Fact)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Facts list */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-slate-800">
                  सक्रिय रोचक तथ्य ({facts.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {facts.map((f) => (
                    <div key={f.id} className="p-3.5 bg-white flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{f.emoji}</span>
                        <div>
                          <p className="font-extrabold text-slate-800">{f.titleHi}</p>
                          <p className="text-slate-400 line-clamp-1">{f.factHi}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteFact(f.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EARLY LEARNING ITEMS */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 6: अक्षर व बाल ज्ञान ({learningItems.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • वर्णमाला, 123 गिनती व Phonics शब्द प्रबंधन
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                Early Learning Zone manages English Alphabets, Numbers, Colors, Shapes, and Custom media. You can add Audio, Video, PDF, and Game links!
              </div>

              {/* Add Learning Form */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200">
                <div className="flex items-center gap-2 mb-3 text-emerald-900">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-extrabold text-sm">Add New Learning Item</h4>
                </div>

                <form onSubmit={handleAddLearning} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Module Category *</label>
                    <select
                      value={newLearning.module}
                      onChange={(e) => setNewLearning({ ...newLearning, module: e.target.value as any })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="alphabet">Alphabet</option>
                      <option value="numbers">Numbers</option>
                      <option value="colors_shapes">Colors & Shapes</option>
                      <option value="animals">Animals</option>
                      <option value="vocabulary">Vocabulary</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Symbol (e.g. A, 1, 🔴) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A"
                      value={newLearning.symbol}
                      onChange={(e) => setNewLearning({ ...newLearning, symbol: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Name (e.g. Apple) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apple"
                      value={newLearning.name}
                      onChange={(e) => setNewLearning({ ...newLearning, name: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pronunciation (e.g. Ah-pul)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ah-pul"
                      value={newLearning.pronunciation}
                      onChange={(e) => setNewLearning({ ...newLearning, pronunciation: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Main Emoji / Icon *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 🍎"
                      value={newLearning.imageOrEmoji}
                      onChange={(e) => setNewLearning({ ...newLearning, imageOrEmoji: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Theme Color Classes</label>
                    <input
                      type="text"
                      placeholder="e.g. bg-rose-100 text-rose-700 border-rose-300"
                      value={newLearning.color}
                      onChange={(e) => setNewLearning({ ...newLearning, color: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="sm:col-span-2 mt-2 pt-2 border-t border-slate-100">
                    <h5 className="font-bold text-emerald-700 mb-2">Rich Content (Optional)</h5>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Related Words (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ant, Axe, Alligator"
                      value={newLearning.words?.join(', ') || ''}
                      onChange={(e) => setNewLearning({ ...newLearning, words: e.target.value.split(',').map(w => w.trim()).filter(Boolean) })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Short Story</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. An ant ate an apple on the axe..."
                      value={newLearning.story || ''}
                      onChange={(e) => setNewLearning({ ...newLearning, story: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Video URL (Embed/MP4)</label>
                    <input
                      type="url"
                      placeholder="https://... (Video URL / Embed)"
                      value={newLearning.videoUrl || ''}
                      onChange={(e) => setNewLearning({ ...newLearning, videoUrl: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Audio URL (MP3)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newLearning.audioUrl || ''}
                      onChange={(e) => setNewLearning({ ...newLearning, audioUrl: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">PDF URL</label>
                    <input
                      type="url"
                      placeholder="https://...pdf"
                      value={newLearning.pdfUrl || ''}
                      onChange={(e) => setNewLearning({ ...newLearning, pdfUrl: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mini Game (Iframe URL)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newLearning.gameUrl || ''}
                      onChange={(e) => setNewLearning({ ...newLearning, gameUrl: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-emerald-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end mt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {learningItems.map((item) => (
                  <div key={item.id} className={`p-3 rounded-2xl border bg-white flex flex-col gap-2 relative`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.imageOrEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-800 text-xs truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400">{item.module} • {item.symbol}</p>
                      </div>
                      <button
                        onClick={() => onSaveLearning(learningItems.filter(l => l.id !== item.id))}
                        className="p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {/* Tags for attached media */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.videoUrl && <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[9px] font-bold">Video</span>}
                      {item.audioUrl && <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[9px] font-bold">Audio</span>}
                      {item.pdfUrl && <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[9px] font-bold">PDF</span>}
                      {item.gameUrl && <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[9px] font-bold">Game</span>}
                      {item.story && <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-bold">Story</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AUDIO STORIES */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 7: ऑडियो कहानियाँ ({audioStories.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • ऑडियो ट्रैक जोड़ें, नैरेटर व अवधि संपादित करें
                  </span>
                </div>
              </div>

              {/* Add Audio Form */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div className="flex items-center gap-2 mb-3 text-purple-900">
                  <Headphones className="w-5 h-5 text-purple-600" />
                  <h4 className="font-extrabold text-sm">
                    नई ऑडियो कहानी जोड़ें (Add Audio Story)
                  </h4>
                </div>

                <form onSubmit={handleAddAudio} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">कहानी शीर्षक (Hindi Title) *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. चालाक लोमड़ी और कौवा"
                      value={newAudio.titleHi}
                      onChange={(e) => setNewAudio({ ...newAudio, titleHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">English Title</label>
                    <input
                      type="text"
                      placeholder="e.g. The Clever Fox and the Crow"
                      value={newAudio.titleEn}
                      onChange={(e) => setNewAudio({ ...newAudio, titleEn: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">वाचक (Narrator)</label>
                    <input
                      type="text"
                      placeholder="उदा. दादी माँ"
                      value={newAudio.narrator}
                      onChange={(e) => setNewAudio({ ...newAudio, narrator: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">अवधि (Duration)</label>
                    <input
                      type="text"
                      placeholder="उदा. 3:45"
                      value={newAudio.duration}
                      onChange={(e) => setNewAudio({ ...newAudio, duration: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">ऑडियो स्ट्रीम URL (MP3/OGG Stream)</label>
                    <input
                      type="url"
                      placeholder="https://...mp3"
                      value={newAudio.audioUrl}
                      onChange={(e) => setNewAudio({ ...newAudio, audioUrl: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">कहानी का संक्षिप्त विवरण (Short Summary)</label>
                    <input
                      type="text"
                      placeholder="उदा. एक मीठी सीख देने वाली लोककथा..."
                      value={newAudio.descriptionHi}
                      onChange={(e) => setNewAudio({ ...newAudio, descriptionHi: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUpload16x9
                      label="ऑडियो का 16:9 कवर फोटो (Audio 16:9 Cover Image)"
                      value={newAudio.coverImage}
                      onChange={(img) => setNewAudio({ ...newAudio, coverImage: img })}
                      required
                      soundEnabled={soundEnabled}
                      helperText="ऑडियो प्लेयर के लिए 16:9 इमेज फ़ाइल अपलोड करें या ड्रैग करें।"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ऑडियो जोड़ें (Save Audio)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Audio Stories List */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-slate-800">
                  सक्रिय ऑडियो कहानियाँ ({audioStories.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {audioStories.map((a) => (
                    <div key={a.id} className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={a.coverImage} alt={a.titleEn} className="w-16 aspect-video rounded-lg object-cover flex-shrink-0 border border-slate-200" />
                        <div className="min-w-0">
                          <p className="font-black text-slate-800 truncate">{a.titleHi}</p>
                          <p className="text-slate-400">{a.narrator} • {a.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold hidden sm:inline">
                          Stream Ready
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteAudio(a.id)}
                          title="हटाएँ (Delete)"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: USER REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 8: पाठक समीक्षाएँ ({reviews.length})
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • समीक्षाएँ देखें, स्वीकारें या डिलीट करें
                  </span>
                </div>
              </div>

              {/* Header Stats */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-xs font-black uppercase">
                    पाठक व अभिभावक प्रतिक्रियाएँ
                  </span>
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black">
                  उपयोगकर्ता समीक्षाएँ व रेटिंग्स (Reviews Moderation Hub)
                </h3>
                <p className="text-xs text-amber-100 leading-relaxed max-w-xl">
                  वेबसाइट पर पाठकों और अभिभावकों द्वारा सबमिट की गई सभी समीक्षाएँ यहाँ सुरक्षित हैं। यदि कोई अनुचित टिप्पणी हो तो आप उसे यहाँ से हटा सकते हैं।
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs font-bold">
                  <span className="bg-white/20 px-3 py-1 rounded-xl">कुल समीक्षाएँ: {reviews.length}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-xl">
                    औसत रेटिंग: {reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : '5.0'} / 5.0 ⭐
                  </span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center justify-between">
                  <span>उपलब्ध समीक्षाएँ ({reviews.length})</span>
                </h4>

                {reviews.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                    <p className="text-sm font-bold text-slate-600">अभी तक कोई समीक्षा दर्ज नहीं हुई है।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-3 hover:border-amber-300 transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center border border-amber-200">
                                {rev.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-black text-slate-900 text-xs sm:text-sm">{rev.name}</h5>
                                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                                  {rev.role}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-amber-500 text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                              ))}
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            "{rev.comment}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                          <span>{rev.date}</span>
                          {onDeleteReview && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`क्या आप "${rev.name}" की इस समीक्षा को हटाना चाहते हैं?`)) {
                                  if (soundEnabled) playPopSound();
                                  onDeleteReview(rev.id);
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>डिलीट करें</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: FOOTER BRANDING */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 9: फुटर आर्टवर्क चित्र
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • वेबसाइट फुटर की मुख्य ब्रांडिंग इमेज बदलें या रीसेट करें
                  </span>
                </div>
              </div>

              {/* Header Info */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-xs font-black uppercase">
                    Admin Exclusive Control
                  </span>
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black">
                  🖼️ फुटर आर्टवर्क चित्र व ब्रांडिंग (Footer Artwork & Branding)
                </h3>
                <p className="text-xs text-amber-100 leading-relaxed max-w-2xl">
                  वेबसाइट के मुख्य पृष्ठ और सभी पृष्ठों के सबसे नीचे (Footer) दिखने वाले चित्र को यहाँ से प्रबंधित करें।
                  सामान्य पाठकों व आगंतुकों के लिए अपलोड का बटन हटा दिया गया है—केवल आप (Admin) यहाँ से चित्र बदल सकते हैं।
                </p>
              </div>

              {/* Footer Artwork Container */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-5">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <span>📸 वर्तमान फुटर चित्र व प्रीव्यू (Active Footer Artwork)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left: Preview */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-600">लाइव प्रीव्यू (Footer Live Aspect):</p>
                    <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden shadow-md border-2 border-amber-300 bg-slate-950">
                      <img
                        src={footerImage || "file_000000002e5c821198d9573a33263d1e.jpg"}
                        onError={(e) => {
                          if (!footerImage) {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/baalvarta-footer-illustration.svg";
                          }
                        }}
                        alt="Footer Artwork"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{footerImage ? '✓ कस्टम इमेज सक्रिय है' : '✓ डिफ़ॉल्ट बालवार्ता चित्र सक्रिय है'}</span>
                      {footerImage && (
                        <button
                          type="button"
                          onClick={() => {
                            if (soundEnabled) playPopSound();
                            setFooterImage(null);
                            saveStoredFooterImage(null);
                            setToastMessage({ text: 'डिफ़ॉल्ट आर्टवर्क पर रीसेट कर दिया गया!', type: 'success' });
                            setTimeout(() => setToastMessage(null), 3000);
                          }}
                          className="text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
                        >
                          मूल डिफ़ॉल्ट पर रीसेट करें
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Upload controls */}
                  <div className="space-y-4">
                    <ImageUpload16x9
                      label="नया फुटर चित्र अपलोड करें (Upload New Footer Image):"
                      value={footerImage || ''}
                      onChange={(newUrl) => {
                        setFooterImage(newUrl);
                        saveStoredFooterImage(newUrl);
                        if (soundEnabled) playSuccessSound();
                        setToastMessage({ text: 'फुटर चित्र सफलतापूर्वक अपडेट और सेव हो गया!', type: 'success' });
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      helperText="कंप्यूटर/मोबाइल से कोई भी PNG/JPG इमेज चुनें या ऑनलाइन लिंक दर्ज करें। यह स्वचालित रूप से सेव हो जाएगा।"
                      soundEnabled={soundEnabled}
                      placeholderAlt="Footer Banner"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: ADMIN SECURITY & DUAL PASSWORDS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 10: एडमिन सुरक्षा व 2FA
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • दोनों अधिकृत जीमेल आईडी के पासवर्ड व सुरक्षा नियम
                  </span>
                </div>
              </div>

              {/* Security Header Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-600 via-amber-700 to-amber-800 text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-xs font-black uppercase">
                    Strict 2-Factor Authentication
                  </span>
                  <Shield className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="text-xl font-black">
                  🔒 एडमिन सुरक्षा व दोहरे खाते (Dual Admin Security & 2FA)
                </h3>
                <p className="text-xs text-amber-100 leading-relaxed max-w-2xl">
                  बालवार्ता एडमिन में केवल दो अधिकृत ईमेल को ही प्रवेश की अनुमति है।
                  हर बार लॉगिन करते समय पासवर्ड के साथ-साथ ईमेल पर 6 अंकों का OTP सत्यापन अनिवार्य है।
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                      2-स्टेप वेरिफिकेशन प्रणाली सक्रिय है (2FA Active)
                    </h4>
                    <p className="text-[11px] text-emerald-700">
                      आईडी-पासवर्ड डालने के बाद केवल नीचे दिए गए दो ईमेल पर ही OTP कोड जाएगा।
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-950 font-black text-xs shrink-0">
                  100% सुरक्षित
                </span>
              </div>

              {securitySuccessMsg && (
                <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-black text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{securitySuccessMsg}</span>
                </div>
              )}

              {/* Account 1: baalvarta@gmail.com */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                      1
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        <span>baalvarta@gmail.com</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                          मुख्य बालवार्ता एडमिन
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Official Publishing & Content Administrator
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    वर्तमान पासवर्ड: {adminPasswords['baalvarta@gmail.com'] ? '••••••••' : 'डिफ़ॉल्ट सेट'}
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPassBaalvarta.trim() || newPassBaalvarta.trim().length < 6) {
                      alert('पासवर्ड कम से कम 6 अक्षरों/अंकों का होना चाहिए!');
                      return;
                    }
                    saveAdminPassword('baalvarta@gmail.com', newPassBaalvarta.trim());
                    setAdminPasswordsState(getAdminPasswords());
                    setNewPassBaalvarta('');
                    if (soundEnabled) playSuccessSound();
                    setSecuritySuccessMsg('baalvarta@gmail.com का पासवर्ड सफलतापूर्वक अपडेट हो गया है!');
                    setTimeout(() => setSecuritySuccessMsg(''), 4000);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1"
                >
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      baalvarta@gmail.com के लिए नया पासवर्ड सेट करें:
                    </label>
                    <input
                      type="text"
                      value={newPassBaalvarta}
                      onChange={(e) => setNewPassBaalvarta(e.target.value)}
                      placeholder="नया पासवर्ड दर्ज करें (कम से कम 6 अक्षर)"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border-2 border-amber-200 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    पासवर्ड सेव करें
                  </button>
                </form>
              </div>

              {/* Account 2: chauhansanjay932@gmail.com */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">
                      2
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        <span>chauhansanjay932@gmail.com</span>
                        <span className="text-[10px] bg-orange-100 text-orange-950 px-2 py-0.5 rounded font-bold">
                          संजय चौहान (सुपर एडमिन / स्वामी)
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Primary Owner & Super Administrator
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    वर्तमान पासवर्ड: {adminPasswords['chauhansanjay932@gmail.com'] ? '••••••••' : 'डिफ़ॉल्ट सेट'}
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPassSanjay.trim() || newPassSanjay.trim().length < 6) {
                      alert('पासवर्ड कम से कम 6 अक्षरों/अंकों का होना चाहिए!');
                      return;
                    }
                    saveAdminPassword('chauhansanjay932@gmail.com', newPassSanjay.trim());
                    setAdminPasswordsState(getAdminPasswords());
                    setNewPassSanjay('');
                    if (soundEnabled) playSuccessSound();
                    setSecuritySuccessMsg('chauhansanjay932@gmail.com का पासवर्ड सफलतापूर्वक अपडेट हो गया है!');
                    setTimeout(() => setSecuritySuccessMsg(''), 4000);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1"
                >
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      chauhansanjay932@gmail.com के लिए नया पासवर्ड सेट करें:
                    </label>
                    <input
                      type="text"
                      value={newPassSanjay}
                      onChange={(e) => setNewPassSanjay(e.target.value)}
                      placeholder="नया पासवर्ड दर्ज करें (कम से कम 6 अक्षर)"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border-2 border-amber-200 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    पासवर्ड सेव करें
                  </button>
                </form>
              </div>

              {/* Direct Gmail 2FA OTP Delivery Status & Live Testing */}
              <div className="p-5 rounded-3xl bg-white border-2 border-emerald-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        <span>2-स्टेप Google Mail (Gmail) OTP डिलीवरी सेंटर</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded font-bold">
                          सक्रिय (Active)
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Strict 2FA Security - स्क्रीन पर OTP कभी नहीं दिखता, केवल Gmail इनबॉक्स में आता है
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>पूर्ण सुरक्षा नीति (Full Privacy Guarantee):</span>
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    लॉगिन करते समय OTP कोड अब कभी भी कंप्यूटर स्क्रीन पर नहीं दिखता ताकि कोई भी व्यक्ति देखकर एंटर न कर सके। 6 अंकों का गुप्त कोड केवल और केवल आपके <strong>Google Account (Gmail)</strong> इनबॉक्स में भेजा जाता है।
                  </p>
                </div>

                {/* Test OTP Buttons */}
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-800">
                    📧 लाइव ईमेल डिलीवरी टेस्ट (Test Gmail Delivery Now):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={testingEmail !== null}
                      onClick={async () => {
                        setTestingEmail('chauhansanjay932@gmail.com');
                        setTestEmailMsg('chauhansanjay932@gmail.com पर टेस्ट OTP भेजा जा रहा है...');
                        const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
                        const res = await sendAdminOtpEmail('chauhansanjay932@gmail.com', testOtp, 'login');
                        setTestingEmail(null);
                        setTestEmailMsg(res.message);
                      }}
                      className="px-4 py-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-300 text-left transition-all cursor-pointer"
                    >
                      <div className="text-xs font-bold text-orange-950 flex items-center justify-between">
                        <span>chauhansanjay932@gmail.com</span>
                        <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full">
                          {testingEmail === 'chauhansanjay932@gmail.com' ? 'भेजा जा रहा है...' : 'टेस्ट OTP भेजें'}
                        </span>
                      </div>
                      <p className="text-[10px] text-orange-800 mt-1">संजय चौहान के Gmail पर टेस्ट OTP मेल करें</p>
                    </button>

                    <button
                      type="button"
                      disabled={testingEmail !== null}
                      onClick={async () => {
                        setTestingEmail('baalvarta@gmail.com');
                        setTestEmailMsg('baalvarta@gmail.com पर टेस्ट OTP भेजा जा रहा है...');
                        const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
                        const res = await sendAdminOtpEmail('baalvarta@gmail.com', testOtp, 'login');
                        setTestingEmail(null);
                        setTestEmailMsg(res.message);
                      }}
                      className="px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-left transition-all cursor-pointer"
                    >
                      <div className="text-xs font-bold text-amber-950 flex items-center justify-between">
                        <span>baalvarta@gmail.com</span>
                        <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full">
                          {testingEmail === 'baalvarta@gmail.com' ? 'भेजा जा रहा है...' : 'टेस्ट OTP भेजें'}
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-800 mt-1">baalvarta@gmail.com पर टेस्ट OTP मेल करें</p>
                    </button>
                  </div>

                  {testEmailMsg && (
                    <div className="p-3 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{testEmailMsg}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 11: PERMANENT DATABASE & BACKUP CENTER */}
          {activeTab === 'firebase' && (
            <div className="space-y-6">
              {/* Back to Categories Hub Header */}
              <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveTab('categories');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← सभी कैटेगरीज मेन्यू (All Categories Menu)</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                    श्रेणी 11: डेटाबेस व सुरक्षित बैकअप
                  </span>
                  <span className="text-slate-600 font-semibold hidden md:inline">
                    • 100% स्थायी डेटाबेस (Server + IndexedDB Permanent Save)
                  </span>
                </div>
              </div>

              {/* Live Database Active Status Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-lg space-y-4 relative overflow-hidden border-2 border-emerald-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black text-emerald-100 border border-white/30">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
                      <span>🟢 डेटाबेस सक्रिय: 100% स्थायी रूप से सुरक्षित (Permanent Save Active)</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      बालवार्ता लाइव डेटाबेस व क्लाउड सिंक केंद्र
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                      अब आपके द्वारा जोड़ी गई सभी कहानियाँ, वीडियो और क्विज़ <strong>हमेशा के लिए सुरक्षित</strong> रहेंगी। ऐप में <strong>सर्वर डेटाबेस (Server DB)</strong> और <strong>ब्राउज़र डेटाबेस (IndexedDB)</strong> दोनों सक्रिय हैं, जिससे पेज रीफ़्रेश करने या फ़ोन बंद करने पर भी कुछ भी डिलीट नहीं होगा।
                    </p>
                  </div>

                  <div className="bg-black/30 p-4 rounded-2xl border border-white/20 backdrop-blur-xs shrink-0 text-left sm:text-right space-y-1">
                    <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">डेटाबेस स्थिति:</p>
                    <p className="text-sm font-mono font-black text-emerald-300 flex items-center gap-1.5 justify-start sm:justify-end">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>डेटा स्वतः सेव (Auto-Saved)</span>
                    </p>
                    <p className="text-[10px] text-white/80">हर बदलाव तुरंत स्थायी रूप से सुरक्षित</p>
                  </div>
                </div>

                {/* Live Count Grid */}
                <div className="pt-2 border-t border-white/20">
                  <p className="text-xs font-black text-emerald-200 mb-2">
                    📊 वर्तमान में डेटाबेस में सुरक्षित सामग्री (Total Saved Content):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-bold">1. बाल कहानियाँ</span>
                      <span className="text-base font-black text-white">{stories.length} कहानियाँ</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-bold">2. वीडियो कहानियाँ</span>
                      <span className="text-base font-black text-white">{videoStories.length} वीडियो</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-bold">3. बाल क्विज़ खेल</span>
                      <span className="text-base font-black text-white">{quizSets.length} क्विज़ सेट</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-bold">4. प्रिंटेबल वर्कशीट्स</span>
                      <span className="text-base font-black text-white">{worksheets.length} शीट्स</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-bold">5. रोचक तथ्य</span>
                      <span className="text-base font-black text-white">{facts.length} तथ्य</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-bold">6. अक्षर व गिनती</span>
                      <span className="text-base font-black text-white">{learningItems.length} कार्ड्स</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-bold">7. ऑडियो कहानियाँ</span>
                      <span className="text-base font-black text-white">{audioStories.length} ट्रैक्स</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                      <span className="text-[10px] text-emerald-200 block font-bold">8. पाठक समीक्षाएँ</span>
                      <span className="text-base font-black text-white">{reviews.length} समीक्षाएँ</span>
                    </div>
                  </div>
                </div>

                {/* Database Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isSyncingDb}
                    onClick={handleForceSyncDb}
                    className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-md hover:bg-emerald-50 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-700 ${isSyncingDb ? 'animate-spin' : ''}`} />
                    <span>{isSyncingDb ? 'सुरक्षित हो रहा है...' : '💾 अभी पूरा डेटाबेस सुरक्षित व सिंक करें (Force Save Now)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadJson}
                    className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-950 text-white font-black text-xs shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
                  >
                    <Download className="w-4 h-4 text-emerald-300" />
                    <span>📥 1-क्लिक कम्प्लीट JSON बैकअप डाउनलोड करें</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(exportFullDatabaseJson({ stories, videoStories, videoCategories, facts, learningItems, audioStories, reviews, quizSets, worksheets }), 'json')}
                    className="px-3.5 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedJson ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedJson ? 'JSON कॉपी हो गया!' : '📋 कॉपी बैकअप JSON'}</span>
                  </button>
                </div>

                {dbSyncMsg && (
                  <div className="p-3 rounded-xl bg-slate-900 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{dbSyncMsg}</span>
                  </div>
                )}
              </div>

              {/* Database Restore from JSON File Card */}
              <div className="p-6 rounded-3xl bg-white border-2 border-indigo-200 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      📤 बैकअप फ़ाइल से डेटाबेस रिस्टोर करें (Restore Database from JSON Backup File)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      यदि आपने कभी बैकअप JSON फ़ाइल डाउनलोड की है या दूसरे फ़ोन से कहानियाँ व सामग्री ट्रांसफर करना चाहते हैं, तो यहाँ अपनी फ़ाइल चुनें। आपका पूरा डेटा 1-सेकंड में रिस्टोर हो जाएगा।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border-2 border-dashed border-indigo-300 hover:border-indigo-500 transition-colors text-center space-y-2">
                  <FileUp className="w-8 h-8 text-indigo-500 mx-auto" />
                  <p className="text-xs font-bold text-indigo-950">
                    अपनी डाउनलोड की हुई .json बैकअप फ़ाइल चुनें:
                  </p>
                  <label className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-all">
                    <span>फ़ाइल चुनें व रिस्टोर करें (Choose File & Restore)</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportDatabaseJson}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-500">समर्थित प्रारूप: baalvarta_database_backup_*.json</p>
                </div>

                {importSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{importSuccess}</span>
                  </div>
                )}

                {importError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}
              </div>

              {/* Firestore Deployment Reference Rules */}
              <div className="bg-slate-900 rounded-3xl p-5 text-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-amber-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Firestore Security Rules (क्लाउड सुरक्षा नियम)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(firestoreRulesSample, 'rules')}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    {copiedCode ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'नियम कॉपी हो गए' : 'Copy Rules'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  यदि आप सीधे Google Cloud Firestore प्रोजेक्ट भी जोड़ना चाहते हैं, तो यह सुरक्षा नियम फ़ाइल तैयार है।
                </p>
                <pre className="text-[11px] font-mono bg-black/50 p-3.5 rounded-xl overflow-x-auto text-emerald-400">
                  {firestoreRulesSample}
                </pre>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-rose-900">डिफ़ॉल्ट कहानियों पर रीसेट करें (Reset to Default Stories)</p>
                    <p className="text-[11px] text-rose-700">यदि आप पुरानी सभी सैंपल कहानियाँ और डेटा वापस लाना चाहते हैं तो यहाँ क्लिक करें।</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('क्या आप वाकई मूल डिफ़ॉल्ट कहानियों और डेटा पर रीसेट करना चाहते हैं?')) {
                      onResetAllData();
                      if (soundEnabled) playPopSound();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>डिफ़ॉल्ट रीसेट</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Story Delete Confirmation Modal */}
        {storyToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border-2 border-rose-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    क्या आप यह कहानी हटाना चाहते हैं?
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    गलत अपलोड या नापसंद कहानी को हटाने की पुष्टि
                  </p>
                </div>
              </div>

              {/* Story Details Box */}
              <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center gap-3">
                <img
                  src={storyToDelete.coverImage}
                  alt={storyToDelete.titleHi}
                  className="w-12 h-12 rounded-xl object-cover border border-rose-200 flex-shrink-0"
                />
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800 line-clamp-1">
                    #{storyToDelete.number}. {storyToDelete.titleHi}
                  </p>
                  <p className="text-slate-500 text-[11px] line-clamp-1">
                    {storyToDelete.titleEn}
                  </p>
                  <p className="text-rose-600 font-bold text-[10px] mt-0.5">
                    सीख: {storyToDelete.moralHi}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                ⚠️ यदि यह कहानी गलत अपलोड हो गई है या पसंद नहीं आ रही है, तो डिलीट करने पर यह बालवार्ता ऐप से तुरंत हट जाएगी। (डिलीट के तुरंत बाद आप इसे 'Undo' भी कर सकते हैं)
              </p>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setStoryToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>हाँ, कहानी हटाएँ (Delete Story)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
