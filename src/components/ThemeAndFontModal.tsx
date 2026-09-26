import React from 'react';
import {
  Palette,
  Type,
  Sun,
  Moon,
  Check,
  X,
  Sparkles,
  Sliders,
  RotateCcw
} from 'lucide-react';
import {
  ThemeSettings,
  ThemeColor,
  AppFont,
  AppFontSize,
  DEFAULT_THEME_SETTINGS
} from '../utils/themeManager';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';

interface ThemeAndFontModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ThemeSettings;
  onUpdateSettings: (newSettings: ThemeSettings) => void;
  soundEnabled: boolean;
}

export const ThemeAndFontModal: React.FC<ThemeAndFontModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const colorThemes: Array<{
    id: ThemeColor;
    nameHi: string;
    nameEn: string;
    colorBg: string;
    ringColor: string;
    description: string;
  }> = [
    {
      id: 'amber',
      nameHi: 'सनशाइन ऑरेंज (डिफ़ॉल्ट)',
      nameEn: 'Sunshine Orange',
      colorBg: 'from-amber-400 to-orange-500',
      ringColor: 'ring-amber-500',
      description: 'ऊर्जावान और चंचल बच्चों की थीम',
    },
    {
      id: 'sky',
      nameHi: 'ओशन ब्लू (समुद्र नीला)',
      nameEn: 'Ocean Blue',
      colorBg: 'from-sky-400 to-blue-600',
      ringColor: 'ring-sky-500',
      description: 'शांत और ताज़ा आसमानी अहसास',
    },
    {
      id: 'emerald',
      nameHi: 'फ़ॉरेस्ट ग्रीन (प्रकृति हरा)',
      nameEn: 'Forest Green',
      colorBg: 'from-emerald-400 to-green-600',
      ringColor: 'ring-emerald-500',
      description: 'जंगल सफारी और पर्यावरण रंग',
    },
    {
      id: 'purple',
      nameHi: 'मैजिक पर्पल (जादुई बैंगनी)',
      nameEn: 'Magic Purple',
      colorBg: 'from-purple-400 to-indigo-600',
      ringColor: 'ring-purple-500',
      description: 'परियों की कहानियों जैसा जादुई रंग',
    },
    {
      id: 'rose',
      nameHi: 'कैंडी पिंक (गुलाबी)',
      nameEn: 'Candy Pink',
      colorBg: 'from-pink-400 to-rose-500',
      ringColor: 'ring-pink-500',
      description: 'चुलबुला और प्यारा रंग',
    },
    {
      id: 'night',
      nameHi: 'बेडटाइम डार्क (रात का समय)',
      nameEn: 'Bedtime Night',
      colorBg: 'from-slate-700 to-slate-900',
      ringColor: 'ring-slate-400',
      description: 'रात में कहानी पढ़ते समय आँखों के लिए सुरक्षित',
    },
  ];

  const fontOptions: Array<{
    id: AppFont;
    name: string;
    preview: string;
    fontFamilyClass: string;
    tag: string;
  }> = [
    {
      id: 'baloo',
      name: 'Baloo 2 (बालू)',
      preview: 'एक बार की बात है, जंगल में एक नन्हा शेर रहता था।',
      fontFamilyClass: 'font-baloo',
      tag: 'बच्चों का पसंदीदा गोल-मटोल',
    },
    {
      id: 'rozha',
      name: 'Rozha One (रोज़ा)',
      preview: 'एक बार की बात है, जंगल में एक नन्हा शेर रहता था।',
      fontFamilyClass: 'font-rozha',
      tag: 'पारंपरिक व सुरुचिपूर्ण देवनागरी',
    },
    {
      id: 'mukta',
      name: 'Mukta (मुक्ता)',
      preview: 'एक बार की बात है, जंगल में एक नन्हा शेर रहता था।',
      fontFamilyClass: 'font-mukta',
      tag: 'साफ़, आधुनिक व स्पष्ट पठनीय',
    },
    {
      id: 'quicksand',
      name: 'Quicksand (क्विकसैंड)',
      preview: 'Once upon a time in a magic forest...',
      fontFamilyClass: 'font-quicksand',
      tag: 'सुंदर व सरल स्टाइल',
    },
  ];

  const handleColorChange = (color: ThemeColor) => {
    if (soundEnabled) playPopSound();
    onUpdateSettings({ ...settings, color });
  };

  const handleFontChange = (font: AppFont) => {
    if (soundEnabled) playPopSound();
    onUpdateSettings({ ...settings, font });
  };

  const handleFontSizeChange = (fontSize: AppFontSize) => {
    if (soundEnabled) playPopSound();
    onUpdateSettings({ ...settings, fontSize });
  };

  const handleResetDefaults = () => {
    if (soundEnabled) playSuccessSound();
    onUpdateSettings(DEFAULT_THEME_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-amber-300 max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 font-kids">
                रंग व फ़ॉन्ट सेटिंग्स (Theme & Font)
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                अपनी पसंद के अनुसार वेबसाइट का रूप और फ़ॉन्ट बदलें
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Color Themes */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1. मनपसंद रंग थीम (Choose Color Theme)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {colorThemes.map((ct) => {
              const isSelected = settings.color === ct.id;
              return (
                <button
                  key={ct.id}
                  onClick={() => handleColorChange(ct.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-amber-50/50 shadow-sm scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${ct.colorBg} shadow-xs border border-white flex items-center justify-center text-white text-xs`}>
                      {ct.id === 'night' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-black text-xs text-slate-900 block leading-tight">
                      {ct.nameHi}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5 line-clamp-1">
                      {ct.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Font Style */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-500" />
            <span>2. कहानी फ़ॉन्ट शैली (Font Style for Kids)</span>
          </label>
          <div className="space-y-2">
            {fontOptions.map((f) => {
              const isSelected = settings.font === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => handleFontChange(f.id)}
                  className={`w-full p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{f.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {f.tag}
                      </span>
                    </div>
                    <p className={`text-xs text-slate-600 ${f.fontFamilyClass}`}>
                      {f.preview}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Text Size */}
        <div className="space-y-2.5">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>3. अक्षरों का आकार (Story Text Size)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal' as AppFontSize, label: 'सामान्य (Normal)', scale: 'A' },
              { id: 'large' as AppFontSize, label: 'बड़ा (Large)', scale: 'A+' },
              { id: 'huge' as AppFontSize, label: 'बहुत बड़ा (Extra Large)', scale: 'A++' },
            ].map((s) => {
              const isSelected = settings.fontSize === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleFontSizeChange(s.id)}
                  className={`py-2.5 px-3 rounded-xl border-2 font-black text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-base font-black">{s.scale}</span>
                  <span className="text-[10px]">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleResetDefaults}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>डिफ़ॉल्ट सेटिंग्स रीसेट करें</span>
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playSuccessSound();
              onClose();
            }}
            className="py-2.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            हो गया (Save & Close)
          </button>
        </div>

      </div>
    </div>
  );
};
