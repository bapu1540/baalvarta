import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Globe,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Info,
  HelpCircle,
  Compass,
  Star,
  RefreshCw,
  Eye,
  Award,
  Zap,
  Flame,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerQuizCelebrationConfetti } from '../utils/confetti';
import {
  SOLAR_PLANETS,
  SPACE_MISSIONS,
  SPACE_FUN_FACTS,
  SPACE_QUIZ_QUESTIONS,
  PlanetItem,
  SpaceMissionItem,
  SpaceFunFactItem
} from '../data/spaceData';
import { Language } from '../types';
import { playPopSound, playSuccessSound, stopSpeech } from '../utils/soundEffects';
import { getStoredSpacePlanets, getStoredSpaceMissions, getStoredSpaceFacts } from '../utils/storage';

interface SpaceUniverseHubProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
}

export const SpaceUniverseHub: React.FC<SpaceUniverseHubProps> = ({
  language,
  soundEnabled,
  onBackToHome,
}) => {
  const isHi = language === 'hi';
  const [planets, setPlanets] = useState<PlanetItem[]>(() => getStoredSpacePlanets());
  const [missions, setMissions] = useState<SpaceMissionItem[]>(() => getStoredSpaceMissions());
  const [facts, setFacts] = useState<SpaceFunFactItem[]>(() => getStoredSpaceFacts());

  useEffect(() => {
    const handleUpdate = () => {
      setPlanets(getStoredSpacePlanets());
      setMissions(getStoredSpaceMissions());
      setFacts(getStoredSpaceFacts());
    };
    window.addEventListener('baalvarta_space_planets_updated', handleUpdate);
    window.addEventListener('baalvarta_space_missions_updated', handleUpdate);
    window.addEventListener('baalvarta_space_facts_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('baalvarta_space_planets_updated', handleUpdate);
      window.removeEventListener('baalvarta_space_missions_updated', handleUpdate);
      window.removeEventListener('baalvarta_space_facts_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const [activeSubTab, setActiveSubTab] = useState<'planets' | 'missions' | 'facts' | 'quiz'>('planets');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetItem | null>(null);
  const [selectedMission, setSelectedMission] = useState<SpaceMissionItem | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Space Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Audio Speech (TTS)
  const handleSpeakText = (text: string) => {
    if (!soundEnabled) return;
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    stopSpeech();
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isHi ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleSubTabChange = (tab: 'planets' | 'missions' | 'facts' | 'quiz') => {
    if (soundEnabled) playPopSound();
    stopSpeech();
    setIsSpeaking(false);
    setActiveSubTab(tab);
  };

  // Quiz Handling
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    if (soundEnabled) playPopSound();
    setSelectedOptionIndex(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const q = SPACE_QUIZ_QUESTIONS[currentQuizIndex];
    const isCorrect = selectedOptionIndex === q.correctIndex;
    if (isCorrect) {
      if (soundEnabled) playSuccessSound();
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (soundEnabled) playPopSound();
    if (currentQuizIndex + 1 < SPACE_QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      if (soundEnabled) playSuccessSound();
      triggerQuizCelebrationConfetti();
    }
  };

  const handleRestartQuiz = () => {
    if (soundEnabled) playPopSound();
    setCurrentQuizIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-4 pb-20 font-sans">
      
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-violet-900 text-white p-5 sm:p-7 shadow-lg border-2 border-blue-400/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 backdrop-blur-md text-cyan-200 text-xs font-black border border-cyan-400/40">
              <Rocket className="w-3.5 h-3.5 animate-bounce text-cyan-300" />
              <span>{isHi ? '8. अंतरिक्ष और ब्रह्मांड खोजकर्ता' : '8. Space & Universe Explorer'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>🚀</span>
              <span>{isHi ? 'सौरमंडल, ग्रह और अंतरिक्ष की जादुई दुनिया' : 'Solar System & Space Wonders'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
              {isHi
                ? 'सूर्य, 8 ग्रह, चंदा मामा, इसरो के मिशन (चंद्रयान-3 व मंगलयान) और अंतरिक्ष के रहस्य जानिए!'
                : 'Explore the 8 planets, Moon, Chandrayaan-3, ISRO missions, and cosmic wonders!'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSpeakText(isHi ? 'अंतरिक्ष और ब्रह्मांड की जादुई दुनिया में आपका स्वागत है। यहाँ सौरमंडल के सभी ग्रहों और चंद्रयान मिशन के बारे में सीखें।' : 'Welcome to Space and Universe Explorer. Learn about planets and space missions.')}
              className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title={isHi ? 'आवाज़ में सुनें' : 'Listen with Audio'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-red-900 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? (isHi ? 'रोकें' : 'Stop') : (isHi ? 'ऑडियो सुनें' : 'Listen')}</span>
            </button>
          </div>
        </div>

        {/* 2. SUB-MENU TABS */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-blue-400/20 pt-3">
          {[
            { id: 'planets', labelHi: '🪐 सौरमंडल व ग्रह', labelEn: '🪐 Planets', count: '10' },
            { id: 'missions', labelHi: '🛰️ इसरो अंतरिक्ष मिशन', labelEn: '🛰️ ISRO Missions', count: '4' },
            { id: 'facts', labelHi: '🌌 अंतरिक्ष के रहस्य', labelEn: '🌌 Cosmic Facts', count: '4' },
            { id: 'quiz', labelHi: '🏆 अंतरिक्ष क्विज़', labelEn: '🏆 Space Quiz', count: '5 Qs' },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSubTabChange(tab.id as any)}
                className={`px-3 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black border border-amber-300'
                    : 'bg-blue-900/60 hover:bg-blue-800/80 text-blue-100 border border-blue-400/30'
                }`}
              >
                <span>{isHi ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TAB 1: SOLAR PLANETS EXPLORER */}
      {activeSubTab === 'planets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🪐</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isHi ? 'सौरमंडल के सभी सदस्य (The Solar System)' : 'Planets of the Solar System'}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {isHi ? 'कार्ड पर क्लिक करके पूरी जानकारी देखें' : 'Click any planet card to explore'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {planets.map((planet) => (
              <div
                key={planet.id}
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setSelectedPlanet(planet);
                }}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col group active:scale-[0.99]"
              >
                <div className={`h-36 sm:h-40 relative overflow-hidden ${planet.bgGradient} flex items-center justify-center`}>
                  <img
                    src={planet.image}
                    alt={planet.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 mix-blend-luminosity opacity-40 absolute inset-0"
                    loading="lazy"
                  />
                  <div className="relative z-10 text-center p-3">
                    <span className="text-5xl sm:text-6xl drop-shadow-md animate-pulse">{planet.emoji}</span>
                    <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-slate-950/70 text-amber-300 text-[11px] font-black backdrop-blur-xs">
                      {isHi ? planet.typeHi : planet.typeEn}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {isHi ? planet.nameHi : planet.nameEn}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium leading-relaxed">
                      {isHi ? planet.summaryHi : planet.summaryEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">
                      {planet.quickStats.moonsCount > 0 ? (isHi ? `🌙 ${planet.quickStats.moonsCount} चंद्रमा` : `🌙 ${planet.quickStats.moonsCount} Moons`) : (isHi ? '🌙 कोई चंद्रमा नहीं' : '🌙 0 Moons')}
                    </span>
                    <span className="font-black text-blue-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      {isHi ? 'विस्तार से देखें' : 'Details'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: ISRO & SPACE MISSIONS */}
      {activeSubTab === 'missions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛰️</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isHi ? 'इसरो व भारत के गौरवशाली अंतरिक्ष मिशन' : 'ISRO & Indian Space Missions'}
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              🇮🇳 जय हिन्द
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-400 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                    {mission.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 inline-block mb-1">
                      {mission.badge}
                    </span>
                    <h3 className="text-base font-black text-slate-900">{isHi ? mission.titleHi : mission.titleEn}</h3>
                    <p className="text-[11px] font-bold text-indigo-600">📅 {mission.year}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                  <p className="text-slate-700 font-medium">
                    <strong className="text-slate-900">{isHi ? 'मुख्य उपलब्धि:' : 'Achievement:'}</strong> {isHi ? mission.achievementHi : mission.achievementEn}
                  </p>
                  <p className="text-indigo-900 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-semibold">
                    💡 <strong>{isHi ? 'रोचक तथ्य:' : 'Fun Fact:'}</strong> {isHi ? mission.funFactHi : mission.funFactEn}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleSpeakText(isHi ? `${mission.titleHi}। ${mission.summaryHi} ${mission.funFactHi}` : `${mission.titleEn}. ${mission.summaryEn}`)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 border border-blue-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isHi ? 'सुनें' : 'Listen'}</span>
                  </button>
                  <span className="text-[11px] font-bold text-slate-500">ISRO 🚀</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: COSMIC FACTS & ASTRONAUT LIFE */}
      {activeSubTab === 'facts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌌</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isHi ? 'ब्रह्मांड के जादुई रहस्य और अंतरिक्ष यात्री का जीवन' : 'Cosmic Mysteries & Astronaut Life'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {facts.map((fact) => (
              <div
                key={fact.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-violet-50 border border-violet-100">{fact.emoji}</span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {isHi ? fact.titleHi : fact.titleEn}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {isHi ? fact.factHi : fact.factEn}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSpeakText(isHi ? `${fact.titleHi}। ${fact.factHi}` : `${fact.titleEn}. ${fact.factEn}`)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1 border border-indigo-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isHi ? 'आवाज़ में सुनें' : 'Listen'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: SPACE QUIZ & ASTRONAUT BADGE */}
      {activeSubTab === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {!isQuizCompleted ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-blue-200 shadow-md p-4 sm:p-6 space-y-4">
              
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-blue-700">
                    {isHi ? `प्रश्न ${currentQuizIndex + 1} / ${SPACE_QUIZ_QUESTIONS.length}` : `Question ${currentQuizIndex + 1} of ${SPACE_QUIZ_QUESTIONS.length}`}
                  </span>
                  <span className="text-amber-600 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> {isHi ? `अंक: ${quizScore}` : `Score: ${quizScore}`}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${((currentQuizIndex + 1) / SPACE_QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {isHi ? SPACE_QUIZ_QUESTIONS[currentQuizIndex].questionHi : SPACE_QUIZ_QUESTIONS[currentQuizIndex].questionEn}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SPACE_QUIZ_QUESTIONS[currentQuizIndex].optionsHi.map((optHi, idx) => {
                  const optEn = SPACE_QUIZ_QUESTIONS[currentQuizIndex].optionsEn[idx];
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrect = idx === SPACE_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;

                  let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                  if (isSelected && !isAnswerSubmitted) {
                    btnStyle = 'bg-blue-100 border-blue-500 text-blue-900 font-black shadow-xs';
                  } else if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-black';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`p-3 rounded-xl border-2 text-xs sm:text-sm font-bold text-left transition-all flex items-center justify-between gap-2 active:scale-98 ${btnStyle}`}
                    >
                      <span>{isHi ? optHi : optEn}</span>
                      {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Banner */}
              {isAnswerSubmitted && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1">
                  <p className="font-black text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {isHi ? 'सही उत्तर की व्याख्या:' : 'Explanation:'}
                  </p>
                  <p className="text-slate-700 font-medium">
                    {isHi ? SPACE_QUIZ_QUESTIONS[currentQuizIndex].explanationHi : SPACE_QUIZ_QUESTIONS[currentQuizIndex].explanationEn}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOptionIndex === null}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 disabled:bg-slate-300 text-white font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    {isHi ? 'उत्तर लॉक करें ✅' : 'Submit Answer ✅'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>{currentQuizIndex + 1 < SPACE_QUIZ_QUESTIONS.length ? (isHi ? 'अगला प्रश्न' : 'Next Question') : (isHi ? 'परिणाम देखें' : 'View Results')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-8 text-center space-y-4 shadow-xl">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner">
                🚀
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black border border-blue-300">
                  {isHi ? '🎖️ बाल अंतरिक्ष यात्री उपाधि (Junior Astronaut)' : '🎖️ Junior Astronaut Badge'}
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {isHi ? 'शानदार प्रदर्शन!' : 'Outstanding Performance!'}
                </h3>
                <p className="text-sm font-bold text-slate-600">
                  {isHi
                    ? `आपने 5 में से ${quizScore} प्रश्नों के सही उत्तर दिए हैं!`
                    : `You answered ${quizScore} out of 5 questions correctly!`}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 text-xs font-bold text-slate-700 space-y-1">
                <p className="text-blue-900 text-sm font-black">
                  {quizScore >= 4 ? (isHi ? '🌟 सुपर स्पेस एक्सपर्ट! आप भविष्य के महान वैज्ञानिक हैं।' : '🌟 Super Space Expert!') : (isHi ? '👍 बहुत अच्छा प्रयास! दोबारा खेलकर पूरे अंक प्राप्त करें।' : '👍 Good job! Try again for 5/5!')}
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isHi ? 'फिर से खेलें' : 'Play Again'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. PLANET DETAIL MODAL */}
      {selectedPlanet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-blue-400 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header Image */}
            <div className={`h-40 relative overflow-hidden ${selectedPlanet.bgGradient} flex items-center justify-center`}>
              <img
                src={selectedPlanet.image}
                alt={selectedPlanet.nameEn}
                className="w-full h-full object-cover mix-blend-luminosity opacity-40 absolute inset-0"
              />
              <button
                onClick={() => {
                  stopSpeech();
                  setIsSpeaking(false);
                  setSelectedPlanet(null);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10 text-center">
                <span className="text-6xl drop-shadow-lg">{selectedPlanet.emoji}</span>
                <h3 className="text-xl font-black text-white drop-shadow-md mt-1">
                  {isHi ? selectedPlanet.nameHi : selectedPlanet.nameEn}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-black border border-blue-200">
                  {isHi ? selectedPlanet.typeHi : selectedPlanet.typeEn}
                </span>
                <button
                  onClick={() => handleSpeakText(isHi ? `${selectedPlanet.nameHi}। ${selectedPlanet.detailedHi} ${selectedPlanet.quickStats.funFactHi}` : `${selectedPlanet.nameEn}. ${selectedPlanet.detailedEn}`)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isHi ? 'ऑडियो सुनें' : 'Listen'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {isHi ? selectedPlanet.detailedHi : selectedPlanet.detailedEn}
              </p>

              {/* Planet Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 font-bold">{isHi ? '📏 व्यास (Diameter)' : 'Diameter'}</p>
                  <p className="font-black text-slate-900 mt-0.5">{selectedPlanet.quickStats.diameter}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 font-bold">{isHi ? '🌡️ तापमान (Temp)' : 'Temperature'}</p>
                  <p className="font-black text-slate-900 mt-0.5">{selectedPlanet.quickStats.temperature}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 font-bold">{isHi ? '⏱️ एक दिन (Day Length)' : 'Day Length'}</p>
                  <p className="font-black text-slate-900 mt-0.5">{selectedPlanet.quickStats.dayLength}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 font-bold">{isHi ? '☀️ एक साल (Year)' : 'Year Length'}</p>
                  <p className="font-black text-slate-900 mt-0.5">{selectedPlanet.quickStats.yearLength}</p>
                </div>
              </div>

              {/* Special Fun Fact */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1 text-xs">
                <p className="font-black text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {isHi ? 'रोचक बाल ज्ञान (Kids Fun Fact):' : 'Kids Fun Fact:'}
                </p>
                <p className="text-slate-800 font-semibold">
                  {isHi ? selectedPlanet.quickStats.funFactHi : selectedPlanet.quickStats.funFactEn}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    stopSpeech();
                    setIsSpeaking(false);
                    setSelectedPlanet(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs sm:text-sm hover:bg-slate-800 transition-all"
                >
                  {isHi ? 'बंद करें (Close)' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
