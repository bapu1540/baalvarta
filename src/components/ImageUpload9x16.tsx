import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

interface ImageUpload9x16Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  helperText?: string;
  soundEnabled?: boolean;
  placeholderAlt?: string;
}

export const ImageUpload9x16: React.FC<ImageUpload9x16Props> = ({
  label,
  value,
  onChange,
  required = false,
  helperText,
  soundEnabled = true,
  placeholderAlt = 'Video 9:16 Thumbnail',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop & scale to 9:16 vertical aspect ratio via Canvas (e.g. 450x800)
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
        // High-Definition 9:16 portrait dimensions for crystal clear display on PC, Tablets & Phones
        let targetWidth = 900;
        let targetHeight = 1600;

        if (img.width < 720) {
          targetWidth = 720;
          targetHeight = 1280;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Enable high quality bicubic/bilinear smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Calculate aspect-ratio cover crop
        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight; // 9/16 = 0.5625

        let renderWidth = targetWidth;
        let renderHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (srcAspect > targetAspect) {
          // Source is wider -> crop horizontal sides
          renderWidth = targetHeight * srcAspect;
          offsetX = (targetWidth - renderWidth) / 2;
        } else {
          // Source is taller -> crop top/bottom
          renderHeight = targetWidth / srcAspect;
          offsetY = (targetHeight - renderHeight) / 2;
        }

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

        // Convert to high-definition JPEG base64 (0.88 quality for crystal clarity on large screens)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        onChange(dataUrl);
        setIsProcessing(false);
        if (soundEnabled) playPopSound();
      };

      img.onerror = () => {
        setIsProcessing(false);
        alert('इमेज प्रोसेस करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft('');
      setShowUrlInput(false);
      if (soundEnabled) playPopSound();
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (soundEnabled) playPopSound();
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="font-black text-slate-800 text-xs flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-red-500" />
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
          <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
            9:16 Portrait
          </span>
        </label>

        <div className="flex items-center gap-2">
          {!showUrlInput && (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>URL से जोड़ें</span>
            </button>
          )}
          {value && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>हटाएं</span>
            </button>
          )}
        </div>
      </div>

      {helperText && <p className="text-[11px] text-slate-500 font-medium">{helperText}</p>}

      {/* URL Input Form if toggled */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="flex items-center gap-2 mb-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://... 9:16 इमेज लिंक पेस्ट करें"
            className="flex-1 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            सेट करें
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* 9:16 Upload / Preview Container */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Thumbnail Preview (9:16 Ratio) */}
        {value ? (
          <div className="relative w-28 aspect-[9/16] rounded-2xl overflow-hidden shadow-md border-2 border-red-300 bg-slate-900 shrink-0 group">
            <img
              src={value}
              alt={placeholderAlt}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-white text-[9px] font-black">
              9:16
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>बदलें</span>
            </button>
          </div>
        ) : (
          <div className="w-28 aspect-[9/16] rounded-2xl border-2 border-dashed border-red-200 bg-red-50/50 flex flex-col items-center justify-center text-red-300 p-2 text-center shrink-0">
            <ImageIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">9:16 प्रीव्यू</span>
          </div>
        )}

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 w-full min-h-[120px] rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-red-500 bg-red-100/70 scale-[1.01]'
              : 'border-red-200 bg-white hover:bg-red-50/50 hover:border-red-300'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {isProcessing ? (
            <div className="flex flex-col items-center gap-1.5 text-red-600">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">इमेज 9:16 में ऑटो-क्रॉप हो रही है...</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-1">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                {value ? 'दूसरी 9:16 फोटो चुनें या ड्रैग करें' : '9:16 थंबनेल अपलोड करें या यहाँ ड्रैग करें'}
              </p>
              <p className="text-[10px] text-slate-500">
                ऑटोमैटिक 9:16 पोर्ट्रेट अनुपात में सेट होगी • JPG, PNG, WebP
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
