import React from 'react';
import {
  Award,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Heart,
  Globe,
  Smile,
  Target,
  Users,
  Compass
} from 'lucide-react';
import { Language } from '../types';

interface AboutUsPageProps {
  language: Language;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ language }) => {
  return (
    <div className="space-y-12 pb-12 font-sans">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <Award className="w-3.5 h-3.5 text-amber-200" />
            <span>{language === 'hi' ? 'हमारे बारे में' : 'About Baalvarta'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {language === 'hi'
              ? 'भारतीय संस्कृति, नैतिक शिक्षा और बाल-ज्ञान का संगम'
              : 'Preserving Heritage, Inspiring Wonder & Joyful Learning'}
          </h1>

          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
            {language === 'hi'
              ? 'बालवार्ता एक गैर-व्यावसायिक, बाल-सुरक्षित वेब पोर्टल है जिसे बच्चों में पढ़ने की आदत, शुद्ध भाषा और नैतिक मूल्यों को बढ़ावा देने के लिए बनाया गया है।'
              : 'Baalvarta is India\'s dedicated safe storytelling and foundational education platform, bridging traditional wisdom with modern interactive technology.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
            🎯
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {language === 'hi' ? 'हमारा उद्देश्य (Our Mission)' : 'Our Mission'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-serif">
            {language === 'hi'
              ? 'आज के डिजिटल दौर में जब बच्चे हिंसक और अवांछित वीडियो में उलझ रहे हैं, बालवार्ता उन्हें एक ऐसा स्वच्छ, प्रेरणादायक और भारतीय संस्कारों से भरा स्थान प्रदान करता है जहाँ वे सीखें, हँसें और अच्छे नागरिक बनें।'
              : 'To create a completely safe, wholesome, and culturally rooted digital sanctuary where children develop moral integrity, strong Hindi/English reading skills, and inquisitive minds.'}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md">
            🌱
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {language === 'hi' ? 'हमारी दृष्टि (Our Vision)' : 'Our Vision'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-serif">
            {language === 'hi'
              ? 'हर भारतीय घर और विद्यालय तक पंचतंत्र, हितोपदेश, जातक कथाएं और वैज्ञानिक रोचक तथ्य पहुँचाना — सरल भाषा, सुंदर 2D कला और शांत ऑडियो आवाज़ के साथ।'
              : 'To make timeless Indian stories (Panchatantra, Hitopadesha, Jataka Tales) accessible to every child globally through beautiful 2D art, bilingual texts, and soothing audio narrations.'}
          </p>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {language === 'hi' ? 'बालवार्ता के 4 मूल स्तंभ' : 'The 4 Core Pillars of Baalvarta'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'hi' ? 'हम हर कहानी और पाठ को इन 4 पैमानों पर परखते हैं:' : 'Every story and module is guided by these principles:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-amber-50/80 p-6 rounded-3xl border-2 border-amber-200 space-y-3">
            <span className="text-3xl">🛡️</span>
            <h3 className="font-black text-base text-slate-900">
              {language === 'hi' ? 'परिवार व बाल-अनुकूल मंच' : '100% Family & Kid Friendly'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'सभी उम्र के पाठकों व परिवारों के लिए शुद्ध, प्रेरणादायक और सकारात्मक ज्ञानवर्धक सामग्री।'
                : 'Wholesome, positive, and inspiring content crafted for young minds and family reading time.'}
            </p>
          </div>

          <div className="bg-emerald-50/80 p-6 rounded-3xl border-2 border-emerald-200 space-y-3">
            <span className="text-3xl">💎</span>
            <h3 className="font-black text-base text-slate-900">Moral Value Focus</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              हर कहानी के अंत में स्पष्ट नैतिक सीख, ताकि बच्चे सही और गलत में अंतर समझ सकें।
            </p>
          </div>

          <div className="bg-sky-50/80 p-6 rounded-3xl border-2 border-sky-200 space-y-3">
            <span className="text-3xl">🌐</span>
            <h3 className="font-black text-base text-slate-900">Bilingual Learning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              सरल हिंदी और सुगम अंग्रेजी का तालमेल, जिससे बच्चों का भाषाई आत्मविश्वास बढ़े।
            </p>
          </div>

          <div className="bg-purple-50/80 p-6 rounded-3xl border-2 border-purple-200 space-y-3">
            <span className="text-3xl">🎧</span>
            <h3 className="font-black text-base text-slate-900">Multi-Modal Learning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              पढ़ें (Text), सुनें (Audio), देखें (2D Cartoons) और अभ्यास करें (Worksheets)।
            </p>
          </div>
        </div>
      </section>

      {/* Storytelling Heritage */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📜</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'hi' ? 'भारतीय कथा-साहित्य की अमर विरासत' : 'The Immortal Indian Storytelling Heritage'}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
          {language === 'hi'
            ? "भारत विश्व में कथा-साहित्य की जन्मस्थली रहा है। ईसा पूर्व विष्णु शर्मा द्वारा रचित 'पंचतंत्र' आज भी दुनिया की सबसे महान नीति-शिक्षा की पुस्तक मानी जाती है। बालवार्ता उसी गौरवमयी परंपरा को आधुनिक बच्चों की पसंद के अनुसार नए रंग-रूप में प्रस्तुत करता है।"
            : "India has been the cradle of world storytelling. From Pandit Vishnu Sharma's ancient Panchatantra to Hitopadesha and Birbal's wit, these fables teach diplomacy, wisdom, empathy, and courage. Baalvarta keeps this timeless flame burning bright for the next generation."}
        </p>
      </section>

    </div>
  );
};
