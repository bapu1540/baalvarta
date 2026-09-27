import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Shapes,
  Hash,
  Languages,
  Footprints,
  Bird,
  BookOpen,
} from 'lucide-react';
import { LearningItem, Language } from '../types';
import { playPopSound, speakText, stopSpeech } from '../utils/soundEffects';
import { INITIAL_LEARNING_ITEMS } from '../data/initialData';

interface EarlyLearningZoneProps {
  items: LearningItem[];
  language: Language;
  soundEnabled: boolean;
  onNavigateTab?: (tab: any) => void;
}

export const EarlyLearningZone: React.FC<EarlyLearningZoneProps> = ({
  items,
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';

  const [activeModule, setActiveModule] = useState<
    'alphabet' | 'numbers' | 'colors_shapes' | 'animals' | 'birds' | 'vocabulary' | 'custom'
  >('alphabet');

  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);

  // Subcategory Modules
  const modules = [
    { id: 'alphabet', labelHi: '🔤 ABC (अक्षर)', labelEn: '🔤 ABC Alphabet', icon: Languages, tag: 'ABC' },
    { id: 'numbers', labelHi: '🔢 COUNTING number (गिनती)', labelEn: '🔢 COUNTING Number', icon: Hash, tag: 'COUNTING' },
    { id: 'colors_shapes', labelHi: '🎨 Colour & Shape (रंग व आकार)', labelEn: '🎨 Colour & Shape', icon: Shapes, tag: 'COLOR' },
    { id: 'animals', labelHi: '🦁 Animal (पशु)', labelEn: '🦁 Animal', icon: Footprints, tag: 'ANIMAL' },
    { id: 'birds', labelHi: '🦜 Birds (पक्षी)', labelEn: '🦜 Birds', icon: Bird, tag: 'BIRDS' },
    { id: 'vocabulary', labelHi: '📖 Vocabulary (शब्दकोश)', labelEn: '📖 Vocabulary', icon: BookOpen, tag: 'VOCAB' },
    { id: 'custom', labelHi: '✨ Custom (कस्टम कार्ड्स)', labelEn: '✨ Custom Cards', icon: Sparkles, tag: 'CUSTOM' },
  ];

  // Combine initial items + prop items
  const baseItems = items.length > 0 ? items : INITIAL_LEARNING_ITEMS;

  // Filter items by current subcategory module
  const currentModuleItems = baseItems.filter((item) => item.module === activeModule);

  // Handle Card Speech & Audio Play
  const handlePlayVoice = (item: LearningItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (soundEnabled) playPopSound();

    const voicePhrase = item.pronunciation || `${item.symbol} for ${item.name}`;
    speakText(voicePhrase, 'en', 0.85);
  };

  const handleCardClick = (item: LearningItem) => {
    if (soundEnabled) playPopSound();
    setSelectedItem(item);
    handlePlayVoice(item);
  };

  return (
    <div className="space-y-6 pb-12 font-kids">
      {/* Flashcards and Interactive Modules */}
      <div className="space-y-4">
        {/* Sleek Category Top Header - Clean and Uncluttered */}
        <div className="flex items-center justify-between gap-3 bg-white rounded-2xl p-2.5 sm:p-3 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg sm:text-xl shadow-xs shrink-0">
              🔤
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {isHi ? '2. सीखें (Early Learning Zone)' : '2. Early Learning Zone'}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
              {isHi ? `${currentModuleItems.length} कार्ड्स` : `${currentModuleItems.length} Cards`}
            </span>
          </div>
        </div>

        {/* Sub-Category Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setActiveModule(m.id as any);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md scale-[1.01] border-2 border-emerald-700'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isHi ? m.labelHi : m.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Flashcard Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {currentModuleItems.map((item) => {
            const speakPhrase = item.pronunciation || `${item.symbol} for ${item.name}`;
            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-400 p-3 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden"
              >
                {/* LEFT SIDE: Large Symbol / Letter */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-black text-2xl sm:text-4xl shadow-sm shrink-0 ${item.color || 'bg-emerald-600 text-white'}`}>
                  {item.symbol}
                </div>

                {/* RIGHT SIDE: Photo/Image + Name + Voice Button */}
                <div className="flex-1 min-w-0 flex items-center gap-2 justify-between">
                  <div className="min-w-0 pr-1">
                    <h3 className="font-black text-sm sm:text-base text-slate-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-bold text-emerald-600 truncate mt-0.5">
                      {speakPhrase}
                    </p>
                  </div>

                  {/* Image / Photo Thumbnail */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{item.imageOrEmoji}</span>
                    )}
                  </div>
                </div>

                {/* Clean Voice Action Button Only */}
                <div className="absolute bottom-2 right-2 flex items-center">
                  <button
                    type="button"
                    onClick={(e) => handlePlayVoice(item, e)}
                    title={`Play Voice: ${speakPhrase}`}
                    className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-4 border-emerald-300 relative flex flex-col font-sans">
            <button
              onClick={() => {
                setSelectedItem(null);
                stopSpeech();
              }}
              className="absolute top-4 right-4 z-10 bg-black/10 hover:bg-black/20 text-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center font-black text-5xl shadow-md shrink-0 ${selectedItem.color || 'bg-emerald-600 text-white'}`}>
                  {selectedItem.symbol}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">{selectedItem.name}</h2>
                  <p className="text-sm font-bold text-emerald-600">
                    {selectedItem.pronunciation || `${selectedItem.symbol} for ${selectedItem.name}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => handlePlayVoice(selectedItem)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer inline-flex mt-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isHi ? 'आवाज़ सुनें (Play Voice)' : 'Play Voice Sound'}</span>
                  </button>
                </div>
              </div>

              {/* Large Image Preview */}
              <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-7xl shadow-inner relative">
                {selectedItem.imageUrl ? (
                  <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{selectedItem.imageOrEmoji}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
