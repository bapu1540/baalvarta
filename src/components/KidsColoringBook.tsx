import React, { useRef, useState, useEffect } from 'react';
import {
  Palette,
  RotateCcw,
  Download,
  Printer,
  Sparkles,
  Eraser,
  PenTool,
  Paintbrush,
  Maximize2,
  CheckCircle2,
  Trash2,
  Undo2,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';

interface KidsColoringBookProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
}

interface TemplateItem {
  id: string;
  nameHi: string;
  nameEn: string;
  emoji: string;
  renderLines: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const KidsColoringBook: React.FC<KidsColoringBookProps> = ({
  language,
  soundEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHi = language === 'hi';

  const [activeColor, setActiveColor] = useState<string>('#ef4444');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [activeTool, setActiveTool] = useState<'brush' | 'crayon' | 'eraser' | 'rainbow'>('brush');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('lion');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Palette colors for kids
  const colors = [
    { hex: '#ef4444', name: 'लाल (Red)' },
    { hex: '#f97316', name: 'नारंगी (Orange)' },
    { hex: '#f59e0b', name: 'पीला (Yellow)' },
    { hex: '#10b981', name: 'हरा (Green)' },
    { hex: '#06b6d4', name: 'आसमानी (Cyan)' },
    { hex: '#3b82f6', name: 'नीला (Blue)' },
    { hex: '#8b5cf6', name: 'बैंगनी (Purple)' },
    { hex: '#ec4899', name: 'गुलाबी (Pink)' },
    { hex: '#854d0e', name: 'भूरा (Brown)' },
    { hex: '#000000', name: 'काला (Black)' },
    { hex: '#ffffff', name: 'सफ़ेद (White)' },
    { hex: '#14b8a6', name: 'टील (Teal)' },
  ];

  // SVG-based line art drawings rendered directly onto canvas
  const templates: TemplateItem[] = [
    {
      id: 'lion',
      nameHi: 'बब्बर शेर (Lion)',
      nameEn: 'Lion',
      emoji: '🦁',
      renderLines: (ctx, w, h) => {
        ctx.save();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Mane circle
        const cx = w / 2;
        const cy = h / 2 - 20;
        ctx.beginPath();
        for (let i = 0; i < 16; i++) {
          const angle = (i * Math.PI) / 8;
          const r = i % 2 === 0 ? 120 : 100;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        // Face
        ctx.beginPath();
        ctx.arc(cx, cy, 70, 0, Math.PI * 2);
        ctx.stroke();

        // Ears
        ctx.beginPath();
        ctx.arc(cx - 50, cy - 65, 20, 0, Math.PI * 2);
        ctx.arc(cx + 50, cy - 65, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(cx - 25, cy - 15, 8, 0, Math.PI * 2);
        ctx.arc(cx + 25, cy - 15, 8, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.beginPath();
        ctx.moveTo(cx - 15, cy + 10);
        ctx.lineTo(cx + 15, cy + 10);
        ctx.lineTo(cx, cy + 28);
        ctx.closePath();
        ctx.fill();

        // Smile
        ctx.beginPath();
        ctx.arc(cx - 12, cy + 32, 14, 0, Math.PI * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 12, cy + 32, 14, 0.1 * Math.PI, Math.PI);
        ctx.stroke();

        // Whiskers
        ctx.beginPath();
        ctx.moveTo(cx - 35, cy + 20); ctx.lineTo(cx - 70, cy + 15);
        ctx.moveTo(cx - 35, cy + 30); ctx.lineTo(cx - 70, cy + 32);
        ctx.moveTo(cx + 35, cy + 20); ctx.lineTo(cx + 70, cy + 15);
        ctx.moveTo(cx + 35, cy + 30); ctx.lineTo(cx + 70, cy + 32);
        ctx.stroke();

        // Body outline
        ctx.beginPath();
        ctx.ellipse(cx, cy + 160, 60, 80, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      },
    },
    {
      id: 'elephant',
      nameHi: 'नन्हा हाथी (Elephant)',
      nameEn: 'Baby Elephant',
      emoji: '🐘',
      renderLines: (ctx, w, h) => {
        ctx.save();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const cx = w / 2;
        const cy = h / 2 - 20;

        // Big Head
        ctx.beginPath();
        ctx.arc(cx, cy, 75, 0, Math.PI * 2);
        ctx.stroke();

        // Big Ears
        ctx.beginPath();
        ctx.ellipse(cx - 90, cy - 10, 35, 60, -0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx + 90, cy - 10, 35, 60, 0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Cute Trunk
        ctx.beginPath();
        ctx.moveTo(cx - 15, cy + 30);
        ctx.quadraticCurveTo(cx - 20, cy + 110, cx + 25, cy + 105);
        ctx.quadraticCurveTo(cx + 40, cy + 95, cx + 35, cy + 85);
        ctx.quadraticCurveTo(cx + 5, cy + 85, cx + 5, cy + 30);
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(cx - 30, cy - 10, 8, 0, Math.PI * 2);
        ctx.arc(cx + 30, cy - 10, 8, 0, Math.PI * 2);
        ctx.fill();

        // Cheeks
        ctx.beginPath();
        ctx.arc(cx - 45, cy + 15, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 45, cy + 15, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Feet
        ctx.beginPath();
        ctx.rect(cx - 50, cy + 130, 35, 45);
        ctx.rect(cx + 15, cy + 130, 35, 45);
        ctx.stroke();

        ctx.restore();
      },
    },
    {
      id: 'butterfly',
      nameHi: 'रंग-बिरंगी तितली (Butterfly)',
      nameEn: 'Butterfly',
      emoji: '🦋',
      renderLines: (ctx, w, h) => {
        ctx.save();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const cx = w / 2;
        const cy = h / 2;

        // Wings Left Top
        ctx.beginPath();
        ctx.ellipse(cx - 70, cy - 50, 60, 45, -0.4, 0, Math.PI * 2);
        ctx.stroke();

        // Wings Right Top
        ctx.beginPath();
        ctx.ellipse(cx + 70, cy - 50, 60, 45, 0.4, 0, Math.PI * 2);
        ctx.stroke();

        // Wings Left Bottom
        ctx.beginPath();
        ctx.ellipse(cx - 50, cy + 40, 45, 35, -0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Wings Right Bottom
        ctx.beginPath();
        ctx.ellipse(cx + 50, cy + 40, 45, 35, 0.2, 0, Math.PI * 2);
        ctx.stroke();

        // Wing Patterns Circles
        ctx.beginPath();
        ctx.arc(cx - 70, cy - 50, 18, 0, Math.PI * 2);
        ctx.arc(cx + 70, cy - 50, 18, 0, Math.PI * 2);
        ctx.arc(cx - 50, cy + 40, 12, 0, Math.PI * 2);
        ctx.arc(cx + 50, cy + 40, 12, 0, Math.PI * 2);
        ctx.stroke();

        // Body
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 14, 65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(cx, cy - 75, 16, 0, Math.PI * 2);
        ctx.fill();

        // Antennae
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy - 85);
        ctx.quadraticCurveTo(cx - 25, cy - 115, cx - 35, cy - 105);
        ctx.moveTo(cx + 5, cy - 85);
        ctx.quadraticCurveTo(cx + 25, cy - 115, cx + 35, cy - 105);
        ctx.stroke();

        ctx.restore();
      },
    },
    {
      id: 'fish',
      nameHi: 'जल की रानी मछली (Fish)',
      nameEn: 'Fish',
      emoji: '🐟',
      renderLines: (ctx, w, h) => {
        ctx.save();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const cx = w / 2;
        const cy = h / 2;

        // Fish Body
        ctx.beginPath();
        ctx.ellipse(cx, cy, 110, 70, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Tail
        ctx.beginPath();
        ctx.moveTo(cx + 100, cy);
        ctx.lineTo(cx + 160, cy - 50);
        ctx.lineTo(cx + 140, cy);
        ctx.lineTo(cx + 160, cy + 50);
        ctx.closePath();
        ctx.stroke();

        // Eye
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(cx - 65, cy - 15, 10, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.beginPath();
        ctx.arc(cx - 95, cy + 10, 14, 0, Math.PI * 0.7);
        ctx.stroke();

        // Scales
        for (let row = -1; row <= 1; row++) {
          ctx.beginPath();
          ctx.arc(cx - 10, cy + row * 30, 20, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx + 30, cy + row * 30, 20, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        }

        // Bubbles
        ctx.beginPath();
        ctx.arc(cx - 120, cy - 40, 8, 0, Math.PI * 2);
        ctx.arc(cx - 135, cy - 65, 12, 0, Math.PI * 2);
        ctx.arc(cx - 110, cy - 90, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      },
    },
    {
      id: 'blank',
      nameHi: 'कोरी स्लेट (Blank Canvas)',
      nameEn: 'Free Drawing',
      emoji: '🎨',
      renderLines: () => {},
    },
  ];

  // Initialize canvas
  useEffect(() => {
    loadTemplate(selectedTemplateId);
  }, [selectedTemplateId]);

  const loadTemplate = (templateId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill pure white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw template lines
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      template.renderLines(ctx, canvas.width, canvas.height);
    }

    // Save initial state to history
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setHistory((prev) => {
      const copy = [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)];
      if (copy.length > 15) copy.shift();
      return copy;
    });
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    if (soundEnabled) playPopSound();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const handleClear = () => {
    if (soundEnabled) playPopSound();
    loadTemplate(selectedTemplateId);
  };

  // Drawing event handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const rainbowHueRef = useRef(0);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);

    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 2;
    } else if (activeTool === 'rainbow') {
      rainbowHueRef.current = (rainbowHueRef.current + 4) % 360;
      ctx.strokeStyle = `hsl(${rainbowHueRef.current}, 100%, 50%)`;
      ctx.lineWidth = brushSize;
    } else if (activeTool === 'crayon') {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize * 1.5;
      ctx.globalAlpha = 0.6;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 1.0;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  const handleDownload = () => {
    if (soundEnabled) playSuccessSound();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `baalvarta-drawing-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setSaveSuccessMsg(isHi ? 'चित्र आपकी गैलरी में सेव हो गया! 🎨' : 'Drawing saved to your device!');
      confetti({ particleCount: 40, spread: 60 });
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4 pb-12 font-kids">
      
      {/* Sleek Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-3.5 sm:p-4 border border-orange-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
            🎨
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {isHi ? '9. कलरिंग बुक (Digital Coloring Book)' : '9. Digital Kids Coloring Book'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {isHi
                ? 'जानवरों के चित्रों में रंग भरें, ब्रश व क्रेयॉन चलाएं और डाउनलोड करें'
                : 'Interactive digital coloring with rainbow brushes and download'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Drawing Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Toolbar (Templates & Tools) */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Templates Selector */}
          <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHi ? 'चित्र चुनें (Choose Template)' : 'Choose Template'}</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      setSelectedTemplateId(tpl.id);
                    }}
                    className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-xs scale-102'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{tpl.emoji}</span>
                    <span className="text-[11px] font-black text-slate-800 text-center leading-tight">
                      {isHi ? tpl.nameHi : tpl.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Selector */}
          <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHi ? 'ब्रश व उपकरण (Drawing Tools)' : 'Tools'}</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'brush', labelHi: 'ब्रश', labelEn: 'Brush', icon: Paintbrush },
                { id: 'crayon', labelHi: 'क्रेयॉन', labelEn: 'Crayon', icon: PenTool },
                { id: 'rainbow', labelHi: 'जादुई इंद्रधनुष', labelEn: 'Rainbow', icon: Sparkles },
                { id: 'eraser', labelHi: 'रबर (मिटाओ)', labelEn: 'Eraser', icon: Eraser },
              ].map((t) => {
                const isSelected = activeTool === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      setActiveTool(t.id as any);
                    }}
                    className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500 text-white shadow-xs font-black'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold'
                    } text-xs`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{isHi ? t.labelHi : t.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Brush Size */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-black text-slate-600 block">
                {isHi ? 'ब्रश मोटाई (Size):' : 'Brush Size:'} {brushSize}px
              </span>
              <div className="flex items-center gap-2">
                {[5, 10, 18, 28].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-black cursor-pointer ${
                      brushSize === size
                        ? 'bg-amber-100 border-amber-400 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {size <= 8 ? 'पतला' : size <= 15 ? 'मध्यम' : size <= 20 ? 'मोटा' : 'बहुत मोटा'}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Center / Right: Canvas and Palette */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Color Palette Row */}
          <div className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {colors.map((c) => {
                const isSelected = activeColor === c.hex && activeTool !== 'eraser' && activeTool !== 'rainbow';
                return (
                  <button
                    key={c.hex}
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      setActiveColor(c.hex);
                      if (activeTool === 'eraser' || activeTool === 'rainbow') {
                        setActiveTool('brush');
                      }
                    }}
                    title={c.name}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform cursor-pointer shadow-xs ${
                      isSelected
                        ? 'scale-125 border-slate-900 ring-2 ring-amber-400'
                        : 'border-slate-300 hover:scale-110'
                    }`}
                  />
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                title="Undo last stroke"
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isHi ? 'वापस (Undo)' : 'Undo'}</span>
              </button>

              <button
                onClick={handleClear}
                title="Clear canvas"
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isHi ? 'साफ़ करें' : 'Clear'}</span>
              </button>
            </div>
          </div>

          {/* Drawing Canvas Container */}
          <div className="bg-white rounded-3xl p-2 sm:p-4 border-4 border-amber-300 shadow-md flex flex-col items-center relative overflow-hidden">
            <canvas
              ref={canvasRef}
              width={640}
              height={460}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full max-w-[640px] h-[340px] sm:h-[420px] md:h-[460px] bg-white rounded-2xl touch-none cursor-crosshair border border-slate-200 shadow-inner"
            />

            {/* Notification Toast */}
            {saveSuccessMsg && (
              <div className="absolute top-6 bg-emerald-600 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Download & Print Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50 rounded-2xl p-3 sm:p-4 border border-amber-200">
            <span className="text-xs font-black text-amber-900 flex items-center gap-1.5 text-center sm:text-left">
              <span>🌟</span>
              <span>{isHi ? 'अपनी बनाई पेंटिंग को मोबाइल/कंप्यूटर में हमेशा के लिए सुरक्षित रखें!' : 'Save your artwork or print it!'}</span>
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-initial py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-amber-200" />
                <span>{isHi ? '📥 ड्राइंग डाउनलोड करें (Download PNG)' : 'Download PNG'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
