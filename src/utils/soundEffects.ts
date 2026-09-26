/**
 * Sound effects generator using Web Audio API and Web Speech API
 * Lightweight, zero-asset overhead to keep app size minimal.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // ignore audio context restrictions
  }
}

export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.09;
      const duration = 0.22;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // ignore
  }
}

export function playStarChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [784, 988, 1174, 1568];

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = now + i * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.12, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(st);
      osc.stop(st + 0.19);
    });
  } catch {
    // ignore
  }
}

// Background Lullaby Generator for Audio Stories
let lullabyInterval: number | null = null;

export function startLullabyAmbient() {
  stopLullabyAmbient();
  const melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00];
  let noteIndex = 0;

  lullabyInterval = window.setInterval(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const freq = melody[noteIndex % melody.length];
      noteIndex++;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch {
      // ignore
    }
  }, 1200);
}

export function stopLullabyAmbient() {
  if (lullabyInterval) {
    clearInterval(lullabyInterval);
    lullabyInterval = null;
  }
}

// Speech Synthesis for Story & Early Learning Read Aloud
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  lang: 'hi' | 'en' = 'hi',
  rate: number = 0.78, // Default gentle, soothing storytelling pace
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError();
    return;
  }

  // Always cancel any prior speech cleanly
  stopSpeech();

  // Format text for natural storytelling pauses
  // Replace Devanagari danda with a period plus space to force a natural sentence pause
  const formattedText = text
    .replace(/[*#_~]/g, '')
    .replace(/।/g, '. ')
    .replace(/\n\s*\n/g, '. ... ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(formattedText);
  activeUtterance = utterance;

  // Natural warm bedtime storytelling settings
  utterance.rate = Math.max(0.65, Math.min(1.2, rate)); // 0.78 is sweet and clear
  utterance.pitch = 1.0; // Natural warm human pitch (not squeaky)

  const voices = window.speechSynthesis.getVoices();
  if (lang === 'hi') {
    // Look for high-quality natural Hindi voices first
    const hindiVoice = voices.find(
      (v) =>
        (v.lang === 'hi-IN' || v.lang.startsWith('hi')) &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('India') || !v.name.includes('Compact'))
    ) || voices.find((v) => v.lang.includes('hi') || v.lang.includes('Hindi'));

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    utterance.lang = 'hi-IN';
  } else {
    const englishVoice = voices.find(
      (v) => (v.lang === 'en-IN' || v.lang === 'en-US') && !v.name.includes('Compact')
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.lang = 'en-US';
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      if (onError) onError();
    }
  };

  window.speechSynthesis.speak(utterance);
}

export function pauseSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  }
}

export function resumeSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (activeUtterance) {
      activeUtterance.onstart = null;
      activeUtterance.onend = null;
      activeUtterance.onerror = null;
      activeUtterance = null;
    }
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

export function isSpeechPaused(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.paused;
  }
  return false;
}
