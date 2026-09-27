import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Trophy,
  Shapes,
  Hash,
  Languages,
  Footprints,
  Play,
  FileText,
  Gamepad2,
  BookOpen,
  Printer,
  Brain,
  Palette
} from 'lucide-react';
import { LearningItem, Language, QuizSet, PrintableWorksheet } from '../types';
import { playPopSound, speakText, stopSpeech } from '../utils/soundEffects';
import { KidsQuizHub } from './KidsQuizHub';
import { PrintableWorksheetsHub } from './PrintableWorksheetsHub';
import { getStoredQuizSets, getStoredWorksheets } from '../utils/storage';
import { INITIAL_LEARNING_ITEMS } from '../data/initialData';

interface EarlyLearningZoneProps {
  items: LearningItem[];
  language: Language;
  soundEnabled: boolean;
}

export const EarlyLearningZone: React.FC<EarlyLearningZoneProps> = ({
  items,
  language,
  soundEnabled,
}) => {
  const [learningMode, setLearningMode] = useState<'flashcards' | 'quiz' | 'printables'>('flashcards');
  const [activeModule, setActiveModule] = useState<'alphabet' | 'numbers' | 'colors_shapes' | 'animals' | 'gk' | 'vocabulary' | 'custom'>('alphabet');
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'video' | 'audio' | 'game' | 'pdf'>('info');

  const [quizSets] = useState<QuizSet[]>(() => getStoredQuizSets());
  const [worksheets] = useState<PrintableWorksheet[]>(() => getStoredWorksheets());

  const isHi = language === 'hi';

  const mainTabs = [
    {
      id: 'flashcards' as const,
      labelHi: '🔤 बुनियादी शिक्षा (Flashcards)',
      labelEn: '🔤 Basic Learning',
      icon: Languages,
      color: 'bg-emerald-500 text-white',
    },
    {
      id: 'quiz' as const,
      labelHi: '🎯 5-प्रश्न बाल क्विज़ (Quiz Zone)',
      labelEn: '🎯 5-Q Kids Quiz',
      icon: Trophy,
      color: 'bg-amber-500 text-white',
    },
    {
      id: 'printables' as const,
      labelHi: '🖨️ वर्कशीट व कलरिंग (Printables)',
      labelEn: '🖨️ Printable Worksheets',
      icon: Printer,
      color: 'bg-cyan-600 text-white',
    },
  ];

  const modules = [
    { id: 'alphabet', label: isHi ? 'अंग्रेजी ABC' : 'English ABCs', icon: Languages, tag: 'A-B-C' },
    { id: 'numbers', label: isHi ? 'गिनती 1-10' : 'Counting Numbers', icon: Hash, tag: '1-2-3' },
    { id: 'colors_shapes', label: isHi ? 'रंग और आकार' : 'Colors & Shapes', icon: Shapes, tag: '🎨' },
    { id: 'animals', label: isHi ? 'पशु और पक्षी' : 'Animals & Birds', icon: Footprints, tag: '🦁' },
    { id: 'vocabulary', label: isHi ? 'सरल शब्दकोश' : 'Vocabulary', icon: BookOpen, tag: '📖' },
    { id: 'custom', label: isHi ? 'कस्टम' : 'Custom', icon: Sparkles, tag: '✨' },
  ];

  const allAvailableItems = items.length > 0 ? items : INITIAL_LEARNING_ITEMS;
  const filteredItems = allAvailableItems.filter((item) => item.module === activeModule);
  const displayItems = filteredItems.length > 0 ? filteredItems : INITIAL_LEARNING_ITEMS.filter((item) => item.module === activeModule);

  const handleCardClick = (item: LearningItem) => {
    if (soundEnabled) playPopSound();
    setSelectedItem(item);
    setActiveModalTab('info');

    const speakWord = `${item.symbol}. ${item.name}. ${item.words ? item.words.join(', ') : ''}`;
    speakText(speakWord, 'en', 0.9);
  };

  return (
    <div className="space-y-6">
      {/* 3 Main Mode Switchers */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-3 border border-slate-200 shadow-sm flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
        {mainTabs.map((tab) => {
          const isActive = learningMode === tab.id;
          return (
            <button
              key={tab.id}
              id={`learning-tab-${tab.id}`}
              onClick={() => {
                if (soundEnabled) playPopSound();
                setLearningMode(tab.id);
              }}
              className={`flex-1 min-w-[120px] sm:min-w-[160px] py-2.5 sm:py-3.5 px-3 sm:px-5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 ${
                isActive
                  ? `${tab.color} shadow-md scale-[1.01] ring-2 ring-amber-300`
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="text-center">{isHi ? tab.labelHi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: Quiz Zone (5 Questions - 4 Options - Explanation) */}
      {learningMode === 'quiz' && (
        <KidsQuizHub
          quizSets={quizSets}
          language={language}
          soundEnabled={soundEnabled}
        />
      )}

      {/* VIEW 2: Printable Worksheets & Coloring Sheets */}
      {learningMode === 'printables' && (
        <PrintableWorksheetsHub
          worksheets={worksheets}
          language={language}
          soundEnabled={soundEnabled}
        />
      )}

      {/* VIEW 3: Flashcards and Interactive Modules */}
      {learningMode === 'flashcards' && (
        <div className="space-y-4">
          {/* Sleek Category Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-3.5 sm:p-4 border border-emerald-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                🔤
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {isHi ? '2. सीखें (Early Learning)' : '2. Early Learning Zone'}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {isHi
                    ? 'अंग्रेजी ABC, गिनती, रंग-आकार और प्रारंभिक शब्दावली'
                    : 'English ABCs, numbers, shapes, colors & vocabulary'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-black">
                {isHi ? `${displayItems.length} कार्ड उपलब्ध` : `${displayItems.length} Cards`}
              </span>
            </div>
          </div>

          {/* Module Selector Buttons (Sub-Menus) */}
          <div className="flex flex-wrap gap-2">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              const isGK = m.id === 'gk';
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActiveModule(m.id as any);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? isGK
                        ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300'
                        : 'bg-emerald-600 text-white shadow-md'
                      : isGK
                        ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 font-extrabold'
                        : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-2xl p-4 border-2 border-slate-100 hover:border-emerald-400 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group hover:-translate-y-1"
              >
                <div className="text-5xl sm:text-6xl mb-3 group-hover:scale-110 transition-transform">
                  {item.imageOrEmoji}
                </div>
                <div className="text-2xl font-black text-slate-800 mb-0.5">
                  {item.symbol}
                </div>
                <div className="text-xs font-bold text-emerald-700">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {item.pronunciation}
                </div>

                <div className="mt-3 w-8 h-8 rounded-full bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white text-emerald-600 flex items-center justify-center transition-colors">
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Item Modal Popup */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-4 border-emerald-300 relative flex flex-col">
            <button
              onClick={() => {
                setSelectedItem(null);
                stopSpeech();
              }}
              className="absolute top-4 right-4 z-10 bg-black/5 hover:bg-black/10 text-slate-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-50 border-b overflow-x-auto no-scrollbar pt-14 sm:pt-4 sm:pr-14">
              <button
                onClick={() => setActiveModalTab('info')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  activeModalTab === 'info' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Learn
              </button>
              {selectedItem.videoUrl && (
                <button
                  onClick={() => setActiveModalTab('video')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    activeModalTab === 'video' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" /> Video
                </button>
              )}
              {selectedItem.audioUrl && (
                <button
                  onClick={() => setActiveModalTab('audio')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    activeModalTab === 'audio' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" /> Audio
                </button>
              )}
              {selectedItem.gameUrl && (
                <button
                  onClick={() => setActiveModalTab('game')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    activeModalTab === 'game' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" /> Game
                </button>
              )}
              {selectedItem.pdfUrl && (
                <button
                  onClick={() => setActiveModalTab('pdf')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                    activeModalTab === 'pdf' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Book
                </button>
              )}
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {activeModalTab === 'info' && (
                <div className="text-center space-y-6">
                  {selectedItem.imageUrl ? (
                    <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-48 h-48 mx-auto rounded-3xl object-cover shadow-sm" />
                  ) : (
                    <div className="w-32 h-32 mx-auto rounded-3xl bg-amber-50 flex items-center justify-center text-7xl shadow-inner border-4 border-white">
                      {selectedItem.imageOrEmoji}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-4xl font-black text-slate-900">{selectedItem.symbol}</div>
                    <h3 className="text-2xl font-extrabold text-emerald-700">
                      {selectedItem.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{selectedItem.pronunciation}</p>
                  </div>

                  {selectedItem.words && selectedItem.words.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {selectedItem.words.map((word, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-sm">
                          {word}
                        </span>
                      ))}
                    </div>
                  )}

                  {selectedItem.story && (
                    <div className="p-4 rounded-2xl bg-blue-100 border border-blue-200 text-sm font-medium text-slate-700 leading-relaxed text-left shadow-inner">
                      <BookOpen className="w-4 h-4 text-blue-500 mb-2" />
                      {selectedItem.story}
                    </div>
                  )}

                  <div className="pt-4 max-w-xs mx-auto">
                    <button
                      onClick={() => handleCardClick(selectedItem)}
                      className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>{isHi ? 'पुनः सुनें' : 'Listen Again'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeModalTab === 'video' && selectedItem.videoUrl && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                  <iframe
                    src={selectedItem.videoUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {activeModalTab === 'audio' && selectedItem.audioUrl && (
                <div className="flex flex-col items-center justify-center p-8 bg-purple-100 rounded-2xl border border-purple-200 h-full min-h-[250px] shadow-inner">
                  <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-6 animate-pulse">
                    <Volume2 className="w-10 h-10 text-purple-600" />
                  </div>
                  <audio controls autoPlay className="w-full max-w-sm rounded-xl" src={selectedItem.audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {activeModalTab === 'game' && selectedItem.gameUrl && (
                <div className="w-full h-[60vh] min-h-[400px] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <iframe
                    src={selectedItem.gameUrl}
                    className="w-full h-full border-0"
                    title="Mini Game"
                  />
                </div>
              )}

              {activeModalTab === 'pdf' && selectedItem.pdfUrl && (
                <div className="w-full h-[60vh] min-h-[400px] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <iframe
                    src={selectedItem.pdfUrl}
                    className="w-full h-full border-0"
                    title="PDF Viewer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

