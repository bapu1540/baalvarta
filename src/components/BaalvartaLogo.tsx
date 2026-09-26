import React from 'react';

interface BaalvartaLogoProps {
  className?: string;
  variant?: 'header' | 'banner' | 'compact' | 'footer';
  alt?: string;
}

// Letter definitions strictly matching the user's requested 3D rainbow cartoon style:
// B: Red
// A: Orange
// A: Yellow
// L: Green
// V: Blue
// A: Purple
// R: Pink
// T: Teal
// A: Orange
const LETTERS = [
  { id: 'b', char: 'B', top: '#FF334B', mid: '#E50024', bot: '#BA001A', shadow: '#7A000F', x: 32, y: 78, rot: -4 },
  { id: 'a1', char: 'A', top: '#FF8800', mid: '#FF6200', bot: '#DD4600', shadow: '#8C2B00', x: 77, y: 73, rot: -2 },
  { id: 'a2', char: 'A', top: '#FFD600', mid: '#FFB600', bot: '#E59500', shadow: '#966100', x: 122, y: 69, rot: -1 },
  { id: 'l', char: 'L', top: '#10E33A', mid: '#00BA28', bot: '#008C1E', shadow: '#005C14', x: 167, y: 67, rot: 0 },
  { id: 'v', char: 'V', top: '#00D4FF', mid: '#00A4FF', bot: '#007BD6', shadow: '#004F8F', x: 212, y: 67, rot: 0 },
  { id: 'a3', char: 'A', top: '#9D5CFF', mid: '#7B22ED', bot: '#5B0CBE', shadow: '#3A0580', x: 257, y: 69, rot: 1 },
  { id: 'r', char: 'R', top: '#FF2D9B', mid: '#E80074', bot: '#BD005C', shadow: '#78003A', x: 302, y: 73, rot: -1 },
  { id: 't', char: 'T', top: '#00D5C7', mid: '#00ABA0', bot: '#008077', shadow: '#00524C', x: 347, y: 77, rot: 2 },
  { id: 'a4', char: 'A', top: '#FF7B00', mid: '#FF5700', bot: '#D84000', shadow: '#8A2800', x: 392, y: 81, rot: 4 },
];

