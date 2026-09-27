import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  Download,
  Trash2,
  Undo2,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Trophy,
  CheckCircle2,
  Zap,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, KidsGameItem } from '../types';
import { playPopSound, playSuccessSound, playStarChime } from '../utils/soundEffects';
import { getStoredGames } from '../utils/storage';

interface KidsMiniGamesHubProps {
  language: Language;
  soundEnabled: boolean;
  gamesList?: KidsGameItem[];
  onBackToHome?: () => void;
}

// ============================================================================
// WEB AUDIO SYNTHESIZER UTILITIES (Bulletproof, instant latency-free audio)
// ============================================================================
let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playSynthesizedNote(freq: number, mode: 'piano' | 'cat' | 'bird' | 'tabla' = 'piano') {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    if (mode === 'piano') {
      // Warm melodious chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    } else if (mode === 'cat') {
      // Playful Meow (pitch drop)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.3, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.45);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (mode === 'bird') {
      // Sweet Bird Chirp (quick warble)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, now);
      osc.frequency.linearRampToValueAtTime(freq * 2.2, now + 0.08);
      osc.frequency.linearRampToValueAtTime(freq * 1.8, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (mode === 'tabla') {
      // Percussive thump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // ignore
  }
}

function playHonkSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(290, now);
    osc2.frequency.setValueAtTime(360, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch {}
}

export const KidsMiniGamesHub: React.FC<KidsMiniGamesHubProps> = ({
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const games = getStoredGames();
  const [selectedGameTab, setSelectedGameTab] = useState<string>('piano');
  const [victoryBanner, setVictoryBanner] = useState<string | null>(null);

  const triggerVictory = (msg: string) => {
    if (soundEnabled) playSuccessSound();
    confetti({ particleCount: 75, spread: 80 });
    setVictoryBanner(msg);
  };

  // =========================================================================
  // 1. 🎹 बच्चों का पियानो व संगीत (KIDS MAGIC PIANO)
  // =========================================================================
  const PIANO_KEYS = [
    { note: 'सा', en: 'C4', freq: 261.63, color: 'bg-rose-500 hover:bg-rose-600 text-white', border: 'border-rose-600' },
    { note: 'रे', en: 'D4', freq: 293.66, color: 'bg-orange-500 hover:bg-orange-600 text-white', border: 'border-orange-600' },
    { note: 'ग', en: 'E4', freq: 329.63, color: 'bg-amber-400 hover:bg-amber-500 text-amber-950', border: 'border-amber-500' },
    { note: 'म', en: 'F4', freq: 349.23, color: 'bg-emerald-500 hover:bg-emerald-600 text-white', border: 'border-emerald-600' },
    { note: 'प', en: 'G4', freq: 392.0, color: 'bg-cyan-500 hover:bg-cyan-600 text-white', border: 'border-cyan-600' },
    { note: 'ध', en: 'A4', freq: 440.0, color: 'bg-blue-500 hover:bg-blue-600 text-white', border: 'border-blue-600' },
    { note: 'नि', en: 'B4', freq: 493.88, color: 'bg-purple-500 hover:bg-purple-600 text-white', border: 'border-purple-600' },
    { note: 'सां', en: 'C5', freq: 523.25, color: 'bg-pink-500 hover:bg-pink-600 text-white', border: 'border-pink-600' },
  ];

  const [pianoMode, setPianoMode] = useState<'piano' | 'cat' | 'bird' | 'tabla'>('piano');
  const [activePianoKey, setActivePianoKey] = useState<number | null>(null);
  const [recordedNotes, setRecordedNotes] = useState<number[]>([]);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);

  const handlePressPianoKey = (idx: number) => {
    setActivePianoKey(idx);
    setTimeout(() => setActivePianoKey(null), 250);
    if (soundEnabled) {
      playSynthesizedNote(PIANO_KEYS[idx].freq, pianoMode);
    }
    setRecordedNotes((prev) => [...prev.slice(-15), idx]);
  };

  const handlePlayRecorded = () => {
    if (recordedNotes.length === 0 || isPlayingRecorded) return;
    setIsPlayingRecorded(true);
    recordedNotes.forEach((keyIdx, i) => {
      setTimeout(() => {
        handlePressPianoKey(keyIdx);
        if (i === recordedNotes.length - 1) {
          setIsPlayingRecorded(false);
          triggerVictory('वाह! आपकी प्यारी धुन बज गई! 🎶');
        }
      }, i * 360);
    });
  };

  // =========================================================================
  // 2. 🫧 बुलबुला पॉप और फोम (MAGIC SOAP BUBBLES)
  // =========================================================================
  interface SoapBubble {
    id: number;
    x: number; // %
    y: number; // %
    size: number; // px
    color: string;
    speed: number;
    wobble: number;
  }
  const [bubbles, setBubbles] = useState<SoapBubble[]>([]);
  const [bubblePopScore, setBubblePopScore] = useState<number>(0);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);

  const createBubble = (id: number): SoapBubble => {
    const rainbowColors = [
      'from-cyan-300/80 via-sky-200/50 to-pink-300/60 border-cyan-200',
      'from-pink-300/80 via-purple-200/50 to-indigo-300/60 border-pink-200',
      'from-emerald-300/80 via-teal-200/50 to-yellow-200/60 border-emerald-200',
      'from-amber-200/80 via-rose-200/50 to-violet-300/60 border-amber-200',
    ];
    return {
      id,
      x: 10 + Math.random() * 80,
      y: 95 + Math.random() * 15,
      size: 55 + Math.floor(Math.random() * 45),
      color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
      speed: 0.25 + Math.random() * 0.35,
      wobble: Math.random() * 10,
    };
  };

  const blowMoreBubbles = () => {
    if (soundEnabled) playPopSound();
    const newBatch = Array.from({ length: 8 }, (_, i) => createBubble(Date.now() + i));
    setBubbles((prev) => [...prev.slice(-12), ...newBatch]);
  };

  useEffect(() => {
    if (selectedGameTab === 'bubble') {
      const initial = Array.from({ length: 9 }, (_, i) => ({
        ...createBubble(Date.now() + i),
        y: 20 + i * 9,
      }));
      setBubbles(initial);
      setBubblePopScore(0);
    }
  }, [selectedGameTab]);

  // Floating animation loop
  useEffect(() => {
    if (selectedGameTab !== 'bubble') return;
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({
            ...b,
            y: b.y - b.speed,
            x: Math.max(5, Math.min(95, b.x + Math.sin(b.y / 8 + b.wobble) * 0.4)),
          }))
          .filter((b) => b.y > -15)
      );
    }, 50);
    return () => clearInterval(interval);
  }, [selectedGameTab]);

  const handlePopBubble = (id: number) => {
    if (soundEnabled) {
      playPopSound();
    }
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setBubblePopScore((s) => {
      const nextScore = s + 10;
      if (nextScore > 0 && nextScore % 80 === 0) {
        triggerVictory('वाह! आपने बहुत सारे बुलबुले फोड़े! 🫧🌟');
      }
      return nextScore;
    });
  };

  // =========================================================================
  // 3. ✨ मैजिक ड्रॉ / जादुई रेखाएं (NEON GLOW DRAWING PAD)
  // =========================================================================
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushColor, setBrushColor] = useState<string>('rainbow');
  const [brushSize, setBrushSize] = useState<number>(6);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const rainbowHueRef = useRef<number>(0);

  const NEON_COLORS = [
    { id: 'rainbow', label: 'इंद्रधनुष 🌈', color: 'rainbow' },
    { id: '#ff007f', label: 'गुलाबी 💖', color: '#ff007f' },
    { id: '#00f0ff', label: 'आसमानी 🩵', color: '#00f0ff' },
    { id: '#39ff14', label: 'नीयन हरा 💚', color: '#39ff14' },
    { id: '#ffe600', label: 'सुनहरा 💛', color: '#ffe600' },
    { id: '#bf55ec', label: 'बैंगनी 💜', color: '#bf55ec' },
    { id: '#ffffff', label: 'सफेद सितारा 🤍', color: '#ffffff' },
  ];

  const clearGlowCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStrokeHistory([]);
    if (soundEnabled) playPopSound();
  };

  useEffect(() => {
    if (selectedGameTab === 'glow_draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth || 550;
      canvas.height = 380;
      clearGlowCanvas();
    }
  }, [selectedGameTab]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setStrokeHistory((prev) => [...prev.slice(-8), imgData]);
    } catch {}
  };

  const undoGlowCanvas = () => {
    if (strokeHistory.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const prevHistory = [...strokeHistory];
    const last = prevHistory.pop();
    setStrokeHistory(prevHistory);
    if (last) {
      ctx.putImageData(last, 0, 0);
    } else {
      clearGlowCanvas();
    }
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    saveCanvasState();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);

    let activeColor = brushColor;
    if (brushColor === 'rainbow') {
      rainbowHueRef.current = (rainbowHueRef.current + 4) % 360;
      activeColor = `hsl(${rainbowHueRef.current}, 100%, 65%)`;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = activeColor;
    ctx.shadowBlur = 14;
    ctx.shadowColor = activeColor;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const addStamp = (emoji: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveCanvasState();
    ctx.font = '40px sans-serif';
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#ffe600';
    const rx = 40 + Math.random() * (canvas.width - 80);
    const ry = 40 + Math.random() * (canvas.height - 80);
    ctx.fillText(emoji, rx, ry);
    if (soundEnabled) playStarChime();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baalvarta_magic_art.png';
    a.click();
    triggerVictory('आपकी चित्रकारी डाउनलोड हो गई! 🎨✨');
  };

  // =========================================================================
  // 4. 🔢 गिनती गिनो और बताओ (COUNT THE CANDIES/STARS)
  // =========================================================================
  const COUNT_OBJECTS = [
    { emoji: '🍬', name: 'रंगीन टॉफियां' },
    { emoji: '⭐', name: 'चमकते सितारे' },
    { emoji: '🍎', name: 'मीठे सेब' },
    { emoji: '🧸', name: 'प्यारे भालू' },
    { emoji: '🎈', name: 'उड़ते गुब्बारे' },
    { emoji: '🧁', name: 'स्वादिष्ट कपकेक' },
  ];

  const [countTarget, setCountTarget] = useState<number>(4);
  const [countItemType, setCountItemType] = useState(COUNT_OBJECTS[0]);
  const [tappedItemIndices, setTappedItemIndices] = useState<number[]>([]);
  const [countScore, setCountScore] = useState<number>(0);
  const [countFeedback, setCountFeedback] = useState<string | null>(null);

  const initCountPuzzle = () => {
    const target = 2 + Math.floor(Math.random() * 7); // 2 to 8
    const item = COUNT_OBJECTS[Math.floor(Math.random() * COUNT_OBJECTS.length)];
    setCountTarget(target);
    setCountItemType(item);
    setTappedItemIndices([]);
    setCountFeedback(null);
  };

  useEffect(() => {
    if (selectedGameTab === 'counting') {
      initCountPuzzle();
      setCountScore(0);
    }
  }, [selectedGameTab]);

  const handleTapCountItem = (idx: number) => {
    if (tappedItemIndices.includes(idx)) return;
    if (soundEnabled) playPopSound();
    setTappedItemIndices([...tappedItemIndices, idx]);
  };

  const handleSelectCountAnswer = (val: number) => {
    if (val === countTarget) {
      if (soundEnabled) playStarChime();
      setCountScore((s) => s + 10);
      setCountFeedback('शाबाश! बिल्कुल सही गिनती! 🌟🎉');
      triggerVictory(`अद्भुत! सही उत्तर: ${val}!`);
      setTimeout(() => {
        initCountPuzzle();
      }, 1600);
    } else {
      if (soundEnabled) playPopSound();
      setCountFeedback('ओह! एक बार फिर से गिनकर देखें 🤔');
      setTimeout(() => setCountFeedback(null), 1200);
    }
  };

  const getCountOptions = () => {
    const opts = new Set<number>([countTarget]);
    while (opts.size < 4) {
      const rand = Math.max(1, countTarget + (Math.floor(Math.random() * 5) - 2));
      opts.add(rand);
    }
    return Array.from(opts).sort((a, b) => a - b);
  };

  // =========================================================================
  // 5. 🔍 छाया पहचानो (SHADOW SILHOUETTE MATCH)
  // =========================================================================
  interface ShadowItem {
    id: string;
    emoji: string;
    nameHi: string;
    matched: boolean;
  }
  const SHADOW_ROUNDS = [
    [
      { id: 'lion', emoji: '🦁', nameHi: 'बब्बर शेर', matched: false },
      { id: 'elephant', emoji: '🐘', nameHi: 'हाथी दादा', matched: false },
      { id: 'rabbit', emoji: '🐰', nameHi: 'नन्हा खरगोश', matched: false },
      { id: 'peacock', emoji: '🦚', nameHi: 'सुंदर मोर', matched: false },
    ],
    [
      { id: 'car', emoji: '🚗', nameHi: 'लाल कार', matched: false },
      { id: 'rocket', emoji: '🚀', nameHi: 'अंतरिक्ष रॉकेट', matched: false },
      { id: 'boat', emoji: '⛵', nameHi: 'नाव', matched: false },
      { id: 'plane', emoji: '✈️', nameHi: 'हवाई जहाज़', matched: false },
    ],
    [
      { id: 'apple', emoji: '🍎', nameHi: 'मीठा सेब', matched: false },
      { id: 'banana', emoji: '🍌', nameHi: 'पीला केला', matched: false },
      { id: 'watermelon', emoji: '🍉', nameHi: 'रसीला तरबूज', matched: false },
      { id: 'grapes', emoji: '🍇', nameHi: 'काले अंगूर', matched: false },
    ],
    [
      { id: 'cat', emoji: '🐱', nameHi: 'बिल्ली मौसी', matched: false },
      { id: 'dog', emoji: '🐶', nameHi: 'वफादार कुत्ता', matched: false },
      { id: 'monkey', emoji: '🐵', nameHi: 'चंचल बंदर', matched: false },
      { id: 'frog', emoji: '🐸', nameHi: 'मेंढक भाई', matched: false },
    ],
  ];

  const [shadowRoundIdx, setShadowRoundIdx] = useState<number>(0);
  const [shadowItems, setShadowItems] = useState<ShadowItem[]>(SHADOW_ROUNDS[0]);
  const [shuffledShadowIds, setShuffledShadowIds] = useState<string[]>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);

  const initShadowGame = (rIdx = 0) => {
    const roundData = SHADOW_ROUNDS[rIdx % SHADOW_ROUNDS.length].map((item) => ({
      ...item,
      matched: false,
    }));
    setShadowItems(roundData);
    const shuffled = [...roundData.map((d) => d.id)].sort(() => Math.random() - 0.5);
    setShuffledShadowIds(shuffled);
    setSelectedAnimalId(null);
  };

  useEffect(() => {
    if (selectedGameTab === 'shadow_match') {
      initShadowGame(shadowRoundIdx);
    }
  }, [selectedGameTab, shadowRoundIdx]);

  const handleSelectAnimalForShadow = (id: string) => {
    if (soundEnabled) playPopSound();
    setSelectedAnimalId(id);
  };

  const handleSelectShadow = (shadowId: string) => {
    if (!selectedAnimalId) return;
    if (selectedAnimalId === shadowId) {
      if (soundEnabled) playStarChime();
      const updated = shadowItems.map((item) =>
        item.id === shadowId ? { ...item, matched: true } : item
      );
      setShadowItems(updated);
      setSelectedAnimalId(null);

      if (updated.every((it) => it.matched)) {
        triggerVictory('अद्भुत! आपने सभी छाया मिला लीं! 🏆🎉');
      }
    } else {
      if (soundEnabled) playPopSound();
    }
  };

  // =========================================================================
  // 6. 🐍 नन्हा साँप और फल (CLASSIC FRIENDLY SNAKE)
  // =========================================================================
  const GRID_SIZE = 12;
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [snakeDir, setSnakeDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [apple, setApple] = useState<{ x: number; y: number }>({ x: 8, y: 5 });
  const [snakeScore, setSnakeScore] = useState<number>(0);
  const [isSnakeRunning, setIsSnakeRunning] = useState<boolean>(false);
  const [snakeSpeed, setSnakeSpeed] = useState<'slow' | 'normal'>('slow');

  // Ultra-gentle, relaxed speed tuned specially for young kids (850ms = super easy, 600ms = normal)
  const speedIntervalMs = snakeSpeed === 'slow' ? 850 : 600;

  const resetSnake = () => {
    setSnake([
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ]);
    setSnakeDir('RIGHT');
    setApple({ x: 8, y: 5 });
    setSnakeScore(0);
    setIsSnakeRunning(true);
  };

  useEffect(() => {
    if (selectedGameTab === 'snake') {
      resetSnake();
    } else {
      setIsSnakeRunning(false);
    }
  }, [selectedGameTab]);

  // Gentle, relaxed speed specially tuned for kids (620ms or 440ms)
  useEffect(() => {
    if (!isSnakeRunning || selectedGameTab !== 'snake') return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (snakeDir === 'UP') head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
        if (snakeDir === 'DOWN') head.y = (head.y + 1) % GRID_SIZE;
        if (snakeDir === 'LEFT') head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
        if (snakeDir === 'RIGHT') head.x = (head.x + 1) % GRID_SIZE;

        // Check apple eating
        if (head.x === apple.x && head.y === apple.y) {
          if (soundEnabled) playStarChime();
          setSnakeScore((s) => s + 10);
          setApple({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
          return [head, ...prev]; // grows!
        }
        return [head, ...prev.slice(0, -1)];
      });
    }, speedIntervalMs);
    return () => clearInterval(interval);
  }, [isSnakeRunning, snakeDir, apple, selectedGameTab, speedIntervalMs]);

  // Keyboard support for snake
  useEffect(() => {
    if (selectedGameTab !== 'snake') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && snakeDir !== 'DOWN') setSnakeDir('UP');
      if (e.key === 'ArrowDown' && snakeDir !== 'UP') setSnakeDir('DOWN');
      if (e.key === 'ArrowLeft' && snakeDir !== 'RIGHT') setSnakeDir('LEFT');
      if (e.key === 'ArrowRight' && snakeDir !== 'LEFT') setSnakeDir('RIGHT');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedGameTab, snakeDir]);

  // =========================================================================
  // 7. 🚀 अंतरिक्ष रॉकेट और सितारे (SPACE ROCKET STAR COLLECTOR)
  // =========================================================================
  const [rocketY, setRocketY] = useState<number>(50); // %
  const [spaceStars, setSpaceStars] = useState<
    { id: number; x: number; y: number; isGem: boolean; collected: boolean }[]
  >([]);
  const [rocketScore, setRocketScore] = useState<number>(0);
  const [isRocketFlying, setIsRocketFlying] = useState<boolean>(false);

  const initRocketGame = () => {
    setRocketY(50);
    setRocketScore(0);
    setIsRocketFlying(true);
    const initialStars = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: 35 + i * 20,
      y: 20 + Math.random() * 60,
      isGem: Math.random() < 0.25,
      collected: false,
    }));
    setSpaceStars(initialStars);
  };

  useEffect(() => {
    if (selectedGameTab === 'rocket') {
      initRocketGame();
    } else {
      setIsRocketFlying(false);
    }
  }, [selectedGameTab]);

  useEffect(() => {
    if (!isRocketFlying || selectedGameTab !== 'rocket') return;
    const starInterval = setInterval(() => {
      setSpaceStars((prev) => {
        const moved = prev
          .map((s) => ({ ...s, x: s.x - 3 }))
          .filter((s) => s.x > -10);

        // Check collision with rocket at x = 18%, y around rocketY
        moved.forEach((s) => {
          if (!s.collected && Math.abs(s.x - 18) < 9 && Math.abs(s.y - rocketY) < 16) {
            s.collected = true;
            if (soundEnabled) playStarChime();
            setRocketScore((sc) => sc + (s.isGem ? 25 : 10));
          }
        });

        // Spawn new star on right
        if (moved.length < 6) {
          moved.push({
            id: Date.now() + Math.random(),
            x: 105,
            y: 15 + Math.random() * 70,
            isGem: Math.random() < 0.25,
            collected: false,
          });
        }
        return moved;
      });
    }, 60);
    return () => clearInterval(starInterval);
  }, [isRocketFlying, rocketY, selectedGameTab]);

  // =========================================================================
  // 8. 🚜 छोटा ट्रैक्टर खेत की सैर (LITTLE TRACTOR FARM RIDE)
  // =========================================================================
  const [tractorLane, setTractorLane] = useState<number>(1); // 0 = Left, 1 = Center, 2 = Right
  const [farmCrops, setFarmCrops] = useState<
    { id: number; lane: number; y: number; type: 'carrot' | 'apple' | 'grass'; collected: boolean }[]
  >([]);
  const [tractorScore, setTractorScore] = useState<number>(0);
  const [isTractorDriving, setIsTractorDriving] = useState<boolean>(false);

  const initTractorGame = () => {
    setTractorLane(1);
    setTractorScore(0);
    setIsTractorDriving(true);
    setFarmCrops([
      { id: 1, lane: 0, y: 15, type: 'carrot', collected: false },
      { id: 2, lane: 1, y: 45, type: 'apple', collected: false },
      { id: 3, lane: 2, y: 75, type: 'grass', collected: false },
    ]);
  };

  useEffect(() => {
    if (selectedGameTab === 'tractor') {
      initTractorGame();
    } else {
      setIsTractorDriving(false);
    }
  }, [selectedGameTab]);

  useEffect(() => {
    if (!isTractorDriving || selectedGameTab !== 'tractor') return;
    const roadLoop = setInterval(() => {
      setFarmCrops((prev) => {
        const moved = prev
          .map((c) => ({ ...c, y: c.y + 3.5 }))
          .filter((c) => c.y < 110);

        // Check collision at tractor y = 80
        moved.forEach((c) => {
          if (!c.collected && c.lane === tractorLane && Math.abs(c.y - 78) < 10) {
            c.collected = true;
            if (soundEnabled) playStarChime();
            setTractorScore((s) => s + (c.type === 'grass' ? 20 : c.type === 'apple' ? 15 : 10));
          }
        });

        if (moved.length < 4) {
          const types: ('carrot' | 'apple' | 'grass')[] = ['carrot', 'apple', 'grass'];
          moved.push({
            id: Date.now() + Math.random(),
            lane: Math.floor(Math.random() * 3),
            y: -10,
            type: types[Math.floor(Math.random() * types.length)],
            collected: false,
          });
        }
        return moved;
      });
    }, 60);
    return () => clearInterval(roadLoop);
  }, [isTractorDriving, tractorLane, selectedGameTab]);

  return (
    <div className="space-y-3.5 max-w-5xl mx-auto pb-12">
      {/* Sleek Category Top Header */}
      <div className="flex items-center justify-between gap-2.5 bg-white rounded-2xl p-2.5 sm:p-3 border border-purple-200/80 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg sm:text-xl shadow-xs shrink-0">
            🎮
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
            {isHi ? '7. बाल खेल (Kids Mini Games Zone)' : '7. Kids Mini Games Zone'}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-black whitespace-nowrap">
            {isHi ? `${games.length} मिनी गेम्स` : `${games.length} Mini Games`}
          </span>
        </div>
      </div>

      {/* Game Selection Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {games.map((game) => {
          const isSelected = selectedGameTab === game.category;
          return (
            <button
              key={game.id}
              onClick={() => {
                setSelectedGameTab(game.category);
                setVictoryBanner(null);
                if (soundEnabled) playPopSound();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-amber-500/30 ring-2 ring-amber-400 scale-[1.01]'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span className="text-lg">{game.emoji}</span>
              <span>{isHi ? game.titleHi.split('(')[0] : game.titleEn}</span>
            </button>
          );
        })}
      </div>

      {/* Simple Victory Celebration Notification */}
      {victoryBanner && (
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-md flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <span className="text-sm font-black">{victoryBanner}</span>
          </div>
          <button
            onClick={() => setVictoryBanner(null)}
            className="px-3 py-1 bg-white/25 hover:bg-white/35 rounded-xl text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. 🎹 बच्चों का पियानो व संगीत (KIDS MAGIC PIANO) */}
      {/* ========================================================================= */}
      {selectedGameTab === 'piano' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-pink-200 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🎹</span>
                <span>{isHi ? 'बच्चों का जादुई पियानो (Magic Piano)' : 'Kids Magic Piano'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'रंग-बिरंगी कुंजियाँ दबाकर सुंदर धुनें और आवाजें बजाएं!' : 'Tap the colorful keys to play sweet melodies!'}
              </p>
            </div>

            {/* Instrument Voice Mode Selector */}
            <div className="flex items-center gap-1 bg-pink-50 p-1 rounded-2xl border border-pink-200">
              <button
                onClick={() => setPianoMode('piano')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  pianoMode === 'piano' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                }`}
              >
                🎹 पियानो
              </button>
              <button
                onClick={() => setPianoMode('cat')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  pianoMode === 'cat' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                }`}
              >
                🐱 बिल्ली
              </button>
              <button
                onClick={() => setPianoMode('bird')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  pianoMode === 'bird' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                }`}
              >
                🦜 चिड़िया
              </button>
              <button
                onClick={() => setPianoMode('tabla')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  pianoMode === 'tabla' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600 hover:bg-white'
                }`}
              >
                🥁 तबला
              </button>
            </div>
          </div>

          {/* Rainbow Piano Keys Keyboard */}
          <div className="grid grid-cols-8 gap-1.5 sm:gap-2 pt-2 pb-4">
            {PIANO_KEYS.map((k, idx) => {
              const isPressed = activePianoKey === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handlePressPianoKey(idx)}
                  className={`h-40 sm:h-52 rounded-2xl border-4 ${k.border} ${k.color} flex flex-col justify-between items-center py-3 shadow-md transform transition-all cursor-pointer active:scale-95 ${
                    isPressed ? 'translate-y-2 ring-4 ring-white shadow-inner scale-95' : 'hover:-translate-y-1'
                  }`}
                >
                  <span className="text-xs font-bold opacity-80">{k.en}</span>
                  <div className="w-3 h-3 rounded-full bg-white/40"></div>
                  <span className="text-xl sm:text-2xl font-black drop-shadow-xs">{k.note}</span>
                </button>
              );
            })}
          </div>

          {/* Melody Replay & Nursery Rhyme helper */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-pink-50/60 p-4 rounded-2xl border border-pink-200">
            <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <span>🎶 आपकी बनाई धुन:</span>
              <span className="font-black text-pink-700">{recordedNotes.length} स्वर नोट</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayRecorded}
                disabled={recordedNotes.length === 0 || isPlayingRecorded}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-40 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlayingRecorded ? 'बज रहा है...' : 'धुन बजाएं (Play My Tune)'}</span>
              </button>

              <button
                onClick={() => setRecordedNotes([])}
                className="px-3 py-2 rounded-xl bg-white hover:bg-pink-100 text-slate-600 text-xs font-bold border border-pink-200 cursor-pointer"
              >
                साफ़ करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 🫧 बुलबुला पॉप और फोम (MAGIC SOAP BUBBLES) */}
      {/* ========================================================================= */}
      {selectedGameTab === 'bubble' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-cyan-200 shadow-sm space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🫧</span>
                <span>{isHi ? 'साबुन के जादुई बुलबुले (Soap Bubbles)' : 'Magic Soap Bubbles'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'तैरते हुए बुलबुलों को उंगली से छूकर फोड़ें और पॉप की आवाज सुनें!' : 'Touch floating soap bubbles to pop them!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cyan-900 bg-cyan-100 px-3 py-1.5 rounded-full border border-cyan-200">
                स्कोर: {bubblePopScore} अंक
              </span>
              <button
                onClick={blowMoreBubbles}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-black text-xs shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>🫧 और बुलबुले छोड़ें!</span>
              </button>
            </div>
          </div>

          {/* Shimmering Bubble Pool */}
          <div
            ref={bubbleContainerRef}
            className="relative h-80 bg-gradient-to-b from-sky-100 via-cyan-50 to-pink-50 rounded-3xl border-2 border-cyan-200 overflow-hidden shadow-inner cursor-pointer select-none"
            onClick={blowMoreBubbles}
          >
            <div className="absolute top-3 left-4 text-xs font-bold text-cyan-800/60 pointer-events-none">
              💡 स्क्रीन पर कहीं भी टैप करके नए बुलबुले उड़ाएं!
            </div>

            {bubbles.map((b) => (
              <button
                key={b.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePopBubble(b.id);
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-gradient-to-br backdrop-blur-xs shadow-lg transition-transform hover:scale-110 active:scale-50 flex items-center justify-center cursor-pointer ${b.color}`}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                }}
              >
                {/* Bubble light glare */}
                <div className="w-2.5 h-2.5 rounded-full bg-white/90 absolute top-2 left-2"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 absolute top-4 left-4"></div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span>🫧 स्क्रीन पर तैरते बुलबुले: {bubbles.length}</span>
            <button
              onClick={() => {
                setBubblePopScore(0);
                blowMoreBubbles();
              }}
              className="text-cyan-700 hover:underline cursor-pointer"
            >
              🔄 फिर से शुरू करें
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ✨ मैजिक ड्रॉ / जादुई रेखाएं (NEON GLOW DRAWING PAD) */}
      {/* ========================================================================= */}
      {selectedGameTab === 'glow_draw' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-purple-200 shadow-sm space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>✨</span>
                <span>{isHi ? 'मैजिक नियॉन ड्रॉ (Neon Magic Pad)' : 'Neon Glow Magic Pad'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'चमकते हुए जादुई रंगों से स्क्रीन पर सुंदर चित्र बनाएं!' : 'Draw with glowing neon colors and cute stamps!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={undoGlowCanvas}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-black border border-purple-200 cursor-pointer"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={clearGlowCanvas}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 cursor-pointer"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={downloadDrawing}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>सहेजें</span>
              </button>
            </div>
          </div>

          {/* Color & Stamp Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 p-2.5 rounded-2xl">
            {/* Color buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {NEON_COLORS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setBrushColor(col.color)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    brushColor === col.color
                      ? 'bg-white/30 text-white ring-2 ring-white scale-105'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>

            {/* Quick Stamps */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => addStamp('⭐')}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-lg flex items-center justify-center cursor-pointer"
                title="Star Stamp"
              >
                ⭐
              </button>
              <button
                onClick={() => addStamp('💖')}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-lg flex items-center justify-center cursor-pointer"
                title="Heart Stamp"
              >
                💖
              </button>
              <button
                onClick={() => addStamp('🦋')}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-lg flex items-center justify-center cursor-pointer"
                title="Butterfly Stamp"
              >
                🦋
              </button>
            </div>
          </div>

          {/* Canvas Board */}
          <div className="rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl relative">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-80 block cursor-crosshair touch-none"
            />
          </div>

          {/* Brush Size selector */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-2">
            <span>ब्रश मोटाई:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBrushSize(3)}
                className={`px-3 py-1 rounded-lg border ${brushSize === 3 ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}
              >
                पतला
              </button>
              <button
                onClick={() => setBrushSize(6)}
                className={`px-3 py-1 rounded-lg border ${brushSize === 6 ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}
              >
                मध्यम
              </button>
              <button
                onClick={() => setBrushSize(12)}
                className={`px-3 py-1 rounded-lg border ${brushSize === 12 ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}
              >
                मोटा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. 🔢 गिनती गिनो और बताओ (COUNT THE CANDIES/STARS) */}
      {/* ========================================================================= */}
      {selectedGameTab === 'counting' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-sm space-y-5 max-w-xl mx-auto text-center">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3 text-left">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🔢</span>
                <span>{isHi ? 'गिनती गिनो और बताओ (Count It)' : 'Count & Match'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'वस्तुओं को छूकर गिनिए और नीचे सही संख्या चुनिए!' : 'Tap each object to count, then choose the right number!'}
              </p>
            </div>
            <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              अंक: {countScore} pts
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-sm font-black text-amber-950">
              यहाँ कितने {countItemType.name} {countItemType.emoji} हैं?
            </span>
          </div>

          {/* Scattered Items Field */}
          <div className="min-h-52 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl border-2 border-dashed border-amber-300 p-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 shadow-inner">
            {Array.from({ length: countTarget }, (_, i) => {
              const isTapped = tappedItemIndices.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleTapCountItem(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center text-4xl shadow-md transition-all cursor-pointer transform ${
                    isTapped
                      ? 'bg-amber-400 border-amber-600 scale-110 rotate-3 ring-4 ring-amber-300'
                      : 'bg-white border-amber-200 hover:scale-105 active:scale-95'
                  }`}
                >
                  <span>{countItemType.emoji}</span>
                  {isTapped && (
                    <span className="text-xs font-black text-amber-950 mt-0.5">
                      {i + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {countFeedback && (
            <div className="text-sm font-black text-amber-800 animate-bounce">
              {countFeedback}
            </div>
          )}

          {/* Number Option Buttons */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500">सही संख्या पर क्लिक करें:</div>
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
              {getCountOptions().map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectCountAnswer(opt)}
                  className="py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-2xl shadow-md transition-transform cursor-pointer border-2 border-amber-600"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. 🔍 छाया पहचानो (SHADOW SILHOUETTE MATCH) */}
      {/* ========================================================================= */}
      {selectedGameTab === 'shadow_match' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm space-y-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🔍</span>
                <span>{isHi ? 'छाया पहचानो (Shadow Match)' : 'Silhouette Shadow Match'}</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  राउंड {shadowRoundIdx + 1} / {SHADOW_ROUNDS.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'बाईं ओर से चित्र चुनें, फिर दाईं ओर उसकी सही छाया (Silhouette) मिलाएँ!' : 'Select an item, then click its matching shadow silhouette!'}
              </p>
            </div>
            <button
              onClick={() => {
                const nextR = (shadowRoundIdx + 1) % SHADOW_ROUNDS.length;
                setShadowRoundIdx(nextR);
                initShadowGame(nextR);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'अगला राउंड' : 'Next Round'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Left Column: Colorful Animals / Objects */}
            <div className="space-y-2.5">
              <div className="text-xs font-black text-slate-600 text-center pb-0.5">
                १. रंगीन चित्र चुनें:
              </div>
              {shadowItems.map((item) => {
                const isSelected = selectedAnimalId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectAnimalForShadow(item.id)}
                    disabled={item.matched}
                    className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between font-black text-sm transition-all cursor-pointer ${
                      item.matched
                        ? 'bg-emerald-100 border-emerald-400 opacity-60 text-emerald-800'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 scale-102 shadow-md'
                        : 'bg-white hover:bg-emerald-50 border-emerald-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-xs sm:text-sm font-black text-slate-800">{item.nameHi}</span>
                    </div>
                    {item.matched && <span className="text-emerald-700 font-black">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Clear, High-Contrast Silhouette Shadows on Light Card */}
            <div className="space-y-2.5">
              <div className="text-xs font-black text-slate-600 text-center pb-0.5">
                २. सही छाया (Shadow) मिलाएँ:
              </div>
              {shuffledShadowIds.map((sid) => {
                const item = shadowItems.find((it) => it.id === sid);
                if (!item) return null;
                return (
                  <button
                    key={sid}
                    onClick={() => handleSelectShadow(sid)}
                    disabled={item.matched}
                    className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 flex items-center justify-between font-black transition-all cursor-pointer ${
                      item.matched
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                        : 'bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-400 shadow-xs active:scale-98'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.matched ? (
                        <span className="text-3xl animate-in zoom-in-75">{item.emoji}</span>
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center relative shadow-inner">
                          <span
                            className="text-3xl select-none"
                            style={{
                              filter: 'grayscale(100%) brightness(0.6) contrast(120%) drop-shadow(0 1px 3px rgba(30,41,59,0.3))',
                              opacity: 0.9,
                            }}
                          >
                            {item.emoji}
                          </span>
                        </div>
                      )}
                      <span className={`text-[11px] sm:text-xs font-black ${item.matched ? 'text-emerald-800' : 'text-slate-700'}`}>
                        {item.matched ? item.nameHi : 'छाया (पहचानें)'}
                      </span>
                    </div>
                    {item.matched ? (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-200/70 px-2 py-0.5 rounded-full">
                        ✓ मिल गया
                      </span>
                    ) : (
                      <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                        मिलान करें
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. 🐍 नन्हा साँप और फल (CLASSIC FRIENDLY SNAKE) */}
      {/* ========================================================================= */}
      {selectedGameTab === 'snake' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-green-200 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="flex items-center justify-between border-b border-green-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🐍</span>
                <span>{isHi ? 'नन्हा साँप और फल (Friendly Snake)' : 'Friendly Little Snake'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'धीमी व आसान गति से नन्हे साँप को लाल सेब खिलाएं!' : 'Help the cute slow snake eat juicy apples!'}
              </p>
            </div>
            <button
              onClick={resetSnake}
              className="px-3.5 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-800 text-xs font-black border border-green-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'नया खेल' : 'Reset'}</span>
            </button>
          </div>

          {/* Snake Speed Selector */}
          <div className="flex items-center justify-between bg-green-50 p-2.5 rounded-2xl border border-green-200 text-xs font-black">
            <span className="text-green-950 flex items-center gap-1.5">
              <span>🍎 सेब खाए: {snakeScore / 10}</span>
              <span className="text-green-600">({snakeScore} pts)</span>
            </span>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-green-200">
              <button
                onClick={() => setSnakeSpeed('slow')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                  snakeSpeed === 'slow'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                🐢 बहुत धीमा
              </button>
              <button
                onClick={() => setSnakeSpeed('normal')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                  snakeSpeed === 'normal'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                🐰 सामान्य
              </button>
            </div>
          </div>

          {/* Snake 12x12 Grid */}
          <div className="aspect-square bg-emerald-100 rounded-3xl border-4 border-emerald-300 grid grid-cols-12 gap-0.5 p-2 shadow-inner">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.slice(1).some((part) => part.x === x && part.y === y);
              const isApple = apple.x === x && apple.y === y;

              return (
                <div
                  key={idx}
                  className={`rounded-md flex items-center justify-center ${
                    isHead
                      ? 'bg-emerald-700 text-white font-black text-xs shadow-xs'
                      : isBody
                      ? 'bg-emerald-500 rounded-sm'
                      : isApple
                      ? 'text-sm animate-bounce'
                      : 'bg-emerald-50/40'
                  }`}
                >
                  {isHead ? '👀' : isApple ? '🍎' : null}
                </div>
              );
            })}
          </div>

          {/* Large On-Screen Touch Controls Pad */}
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              onClick={() => snakeDir !== 'DOWN' && setSnakeDir('UP')}
              className="w-14 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xl font-black shadow-md active:scale-95 cursor-pointer"
            >
              <ArrowUp className="w-6 h-6 stroke-[3]" />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => snakeDir !== 'RIGHT' && setSnakeDir('LEFT')}
                className="w-14 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xl font-black shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-7 h-7 stroke-[3]" />
              </button>
              <button
                onClick={() => snakeDir !== 'UP' && setSnakeDir('DOWN')}
                className="w-14 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xl font-black shadow-md active:scale-95 cursor-pointer"
              >
                <ArrowDown className="w-6 h-6 stroke-[3]" />
              </button>
              <button
                onClick={() => snakeDir !== 'LEFT' && setSnakeDir('RIGHT')}
                className="w-14 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xl font-black shadow-md active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-7 h-7 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. 🚀 अंतरिक्ष रॉकेट और सितारे (SPACE ROCKET STAR COLLECTOR) */}
      {/* ========================================================================= */}
      {selectedGameTab === 'rocket' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-indigo-200 shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🚀</span>
                <span>{isHi ? 'अंतरिक्ष रॉकेट सैर (Space Rocket)' : 'Space Rocket Star Collector'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'रॉकेट को ऊपर-नीचे ले जाकर चमकते सितारे और रत्न पकड़िए!' : 'Steer the rocket to collect shiny stars and gems!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-900 bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-200">
                सितारे: {rocketScore} pts
              </span>
              <button
                onClick={initRocketGame}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-black border border-indigo-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Deep Cosmos Flight Window */}
          <div
            className="relative h-72 bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 rounded-3xl border-4 border-indigo-400 overflow-hidden shadow-2xl select-none"
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clientY = e.touches[0].clientY;
              const yPerc = Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100));
              setRocketY(yPerc);
            }}
          >
            {/* Distant background stars */}
            <div className="absolute top-6 left-12 text-xs text-white/30">✦</div>
            <div className="absolute top-16 right-24 text-xs text-white/40">✦</div>
            <div className="absolute bottom-8 left-36 text-xs text-white/30">✦</div>

            {/* Rocket */}
            <div
              className="absolute -translate-y-1/2 left-[18%] transition-all duration-75 flex items-center gap-1"
              style={{ top: `${rocketY}%` }}
            >
              <span className="text-4xl drop-shadow-md">🚀</span>
              <div className="w-3 h-2 rounded-full bg-orange-400 animate-ping"></div>
            </div>

            {/* Collectible Stars & Gems */}
            {spaceStars.map((s) => {
              if (s.collected) return null;
              return (
                <div
                  key={s.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl animate-pulse"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  {s.isGem ? '💎' : '⭐'}
                </div>
              );
            })}
          </div>

          {/* Up & Down Control Buttons */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <button
              onClick={() => setRocketY((y) => Math.max(12, y - 16))}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ArrowUp className="w-5 h-5 stroke-[3]" />
              <span>ऊपर (Up)</span>
            </button>
            <button
              onClick={() => setRocketY((y) => Math.min(88, y + 16))}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ArrowDown className="w-5 h-5 stroke-[3]" />
              <span>नीचे (Down)</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. 🚜 छोटा ट्रैक्टर खेत की सैर (LITTLE TRACTOR FARM RIDE) */}
      {/* ========================================================================= */}
      {selectedGameTab === 'tractor' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🚜</span>
                <span>{isHi ? 'छोटा ट्रैक्टर खेत की सैर' : 'Little Tractor Farm Ride'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isHi ? 'ट्रैक्टर को बाएँ-दाएँ चलाकर खेत से ताज़ी गाजर व सेब बटोरें!' : 'Steer the farm tractor to harvest fresh carrots!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200">
                फसल: {tractorScore} अंक
              </span>
              <button
                onClick={initTractorGame}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black border border-amber-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3-Lane Farm Road */}
          <div className="relative h-80 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 rounded-3xl border-4 border-amber-400 overflow-hidden shadow-inner flex">
            {/* Lane 0 */}
            <div
              onClick={() => setTractorLane(0)}
              className="flex-1 border-r-2 border-dashed border-amber-300 relative cursor-pointer"
            >
              {tractorLane === 0 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
                  🚜
                </div>
              )}
            </div>

            {/* Lane 1 */}
            <div
              onClick={() => setTractorLane(1)}
              className="flex-1 border-r-2 border-dashed border-amber-300 relative cursor-pointer"
            >
              {tractorLane === 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
                  🚜
                </div>
              )}
            </div>

            {/* Lane 2 */}
            <div
              onClick={() => setTractorLane(2)}
              className="flex-1 relative cursor-pointer"
            >
              {tractorLane === 2 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
                  🚜
                </div>
              )}
            </div>

            {/* Falling Farm Crops */}
            {farmCrops.map((c) => {
              if (c.collected) return null;
              const leftPerc = c.lane === 0 ? '16%' : c.lane === 1 ? '50%' : '84%';
              return (
                <div
                  key={c.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl pointer-events-none"
                  style={{ left: leftPerc, top: `${c.y}%` }}
                >
                  {c.type === 'carrot' ? '🥕' : c.type === 'apple' ? '🍎' : '🌾'}
                </div>
              );
            })}
          </div>

          {/* Tractor Steering & Horn Controls */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setTractorLane((l) => Math.max(0, l - 1))}
              className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-sm shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
              <span>बाएँ (Left)</span>
            </button>

            {/* Honk Horn Button */}
            <button
              onClick={() => {
                if (soundEnabled) playHonkSound();
                triggerVictory('पौं-पौं! 🚜📢 रास्ता साफ है!');
              }}
              className="px-4 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xs shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              📢 पौं-पौं!
            </button>

            <button
              onClick={() => setTractorLane((l) => Math.min(2, l + 1))}
              className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-sm shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>दाएँ (Right)</span>
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
