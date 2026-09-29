import React, { useState } from 'react';
import {
  Rocket,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Eye,
  X,
  Upload,
  Globe
} from 'lucide-react';
import { PlanetItem, SpaceMissionItem, SpaceFunFactItem, SOLAR_PLANETS, SPACE_MISSIONS, SPACE_FUN_FACTS } from '../../data/spaceData';
import {
  getStoredSpacePlanets,
  saveStoredSpacePlanets,
  getStoredSpaceMissions,
  saveStoredSpaceMissions,
  getStoredSpaceFacts,
  saveStoredSpaceFacts
} from '../../utils/storage';
import {
  syncSpacePlanetToFirestore,
  deleteSpacePlanetFromFirestore
} from '../../utils/firebase';
import { playPopSound, playSuccessSound } from '../../utils/soundEffects';

interface AdminSpaceManagerProps {
  soundEnabled: boolean;
}

export const AdminSpaceManager: React.FC<AdminSpaceManagerProps> = ({
  soundEnabled,
}) => {
  const [subTab, setSubTab] = useState<'planets' | 'missions' | 'facts'>('planets');
  const [planets, setPlanets] = useState<PlanetItem[]>(() => getStoredSpacePlanets());
  const [missions, setMissions] = useState<SpaceMissionItem[]>(() => getStoredSpaceMissions());
  const [facts, setFacts] = useState<SpaceFunFactItem[]>(() => getStoredSpaceFacts());

  const [editingPlanetId, setEditingPlanetId] = useState<string | null>(null);
  const [isPlanetModalOpen, setIsPlanetModalOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Planet Form State
  const [planetForm, setPlanetForm] = useState<PlanetItem>({
    id: '',
    nameHi: '',
    nameEn: '',
    typeHi: 'ग्रह',
    typeEn: 'Planet',
    orderFromSun: 1,
    emoji: '🪐',
    color: 'from-blue-600 to-indigo-700',
    bgGradient: 'bg-gradient-to-br from-blue-600 to-indigo-800',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    summaryHi: '',
    summaryEn: '',
    detailedHi: '',
    detailedEn: '',
    quickStats: {
      diameter: '12,000 किमी',
      dayLength: '24 घंटे',
      yearLength: '365 दिन',
      moonsCount: 0,
      temperature: '20°C',
      funFactHi: '',
      funFactEn: '',
    },
    audioFactHi: '',
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    if (soundEnabled) playSuccessSound();
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleOpenAddPlanet = () => {
    if (soundEnabled) playPopSound();
    setEditingPlanetId(null);
    setPlanetForm({
      id: `planet-${Date.now()}`,
      nameHi: '',
      nameEn: '',
      typeHi: 'सौरमंडल सदस्य',
      typeEn: 'Solar Planet',
      orderFromSun: planets.length + 1,
      emoji: '🪐',
      color: 'from-blue-600 to-indigo-700',
      bgGradient: 'bg-gradient-to-br from-blue-600 to-indigo-800',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
      summaryHi: '',
      summaryEn: '',
      detailedHi: '',
      detailedEn: '',
      quickStats: {
        diameter: '10,000 किमी',
        dayLength: '24 घंटे',
        yearLength: '365 दिन',
        moonsCount: 0,
        temperature: '25°C',
        funFactHi: '',
        funFactEn: '',
      },
      audioFactHi: '',
    });
    setIsPlanetModalOpen(true);
  };

  const handleOpenEditPlanet = (p: PlanetItem) => {
    if (soundEnabled) playPopSound();
    setEditingPlanetId(p.id);
    setPlanetForm(JSON.parse(JSON.stringify(p)));
    setIsPlanetModalOpen(true);
  };

  const handlePlanetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('कृपया 2MB से छोटी फोटो अपलोड करें!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setPlanetForm((prev) => ({ ...prev, image: base64 }));
        if (soundEnabled) playSuccessSound();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePlanet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planetForm.nameHi.trim()) {
      alert('कृपया ग्रह का नाम लिखें!');
      return;
    }

    let updated: PlanetItem[] = [];
    if (editingPlanetId) {
      updated = planets.map((p) => (p.id === editingPlanetId ? planetForm : p));
      showToast(`✅ "${planetForm.nameHi}" की जानकारी अपडेट हुई!`);
    } else {
      updated = [...planets, planetForm];
      showToast(`✅ नया ग्रह "${planetForm.nameHi}" सफलतापूर्वक जुड़ गया!`);
    }

    setPlanets(updated);
    saveStoredSpacePlanets(updated);
    syncSpacePlanetToFirestore(planetForm);
    setIsPlanetModalOpen(false);
  };

  const handleDeletePlanet = (id: string, name: string) => {
    if (!window.confirm(`क्या आप वाकई "${name}" को हटाना चाहते हैं?`)) return;
    if (soundEnabled) playPopSound();
    const updated = planets.filter((p) => p.id !== id);
    setPlanets(updated);
    saveStoredSpacePlanets(updated);
    deleteSpacePlanetFromFirestore(id);
    showToast(`🗑️ "${name}" को हटाया गया।`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-violet-900 rounded-3xl p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-blue-400">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/50 text-cyan-200 text-xs font-black">
            <Rocket className="w-3.5 h-3.5 text-cyan-300" />
            <span>8. अंतरिक्ष और ब्रह्मांड (Admin Management)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            ग्रह, इसरो मिशन और ब्रह्मांड ज्ञान प्रबंधन
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            यहाँ से आप सभी ग्रहों, चंद्रयान/मंगलयान मिशनों की फोटो और विवरण अपलोड/एडिट कर सकते हैं।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddPlanet}
            className="px-4 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ नया ग्रह / मिशन जोड़ें</span>
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

      {/* PLANET MODAL */}
      {isPlanetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-400 shadow-2xl relative p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2.5">
              <h3 className="text-base font-black text-slate-900">
                {editingPlanetId ? 'ग्रह / अंतरिक्ष विवरण एडिट करें' : 'नया ग्रह जोड़ें'}
              </h3>
              <button onClick={() => setIsPlanetModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlanet} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-black text-slate-700 mb-1">ग्रह का नाम (हिंदी) *</label>
                  <input
                    type="text"
                    required
                    value={planetForm.nameHi}
                    onChange={(e) => setPlanetForm({ ...planetForm, nameHi: e.target.value })}
                    placeholder="उदा. मंगल ग्रह (Mars)"
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">Name in English</label>
                  <input
                    type="text"
                    value={planetForm.nameEn}
                    onChange={(e) => setPlanetForm({ ...planetForm, nameEn: e.target.value })}
                    placeholder="e.g. Mars"
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                <label className="block font-black text-blue-950">फोटो (Image / Photo) *</label>
                <div className="flex gap-2 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-blue-300 shrink-0">
                    <img src={planetForm.image} alt="Planet" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      value={planetForm.image}
                      onChange={(e) => setPlanetForm({ ...planetForm, image: e.target.value })}
                      placeholder="फोटो URL डालें"
                      className="w-full p-1.5 rounded-lg border border-slate-300 text-[11px] bg-white font-mono"
                    />
                    <label className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] inline-flex items-center gap-1 cursor-pointer">
                      <Upload className="w-3 h-3" />
                      <span>फोटो अपलोड करें</span>
                      <input type="file" accept="image/*" onChange={handlePlanetImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1">विस्तृत विवरण (Detailed Description)</label>
                <textarea
                  rows={3}
                  value={planetForm.detailedHi}
                  onChange={(e) => setPlanetForm({ ...planetForm, detailedHi: e.target.value })}
                  placeholder="ग्रह के बारे में मजेदार बातें लिखें..."
                  className="w-full p-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-700 mb-1">व्यास (Diameter)</label>
                  <input
                    type="text"
                    value={planetForm.quickStats.diameter}
                    onChange={(e) =>
                      setPlanetForm({
                        ...planetForm,
                        quickStats: { ...planetForm.quickStats, diameter: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1">तापमान (Temperature)</label>
                  <input
                    type="text"
                    value={planetForm.quickStats.temperature}
                    onChange={(e) =>
                      setPlanetForm({
                        ...planetForm,
                        quickStats: { ...planetForm.quickStats, temperature: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsPlanetModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md cursor-pointer"
                >
                  सुरक्षित करें ✅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLANETS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {planets.map((planet) => (
          <div
            key={planet.id}
            className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 shadow-xs flex flex-col justify-between space-y-2.5"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-blue-300 shrink-0">
                <img src={planet.image} alt={planet.nameEn} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-slate-900 truncate">{planet.nameHi}</h4>
                <p className="text-[11px] text-slate-500 font-bold">{planet.nameEn}</p>
                <p className="text-[10px] text-blue-600 font-semibold">📏 {planet.quickStats.diameter}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleOpenEditPlanet(planet)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center gap-1 border border-blue-200 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>एडिट</span>
              </button>
              <button
                onClick={() => handleDeletePlanet(planet.id, planet.nameHi)}
                className="p-1 rounded-lg bg-rose-50 text-rose-600 font-bold border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
