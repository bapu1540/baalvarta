import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  Volume2,
  CheckCircle2,
  Clock,
  Layers,
  Printer,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Star
} from 'lucide-react';
import { ORIGAMI_CRAFT_ITEMS, OrigamiCraftItem } from '../data/origamiCraftData';
import { Language } from '../types';
import { speakText, stopSpeech, playPopSound, playSuccessSound } from '../utils/soundEffects';

interface KidsOrigamiCraftSectionProps {
  language: Language;
  soundEnabled: boolean;
}

export const KidsOrigamiCraftSection: React.FC<KidsOrigamiCraftSectionProps> = ({
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [selectedCraftId, setSelectedCraftId] = useState<string>(ORIGAMI_CRAFT_ITEMS[0].id);
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);

  const selectedCraft: OrigamiCraftItem =
    ORIGAMI_CRAFT_ITEMS.find((c) => c.id === selectedCraftId) || ORIGAMI_CRAFT_ITEMS[0];

  const handleSpeakStep = (stepNumber: number, text: string) => {
    if (speakingStep === stepNumber) {
      stopSpeech();
      setSpeakingStep(null);
      return;
    }

    if (soundEnabled) playPopSound();
    stopSpeech();
    setSpeakingStep(stepNumber);

    speakText(
      text,
      isHi ? 'hi' : 'en',
      0.9,
      () => setSpeakingStep(stepNumber),
      () => setSpeakingStep(null),
      () => setSpeakingStep(null)
    );
  };

  const handlePrintCraft = () => {
    if (soundEnabled) playSuccessSound();
    window.print();
  };

  return (
    <div className="space-y-4 font-sans pb-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30 shrink-0">
            ✂️
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-amber-100 text-[10px] font-black mb-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>{isHi ? 'कागज़ की कला व ओरिगेमी' : 'Paper Craft & Origami Fun'}</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white">
              {isHi ? '✂️ बनाओ कागज़ के आसान खिलौने व मॉडल्स' : '✂️ Create Easy DIY Paper Toys & Origami'}
            </h2>
            <p className="text-xs text-rose-100">
              {isHi
                ? 'स्टेप-बाय-स्टेप चित्रों और आवाज़ के साथ खुद बनाएं नाव, प्लेन, मेंढक और बहुत कुछ!'
                : 'Follow simple step-by-step visual folding guides with audio instructions!'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrintCraft}
          className="px-4 py-2 rounded-xl bg-white text-rose-950 font-black text-xs shadow-md hover:bg-rose-50 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-rose-600" />
          <span>{isHi ? 'क्राफ्ट गाइड प्रिंट करें' : 'Print Craft Guide'}</span>
        </button>
      </div>

      {/* 2. Craft Selector Cards Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
          <span className="flex items-center gap-1">
            <span>🎨</span>
            <span>{isHi ? 'अपना मनपसंद क्राफ्ट चुनें (Select Any Craft):' : 'Select Craft:'}</span>
          </span>
          <span className="text-[11px] text-slate-500">{ORIGAMI_CRAFT_ITEMS.length} {isHi ? 'क्राफ्ट्स उपलब्ध' : 'crafts'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {ORIGAMI_CRAFT_ITEMS.map((craft) => {
            const isSelected = selectedCraft.id === craft.id;
            return (
              <button
                key={craft.id}
                type="button"
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setSelectedCraftId(craft.id);
                  stopSpeech();
                  setSpeakingStep(null);
                }}
                className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center space-y-1 group ${
                  isSelected
                    ? 'bg-gradient-to-br ' + craft.gradient + ' text-white border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 shadow-2xs'
                }`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {craft.emoji}
                </span>
                <span className="font-black text-xs sm:text-sm line-clamp-1">
                  {isHi ? craft.titleHi : craft.titleEn}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ⏱️ {craft.timeMinutes} {isHi ? 'मिनट' : 'mins'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Step-by-Step View of Selected Craft */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-900 shadow-md space-y-5">
        
        {/* Top Details Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 rounded-2xl bg-amber-100/80 border border-amber-200 shadow-2xs">
              {selectedCraft.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                  {isHi ? selectedCraft.categoryLabelHi : selectedCraft.categoryLabelEn}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  ⚡ {selectedCraft.difficulty}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                {isHi ? selectedCraft.titleHi : selectedCraft.titleEn}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {isHi ? selectedCraft.descriptionHi : selectedCraft.descriptionEn}
              </p>
            </div>
          </div>

          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-left text-xs text-slate-800 shrink-0 w-full sm:w-auto">
            <span className="font-black text-amber-900 block text-[11px] mb-0.5">
              📦 {isHi ? 'ज़रूरी सामग्री (Materials Needed):' : 'Materials Needed:'}
            </span>
            <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
              {(isHi ? selectedCraft.materialsHi : selectedCraft.materialsEn).map((mat, idx) => (
                <li key={idx}>{mat}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fun Tip */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-xs font-bold text-amber-950 flex items-center gap-2">
          <span>{isHi ? selectedCraft.funTipHi : selectedCraft.funTipEn}</span>
        </div>

        {/* Steps Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>📋</span>
            <span>{isHi ? 'बनाने के आसान चरण (Step-by-Step Instructions):' : 'Step-by-Step Instructions:'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedCraft.steps.map((step) => {
              const isPlaying = speakingStep === step.stepNumber;
              const stepSpeechText = isHi
                ? `चरण ${step.stepNumber}: ${step.titleHi}। ${step.instructionHi}`
                : `Step ${step.stepNumber}: ${step.titleEn}. ${step.instructionEn}`;

              return (
                <div
                  key={step.stepNumber}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-rose-300 transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-black text-[11px] flex items-center gap-1">
                        <span>चरण {step.stepNumber}</span>
                      </span>
                      <span className="text-2xl group-hover:scale-125 transition-transform">
                        {step.icon}
                      </span>
                    </div>

                    <h5 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                      {isHi ? step.titleHi : step.titleEn}
                    </h5>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {isHi ? step.instructionHi : step.instructionEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSpeakStep(step.stepNumber, stepSpeechText)}
                      className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlaying ? (isHi ? 'बोल रहा है...' : 'Playing...') : (isHi ? 'सुनें 🔊' : 'Listen 🔊')}</span>
                    </button>

                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{isHi ? 'आसान चरण' : 'Easy step'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
