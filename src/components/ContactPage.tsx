import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Phone,
  MapPin,
  Heart,
  ChevronDown
} from 'lucide-react';
import { Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';

interface ContactPageProps {
  language: Language;
  soundEnabled: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  language,
  soundEnabled,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'parent',
    category: 'story_suggestion',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    if (soundEnabled) playSuccessSound();
    setIsSubmitted(true);
  };

  const faqs = [
    {
      qHi: 'क्या बालवार्ता पोर्टल बच्चों के लिए पूरी तरह निशुल्क और सुरक्षित है?',
      qEn: 'Is Baalvarta completely free and safe for children?',
      aHi: 'हाँ, बालवार्ता बच्चों के लिए 100% निशुल्क, सुरक्षित और विज्ञापन-मुक्त है। यहाँ कोई अनचाहे पॉपअप या बाहरी ट्रैकिंग लिंक नहीं हैं।',
      aEn: 'Yes, Baalvarta is 100% free, kid-safe and ad-free without any intrusive advertisements or malicious tracking.',
    },
    {
      qHi: 'क्या शिक्षक अपनी प्राथमिक कक्षाओं में इन कहानियों और वर्कशीट्स का उपयोग कर सकते हैं?',
      qEn: 'Can schools and teachers use these stories and worksheets in class?',
      aHi: 'बिल्कुल! शिक्षक और प्राथमिक विद्यालय हमारी सचित्र कहानियों, वर्णमाला चार्ट और प्रिंटेबल वर्कशीट्स का कक्षा में निःशुल्क उपयोग कर सकते हैं।',
      aEn: 'Absolutely! Teachers and preschool educators are warmly encouraged to use our stories, charts, and activity sheets for classroom instruction.',
    },
    {
      qHi: 'क्या माता-पिता नई कहानियों का सुझाव या बच्चों द्वारा लिखी रचनाएँ भेज सकते हैं?',
      qEn: 'Can parents suggest new stories or submit kids creative writings?',
      aHi: 'हाँ! आप नीचे दिए गए फॉर्म के माध्यम से हमें किसी भी नैतिक कहानी का सुझाव भेज सकते हैं। हमारी संपादकीय टीम उसे 2D कार्टून प्रारूप में शामिल करेगी।',
      aEn: 'Yes! Please use the form on this page to suggest stories or share your child\'s creative ideas with our editorial team.',
    },
    {
      qHi: 'एडमिन CMS का उपयोग कैसे करें?',
      qEn: 'How do parents and teachers access the Admin CMS?',
      aHi: "वेबसाइट के ऊपर दिए गए 'अभिभावक/शिक्षक लॉगिन' बटन पर क्लिक करें और सुरक्षा पिन दर्ज करें (डिफ़ॉल्ट पिन: 1234)। इसके बाद आप नई कहानियाँ, रील्स और फैक्ट्स जोड़ सकते हैं।",
      aEn: 'Click the "Parent/Admin Login" button on the top right and enter the security PIN (Default: 1234) to manage stories, audio, and learning modules.',
    },
  ];

  return (
    <div className="space-y-12 pb-12 font-sans">
      
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <Mail className="w-3.5 h-3.5 text-blue-200" />
            <span>{language === 'hi' ? 'संपर्क एवं प्रतिक्रिया' : 'Contact & Suggestions'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {language === 'hi'
              ? 'हमसे जुड़ें और अपने विचार साझा करें'
              : 'Connect with Baalvarta Editorial & Parent Team'}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
            {language === 'hi'
              ? 'यदि आपके पास बच्चों की कहानियों के लिए कोई सुझाव है, कोई नई सीख जोड़ना चाहते हैं या विद्यालयों के साथ सहयोग करना चाहते हैं, तो हमें अवश्य लिखें।'
              : 'Have a story idea, feedback, or school partnership inquiry? We would love to hear from parents, teachers, and young storytellers!'}
          </p>
        </div>
      </section>

      {/* Official Connect Bar: Email on Left + Instagram & YouTube on Right */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          {/* Left Side: Email */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <a
              href="mailto:baalvarta@gmail.com"
              className="flex items-center gap-2 text-xs sm:text-sm font-extrabold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl shadow-xs transition-all hover:scale-102 cursor-pointer"
              title={language === 'hi' ? 'बालवार्ता ईमेल करें' : 'Email Baalvarta'}
            >
              <Mail className="w-4 h-4 text-white" />
              <span className="font-bold hidden xs:inline">{language === 'hi' ? 'आधिकारिक ईमेल:' : 'Official Email:'}</span>
              <span className="font-black underline decoration-white/60">baalvarta@gmail.com</span>
            </a>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">
              {language === 'hi' ? '• 24-48 घंटों में उत्तर' : '• 24-48 hrs response'}
            </span>
          </div>

          {/* Right Side: Instagram & YouTube Original Channels */}
          <div className="flex items-center justify-center gap-2.5 shrink-0">
            <span className="text-xs font-black text-slate-700 hidden sm:inline">
              {language === 'hi' ? 'सोशल मीडिया चैनल:' : 'Official Channels:'}
            </span>

            {/* 1. Instagram */}
            <a
              href="https://www.instagram.com/baalvarta?stkn=dmhuNjFoYzNlZ2N2"
              target="_blank"
              rel="noopener noreferrer"
              title={language === 'hi' ? 'बालवार्ता इंस्टाग्राम पेज खोलें' : 'Follow Baalvarta on Instagram'}
              className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>

            {/* 2. YouTube */}
            <a
              href="https://www.youtube.com/@baalvartaofficial"
              target="_blank"
              rel="noopener noreferrer"
              title={language === 'hi' ? 'बालवार्ता यूट्यूब चैनल खोलें' : 'Subscribe to Baalvarta on YouTube'}
              className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </a>
          </div>

        </div>
      </section>

      {/* Main Grid: Form + Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>{language === 'hi' ? 'संदेश या कहानी का सुझाव भेजें' : 'Send a Message or Story Suggestion'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'हमारी टीम 24-48 घंटों में आपके ईमेल पर उत्तर देगी।' : 'Our team will respond to your email within 24-48 hours.'}
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl mx-auto">
                ✓
              </div>
              <h3 className="text-lg font-black text-emerald-950">
                {language === 'hi' ? 'धन्यवाद! आपका संदेश प्राप्त हो गया है।' : 'Thank You! Message Received.'}
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {language === 'hi'
                  ? 'बालवार्ता टीम बच्चों के लिए और अधिक सुंदर कहानियाँ बनाने के लिए आपके सुझावों का सम्मान करती है।'
                  : 'We truly appreciate your valuable suggestions in building a better learning space for children.'}
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', role: 'parent', category: 'story_suggestion', message: '' });
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                {language === 'hi' ? 'एक और संदेश भेजें' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'आपका नाम (Full Name) *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. सुनीता शर्मा"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'ईमेल पता (Email Address) *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@mail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'आप कौन हैं? (Your Role)' : 'Your Role'}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold bg-white"
                  >
                    <option value="parent">माता-पिता (Parent)</option>
                    <option value="teacher">शिक्षक / शिक्षिका (Teacher)</option>
                    <option value="school">स्कूल / संस्था प्रतिनिधि (School Rep)</option>
                    <option value="other">अन्य पाठक (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'विषय (Subject)' : 'Subject'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold bg-white"
                  >
                    <option value="story_suggestion">नई कहानी का सुझाव (Story Idea)</option>
                    <option value="feedback">फीडबैक एवं प्रशंसा (Feedback)</option>
                    <option value="school_partnership">स्कूल पार्टनरशिप (School Tie-up)</option>
                    <option value="technical">तकनीकी सहायता (Technical Help)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'आपका संदेश या कहानी का विवरण *' : 'Message or Story Details *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    language === 'hi'
                      ? 'यहाँ अपना विचार, कहानी का सारांश या प्रतिक्रिया लिखें...'
                      : 'Write your thoughts, story synopsis or feedback here...'
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'hi' ? 'संदेश भेजें' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-amber-50/80 rounded-3xl p-6 border-2 border-amber-200 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? 'संपादकीय कार्यालय' : 'Editorial Desk'}</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-serif">
              {language === 'hi'
                ? 'बालवार्ता टीम देश भर के बाल साहित्यकारों, प्राथमिक शिक्षकों और 2D चित्रकारों के साथ मिलकर बच्चों के लिए गुणवत्तापूर्ण साहित्य का निर्माण करती है।'
                : 'Our editorial desk collaborates with children\'s authors, teachers, and illustrators to craft meaningful literature for young minds.'}
            </p>

            <div className="pt-3 border-t border-amber-200 space-y-2.5 text-xs font-bold text-slate-800">
              <a
                href="mailto:baalvarta@gmail.com"
                className="flex items-center gap-2 hover:text-amber-800 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-extrabold text-amber-950">baalvarta@gmail.com</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <span>नई दिल्ली एवं जयपुर, भारत</span>
              </div>

              {/* Social Channels Quick Buttons */}
              <div className="pt-2 border-t border-amber-200/80">
                <p className="text-[11px] font-bold text-slate-500 mb-2">
                  {language === 'hi' ? 'आधिकारिक सोशल मीडिया चैनल:' : 'Official Social Channels:'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://www.instagram.com/baalvarta?stkn=dmhuNjFoYzNlZ2N2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white text-xs font-black shadow-xs hover:scale-102 active:scale-95 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://www.youtube.com/@baalvartaofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black shadow-xs hover:scale-102 active:scale-95 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/80 rounded-3xl p-6 border-2 border-emerald-200 space-y-3">
            <h3 className="font-black text-base text-emerald-950 flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'स्कूलों के लिए निःशुल्क' : 'Free for All Schools'}</span>
            </h3>
            <p className="text-xs text-emerald-900 leading-relaxed">
              {language === 'hi'
                ? 'यदि आप किसी प्राथमिक विद्यालय, आंगनवाड़ी या बाल पुस्तकालय के शिक्षक हैं, तो आप सभी पाठ्य सामग्री और वर्कशीट्स का निःशुल्क उपयोग कर सकते हैं।'
                : 'Primary schools, preschools, and rural learning centers are welcome to freely print and utilize our full library.'}
            </p>
          </div>
        </div>

      </section>

      {/* FAQs Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-100 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'माता-पिता और शिक्षकों के सामान्य सवाल' : 'Common Questions & Answers'}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setOpenFaq(isOpen ? null : index);
                  }}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <span>{language === 'hi' ? faq.qHi : faq.qEn}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-white font-serif">
                    {language === 'hi' ? faq.aHi : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
