import React, { useState, useRef } from 'react';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Award,
  ChevronRight,
  Volume2,
  Brain,
  Star,
  Download,
  Medal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizSet, QuizQuestion, Language } from '../types';
import { playPopSound, playSuccessSound, speakText } from '../utils/soundEffects';
import { INITIAL_QUIZ_SETS } from '../data/quizData';
import { getStoredQuizSets } from '../utils/storage';

interface KidsQuizGameSectionProps {
  language: Language;
  soundEnabled: boolean;
  onNavigateTab?: (tab: any, category?: string, certType?: string) => void;
}

export const KidsQuizGameSection: React.FC<KidsQuizGameSectionProps> = ({
  language,
  soundEnabled,
  onNavigateTab,
}) => {
  const isHi = language === 'hi';
  const quizSets: QuizSet[] = getStoredQuizSets() || INITIAL_QUIZ_SETS;

  const [activeQuiz, setActiveQuiz] = useState<QuizSet | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<{ qIndex: number; selected: number; isCorrect: boolean }>>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [childName, setChildName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  const startQuiz = (set: QuizSet) => {
    if (soundEnabled) playPopSound();
    setActiveQuiz(set);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setQuizFinished(false);
    setShowCertificate(false);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered || !activeQuiz) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const currentQ = activeQuiz.questions[currentQIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      if (soundEnabled) playSuccessSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      if (soundEnabled) playPopSound();
    }

    setUserAnswers((prev) => [
      ...prev,
      { qIndex: currentQIndex, selected: optionIndex, isCorrect },
    ]);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    if (soundEnabled) playPopSound();

    if (currentQIndex + 1 < activeQuiz.questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      setQuizFinished(true);
      if (soundEnabled) playSuccessSound();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    if (!activeQuiz) return;
    startQuiz(activeQuiz);
  };

  const handleBackToList = () => {
    if (soundEnabled) playPopSound();
    setActiveQuiz(null);
    setQuizFinished(false);
    setShowCertificate(false);
  };

  const handleSpeakQuestion = (q: QuizQuestion) => {
    const textToSpeak = isHi
      ? `${q.questionHi}। विकल्प हैं: 1. ${q.options[0]}, 2. ${q.options[1]}, 3. ${q.options[2]}, 4. ${q.options[3]}`
      : `${q.questionEn}. Options are: 1. ${q.optionsEn?.[0] || q.options[0]}, 2. ${q.optionsEn?.[1] || q.options[1]}, 3. ${q.optionsEn?.[2] || q.options[2]}, 4. ${q.optionsEn?.[3] || q.options[3]}`;

    speakText(textToSpeak, isHi ? 'hi' : 'en', 0.9);
  };

  // If a Quiz is Active and Running
  if (activeQuiz && !quizFinished) {
    const currentQ = activeQuiz.questions[currentQIndex];
    const totalQ = activeQuiz.questions.length;
    const progressPercent = Math.round(((currentQIndex + 1) / totalQ) * 100);

    return (
      <div className="space-y-4 font-sans max-w-4xl mx-auto pb-8">
        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-slate-900 shadow-sm flex items-center justify-between gap-2">
          <button
            onClick={handleBackToList}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <span>←</span>
            <span>{isHi ? 'सभी क्विज़' : 'All Quizzes'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-600">
              {isHi ? `प्रश्न ${currentQIndex + 1} / ${totalQ}` : `Q ${currentQIndex + 1} / ${totalQ}`}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
              ⭐ {score} {isHi ? 'अंक' : 'pts'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-500 to-amber-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Active Question Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-900 shadow-md space-y-5">
          
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                {activeQuiz.titleHi}
              </span>
              <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                {isHi ? currentQ.questionHi : currentQ.questionEn}
              </h2>
            </div>

            <button
              onClick={() => handleSpeakQuestion(currentQ)}
              className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0 cursor-pointer transition-transform active:scale-90"
              title={isHi ? 'सवाल बोलकर सुनें' : 'Listen to question'}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Question Image if present */}
          {currentQ.image && (
            <div className="w-full h-44 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={currentQ.image}
                alt="Question"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              
              let btnStyle = 'bg-white border-slate-300 text-slate-800 hover:border-slate-500 hover:bg-slate-50';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[1.01]';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-md';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 font-black text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{isHi ? option : currentQ.optionsEn?.[idx] || option}</span>
                  </div>

                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Card after answer */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{selectedOption === currentQ.correctIndex ? '🎉 शाबाश! सही उत्तर' : '💡 सही उत्तर और व्याख्या:'}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {isHi ? currentQ.explanationHi : currentQ.explanationEn}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{currentQIndex + 1 === totalQ ? (isHi ? 'परिणाम देखें 🏆' : 'See Results 🏆') : (isHi ? 'अगला सवाल ➔' : 'Next Question ➔')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    );
  }

  // If Quiz Finished (Results & Certificate Screen)
  if (quizFinished && activeQuiz) {
    const totalQ = activeQuiz.questions.length;
    const isPerfect = score === totalQ;
    const percent = Math.round((score / totalQ) * 100);

    return (
      <div className="space-y-5 font-sans max-w-2xl mx-auto pb-8 text-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-900 shadow-xl space-y-4">
          
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-4xl shadow-inner border-2 border-amber-300">
            {isPerfect ? '👑' : percent >= 60 ? '🏆' : '🌟'}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {isPerfect
                ? (isHi ? 'अद्भुत! पूरे 100% सही उत्तर! 🎉' : 'Outstanding! Perfect Score! 🎉')
                : percent >= 60
                ? (isHi ? 'बहुत बढ़िया प्रदर्शन! 👏' : 'Great Job! Well Played! 👏')
                : (isHi ? 'अच्छा प्रयास! फिर से खेलें! 💪' : 'Good Effort! Try Again! 💪')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {isHi ? `आपने ${activeQuiz.titleHi} सफलतापूर्वक पूरा किया!` : `You completed ${activeQuiz.titleEn}!`}
            </p>
          </div>

          {/* Score Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-amber-300 inline-flex items-center gap-4">
            <div>
              <span className="text-3xl font-black text-amber-600">{score} / {totalQ}</span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">{isHi ? 'कुल सही उत्तर' : 'Total Score'}</span>
            </div>
            <div className="h-8 w-px bg-amber-200" />
            <div>
              <span className="text-2xl font-black text-emerald-600">{percent}%</span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">{isHi ? 'सफलता दर' : 'Accuracy'}</span>
            </div>
          </div>

          {/* Certificate Input */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
            <label className="block text-xs font-black text-slate-800">
              🎖️ {isHi ? 'अपना नाम लिखकर प्रमाण पत्र (Certificate) तैयार करें:' : 'Enter your name for Quiz Champion Certificate:'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={isHi ? 'बच्चे का नाम (जैसे: आरव, अन्या)...' : 'Child Name...'}
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900"
              />
              <button
                onClick={() => {
                  if (!childName.trim()) {
                    setChildName(isHi ? 'बाल विजेता' : 'Little Champion');
                  }
                  setShowCertificate(true);
                  if (soundEnabled) playSuccessSound();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs cursor-pointer shadow-xs"
              >
                {isHi ? 'सर्टिफिकेट देखें 🎖️' : 'View Certificate'}
              </button>
            </div>

            {showCertificate && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 border-4 border-amber-400 text-center space-y-2 shadow-md mt-3">
                <span className="text-3xl">🎖️</span>
                <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                  {isHi ? 'बालवार्ता क्विज़ चैंपियन सम्मान पत्र' : 'Baalvarta Quiz Champion Certificate'}
                </h4>
                <p className="text-lg font-black text-slate-900 underline decoration-amber-500">
                  {childName || 'Little Champion'}
                </p>
                <p className="text-[11px] text-slate-700">
                  {isHi
                    ? `ने ${activeQuiz.titleHi} में ${score}/${totalQ} अंक प्राप्त कर अपनी सूझबूझ और ज्ञान का उत्कृष्ट प्रमाण दिया।`
                    : `Achieved ${score}/${totalQ} in ${activeQuiz.titleEn} with exceptional knowledge!`}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-black text-xs shadow-xs"
                  >
                    🖨️ {isHi ? 'सर्टिफिकेट प्रिंट / सेव करें' : 'Print / Save'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isHi ? 'फिर से खेलें' : 'Play Again'}</span>
            </button>

            <button
              onClick={handleBackToList}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>{isHi ? 'अन्य क्विज़ चुनें ➔' : 'Choose Another Quiz ➔'}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Quiz Sets List View
  return (
    <div className="space-y-4 font-sans pb-6">
      
      {/* List Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <span>🎯</span>
          <span>{isHi ? 'अपना मनपसंद क्विज़ गेम चुनें:' : 'Select a Quiz Game:'}</span>
        </h3>
        <span className="text-xs font-bold text-slate-500">
          {quizSets.length} {isHi ? 'क्विज़ उपलब्ध' : 'Quizzes'}
        </span>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {quizSets.map((quiz) => (
          <div
            key={quiz.id}
            onClick={() => startQuiz(quiz)}
            className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2.5">
              
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-100 border border-amber-200 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                  {quiz.icon || '🏆'}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                  ⚡ {quiz.questions.length} {isHi ? 'सवाल' : 'Questions'}
                </span>
              </div>

              <div>
                <h4 className="font-black text-base text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                  {isHi ? quiz.titleHi : quiz.titleEn}
                </h4>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1">
                  {isHi ? quiz.descriptionHi : quiz.descriptionEn}
                </p>
              </div>

            </div>

            <button
              type="button"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 group-hover:scale-[1.02] transition-transform"
            >
              <span>{isHi ? 'क्विज़ खेलें ➔' : 'Play Quiz ➔'}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
