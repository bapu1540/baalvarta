import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

interface ImageUpload16x9Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helperText?: string;
  soundEnabled?: boolean;
  placeholderAlt?: string;
}

export const ImageUpload16x9: React.FC<ImageUpload16x9Props> = ({
  label,
  value,
  onChange,
  required = false,
  helperText,
  soundEnabled = true,
  placeholderAlt = 'Cover Image',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to crop & scale to 16:9 aspect ratio via Canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल एक वैध इमेज फाइल (PNG, JPG, WebP) चुनें।');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // High-Definition 16:9 dimensions for crystal clear display on Computer & Tablet screens
        // 1600x900 Full HD with high quality smoothing
        let targetWidth = 1600;
        let targetHeight = 900;

        // If source image is smaller than 1280, adapt cleanly without artificial over-stretching
        if (img.width < 1280 && img.width > 640) {
          targetWidth = 1280;
          targetHeight = 720;
        } else if (img.width <= 640) {
          targetWidth = 960;
          targetHeight = 540;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Enable high quality bicubic/bilinear smoothing for retina & 4K PC/Tablet monitors
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Calculate aspect-ratio cover crop (centered)
        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight; // 16:9 = 1.777...

        let renderWidth = targetWidth;
        let renderHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (srcAspect > targetAspect) {
          // Source is wider than 16:9 -> crop horizontal sides
          renderWidth = targetHeight * srcAspect;
          offsetX = (targetWidth - renderWidth) / 2;
        } else {
          // Source is taller than 16:9 -> crop vertical top/bottom
          renderHeight = targetWidth / srcAspect;
          offsetY = (targetHeight - renderHeight) / 2;
        }

        // Draw clean cropped 16:9 image with background fill
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

        // Convert to ultra-crisp HD image (quality 0.88 gives crystal-clear sharpness for PC/iPad while keeping cloud payload light)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        onChange(dataUrl);
        setIsProcessing(false);
        if (soundEnabled) playPopSound();
      };

      img.onerror = () => {
        setIsProcessing(false);
        alert('इमेज लोड करने में त्रुटि हुई। कृपया दूसरी फाइल चुनें।');
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft('');
      setShowUrlInput(false);
      if (soundEnabled) playPopSound();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playPopSound();
    onChange('');
  };

  return (
    <div className="space-y-1.5 w-full">
      {/* Label and Badge Header */}
      <div className="flex items-center justify-between gap-2">
        <label className="font-extrabold text-slate-700 text-xs flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>

        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300 flex items-center gap-1">
            <span>✨</span>
            <span>Ultra HD 16:9 (PC & Tablet)</span>
          </span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'अपलोड बॉक्स' : 'या HD URL'}</span>
          </button>
        </div>
      </div>

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-amber-50/70 border border-amber-200 rounded-xl">
          <input
            type="url"
            placeholder="https://example.com/cover-16-9.jpg"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-amber-300 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors"
          >
            लागू करें
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview or Drop Area */}
      {value ? (
        /* Image Preview with 16:9 Aspect Ratio */
        <div className="relative group aspect-video w-full rounded-2xl overflow-hidden border-2 border-amber-300 bg-slate-100 shadow-xs">
          <img
            src={value}
            alt={placeholderAlt}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80';
            }}
          />

          {/* 16:9 Overlay Badges */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-black backdrop-blur-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>16:9 कवर सेट है</span>
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-amber-50 font-black text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
              <span>फ़ोटो बदलें (16:9)</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              <span>हटाएँ</span>
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone / Click to Upload Box (16:9 proportion) */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all select-none ${
            isDragging
              ? 'border-amber-500 bg-amber-100/70 scale-[1.01]'
              : 'border-amber-300 bg-amber-50/50 hover:bg-amber-100/50 hover:border-amber-400'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 text-amber-800">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
              <p className="text-xs font-black">16:9 में प्रोसेस हो रहा है...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-200/80 text-amber-800 flex items-center justify-center shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-xs text-amber-950">
                  सीधे 16:9 इमेज अपलोड करें (क्लिक करें या ड्रैग करें)
                </p>
                <p className="text-[11px] text-amber-800/80 mt-0.5">
                  PNG, JPG या WebP (यह खुद 16:9 में सटीक क्रॉप व सेट हो जाएगी)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[10px] font-bold text-amber-900 shadow-2xs">
                📂 डिवाइस / गैलरी से चुनें
              </span>
            </div>
          )}
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
