import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Download,
  BookOpen,
  Clock,
  Heart,
  Sparkles,
  HelpCircle,
  FileText,
  Smile,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';

interface ParentGuidePageProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
}

export const ParentGuidePage: React.FC<ParentGuidePageProps> = ({
  language,
  soundEnabled,
  onBackToHome,
}) => {
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);

  const worksheets = [
    {
      id: 'ws-1',
      titleHi: 'हिंदी वर्णमाला (स्वर व व्यंजन) अभ्यास पत्र',
      titleEn: 'Hindi Varnamala Tracing & Writing Worksheet',
      pages: '4 पृष्ठ',
      age: '3-6 वर्ष',
      type: 'PDF',
      color: 'bg-emerald-500',
    },
    {
      id: 'ws-2',
      titleHi: 'पंचतंत्र "शेर और चूहा" रंग भरो ड्राइंग शीट',
      titleEn: 'Lion & Mouse Coloring & Story Activity Sheet',
      pages: '2 पृष्ठ',
      age: '4-8 वर्ष',
      type: 'PDF',
      color: 'bg-amber-500',
    },
    {
      id: 'ws-3',
      titleHi: '1 से 20 तक गिनती एवं चित्र मिलान वर्कशीट',
      titleEn: 'Numbers 1 to 20 Counting & Matching Fun',
      pages: '3 पृष्ठ',
      age: '3-6 वर्ष',
      type: 'PDF',
      color: 'bg-sky-500',
    },
    {
      id: 'ws-4',
      titleHi: 'दैनिक अच्छी आदतें एवं नैतिक आचरण चार्ट',
      titleEn: 'Daily Good Habits & Moral Tracker Chart',
      pages: '1 पृष्ठ',
      age: '5-12 वर्ष',
      type: 'PDF',
      color: 'bg-purple-500',
    },
  ];

  const handleDownload = (title: string) => {
    if (soundEnabled) playSuccessSound();
    setDownloadedItem(title);
    setTimeout(() => setDownloadedItem(null), 4000);
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-12 font-sans">
      
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-r from-teal-600 via-cyan-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <Download className="w-3.5 h-3.5 text-cyan-200" />
            <span>{language === 'hi' ? 'मुफ्त डाउनलोड केंद्र' : 'Free Download Center'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {language === 'hi'
              ? 'मुफ्त एक्टिविटी वर्कशीट्स व कलरिंग शीट्स'
              : 'Free Activity Worksheets & Coloring Sheets'}
          </h1>

          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed font-medium">
            {language === 'hi'
              ? 'घर और विद्यालय में बच्चों के अभ्यास के लिए वर्णमाला ट्रेसिंग, ड्राइंग और नैतिक आचरण चार्ट आसानी से डाउनलोड करें।'
              : 'Download handwriting tracing sheets, story coloring activities, and daily moral habit charts for kids.'}
          </p>
        </div>
      </section>

      {/* Free Printable Activity Sheets */}
      <section className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black mb-1.5">
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span>{language === 'hi' ? 'मुफ्त डाउनलोड' : 'Free Printable PDFs'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'hi' ? 'घर और कक्षा के लिए एक्टिविटी वर्कशीट्स' : 'Printable Worksheets for Home & School'}
            </h2>
          </div>

          {downloadedItem && (
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>डाउनलोड शुरू हो गया: {downloadedItem}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {worksheets.map((ws) => (
            <div
              key={ws.id}
              className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-xl ${ws.color} text-white flex items-center justify-center font-bold text-xs`}>
                    PDF
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {ws.age}
                  </span>
                </div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-snug">
                  {language === 'hi' ? ws.titleHi : ws.titleEn}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">{ws.pages} • हाई क्वालिटी प्रिंटेबल</p>
              </div>

              <button
                onClick={() => handleDownload(language === 'hi' ? ws.titleHi : ws.titleEn)}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-amber-950 hover:bg-black text-white font-black text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{language === 'hi' ? 'प्रिंट PDF डाउनलोड करें' : 'Download PDF'}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bedtime Storytelling Benefits (Preserved as requested) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>{language === 'hi' ? 'सोते समय कहानी सुनाने के वैज्ञानिक लाभ' : 'Why Bedtime Storytelling Matters'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-black text-slate-900 text-sm">🧠 शब्दकोश और भाषा का तीव्र विकास</p>
            <p className="leading-relaxed">
              कहानियों से बच्चे नए-नए शब्द, मुहावरे और वाक्य रचना सीखते हैं, जो उनके विद्यालयीन प्रदर्शन को 30% तक बेहतर बनाता है।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-black text-slate-900 text-sm">❤️ माता-पिता से गहरा भावनात्मक जुड़ाव</p>
            <p className="leading-relaxed">
              सोते समय 15 मिनट की कहानी बच्चे के मन से दिनभर का तनाव दूर कर उसे सुरक्षा और प्रेम की गहरी अनुभूति देती है।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="font-black text-slate-900 text-sm">💡 नैतिक सूझबूझ और निर्णय क्षमता</p>
            <p className="leading-relaxed">
              सच्चाई, दया, ईमानदारी और साहस जैसी कहानियाँ बच्चों के अवचेतन मन में जीवन भर के लिए मजबूत चरित्र का निर्माण करती हैं।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
