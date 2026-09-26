import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileText,
  Sparkles,
  Palette,
  Edit3,
  Puzzle,
  CheckCircle,
  Eye,
  X,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrintableWorksheet, Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { AdBannerSlot } from './AdBannerSlot';

interface PrintableWorksheetsHubProps {
  worksheets?: PrintableWorksheet[];
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
}

const DEFAULT_WORKSHEETS: PrintableWorksheet[] = [
  {
    id: 'ws-swar',
    titleHi: 'हिंदी वर्णमाला (स्वर: अ से अः) ट्रेसिंग व अभ्यास शीट',
    titleEn: 'Hindi Swar Tracing & Writing Practice Sheet',
    category: 'tracing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    printUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80',
    ageGroup: '3-6 वर्ष',
    descriptionHi: 'नन्हे बच्चों के लिए पेंसिल पकड़ने और सुंदर लिखावट अभ्यास के लिए बड़े अक्षरों में सचित्र ट्रेसिंग शीट।',
    descriptionEn: 'Illustrated large letter tracing sheet for beginners to practice Hindi Swar with neat handwriting.',
  },
  {
    id: 'ws-vyanjan',
    titleHi: 'हिंदी व्यंजन (क से ज्ञ) लिखावट व चित्र पहचान पत्र',
    titleEn: 'Hindi Vyanjan (Ka to Gya) Identification & Writing',
    category: 'tracing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    printUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
    ageGroup: '4-8 वर्ष',
    descriptionHi: 'कबूतर, खरगोश आदि चित्रों के साथ व्यंजन पहचान और दोहराने का संपूर्ण वर्णमाला अभ्यास चार्ट।',
    descriptionEn: 'Comprehensive Hindi consonants practice chart with friendly animal associations.',
  },
  {
    id: 'ws-lion-mouse',
    titleHi: 'पंचतंत्र "शेर और दयालु चूहा" बाल कलरिंग शीट',
    titleEn: 'Panchatantra Lion & Mouse Story Coloring Sheet',
    category: 'coloring',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format&fit=crop&q=80',
    printUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&auto=format&fit=crop&q=80',
    ageGroup: '3-10 वर्ष',
    descriptionHi: 'कहानी के मुख्य दृश्य का सुंदर आउटलाइन स्केच, जिसमें बच्चे मोम के रंग (Crayons) भर सकते हैं।',
    descriptionEn: 'High quality outline coloring sketch of the brave lion and helpful mouse.',
  },
  {
    id: 'ws-numbers',
    titleHi: '1 से 20 तक गिनती, चित्र मिलान व भूलभुलैया (Maze)',
    titleEn: 'Numbers 1 to 20 Counting & Maze Puzzle Fun',
    category: 'puzzle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    printUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&auto=format&fit=crop&q=80',
    ageGroup: '4-7 वर्ष',
    descriptionHi: 'तारे, सेब और तितलियों की गिनती करके सही संख्या से मिलान करने वाली मनोरंजक गणित पहेली।',
    descriptionEn: 'Fun counting maze with apples, stars, and butterflies for early math development.',
  },
  {
    id: 'ws-habits',
    titleHi: 'दैनिक अच्छी आदतें, संस्कार व नैतिक आचरण चार्ट',
    titleEn: 'Daily Good Habits & Moral Manners Tracker Chart',
    category: 'craft',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
    printUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80',
    ageGroup: 'All Ages',
    descriptionHi: 'सुबह समय पर उठना, बड़ों का आदर, हाथ धोना व पढ़ाई का साप्ताहिक स्टार ट्रैकिंग चार्ट।',
    descriptionEn: 'Weekly star habit tracker chart for kids: waking early, respect elders, reading daily.',
  },
  {
    id: 'ws-peacock',
    titleHi: 'हमारा राष्ट्रीय पक्षी "सुंदर मोर" रंग भरो व सीखो',
    titleEn: 'National Bird Peacock Coloring & Information Sheet',
    category: 'coloring',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=600&auto=format&fit=crop&q=80',
    printUrl: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=1200&auto=format&fit=crop&q=80',
    ageGroup: '4-9 वर्ष',
    descriptionHi: 'मोर के पंखों में नीले, हरे और सुनहरे रंग भरने के लिए विशेष आउटलाइन आर्ट शीट।',
    descriptionEn: 'Detailed outline art to fill vibrant blue and emerald green hues in dancing peacock.',
  },
];

