import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Download,
  BookOpen,
  Heart,
  Sparkles,
  HelpCircle,
  FileText,
  Smile,
  Crown,
  Lock,
  Volume2,
  Bot,
  Award,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';

interface ParentGuidePageProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
  onOpenProModal?: () => void;
}

export const ParentGuidePage: React.FC<ParentGuidePageProps> = ({
  language,
  soundEnabled,
  onBackToHome,
  onOpenProModal,
}) => {
  const isHi = language === 'hi';
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

  const handleOpenPro = () => {
    if (soundEnabled) playPopSound();
    if (onOpenProModal) {
      onOpenProModal();
    } else {
      window.dispatchEvent(new CustomEvent('baalvarta_open_pro_modal'));
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-12 font-sans">
      
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-r from-teal-600 via-cyan-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5 text-cyan-200" />
            <span>{isHi ? 'अभिभावक व बाल विकास केंद्र' : 'Parent & Child Development Hub'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {isHi
              ? 'साथ पढ़ें, साथ सीखें • सुरक्षित बाल मार्गदर्शन'
              : 'Read Together, Learn Together • Family Guidance'}
          </h1>

          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed font-medium">
            {isHi
              ? 'बालवार्ता मंच पर बच्चों के ज्ञान, नैतिक मूल्यों और संस्कारी विकास हेतु उपयोगी मार्गदर्शन, को-रीडिंग टिप्स और प्रिंटेबल एक्टिविटी शीट्स।'
              : 'Family co-reading tips, moral learning guides, and printable educational activity sheets for children.'}
          </p>
        </div>
      </section>

      {/* 🌟 साथ पढ़ें, साथ सीखें - Family Co-Reading Guide */}
      <section className="bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 text-amber-950">
          <Sparkles className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl sm:text-2xl font-black">
            {isHi ? 'साथ पढ़ें, साथ सीखें (Co-Reading & Family Bonding)' : 'Read Together, Learn Together'}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
          {isHi
            ? 'जब माता-पिता और शिक्षक बच्चों के साथ बैठकर कहानियाँ पढ़ते हैं, तो बच्चे न केवल बेहतर सीखते हैं बल्कि उनकी जिज्ञासा, एकाग्रता और पारिवारिक जुड़ाव भी मजबूत होता है।'
            : 'Co-reading stories with children enhances their vocabulary, cognitive skills, and strengthens family emotional bonds.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-1.5">
            <p className="font-black text-slate-900 text-sm">📖 संवाद व चर्चा करें</p>
            <p className="leading-relaxed">
              कहानी के मुख्य पात्रों और घटनाओं पर बच्चों से सवाल पूछें जैसे "अगर तुम वहाँ होते तो क्या करते?"।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-1.5">
            <p className="font-black text-slate-900 text-sm">💡 नैतिक शिक्षा को समझें</p>
            <p className="leading-relaxed">
              कहानी की सीख (Moral) को दैनिक जीवन से जोड़कर बच्चों को दयालुता, सच्चाई और सहयोग का महत्व समझाएं।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-1.5">
            <p className="font-black text-slate-900 text-sm">🎨 कल्पनाशीलता को प्रोत्साहन</p>
            <p className="leading-relaxed">
              कहानी के बाद बच्चों से उस पर चित्र बनाने या कहानी को अपनी भाषा में दोहराने के लिए कहें।
            </p>
          </div>
        </div>
      </section>

      {/* 👑 PREMIUM / VIP MEMBERSHIP FOR MAXIMUM SAFETY & ADVANCED FEATURES */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border-2 sm:border-3 border-amber-300">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md border border-white/30">
                <Crown className="w-4 h-4 text-amber-200" />
                <span>{isHi ? 'बालवार्ता वीआईपी व प्रो सदस्यता' : 'Baalvarta VIP & Pro'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                {isHi ? 'अतिरिक्त सुरक्षा एवं संपूर्ण प्रीमियम सुविधाएं' : 'Maximum Child Safety & Full Premium Access'}
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-2xl">
                {isHi
                  ? 'यदि आप अपने बच्चे के लिए 100% सुरक्षित, विज्ञापन-मुक्त वातावरण और सभी प्रीमियम फीचर्स चाहते हैं, तो बालवार्ता वीआईपी प्रो प्लान चुनें!'
                  : 'Get 100% ad-free safe child environment, unlimited printable worksheets, audio stories, and full parental peace of mind.'}
              </p>
            </div>

            <button
              onClick={handleOpenPro}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0 border-2 border-amber-200"
            >
              <Crown className="w-5 h-5 text-amber-600" />
              <span>{isHi ? '👑 वीआईपी सदस्यता देखें' : 'View VIP Membership'}</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>

          {/* Premium Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>🚫 100% विज्ञापन-मुक्त वातावरण</span>
              </div>
              <p className="text-[11px] text-amber-100 leading-relaxed">
                कोई भी बाहरी पॉपअप या अनचाहे विज्ञापन नहीं। सिर्फ शुद्ध बाल साहित्य और सुरक्षित पठन।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-white">
                <Lock className="w-5 h-5 text-amber-200 shrink-0" />
                <span>🔒 पूर्ण पैरेंटल शील्ड व सेफ्टी</span>
              </div>
              <p className="text-[11px] text-amber-100 leading-relaxed">
                पैरेंटल गेटवे के साथ सुरक्षित ब्राउजिंग और शून्य बाहरी रीडायरेक्ट।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-white">
                <Download className="w-5 h-5 text-cyan-200 shrink-0" />
                <span>📥 असीमित HD प्रिंटेबल्स</span>
              </div>
              <p className="text-[11px] text-amber-100 leading-relaxed">
                वर्णमाला, ड्राइंग, गणित और नैतिक आचरण चार्ट के असीमित PDF डाउनलोड।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-white">
                <Volume2 className="w-5 h-5 text-purple-200 shrink-0" />
                <span>🎧 असीमित ऑडियो कहानियाँ</span>
              </div>
              <p className="text-[11px] text-amber-100 leading-relaxed">
                सोते समय शांतिदायक आवाज़ में असीमित ऑडियो कहानियां और स्लीप प्लेयर।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-white">
                <Award className="w-5 h-5 text-yellow-200 shrink-0" />
                <span>🏆 असीमित प्रमाण पत्र व बैज</span>
              </div>
              <p className="text-[11px] text-amber-100 leading-relaxed">
                बच्चों की हर उपलब्धि पर विशेष वीआईपी बैज और कस्टमाइज़्ड प्रमाण पत्र।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-white">
                <Bot className="w-5 h-5 text-rose-200 shrink-0" />
                <span>🤖 असीमित AI बालमित्र</span>
              </div>
              <p className="text-[11px] text-amber-100 leading-relaxed">
                बच्चों के प्रश्नों के रोचक और ज्ञानवर्धक उत्तर देने वाला स्मार्ट बालमित्र।
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Free Printable Activity Sheets */}
      <section className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black mb-1.5">
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span>{isHi ? 'मुफ्त डाउनलोड' : 'Free Printable PDFs'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {isHi ? 'घर और कक्षा के लिए एक्टिविटी वर्कशीट्स' : 'Printable Worksheets for Home & School'}
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
                  {isHi ? ws.titleHi : ws.titleEn}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">{ws.pages} • हाई क्वालिटी प्रिंटेबल</p>
              </div>

              <button
                onClick={() => handleDownload(isHi ? ws.titleHi : ws.titleEn)}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-amber-950 hover:bg-black text-white font-black text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'प्रिंट PDF डाउनलोड करें' : 'Download PDF'}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bedtime Storytelling Benefits */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>{isHi ? 'सोते समय कहानी सुनाने के वैज्ञानिक लाभ' : 'Why Bedtime Storytelling Matters'}</span>
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
