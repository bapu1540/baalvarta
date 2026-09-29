import confetti from 'canvas-confetti';

/**
 * Triggers an energetic, festive confetti burst with multi-stage cannon blasts,
 * stars, and vibrant multi-colored particles for positive reinforcement.
 */
export const triggerFestiveConfetti = (originY = 0.6) => {
  try {
    // 1. Center vibrant blast
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: originY },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C', '#9B5DE5', '#00BBF9', '#F15BB5'],
      ticks: 250,
      scalar: 1.1,
    });

    // 2. Left and Right festive cannons
    setTimeout(() => {
      try {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 65,
          origin: { x: 0.05, y: originY + 0.1 },
          colors: ['#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#8338EC'],
          ticks: 200,
        });

        confetti({
          particleCount: 50,
          angle: 120,
          spread: 65,
          origin: { x: 0.95, y: originY + 0.1 },
          colors: ['#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#8338EC'],
          ticks: 200,
        });
      } catch {
        // Safe fallback
      }
    }, 200);

    // 3. Falling stars & sparkles for joy
    setTimeout(() => {
      try {
        confetti({
          particleCount: 35,
          spread: 120,
          origin: { y: Math.max(0.2, originY - 0.2) },
          shapes: ['circle'],
          colors: ['#FFD700', '#FFA500', '#FF4500', '#00E5FF'],
          scalar: 1.2,
          ticks: 180,
        });
      } catch {
        // Safe fallback
      }
    }, 450);
  } catch {
    // Fallback if canvas is not supported
  }
};

/**
 * Specifically tailored for completing stories
 */
export const triggerStoryCompleteConfetti = () => {
  triggerFestiveConfetti(0.65);
};

/**
 * Specifically tailored for completing quizzes
 */
export const triggerQuizCelebrationConfetti = () => {
  triggerFestiveConfetti(0.55);
};
