import React, { useState } from 'react';
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
  Share2,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizSet, QuizQuestion, Language } from '../types';
import { playPopSound, playSuccessSound, speakText } from '../utils/soundEffects';

interface KidsQuizHubProps {
  quizSets: QuizSet[];
  language: Language;
  soundEnabled: boolean;
  onSelectQuiz?: (quiz: QuizSet) => void;
}

export const KidsQuizHub: React.FC<KidsQuizHubProps> = ({
  quizSets,
  language,
  soundEnabled,
}) => {
  const [activeQuiz, setActiveQuiz] = useState<QuizSet | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<{ qIndex: number; selected: number; isCorrect: boolean }>>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const isHi = language === 'hi';

  const startQuiz = (set: QuizSet) => {
    if (soundEnabled) playPopSound();
    setActiveQuiz(set);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setQuizFinished(false);
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
    } else {
      setQuizFinished(true);
      if (score + (selectedOption === activeQuiz.questions[currentQIndex].correctIndex ? 0 : 0) >= 3) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    }
  };

  const currentQ: QuizQuestion | undefined = activeQuiz?.questions[currentQIndex];

  // List View (All Quiz Categories)
  if (!activeQuiz) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-3">
              <Brain className="w-4 h-4 text-amber-200" />
              <span>{isHi ? 'बाल प्रश्नोत्तरी ज़ोन (5 सवाल - 4 विकल्प)' : 'Kids Interactive Quiz (5 Questions - 4 Options)'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 font-display">
              {isHi ? 'खेल-खेल में सीखें और बनें सुपर स्टार!' : 'Play & Learn with 5-Question Quizzes!'}
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              {isHi
                ? 'हर प्रश्न के 4 विकल्प हैं। गलत जवाब होने पर सही उत्तर और "यह क्यों सही है" का सचित्र कारण भी समझाया जाएगा।'
                : 'Each question has 4 options. Instant visual explanations show why the correct answer is right!'}
            </p>
          </div>
        </div>

        {/* Quiz Set Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizSets.map((set) => (
            <div
              key={set.id}
              onClick={() => startQuiz(set)}
              className="bg-white rounded-3xl p-6 border-2 border-slate-100 hover:border-amber-400 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl p-3 bg-amber-50 rounded-2xl group-hover:scale-110 transition-transform">
                    {set.icon}
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                    {set.questions.length} {isHi ? 'सवाल' : 'Questions'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors mb-2 font-display">
                  {isHi ? set.titleHi : set.titleEn}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {isHi ? set.descriptionHi : set.descriptionEn}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {isHi ? '4 विकल्प + सचित्र व्याख्या' : '4 Options + Picture Explain'}
                </span>
                <button
                  id={`start-quiz-${set.id}`}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold shadow-md group-hover:shadow-lg group-hover:from-amber-600 group-hover:to-orange-600 transition-all flex items-center gap-1"
                >
                  <span>{isHi ? 'क्विज़ शुरू करें' : 'Start Quiz'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz Finished View (Scorecard & Explanation Review)
  if (quizFinished) {
    const totalQuestions = activeQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    let badgeTitle = isHi ? '🌟 सुपर स्टार' : '🌟 Super Star';
    let badgeDesc = isHi ? 'अद्भुत प्रदर्शन! आपने सभी सवालों के सही जवाब दिए।' : 'Phenomenal work! You mastered every question.';
    if (percentage < 60) {
      badgeTitle = isHi ? '🌱 नन्हा जिज्ञासु' : '🌱 Little Explorer';
      badgeDesc = isHi ? 'बहुत अच्छा प्रयास! हर गलती एक नई सीख देती है।' : 'Great effort! Review the explanations below to learn more.';
    } else if (percentage < 100) {
      badgeTitle = isHi ? '🏆 बाल ज्ञानरत्न' : '🏆 Smart Thinker';
      badgeDesc = isHi ? 'शानदार स्कोर! आप बहुत होशियार हैं।' : 'Awesome score! You did wonderfully well.';
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-xl text-center relative overflow-hidden">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl shadow-lg animate-bounce">
            🏆
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-1 font-display">
            {isHi ? 'क्विज़ पूरा हुआ!' : 'Quiz Completed!'}
          </h2>
          <p className="text-slate-600 mb-6 text-base font-medium">
            {isHi ? activeQuiz.titleHi : activeQuiz.titleEn}
          </p>

          <div className="inline-block bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 mb-6">
            <div className="text-sm font-bold text-amber-800 mb-1">{badgeTitle}</div>
            <div className="text-5xl font-extrabold text-amber-600 mb-2 font-display">
              {score} / {totalQuestions}
            </div>
            <div className="text-xs text-slate-600 max-w-sm">{badgeDesc}</div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="quiz-play-again-btn"
              onClick={() => startQuiz(activeQuiz)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isHi ? 'फिर से खेलें' : 'Play Again'}</span>
            </button>
            <button
              id="quiz-choose-another-btn"
              onClick={() => setActiveQuiz(null)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isHi ? 'अन्य क्विज़ चुनें' : 'Choose Another Quiz'}</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review with "Kyo Sahi Hai" Explanations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-800">
              {isHi ? 'सभी 5 प्रश्नों के सही उत्तर और कारण (व्याख्या)' : 'Review 5 Questions with Explanations'}
            </h3>
          </div>

          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => {
              const userAns = userAnswers.find((a) => a.qIndex === idx);
              const isCorrect = userAns?.isCorrect ?? false;
              const selectedIdx = userAns?.selected;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-800 text-base">
                        {isHi ? q.questionHi : q.questionEn}
                      </h4>
                    </div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isHi ? 'सही जवाब' : 'Correct'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        {isHi ? 'गलत हुआ' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctIndex;
                      const isOptionSelected = oIdx === selectedIdx;

                      let optStyle = 'bg-white border-slate-200 text-slate-700';
                      if (isOptionCorrect) {
                        optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optStyle = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-sm flex items-center gap-2 ${optStyle}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white/80 text-xs font-bold flex items-center justify-center shrink-0">
                            {['A', 'B', 'C', 'D'][oIdx]}
                          </span>
                          <span>{opt}</span>
                          {isOptionCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* "Why is this correct?" Explanation Box with Image */}
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                    {(q.explanationImage || q.image) && (
                      <img
                        src={q.explanationImage || q.image}
                        alt="Explanation"
                        referrerPolicy="no-referrer"
                        className="w-full sm:w-28 h-24 object-cover rounded-xl border border-amber-200 shrink-0 shadow-sm"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1 uppercase tracking-wide">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isHi ? '💡 यह उत्तर क्यों सही है?' : '💡 Why is this correct?'}</span>
                      </div>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                        {isHi ? q.explanationHi : q.explanationEn}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Question Playing View
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Top Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <button
          onClick={() => setActiveQuiz(null)}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          ← {isHi ? 'क्विज़ सूची पर वापस' : 'Back to Quizzes'}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            {isHi ? `सवाल ${currentQIndex + 1} / ${activeQuiz.questions.length}` : `Question ${currentQIndex + 1} of ${activeQuiz.questions.length}`}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            {isHi ? `स्कोर: ${score}` : `Score: ${score}`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-300"
          style={{ width: `${((currentQIndex + 1) / activeQuiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-lg space-y-6">
          {/* Question Title & Audio */}
          <div className="space-y-4">
            {currentQ.image && (
              <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                <img
                  src={currentQ.image}
                  alt="Question Visual"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug font-display">
                {isHi ? currentQ.questionHi : currentQ.questionEn}
              </h3>
              <button
                onClick={() => speakText(isHi ? currentQ.questionHi : currentQ.questionEn, isHi ? 'hi' : 'en')}
                className="p-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors shrink-0"
                title={isHi ? 'सवाल सुनें' : 'Listen to question'}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((optText, oIdx) => {
              const isSelected = selectedOption === oIdx;
              const isCorrectAnswer = oIdx === currentQ.correctIndex;

              let btnStyle = 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400 shadow-md';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-400';
                } else {
                  btnStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={oIdx}
                  id={`quiz-option-${oIdx}`}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between group ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white shadow-sm border border-slate-200 text-sm font-bold flex items-center justify-center text-slate-700 shrink-0 group-hover:scale-105">
                      {['A', 'B', 'C', 'D'][oIdx]}
                    </span>
                    <span className="text-base font-semibold">{optText}</span>
                  </div>

                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Explanation Box ("Kyo Sahi Hai" with Explanation Image) */}
          {isAnswered && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <span>
                  {selectedOption === currentQ.correctIndex
                    ? (isHi ? '🎉 शाबाश! आपका जवाब बिल्कुल सही है।' : '🎉 Excellent! That is correct.')
                    : (isHi ? '💡 सही उत्तर और कारण जानें:' : '💡 Correct Answer Explanation:')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {currentQ.explanationImage && (
                  <img
                    src={currentQ.explanationImage}
                    alt="Explanation Visual"
                    referrerPolicy="no-referrer"
                    className="w-full sm:w-32 h-28 object-cover rounded-xl border border-amber-200 shadow-sm shrink-0"
                  />
                )}
                <div className="flex-1 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">
                    {isHi ? `सही उत्तर: ${currentQ.options[currentQ.correctIndex]}` : `Correct: ${currentQ.options[currentQ.correctIndex]}`}
                  </p>
                  <p>{isHi ? currentQ.explanationHi : currentQ.explanationEn}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-200/60 flex justify-end">
                <button
                  id="quiz-next-q-btn"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>
                    {currentQIndex + 1 < activeQuiz.questions.length
                      ? (isHi ? 'अगला सवाल (Next Question) →' : 'Next Question →')
                      : (isHi ? 'रिजल्ट देखें (View Results) 🏆' : 'View Results 🏆')}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
