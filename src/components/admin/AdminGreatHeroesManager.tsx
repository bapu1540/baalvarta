import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  CheckCircle2,
  Quote,
  BookOpen,
  Volume2,
  ShieldCheck,
  RefreshCw,
  Eye,
  X,
  Upload,
  Heart
} from 'lucide-react';
import { GreatHeroItem, GREAT_HEROES_LIST } from '../../data/greatHeroesData';
import { getStoredGreatHeroes, saveStoredGreatHeroes } from '../../utils/storage';
import { syncGreatHeroToFirestore, deleteGreatHeroFromFirestore, syncAllGreatHeroesToFirestore } from '../../utils/firebase';
import { playPopSound, playSuccessSound } from '../../utils/soundEffects';

interface AdminGreatHeroesManagerProps {
  soundEnabled: boolean;
}

export const AdminGreatHeroesManager: React.FC<AdminGreatHeroesManagerProps> = ({
  soundEnabled,
}) => {
  const [heroes, setHeroes] = useState<GreatHeroItem[]>(() => getStoredGreatHeroes());
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState<{
    id: string;
    nameHi: string;
    nameEn: string;
    childhoodNameHi: string;
    childhoodNameEn: string;
    titleBadgeHi: string;
    titleBadgeEn: string;
    eraHi: string;
    eraEn: string;
    image: string;
    heroColor: string;
    childhoodKeyTraitHi: string;
    childhoodKeyTraitEn: string;
    shortSummaryHi: string;
    shortSummaryEn: string;
    childhoodStoryHi: string;
    childhoodStoryEn: string;
    moralLessonHi: string;
    moralLessonEn: string;
    famousQuoteHi: string;
    famousQuoteEn: string;
    note1Title: string;
    note1Desc: string;
    note2Title: string;
    note2Desc: string;
  }>({
    id: '',
    nameHi: '',
    nameEn: '',
    childhoodNameHi: '',
    childhoodNameEn: '',
    titleBadgeHi: '🌟 बाल महानायक',
    titleBadgeEn: '🌟 Child Legend',
    eraHi: 'भारत',
    eraEn: 'India',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-amber-500 to-orange-600',
    childhoodKeyTraitHi: 'साहस, परिश्रम और सच्चाई',
    childhoodKeyTraitEn: 'Courage, hard work, and truth',
    shortSummaryHi: '',
    shortSummaryEn: '',
    childhoodStoryHi: '',
    childhoodStoryEn: '',
    moralLessonHi: '',
    moralLessonEn: '',
    famousQuoteHi: '',
    famousQuoteEn: '',
    note1Title: 'बचपन का संस्कार',
    note1Desc: 'माता-पिता से मिले अनमोल संस्कार।',
    note2Title: 'महान उपलब्धि',
    note2Desc: 'कठिनाइयों को पार करके देश का नाम रोशन किया।',
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    if (soundEnabled) playSuccessSound();
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleOpenAddForm = () => {
    if (soundEnabled) playPopSound();
    setEditingHeroId(null);
    setFormState({
      id: `hero-${Date.now()}`,
      nameHi: '',
      nameEn: '',
      childhoodNameHi: '',
      childhoodNameEn: '',
      titleBadgeHi: '🌟 बाल महानायक',
      titleBadgeEn: '🌟 Child Legend',
      eraHi: 'भारत',
      eraEn: 'India',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      heroColor: 'from-amber-500 to-orange-600',
      childhoodKeyTraitHi: 'साहस, परिश्रम और सच्चाई',
      childhoodKeyTraitEn: 'Courage, hard work, and truth',
      shortSummaryHi: '',
      shortSummaryEn: '',
      childhoodStoryHi: '',
      childhoodStoryEn: '',
      moralLessonHi: '',
      moralLessonEn: '',
      famousQuoteHi: '',
      famousQuoteEn: '',
      note1Title: 'बचपन का संस्कार',
      note1Desc: 'माता-पिता से मिले अनमोल संस्कार।',
      note2Title: 'महान उपलब्धि',
      note2Desc: 'कठिनाइयों को पार करके देश का नाम रोशन किया।',
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (hero: GreatHeroItem) => {
    if (soundEnabled) playPopSound();
    setEditingHeroId(hero.id);
    setFormState({
      id: hero.id,
      nameHi: hero.nameHi,
      nameEn: hero.nameEn,
      childhoodNameHi: hero.childhoodNameHi || '',
      childhoodNameEn: hero.childhoodNameEn || '',
      titleBadgeHi: hero.titleBadgeHi || '🌟 बाल महानायक',
      titleBadgeEn: hero.titleBadgeEn || '🌟 Child Legend',
      eraHi: hero.eraHi || 'भारत',
      eraEn: hero.eraEn || 'India',
      image: hero.image,
      heroColor: hero.heroColor || 'from-amber-500 to-orange-600',
      childhoodKeyTraitHi: hero.childhoodKeyTraitHi || '',
      childhoodKeyTraitEn: hero.childhoodKeyTraitEn || '',
      shortSummaryHi: hero.shortSummaryHi || '',
      shortSummaryEn: hero.shortSummaryEn || '',
      childhoodStoryHi: hero.childhoodStoryHi || '',
      childhoodStoryEn: hero.childhoodStoryEn || '',
      moralLessonHi: hero.moralLessonHi || '',
      moralLessonEn: hero.moralLessonEn || '',
      famousQuoteHi: hero.famousQuoteHi || '',
      famousQuoteEn: hero.famousQuoteEn || '',
      note1Title: hero.keyFacts?.[0]?.titleHi || 'बचपन का संस्कार',
      note1Desc: hero.keyFacts?.[0]?.descHi || '',
      note2Title: hero.keyFacts?.[1]?.titleHi || 'महान उपलब्धि',
      note2Desc: hero.keyFacts?.[1]?.descHi || '',
    });
    setIsFormOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('कृपया 2MB से छोटी फोटो अपलोड करें!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormState((prev) => ({ ...prev, image: base64 }));
        if (soundEnabled) playSuccessSound();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nameHi.trim()) {
      alert('कृपया महानायक का नाम अवश्य लिखें!');
      return;
    }

    const heroItem: GreatHeroItem = {
      id: formState.id || `hero-${Date.now()}`,
      nameHi: formState.nameHi.trim(),
      nameEn: formState.nameEn.trim() || formState.nameHi.trim(),
      childhoodNameHi: formState.childhoodNameHi.trim() || formState.nameHi.trim(),
      childhoodNameEn: formState.childhoodNameEn.trim() || formState.nameEn.trim(),
      titleBadgeHi: formState.titleBadgeHi.trim() || '🌟 बाल महानायक',
      titleBadgeEn: formState.titleBadgeEn.trim() || '🌟 Child Legend',
      eraHi: formState.eraHi.trim() || 'भारत',
      eraEn: formState.eraEn.trim() || 'India',
      image: formState.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      heroColor: formState.heroColor || 'from-amber-500 to-orange-600',
      solidColor: 'bg-orange-500',
      borderClass: 'border-orange-400',
      childhoodKeyTraitHi: formState.childhoodKeyTraitHi.trim() || 'साहस और संस्कार',
      childhoodKeyTraitEn: formState.childhoodKeyTraitEn.trim() || 'Courage & Values',
      shortSummaryHi: formState.shortSummaryHi.trim() || formState.childhoodStoryHi.slice(0, 100) + '...',
      shortSummaryEn: formState.shortSummaryEn.trim() || formState.childhoodStoryEn.slice(0, 100) + '...',
      childhoodStoryHi: formState.childhoodStoryHi.trim() || 'बचपन की प्रेरक कहानी...',
      childhoodStoryEn: formState.childhoodStoryEn.trim() || formState.childhoodStoryHi.trim(),
      moralLessonHi: formState.moralLessonHi.trim() || 'परिश्रम और सच्चाई से हर लक्ष्य हासिल किया जा सकता है।',
      moralLessonEn: formState.moralLessonEn.trim() || 'Values and perseverance lead to great success.',
      famousQuoteHi: formState.famousQuoteHi.trim() || '"सत्य और सेवा ही सबसे बड़ा धर्म है!"',
      famousQuoteEn: formState.famousQuoteEn.trim() || '"Truth and service are the greatest virtues!"',
      keyFacts: [
        {
          titleHi: formState.note1Title || 'बचपन का संस्कार',
          titleEn: 'Childhood Value',
          descHi: formState.note1Desc || 'माँ और गुरुजनों से मिले अच्छे संस्कार।',
          descEn: 'Values learned from parents and mentors.',
        },
        {
          titleHi: formState.note2Title || 'महान कार्य',
          titleEn: 'Great Feat',
          descHi: formState.note2Desc || 'देश और समाज के लिए दिया अतुलनीय योगदान।',
          descEn: 'Invaluable contribution to humanity.',
        },
      ],
      audioSummaryHi: `${formState.nameHi} का प्रेरक बचपन। ${formState.childhoodKeyTraitHi}।`,
    };

    let updatedList: GreatHeroItem[] = [];
    if (editingHeroId) {
      updatedList = heroes.map((h) => (h.id === editingHeroId ? heroItem : h));
      showToast(`✅ "${heroItem.nameHi}" की जानकारी और फोटो सफलतापूर्वक अपडेट हुई!`);
    } else {
      updatedList = [heroItem, ...heroes];
      showToast(`✅ नया महानायक "${heroItem.nameHi}" सफलतापूर्वक जुड़ गया!`);
    }

    setHeroes(updatedList);
    saveStoredGreatHeroes(updatedList);
    syncGreatHeroToFirestore(heroItem);
    setIsFormOpen(false);
  };

  const handleDeleteHero = (id: string, name: string) => {
    if (!window.confirm(`क्या आप वाकई "${name}" को हटाना चाहते हैं?`)) return;
    if (soundEnabled) playPopSound();
    const updated = heroes.filter((h) => h.id !== id);
    setHeroes(updated);
    saveStoredGreatHeroes(updated);
    deleteGreatHeroFromFirestore(id);
    showToast(`🗑️ "${name}" को सफलतापूर्वक हटाया गया।`);
  };

  const handleResetToDefault = () => {
    if (!window.confirm('क्या आप सभी महानायकों को शुरुआती डिफ़ॉल्ट डेटा में रीसेट करना चाहते हैं?')) return;
    setHeroes(GREAT_HEROES_LIST);
    saveStoredGreatHeroes(GREAT_HEROES_LIST);
    syncAllGreatHeroesToFirestore(GREAT_HEROES_LIST);
    showToast('🔄 सभी महानायक डिफ़ॉल्ट डेटा में रीसेट हो गए!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-pink-300">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/40 text-amber-200 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>9. महान हस्तियों का प्रेरक बचपन (Admin Management)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            महानायकों की कहानियाँ, फोटो और नोट्स प्रबंधन
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 font-medium">
            यहाँ से आप किसी भी महानायक की फोटो बदल सकते हैं, नई कहानी/नोट्स जोड़ सकते हैं या डिलीट कर सकते हैं।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddForm}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ नया महानायक जोड़ें</span>
          </button>

          <button
            onClick={handleResetToDefault}
            className="p-2.5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 text-white text-xs font-bold transition-all"
            title="डिफ़ॉल्ट रीसेट करें"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ADD / EDIT MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border-2 border-pink-400 shadow-2xl relative animate-in fade-in zoom-in duration-200 p-5 sm:p-7 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🌟</span>
                <span>{editingHeroId ? 'महानायक की कहानी व फोटो एडिट करें' : 'नया महानायक व बचपन की कहानी जोड़ें'}</span>
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHero} className="space-y-4 text-xs font-sans">
              
              {/* Row 1: Name and Childhood Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 mb-1">महानायक का पूरा नाम (हिंदी) *</label>
                  <input
                    type="text"
                    required
                    value={formState.nameHi}
                    onChange={(e) => setFormState({ ...formState, nameHi: e.target.value })}
                    placeholder="उदा. छत्रपति शिवाजी महाराज"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:border-pink-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">Name in English</label>
                  <input
                    type="text"
                    value={formState.nameEn}
                    onChange={(e) => setFormState({ ...formState, nameEn: e.target.value })}
                    placeholder="e.g. Chhatrapati Shivaji Maharaj"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:border-pink-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 2: Childhood Name & Title Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 mb-1">बचपन का नाम (उदा. नन्हे शिवा / मोनिया)</label>
                  <input
                    type="text"
                    value={formState.childhoodNameHi}
                    onChange={(e) => setFormState({ ...formState, childhoodNameHi: e.target.value })}
                    placeholder="उदा. नन्हे शिवा (Young Shiva)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">स्थान / काल (Era/Location)</label>
                  <input
                    type="text"
                    value={formState.eraHi}
                    onChange={(e) => setFormState({ ...formState, eraHi: e.target.value })}
                    placeholder="उदा. शिवनेरी दुर्ग, महाराष्ट्र"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* PHOTO UPLOAD & URL SECTION */}
              <div className="p-3.5 bg-pink-50 rounded-2xl border border-pink-200 space-y-2.5">
                <label className="block font-black text-pink-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-pink-600" />
                    <span>महानायक की फोटो (Photo / Portrait Image) *</span>
                  </span>
                  <span className="text-[11px] text-pink-700 font-normal">URL डालें या डिवाइस से अपलोड करें</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-pink-400 bg-slate-900 shrink-0 shadow-sm">
                    {formState.image ? (
                      <img src={formState.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl">👤</div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="url"
                      value={formState.image}
                      onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                      placeholder="फोटो वेब URL डालें (https://...)"
                      className="w-full p-2 rounded-xl border border-slate-300 font-mono text-[11px] bg-white"
                    />

                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95">
                        <Upload className="w-3.5 h-3.5" />
                        <span>कंप्यूटर / मोबाइल से फोटो चुनें</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-slate-500 font-medium">PNG, JPG, WebP (&lt;2MB)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Childhood Virtue & Quote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 mb-1">बचपन का मुख्य गुण (Childhood Trait)</label>
                  <input
                    type="text"
                    value={formState.childhoodKeyTraitHi}
                    onChange={(e) => setFormState({ ...formState, childhoodKeyTraitHi: e.target.value })}
                    placeholder="उदा. निडरता, माता का आदर और संकल्प"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">महान विचार (Famous Quote)</label>
                  <input
                    type="text"
                    value={formState.famousQuoteHi}
                    onChange={(e) => setFormState({ ...formState, famousQuoteHi: e.target.value })}
                    placeholder='उदा. "जब इरादे पक्के हों, तो पहाड़ भी रास्ता दे देते हैं!"'
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* Row 4: Full Childhood Story */}
              <div>
                <label className="block font-black text-slate-700 mb-1">बचपन की पूरी प्रेरक कहानी (Full Story) *</label>
                <textarea
                  rows={5}
                  required
                  value={formState.childhoodStoryHi}
                  onChange={(e) => setFormState({ ...formState, childhoodStoryHi: e.target.value })}
                  placeholder="बचपन की प्रेरक घटना, माता-पिता की सीख और साहस की विस्तृत कहानी यहाँ लिखें..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium leading-relaxed"
                />
              </div>

              {/* Row 5: Moral Lesson */}
              <div>
                <label className="block font-black text-slate-700 mb-1">बच्चों के लिए अनमोल सीख (Moral Lesson)</label>
                <input
                  type="text"
                  value={formState.moralLessonHi}
                  onChange={(e) => setFormState({ ...formState, moralLessonHi: e.target.value })}
                  placeholder="उदा. बचपन के संस्कार जीवन में सबसे बड़े लक्ष्य को हासिल करने की शक्ति देते हैं।"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              {/* Row 6: Custom Notes & Key Facts */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <p className="font-black text-amber-900">📝 विशेष नोट्स व महत्वपूर्ण बिंदु (Notes & Key Facts):</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200 space-y-1">
                    <input
                      type="text"
                      value={formState.note1Title}
                      onChange={(e) => setFormState({ ...formState, note1Title: e.target.value })}
                      placeholder="नोट 1 शीर्षक (उदा. माँ जीजाबाई का संस्कार)"
                      className="w-full p-1.5 font-black border-b border-slate-200 focus:outline-hidden"
                    />
                    <textarea
                      rows={2}
                      value={formState.note1Desc}
                      onChange={(e) => setFormState({ ...formState, note1Desc: e.target.value })}
                      placeholder="नोट 1 का विवरण..."
                      className="w-full p-1.5 text-[11px] font-medium resize-none focus:outline-hidden"
                    />
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-amber-200 space-y-1">
                    <input
                      type="text"
                      value={formState.note2Title}
                      onChange={(e) => setFormState({ ...formState, note2Title: e.target.value })}
                      placeholder="नोट 2 शीर्षक (उदा. 16 की उम्र में पहला किला)"
                      className="w-full p-1.5 font-black border-b border-slate-200 focus:outline-hidden"
                    />
                    <textarea
                      rows={2}
                      value={formState.note2Desc}
                      onChange={(e) => setFormState({ ...formState, note2Desc: e.target.value })}
                      placeholder="नोट 2 का विवरण..."
                      className="w-full p-1.5 text-[11px] font-medium resize-none focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {editingHeroId ? 'अपडेट सुरक्षित करें ✅' : 'प्रकाशित करें (Publish) ✅'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* HEROES LIST GRID IN ADMIN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className="bg-white rounded-3xl border-2 border-slate-200 hover:border-pink-400 p-4 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-300 shadow-sm shrink-0 bg-slate-900">
                <img
                  src={hero.image}
                  alt={hero.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="px-2 py-0.5 rounded-md bg-pink-100 text-pink-900 text-[10px] font-black inline-block mb-1">
                  {hero.titleBadgeHi}
                </span>
                <h4 className="text-base font-black text-slate-900 leading-tight truncate">{hero.nameHi}</h4>
                <p className="text-[11px] text-slate-500 font-bold">बचपन: {hero.childhoodNameHi}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              {hero.shortSummaryHi || hero.childhoodStoryHi}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[10px] font-bold text-slate-400">
                {hero.keyFacts?.length || 0} नोट्स
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditForm(hero)}
                  className="px-2.5 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold flex items-center gap-1 border border-pink-200 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>एडिट</span>
                </button>
                <button
                  onClick={() => handleDeleteHero(hero.id, hero.nameHi)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold border border-rose-200 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