export const BaalvartaLogo: React.FC<BaalvartaLogoProps> = ({
  className = '',
  variant = 'header',
}) => {
  // Enhanced container dimensions for maximum visibility in both Header & Footer:
  let containerClasses = 'h-11 sm:h-14 md:h-16 lg:h-[68px] w-auto max-w-[145px] sm:max-w-none';
  if (variant === 'compact') {
    containerClasses = 'h-9 sm:h-11 w-auto';
  } else if (variant === 'banner') {
    containerClasses = 'h-32 sm:h-40 md:h-48 w-auto';
  } else if (variant === 'footer') {
    containerClasses = 'h-24 sm:h-28 md:h-32 lg:h-36 w-auto';
  }

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      aria-label="BAALVARTA - Fun - Learning - Stories"
    >
      <svg
        viewBox="18 16 394 126"
        className={`${containerClasses} transition-transform duration-200 hover:scale-[1.03] filter drop-shadow-md`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        overflow="visible"
      >
        <defs>
          {/* Gradients for each letter */}
          {LETTERS.map((item) => (
            <linearGradient key={`grad-${item.id}`} id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={item.top} />
              <stop offset="55%" stopColor={item.mid} />
              <stop offset="100%" stopColor={item.bot} />
            </linearGradient>
          ))}

          {/* Wooden banner gradient */}
          <linearGradient id="wood-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C4217" />
            <stop offset="50%" stopColor="#6E2F0A" />
            <stop offset="100%" stopColor="#4A1E05" />
          </linearGradient>

          {/* Sun face gradient */}
          <radialGradient id="sun-gradient" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="65%" stopColor="#FFCE00" />
            <stop offset="100%" stopColor="#FFA600" />
          </radialGradient>

          {/* Sun rays gradient */}
          <radialGradient id="sun-rays" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FF8800" />
          </radialGradient>

          {/* Drop shadow for 3D depth */}
          <filter id="logo-depth" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>

          {/* Rainbow Arc Gradient */}
          <linearGradient id="rainbow-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF2A4D" />
            <stop offset="25%" stopColor="#FFA200" />
            <stop offset="50%" stopColor="#FFEB00" />
            <stop offset="75%" stopColor="#00D440" />
            <stop offset="100%" stopColor="#00B4FF" />
          </linearGradient>
        </defs>

        {/* 1. BACKGROUND ACCENTS: Cheerful Sun & Mini Playful Rainbow */}
        <g id="sun-and-rainbow" filter="url(#logo-depth)">
          {/* Mini Playful Rainbow on Left (tightened to stay snug without bulky white border) */}
          <path
            d="M 32,46 A 34,34 0 0,1 84,20"
            stroke="url(#rainbow-arc)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Happy Smiling Sun Mascot peeking cheerfully from center behind letters */}
          <g transform="translate(212, 35)">
            {/* Wavy Sun Rays */}
            <g fill="url(#sun-rays)" stroke="#FF8A00" strokeWidth="1.2" strokeLinejoin="round">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                <path
                  key={i}
                  d="M -2.5,-23 L 0,-30 L 2.5,-23 Z"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>

            {/* Sun Face Circle */}
            <circle cx="0" cy="0" r="19" fill="url(#sun-gradient)" stroke="#FFA000" strokeWidth="2" />

            {/* Rosy Cheeks */}
            <circle cx="-10" cy="3" r="3.5" fill="#FF5E7E" opacity="0.75" />
            <circle cx="10" cy="3" r="3.5" fill="#FF5E7E" opacity="0.75" />

            {/* Cartoon Eyes */}
            <ellipse cx="-6.5" cy="-2.5" rx="2" ry="3.2" fill="#2A1B00" />
            <circle cx="-5.8" cy="-3.8" r="1" fill="#FFFFFF" />
            <ellipse cx="6.5" cy="-2.5" rx="2" ry="3.2" fill="#2A1B00" />
            <circle cx="7.2" cy="-3.8" r="1" fill="#FFFFFF" />

            {/* Joyful Open Smile */}
            <path
              d="M -7,2.5 Q 0,11 7,2.5 Q 0,5.5 -7,2.5 Z"
              fill="#9C0018"
              stroke="#59000E"
              strokeWidth="0.8"
            />
            {/* Cute pink tongue */}
            <path d="M -3.2,5.5 Q 0,10.5 3.2,5.5 Q 0,6.5 -3.2,5.5 Z" fill="#FF6B8B" />
          </g>
        </g>

        {/* 2. THE 3D BUBBLE RAINBOW TITLE: BAALVARTA */}
        
        {/* LAYER A: Tight, Crisp Outer Stroke (reduced from 6 to 2.5 to eliminate large white border) */}
        <g
          fontFamily="'Lilita One', 'Fredoka', 'Baloo 2', system-ui, sans-serif"
          fontWeight="900"
          fontSize="52"
          textAnchor="middle"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          style={{ paintOrder: 'stroke fill' }}
          filter="url(#logo-depth)"
        >
          {LETTERS.map((item) => (
            <text
              key={`white-bg-${item.id}`}
              x={item.x}
              y={item.y}
              transform={`rotate(${item.rot} ${item.x} ${item.y})`}
            >
              {item.char}
            </text>
          ))}
        </g>

        {/* LAYER B: Bottom 3D Bevel / Extrusion Shadows */}
        <g
          fontFamily="'Lilita One', 'Fredoka', 'Baloo 2', system-ui, sans-serif"
          fontWeight="900"
          fontSize="52"
          textAnchor="middle"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ paintOrder: 'stroke fill' }}
        >
          {LETTERS.map((item) => (
            <text
              key={`bevel-${item.id}`}
              x={item.x}
              y={item.y + 3.8}
              fill={item.shadow}
              transform={`rotate(${item.rot} ${item.x} ${item.y + 3.8})`}
            >
              {item.char}
            </text>
          ))}
        </g>

        {/* LAYER C: Main Vibrant Candy Bubble Letters */}
        <g
          fontFamily="'Lilita One', 'Fredoka', 'Baloo 2', system-ui, sans-serif"
          fontWeight="900"
          fontSize="52"
          textAnchor="middle"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ paintOrder: 'stroke fill' }}
        >
          {LETTERS.map((item) => (
            <text
              key={`front-${item.id}`}
              x={item.x}
              y={item.y}
              fill={`url(#grad-${item.id})`}
              transform={`rotate(${item.rot} ${item.x} ${item.y})`}
            >
              {item.char}
            </text>
          ))}
        </g>

        {/* LAYER D: 3D Gloss / Specular Highlights on top-left of each letter */}
        <g opacity="0.82" fill="#FFFFFF">
          {LETTERS.map((item) => (
            <ellipse
              key={`shine-${item.id}`}
              cx={item.x - 7}
              cy={item.y - 26}
              rx="4"
              ry="2"
              transform={`rotate(${item.rot - 18} ${item.x - 7} ${item.y - 26})`}
            />
          ))}
        </g>

        {/* 3. WOODEN SIGNBOARD BANNER: "Fun - Learning - Stories" */}
        <g id="wooden-banner" filter="url(#logo-depth)">
          {/* Wooden Plank Outline & Fill */}
          <path
            d="M 68,103 
               Q 212,109 356,103 
               Q 361,118 356,133 
               Q 212,140 68,133 
               Q 63,118 68,103 Z"
            fill="url(#wood-gradient)"
            stroke="#3B1804"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />

          {/* Wooden Inner Bevel Highlight Line */}
          <path
            d="M 74,106 Q 212,112 350,106"
            stroke="#A35422"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Wood Grain Lines */}
          <path
            d="M 90,119 Q 138,121 180,118 M 250,120 Q 295,118 335,120"
            stroke="#4A1E05"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />

          {/* Green Leaves at Left End */}
          <g transform="translate(60, 115)">
            <ellipse cx="-4" cy="-5" rx="6" ry="3.5" fill="#38C71B" stroke="#1D730B" strokeWidth="1" transform="rotate(-35)" />
            <ellipse cx="-4" cy="5" rx="6" ry="3.5" fill="#2CA812" stroke="#1D730B" strokeWidth="1" transform="rotate(30)" />
          </g>

          {/* Green Leaves at Right End */}
          <g transform="translate(364, 115)">
            <ellipse cx="4" cy="-5" rx="6" ry="3.5" fill="#38C71B" stroke="#1D730B" strokeWidth="1" transform="rotate(35)" />
            <ellipse cx="4" cy="5" rx="6" ry="3.5" fill="#2CA812" stroke="#1D730B" strokeWidth="1" transform="rotate(-30)" />
          </g>

          {/* Banner Text: "Fun - Learning - Stories" */}
          {/* Drop shadow text */}
          <text
            x="212"
            y="125"
            textAnchor="middle"
            fontFamily="'Fredoka', 'Lilita One', 'Baloo 2', system-ui, sans-serif"
            fontWeight="800"
            fontSize="15.5"
            letterSpacing="0.8"
            fill="#2D1100"
          >
            Fun - Learning - Stories
          </text>
          {/* Main Crisp White Text */}
          <text
            x="212"
            y="123.5"
            textAnchor="middle"
            fontFamily="'Fredoka', 'Lilita One', 'Baloo 2', system-ui, sans-serif"
            fontWeight="800"
            fontSize="15.5"
            letterSpacing="0.8"
            fill="#FFFFFF"
            stroke="#421A04"
            strokeWidth="1"
            style={{ paintOrder: 'stroke fill' }}
          >
            Fun - Learning - Stories
          </text>
        </g>
      </svg>
    </div>
  );
};
