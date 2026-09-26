import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2,
  Eye,
  Smile,
  Puzzle,
  Award,
  Volume2,
  Timer,
  Zap,
  HelpCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, KidsGameItem } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { INITIAL_KIDS_GAMES } from '../data/gamesData';
import { getStoredGames } from '../utils/storage';

interface KidsMiniGamesHubProps {
  language: Language;
  soundEnabled: boolean;
  gamesList?: KidsGameItem[];
  onBackToHome?: () => void;
}

// 1. MEMORY MATCH ITEMS
const ANIMAL_PAIRS = [
  { id: 'lion', emoji: '🦁', nameHi: 'शेर (Lion)', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'elephant', emoji: '🐘', nameHi: 'हाथी (Elephant)', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'rabbit', emoji: '🐰', nameHi: 'खरगोश (Rabbit)', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'monkey', emoji: '🐵', nameHi: 'बंदर (Monkey)', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'peacock', emoji: '🦚', nameHi: 'मोर (Peacock)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'parrot', emoji: '🦜', nameHi: 'तोता (Parrot)', color: 'bg-green-100 text-green-900 border-green-300' },
];

// 2. PUZZLE IMAGES
const PUZZLE_IMAGES = [
  {
    id: 'lion-mouse',
    titleHi: 'शेर और दयालु चूहा (Lion & Mouse)',
    src: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'peacock',
    titleHi: 'सुंदर पंखों वाला मोर (Dancing Peacock)',
    src: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'elephant',
    titleHi: 'जंगल का प्यारा हाथी (Elephant Safari)',
    src: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
  },
];

// 4. ANIMAL SOUND QUIZ QUESTIONS
const ANIMAL_QUIZ_DATA = [
  {
    id: 'q1',
    soundHint: 'दहाड़ता हूँ (Roar) और जंगल का राजा कहलाता हूँ!',
    soundVoice: 'Grrr... Roarrr!',
    options: [
      { id: 'lion', emoji: '🦁', name: 'शेर (Lion)', isCorrect: true },
      { id: 'monkey', emoji: '🐵', name: 'बंदर (Monkey)', isCorrect: false },
      { id: 'rabbit', emoji: '🐰', name: 'खरगोश (Rabbit)', isCorrect: false },
    ],
    funFactHi: 'शेर की दहाड़ 8 किलोमीटर दूर तक सुनाई देती है!',
  },
  {
    id: 'q2',
    soundHint: 'म्याऊँ-म्याऊँ (Meow) करती हूँ और दूध पीती हूँ!',
    soundVoice: 'Meowww... Meowww!',
    options: [
      { id: 'dog', emoji: '🐶', name: 'कुत्ता (Dog)', isCorrect: false },
      { id: 'cat', emoji: '🐱', name: 'बिल्ली (Cat)', isCorrect: true },
      { id: 'cow', emoji: '🐮', name: 'गाय (Cow)', isCorrect: false },
    ],
    funFactHi: 'बिल्लियाँ अंधेरे में भी इंसानों से 6 गुना बेहतर देख सकती हैं!',
  },
  {
    id: 'q3',
    soundHint: 'पीहू-पीहू की आवाज निकालता हूँ और बारिश में नाचता हूँ!',
    soundVoice: 'Peehu... Peehu!',
    options: [
      { id: 'peacock', emoji: '🦚', name: 'मोर (Peacock)', isCorrect: true },
      { id: 'parrot', emoji: '🦜', name: 'तोता (Parrot)', isCorrect: false },
      { id: 'duck', emoji: '🦆', name: 'बतख (Duck)', isCorrect: false },
    ],
    funFactHi: 'मोर भारत का राष्ट्रीय पक्षी है और इसके पंख बहुत सुंदर होते हैं।',
  },
  {
    id: 'q4',
    soundHint: 'लंबी सूंड से चिंघाड़ता हूँ और पानी फव्वारे जैसे फेंकता हूँ!',
    soundVoice: 'Trumpet sound... Pawoo!',
    options: [
      { id: 'horse', emoji: '🐴', name: 'घोड़ा (Horse)', isCorrect: false },
      { id: 'elephant', emoji: '🐘', name: 'हाथी (Elephant)', isCorrect: true },
      { id: 'bear', emoji: '🐻', name: 'भालू (Bear)', isCorrect: false },
    ],
    funFactHi: 'हाथी धरती पर सबसे बड़े और बहुत बुद्धिमान स्तनपायी जीव हैं।',
  },
];

// 5. WORD BUILDER DATA
const WORD_BUILDER_DATA = [
  { id: 'w1', word: 'कमल', meaning: 'Lotus 🪷', scrambled: ['ल', 'क', 'म'], emoji: '🪷' },
  { id: 'w2', word: 'शेर', meaning: 'Lion 🦁', scrambled: ['र', 'श', 'े'], emoji: '🦁' },
  { id: 'w3', word: 'हाथी', meaning: 'Elephant 🐘', scrambled: ['थ', 'ह', 'ा', 'ी'], emoji: '🐘' },
  { id: 'w4', word: 'तोता', meaning: 'Parrot 🦜', scrambled: ['त', 'ो', 'त', 'ा'], emoji: '🦜' },
  { id: 'w5', word: 'मोर', meaning: 'Peacock 🦚', scrambled: ['र', 'म', 'ो'], emoji: '🦚' },
  { id: 'w6', word: 'तितली', meaning: 'Butterfly 🦋', scrambled: ['त', 'ि', 'त', 'ल', 'ी'], emoji: '🦋' },
];

export const KidsMiniGamesHub: React.FC<KidsMiniGamesHubProps> = ({
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const games = getStoredGames();
  const [selectedGameTab, setSelectedGameTab] = useState<string>('memory');

  // ----------------------------------------------------
  // 1. MEMORY MATCH STATE
  // ----------------------------------------------------
  interface MemoryCard {
    uid: number;
    id: string;
    emoji: string;
    nameHi: string;
    color: string;
    isFlipped: boolean;
    isMatched: boolean;
  }
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isMemoryWon, setIsMemoryWon] = useState<boolean>(false);

  const startMemoryGame = () => {
    const deck: MemoryCard[] = [];
    let uid = 0;
    [...ANIMAL_PAIRS, ...ANIMAL_PAIRS].forEach((item) => {
      deck.push({
        uid: uid++,
        id: item.id,
        emoji: item.emoji,
        nameHi: item.nameHi,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
    });
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsMemoryWon(false);
  };

  useEffect(() => {
    startMemoryGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedCards.length >= 2) return;
    if (soundEnabled) playPopSound();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].id === cards[secondIdx].id) {
        setTimeout(() => {
          if (soundEnabled) playSuccessSound();
          const matchedState = [...cards];
          matchedState[firstIdx].isMatched = true;
          matchedState[secondIdx].isMatched = true;
          setCards(matchedState);
          setFlippedCards([]);
          const newPairsCount = matchedPairs + 1;
          setMatchedPairs(newPairsCount);
          if (newPairsCount === ANIMAL_PAIRS.length) {
            setIsMemoryWon(true);
            confetti({ particleCount: 80, spread: 80 });
          }
        }, 350);
      } else {
        setTimeout(() => {
          const resetFlipped = [...cards];
          resetFlipped[firstIdx].isFlipped = false;
          resetFlipped[secondIdx].isFlipped = false;
          setCards(resetFlipped);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // ----------------------------------------------------
  // 2. JIGSAW PUZZLE STATE
  // ----------------------------------------------------
  const [selectedPuzzleImg, setSelectedPuzzleImg] = useState(PUZZLE_IMAGES[0]);
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedTileIdx, setSelectedTileIdx] = useState<number | null>(null);
  const [puzzleMoves, setPuzzleMoves] = useState<number>(0);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const shuffleTiles = () => {
    if (soundEnabled) playPopSound();
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setSelectedTileIdx(null);
    setPuzzleMoves(0);
    setIsPuzzleSolved(false);
  };

  useEffect(() => {
    shuffleTiles();
  }, [selectedPuzzleImg.id]);

  const handleTileClick = (index: number) => {
    if (isPuzzleSolved) return;
    if (soundEnabled) playPopSound();

    if (selectedTileIdx === null) {
      setSelectedTileIdx(index);
    } else {
      if (selectedTileIdx === index) {
        setSelectedTileIdx(null);
        return;
      }
      const nextTiles = [...tiles];
      const temp = nextTiles[selectedTileIdx];
      nextTiles[selectedTileIdx] = nextTiles[index];
      nextTiles[index] = temp;
      setTiles(nextTiles);
      setSelectedTileIdx(null);
      setPuzzleMoves((m) => m + 1);

      const isSolved = nextTiles.every((val, idx) => val === idx);
      if (isSolved) {
        if (soundEnabled) playSuccessSound();
        setIsPuzzleSolved(true);
        confetti({ particleCount: 90, spread: 90 });
      }
    }
  };

  // ----------------------------------------------------
  // 3. BALLOON POP GAME STATE
  // ----------------------------------------------------
  interface BalloonItem {
    id: number;
    color: string;
    number: number;
    x: number;
    speed: number;
    isPopped: boolean;
  }
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [balloonScore, setBalloonScore] = useState<number>(0);
  const [isBalloonPlaying, setIsBalloonPlaying] = useState<boolean>(false);

  const startBalloonGame = () => {
    setBalloonScore(0);
    setIsBalloonPlaying(true);
    generateBalloons();
  };

  const generateBalloons = () => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-amber-400', 'bg-emerald-500',
      'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-400'
    ];
    const initialBalloons: BalloonItem[] = [];
    for (let i = 0; i < 10; i++) {
      initialBalloons.push({
        id: i,
        color: colors[i % colors.length],
        number: i + 1,
        x: Math.floor(Math.random() * 80) + 5,
        speed: Math.random() * 1.5 + 1,
        isPopped: false,
      });
    }
    setBalloons(initialBalloons);
  };

  const handlePopBalloon = (id: number) => {
    if (soundEnabled) playPopSound();
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPopped: true } : b))
    );
    const newScore = balloonScore + 10;
    setBalloonScore(newScore);

    if (newScore % 50 === 0) {
      if (soundEnabled) playSuccessSound();
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  // ----------------------------------------------------
  // 4. ANIMAL SOUND / CLUES QUIZ STATE
  // ----------------------------------------------------
  const [animalQuizIdx, setAnimalQuizIdx] = useState<number>(0);
  const [animalQuizScore, setAnimalQuizScore] = useState<number>(0);
  const [animalQuizAnswered, setAnimalQuizAnswered] = useState<boolean>(false);
  const [animalQuizSelectedOpt, setAnimalQuizSelectedOpt] = useState<string | null>(null);

  const currentAnimalQ = ANIMAL_QUIZ_DATA[animalQuizIdx];

  const handleAnswerAnimalQuiz = (optId: string, isCorrect: boolean) => {
    if (animalQuizAnswered) return;
    setAnimalQuizAnswered(true);
    setAnimalQuizSelectedOpt(optId);

    if (isCorrect) {
      if (soundEnabled) playSuccessSound();
      setAnimalQuizScore((s) => s + 10);
      confetti({ particleCount: 40, spread: 50 });
    } else {
      if (soundEnabled) playPopSound();
    }
  };

  const handleNextAnimalQuiz = () => {
    setAnimalQuizAnswered(false);
    setAnimalQuizSelectedOpt(null);
    if (animalQuizIdx < ANIMAL_QUIZ_DATA.length - 1) {
      setAnimalQuizIdx((idx) => idx + 1);
    } else {
      setAnimalQuizIdx(0);
    }
  };

  // ----------------------------------------------------
  // 5. WORD BUILDER GAME STATE
  // ----------------------------------------------------
  const [wordIdx, setWordIdx] = useState<number>(0);
  const currentWordItem = WORD_BUILDER_DATA[wordIdx];
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isWordCorrect, setIsWordCorrect] = useState<boolean>(false);

  useEffect(() => {
    setAvailableLetters([...currentWordItem.scrambled]);
    setBuiltWord([]);
    setIsWordCorrect(false);
  }, [wordIdx]);

  const handleSelectLetter = (letter: string, index: number) => {
    if (soundEnabled) playPopSound();
    const nextBuilt = [...builtWord, letter];
    setBuiltWord(nextBuilt);

    const nextAvail = [...availableLetters];
    nextAvail.splice(index, 1);
    setAvailableLetters(nextAvail);

    if (nextBuilt.join('') === currentWordItem.word) {
      if (soundEnabled) playSuccessSound();
      setIsWordCorrect(true);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const handleResetWord = () => {
    if (soundEnabled) playPopSound();
    setAvailableLetters([...currentWordItem.scrambled]);
    setBuiltWord([]);
    setIsWordCorrect(false);
  };

  const handleNextWord = () => {
    if (wordIdx < WORD_BUILDER_DATA.length - 1) {
      setWordIdx((i) => i + 1);
    } else {
      setWordIdx(0);
    }
  };

  // ----------------------------------------------------
  // 6. WHACK-A-MONKEY STATE
  // ----------------------------------------------------
  const [whackActiveHole, setWhackActiveHole] = useState<number | null>(null);
  const [whackScore, setWhackScore] = useState<number>(0);
  const [whackTimer, setWhackTimer] = useState<number>(25);
  const [isWhackRunning, setIsWhackRunning] = useState<boolean>(false);

  const startWhackGame = () => {
    setWhackScore(0);
    setWhackTimer(25);
    setIsWhackRunning(true);
  };

  useEffect(() => {
    let timerInterval: any;
    let moleInterval: any;

    if (isWhackRunning && whackTimer > 0) {
      timerInterval = setInterval(() => {
        setWhackTimer((t) => t - 1);
      }, 1000);

      moleInterval = setInterval(() => {
        const randomHole = Math.floor(Math.random() * 6);
        setWhackActiveHole(randomHole);
      }, 850);
    } else if (whackTimer === 0) {
      setIsWhackRunning(false);
      setWhackActiveHole(null);
      if (soundEnabled) playSuccessSound();
      confetti({ particleCount: 60, spread: 70 });
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(moleInterval);
    };
  }, [isWhackRunning, whackTimer]);

  const handleWhackHole = (holeIdx: number) => {
    if (!isWhackRunning) return;
    if (whackActiveHole === holeIdx) {
      if (soundEnabled) playPopSound();
      setWhackScore((s) => s + 10);
      setWhackActiveHole(null); // caught
    }
  };

  // ----------------------------------------------------
  // 7. TIC-TAC-TOE STATE
  // ----------------------------------------------------
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true); // X = 🦁 (Lion), O = 🐰 (Rabbit)
  const [vsAi, setVsAi] = useState<boolean>(true);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const tttWinner = calculateWinner(board);
  const isTttDraw = !tttWinner && board.every((sq) => sq !== null);

  const handleTttClick = (idx: number) => {
    if (board[idx] || tttWinner) return;
    if (soundEnabled) playPopSound();

    const newBoard = [...board];
    newBoard[idx] = isXNext ? '🦁' : '🐰';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const winner = calculateWinner(newBoard);
    if (winner) {
      if (soundEnabled) playSuccessSound();
      confetti({ particleCount: 60, spread: 70 });
    } else if (vsAi && isXNext) {
      // AI's turn (Rabbit 🐰)
      setTimeout(() => {
        const emptyIndices = newBoard.map((val, i) => (val === null ? i : null)).filter((v) => v !== null) as number[];
        if (emptyIndices.length > 0) {
          const aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const aiBoard = [...newBoard];
          aiBoard[aiChoice] = '🐰';
          setBoard(aiBoard);
          setIsXNext(true);
          const aiWinner = calculateWinner(aiBoard);
          if (aiWinner && soundEnabled) playSuccessSound();
        }
      }, 400);
    }
  };

  const resetTtt = () => {
    if (soundEnabled) playPopSound();
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="space-y-6 pb-16 font-kids">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-rose-500 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-2">
            <Gamepad2 className="w-4 h-4 text-purple-200" />
            <span>{isHi ? 'किड्स गेम्स ज़ोन (8 मज़ेदार खेल)' : 'Kids Brain Games & Puzzles (8 Games)'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isHi ? '🎮 बाल गेम्स व दिमागी कसरत मंच' : '🎮 Play, Learn & Have Fun!'}
          </h1>
          <p className="text-white/90 text-xs sm:text-sm font-bold mt-1">
            {isHi
              ? 'मेमोरी मैच, जिगसॉ पहेली, गुब्बारे फोड़ो, पशु ध्वनि क्विज़, शब्द बनाओ और चंचल बंदर पकड़ो खेलें!'
              : 'Boost memory, reflexes & Hindi vocabulary with 8 exciting kid-friendly games!'}
          </p>
        </div>
      </div>

      {/* 8 Game Selector Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {games.map((g) => {
          const isSelected = selectedGameTab === g.category;
          return (
            <button
              key={g.id}
              onClick={() => {
                if (soundEnabled) playPopSound();
                setSelectedGameTab(g.category);
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                isSelected
                  ? 'border-amber-500 bg-amber-500 text-white shadow-md scale-102 font-black'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 font-bold'
              }`}
            >
              <span className="text-2xl shrink-0">{g.emoji}</span>
              <div className="min-w-0">
                <span className="text-xs font-black block leading-tight truncate">
                  {isHi ? g.titleHi : g.titleEn}
                </span>
                <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                  {g.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. MEMORY MATCH GAME */}
      {/* ========================================================================= */}
      {selectedGameTab === 'memory' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-sm space-y-5 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-black text-slate-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                {isHi ? 'चालें:' : 'Moves:'} {moves}
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {isHi ? 'जोड़ियाँ:' : 'Matched:'} {matchedPairs} / {ANIMAL_PAIRS.length}
              </span>
            </div>

            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                startMemoryGame();
              }}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 text-slate-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'नया खेल' : 'Reset'}</span>
            </button>
          </div>

          {isMemoryWon && (
            <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-2xl p-4 text-white text-center space-y-1.5 animate-bounce shadow-md">
              <span className="text-3xl">🎉 🏆 ⭐</span>
              <h3 className="text-lg font-black">
                {isHi ? 'अद्भुत! आपने सभी जोड़ियाँ ढूँढ लीं!' : 'Superb! You matched all pairs!'}
              </h3>
              <p className="text-xs text-white/95 font-bold">
                {isHi ? `कुल ${moves} चालों में खेल पूरा हुआ!` : `Completed in ${moves} moves!`}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {cards.map((card, idx) => {
              const showFace = card.isFlipped || card.isMatched;
              return (
                <button
                  key={card.uid}
                  onClick={() => handleCardClick(idx)}
                  disabled={card.isMatched}
                  className={`aspect-square rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer ${
                    card.isMatched
                      ? 'bg-emerald-50 border-emerald-400 opacity-80 scale-95'
                      : showFace
                      ? `${card.color} scale-105 shadow-md`
                      : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 hover:scale-102'
                  }`}
                >
                  {showFace ? (
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <span className="text-3xl sm:text-4xl">{card.emoji}</span>
                      <span className="text-[10px] sm:text-xs font-black text-slate-800 line-clamp-1">
                        {card.nameHi}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white">
                      <span className="text-2xl">❓</span>
                      <span className="text-[9px] font-black tracking-wider text-amber-100 uppercase mt-0.5">
                        Baalvarta
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. JIGSAW PUZZLE */}
      {/* ========================================================================= */}
      {selectedGameTab === 'puzzle' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-purple-200 shadow-sm space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                {isHi ? 'चालें:' : 'Swaps:'} {puzzleMoves}
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="py-1 px-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3 text-purple-600" />
                <span>{showHint ? 'इशारा छिपाएँ' : 'इशारा (Hint)'}</span>
              </button>
            </div>

            <button
              onClick={shuffleTiles}
              className="py-1.5 px-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'मिलाएँ' : 'Shuffle'}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center gap-3">
              <img
                src={selectedPuzzleImg.src}
                alt="Hint"
                className="w-16 h-16 rounded-xl object-cover border border-purple-300 shadow-xs"
              />
              <div className="text-xs text-purple-900 font-bold">
                <span className="block font-black">{selectedPuzzleImg.titleHi}</span>
                <span className="text-[11px] text-purple-700">टुकड़ों को सही जगह पर लाकर तस्वीर पूरी करें।</span>
              </div>
            </div>
          )}

          {isPuzzleSolved && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white text-center space-y-1 animate-bounce shadow-md">
              <span className="text-3xl">🌟 🏆 🎨</span>
              <h3 className="text-lg font-black">
                {isHi ? 'शाबाश! आपने पहेली सुलझा ली!' : 'Brilliant! You solved the puzzle!'}
              </h3>
            </div>
          )}

          <div className="relative aspect-square max-w-[360px] mx-auto grid grid-cols-3 gap-1.5 p-2 bg-purple-100 rounded-3xl border-4 border-purple-300 shadow-inner">
            {tiles.map((tilePos, idx) => {
              const isSelected = selectedTileIdx === idx;
              const row = Math.floor(tilePos / 3);
              const col = tilePos % 3;

              return (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer aspect-square ${
                    isSelected
                      ? 'border-amber-400 ring-4 ring-amber-300 scale-95 z-10 shadow-lg'
                      : 'border-white hover:border-purple-300'
                  }`}
                  style={{
                    backgroundImage: `url(${selectedPuzzleImg.src})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${col * 50}% ${row * 50}%`,
                  }}
                >
                  <span className="absolute top-1 left-1.5 text-[9px] font-black text-white/90 bg-black/40 px-1 rounded-sm">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BALLOON POP GAME */}
      {/* ========================================================================= */}
      {selectedGameTab === 'balloon' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-rose-200 shadow-sm space-y-5 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>{isHi ? 'स्कोर:' : 'Score:'} {balloonScore} pts</span>
              </span>
            </div>

            <button
              onClick={startBalloonGame}
              className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-black shadow-xs cursor-pointer"
            >
              {isBalloonPlaying ? 'फिर से शुरू करें' : '🎈 खेल शुरू करें'}
            </button>
          </div>

          <div className="relative h-80 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 rounded-3xl border-4 border-rose-200 overflow-hidden flex flex-wrap items-center justify-center gap-4 p-4 shadow-inner">
            {balloons.map((b) => (
              <button
                key={b.id}
                onClick={() => !b.isPopped && handlePopBalloon(b.id)}
                disabled={b.isPopped}
                className={`w-14 h-18 rounded-full flex flex-col items-center justify-center text-white font-black text-sm shadow-md transition-all cursor-pointer ${
                  b.isPopped
                    ? 'scale-0 opacity-0 transition-transform duration-200'
                    : `${b.color} hover:scale-110 active:scale-90 animate-bounce`
                }`}
                style={{ animationDuration: `${1.5 + (b.id % 3) * 0.4}s` }}
              >
                <span>{b.number}</span>
                <span className="w-1 h-3 bg-white/40 rounded-full mt-1"></span>
              </button>
            ))}

            {!isBalloonPlaying && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3 p-4 text-center">
                <span className="text-4xl">🎈 💥 🎈</span>
                <h3 className="text-xl font-black">
                  {isHi ? 'गुब्बारे फोड़ो और अंक बनाओ!' : 'Pop Balloons & Learn Numbers!'}
                </h3>
                <button
                  onClick={startBalloonGame}
                  className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-sm shadow-lg cursor-pointer transition-transform active:scale-95"
                >
                  {isHi ? '▶️ अभी खेलें (Play Now)' : 'Play Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ANIMAL SOUND / CLUES QUIZ */}
      {/* ========================================================================= */}
      {selectedGameTab === 'animal_quiz' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              प्रश्न: {animalQuizIdx + 1} / {ANIMAL_QUIZ_DATA.length}
            </span>
            <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              स्कोर: {animalQuizScore} pts
            </span>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 text-center space-y-2 border border-emerald-200">
            <span className="text-3xl">🔊 🐾</span>
            <h3 className="text-base font-black text-emerald-950">
              "{currentAnimalQ.soundHint}"
            </h3>
            <span className="text-xs font-bold text-emerald-700 block italic">
              आवाज: {currentAnimalQ.soundVoice}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {currentAnimalQ.options.map((opt) => {
              const isSelected = animalQuizSelectedOpt === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerAnimalQuiz(opt.id, opt.isCorrect)}
                  disabled={animalQuizAnswered}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    animalQuizAnswered
                      ? opt.isCorrect
                        ? 'bg-emerald-500 border-emerald-600 text-white font-black'
                        : isSelected
                        ? 'bg-rose-500 border-rose-600 text-white font-black'
                        : 'bg-white text-slate-400 border-slate-200'
                      : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800 font-bold'
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-xs font-black">{opt.name}</span>
                </button>
              );
            })}
          </div>

          {animalQuizAnswered && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 font-bold">
                💡 <strong>रोचक तथ्य:</strong> {currentAnimalQ.funFactHi}
              </div>
              <button
                onClick={handleNextAnimalQuiz}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>अगला जानवर →</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HINDI WORD BUILDER */}
      {/* ========================================================================= */}
      {selectedGameTab === 'word' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-sm space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <span className="text-xs font-black text-sky-900 bg-sky-100 px-3 py-1 rounded-full border border-sky-200">
              शब्द: {wordIdx + 1} / {WORD_BUILDER_DATA.length} ({currentWordItem.meaning})
            </span>
            <button
              onClick={handleResetWord}
              className="py-1 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              रीसेट
            </button>
          </div>

          <div className="text-center space-y-2">
            <span className="text-5xl">{currentWordItem.emoji}</span>
            <p className="text-xs font-bold text-slate-600">
              नीचे दिए गए अक्षरों को सही क्रम में चुनकर शब्द बनाएँ:
            </p>
          </div>

          {/* Built word boxes */}
          <div className="flex items-center justify-center gap-2 min-h-[60px] p-3 bg-sky-50 rounded-2xl border-2 border-dashed border-sky-300">
            {builtWord.length === 0 ? (
              <span className="text-xs text-slate-400 font-bold">यहाँ अक्षर दिखाई देंगे...</span>
            ) : (
              builtWord.map((ch, i) => (
                <span
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white border-2 border-sky-400 text-sky-900 font-black text-xl flex items-center justify-center shadow-xs animate-in zoom-in"
                >
                  {ch}
                </span>
              ))
            )}
          </div>

          {/* Scrambled letter buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {availableLetters.map((ch, i) => (
              <button
                key={i}
                onClick={() => handleSelectLetter(ch, i)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-xl shadow-md cursor-pointer transition-transform active:scale-90 flex items-center justify-center"
              >
                {ch}
              </button>
            ))}
          </div>

          {isWordCorrect && (
            <div className="p-3 bg-emerald-500 text-white rounded-2xl text-center space-y-2 animate-bounce shadow-md">
              <span className="text-2xl">🎉 शाबाश! सही शब्द: {currentWordItem.word}</span>
              <button
                onClick={handleNextWord}
                className="block mx-auto py-1.5 px-4 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-xs cursor-pointer hover:bg-emerald-50"
              >
                अगला शब्द →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. WHACK-A-MONKEY */}
      {/* ========================================================================= */}
      {selectedGameTab === 'whack' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-yellow-200 shadow-sm space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-yellow-100 pb-3">
            <span className="text-xs font-black text-yellow-950 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
              स्कोर: {whackScore} pts
            </span>
            <span className="text-xs font-black text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
              समय: {whackTimer}s
            </span>
            <button
              onClick={startWhackGame}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-black shadow-xs cursor-pointer"
            >
              {isWhackRunning ? 'पुनः खेलें' : '🐵 शुरू करें'}
            </button>
          </div>

          {/* 6 Tree Holes Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-emerald-100 rounded-3xl border-4 border-emerald-300 shadow-inner">
            {[0, 1, 2, 3, 4, 5].map((holeIdx) => {
              const isMonkeyHere = whackActiveHole === holeIdx;
              return (
                <button
                  key={holeIdx}
                  onClick={() => handleWhackHole(holeIdx)}
                  className="aspect-square rounded-2xl bg-amber-900/80 border-4 border-amber-950/60 shadow-inner flex items-center justify-center overflow-hidden relative cursor-pointer active:scale-95 transition-transform"
                >
                  {isMonkeyHere ? (
                    <span className="text-4xl sm:text-5xl animate-bounce">🐵</span>
                  ) : (
                    <span className="text-xs text-amber-700/60 font-black">पत्ता 🌿</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TIC-TAC-TOE */}
      {/* ========================================================================= */}
      {selectedGameTab === 'tictactoe' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-violet-200 shadow-sm space-y-5 max-w-sm mx-auto">
          <div className="flex items-center justify-between border-b border-violet-100 pb-3">
            <span className="text-xs font-black text-violet-900">
              {tttWinner
                ? `विजेता: ${tttWinner} 🎉`
                : isTttDraw
                ? 'मुकाबला बराबरी (Draw)! 🤝'
                : `बारी: ${isXNext ? '🦁 शेर' : '🐰 खरगोश'}`}
            </span>

            <button
              onClick={resetTtt}
              className="py-1.5 px-3 rounded-xl border border-violet-200 text-xs font-black text-violet-800 bg-violet-50 hover:bg-violet-100 cursor-pointer"
            >
              नया खेल
            </button>
          </div>

          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-violet-100 rounded-3xl border-4 border-violet-300 shadow-inner aspect-square">
            {board.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleTttClick(idx)}
                className="rounded-2xl bg-white border-2 border-violet-200 text-4xl flex items-center justify-center font-black shadow-xs hover:bg-violet-50 transition-all cursor-pointer aspect-square"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. COLOR BASKET SORT */}
      {/* ========================================================================= */}
      {selectedGameTab === 'color_sort' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-teal-200 shadow-sm space-y-5 max-w-xl mx-auto text-center">
          <div className="space-y-1">
            <span className="text-3xl">🧺 🍎 🍌 🍇</span>
            <h3 className="text-base font-black text-teal-950">
              {isHi ? 'रंग और फल मिलान खेल' : 'Match Fruits with Color Baskets'}
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              {isHi ? 'लाल सेब को लाल टोकरी में और पीले आम को पीली टोकरी में रखें।' : 'Sort matching colors!'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { name: 'लाल टोकरी', emoji: '🍎', color: 'bg-red-100 border-red-400 text-red-900', label: 'लाल (Red)' },
              { name: 'पीली टोकरी', emoji: '🍌', color: 'bg-yellow-100 border-yellow-400 text-yellow-900', label: 'पीला (Yellow)' },
              { name: 'हरी टोकरी', emoji: '🍉', color: 'bg-emerald-100 border-emerald-400 text-emerald-900', label: 'हरा (Green)' },
            ].map((basket, i) => (
              <button
                key={i}
                onClick={() => {
                  if (soundEnabled) playSuccessSound();
                  confetti({ particleCount: 30, spread: 40 });
                }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs ${basket.color}`}
              >
                <span className="text-4xl">{basket.emoji}</span>
                <span className="text-xs font-black">{basket.name}</span>
                <span className="text-[10px] font-bold opacity-80">{basket.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