export const PrintableWorksheetsHub: React.FC<PrintableWorksheetsHubProps> = ({
  worksheets = DEFAULT_WORKSHEETS,
  language,
  soundEnabled,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePreviewSheet, setActivePreviewSheet] = useState<PrintableWorksheet | null>(null);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const isHi = language === 'hi';
  const list = worksheets.length > 0 ? worksheets : DEFAULT_WORKSHEETS;

  const categories = [
    { id: 'all', labelHi: 'सभी शीट्स (All)', labelEn: 'All Sheets', icon: FileText },
    { id: 'tracing', labelHi: 'अक्षर ट्रेसिंग (Tracing)', labelEn: 'Letter Tracing', icon: Edit3 },
    { id: 'coloring', labelHi: 'कलरिंग शीट्स (Coloring)', labelEn: 'Coloring Sheets', icon: Palette },
    { id: 'puzzle', labelHi: 'मज़ेदार पहेलियाँ (Puzzles)', labelEn: 'Puzzles & Mazes', icon: Puzzle },
    { id: 'craft', labelHi: 'संस्कार व अच्छी आदतें', labelEn: 'Good Habits & Craft', icon: Sparkles },
  ];

  const filtered = selectedCategory === 'all'
    ? list
    : list.filter((w) => w.category === selectedCategory);

  const handlePrintSheet = (sheet: PrintableWorksheet) => {
    if (soundEnabled) playPopSound();
    setActivePreviewSheet(sheet);
    // Allow state to render then print
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownloadSheet = (sheet: PrintableWorksheet) => {
    if (soundEnabled) playSuccessSound();

    // Generate high-resolution printable sheet on canvas and download
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White page background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 1600);

    // Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, 1120, 1520);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 1090, 1490);

    // Header Branding
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px "Baloo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📖 बालवार्ता (Baalvarta) - निःशुल्क बाल अभ्यास वर्कशीट', 600, 120);

    // Sheet Title
    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 32px "Baloo 2", sans-serif';
    ctx.fillText(isHi ? sheet.titleHi : sheet.titleEn, 600, 175);

    ctx.fillStyle = '#64748b';
    ctx.font = '20px "Baloo 2", sans-serif';
    ctx.fillText(`विद्यार्थी का नाम: _______________________      दिनांक: ______________      आयु: ${sheet.ageGroup}`, 600, 225);

    // Underline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 250);
    ctx.lineTo(1120, 250);
    ctx.stroke();

    // Draw placeholder illustration area / activity boxes
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(100, 280, 1000, 1150);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 280, 1000, 1150);

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 28px "Baloo 2", sans-serif';
    ctx.fillText(isHi ? sheet.descriptionHi : sheet.descriptionEn, 600, 340);

    // Fun Tracing or Activity Guideline lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    for (let y = 420; y <= 1350; y += 80) {
      ctx.beginPath();
      ctx.moveTo(140, y);
      ctx.lineTo(1060, y);
      ctx.stroke();
    }

    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px "Baloo 2", sans-serif';
    ctx.fillText('बालवार्ता • 100% निःशुल्क व सुरक्षित भारतीय बाल पोर्टल • www.baalvarta.com', 600, 1500);

    // Download trigger
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `Baalvarta-Worksheet-${sheet.id}.png`;
    a.href = dataUrl;
    a.click();

    setDownloadSuccessMsg(isHi ? 'वर्कशीट डाउनलोड हो गई! 📥' : 'Worksheet downloaded!');
    confetti({ particleCount: 50, spread: 70 });
    setTimeout(() => setDownloadSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12 font-kids">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-2">
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>{isHi ? 'स्क्रीन-फ़्री पढ़ाई व कला अभ्यास' : 'Screen-Free Printable Worksheets'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isHi ? '🖨️ प्रिंटेबल वर्कशीट व कलरिंग शीट्स' : '🖨️ Printable Worksheets & Coloring'}
          </h1>
          <p className="text-white/95 text-xs sm:text-sm font-bold mt-1">
            {isHi
              ? 'वर्णमाला ट्रेसिंग, पंचतंत्र कहानियों के पात्रों में रंग भरने और मज़ेदार पहेलियों की उच्च-गुणवत्ता वाली PDF/प्रिंट शीट्स 1-क्लिक में डाउनलोड करें।'
              : 'Download free printable handwriting tracing sheets, story coloring activities, and daily habit charts for kids!'}
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (soundEnabled) playPopSound();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 border-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{isHi ? cat.labelHi : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Ad Space Banner */}
      <AdBannerSlot format="leaderboard" slotId="worksheets-hub-top" />

      {/* Toast Notification */}
      {downloadSuccessMsg && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-md animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Worksheets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ws) => (
          <div
            key={ws.id}
            className="bg-white rounded-3xl border-2 border-amber-200 hover:border-emerald-400 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={ws.thumbnailUrl}
                  alt={ws.titleHi}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/95 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {ws.ageGroup}
                </span>
                <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  मुफ्त PDF
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-1.5">
                <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {isHi ? ws.titleHi : ws.titleEn}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                  {isHi ? ws.descriptionHi : ws.descriptionEn}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownloadSheet(ws)}
                className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>{isHi ? 'डाउनलोड' : 'Download'}</span>
              </button>

              <button
                onClick={() => handlePrintSheet(ws)}
                className="py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
