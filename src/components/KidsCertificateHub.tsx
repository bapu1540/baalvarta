import React, { useState, useRef } from 'react';
import {
  Award,
  Download,
  Printer,
  Sparkles,
  Star,
  CheckCircle2,
  Share2,
  User,
  Heart,
  Trophy,
  ShieldCheck,
  Check,
  Camera,
  Trash2,
  Image as ImageIcon,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { BaalvartaLogo } from './BaalvartaLogo';

interface KidsCertificateHubProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
  initialAchievementType?: string;
}

export const KidsCertificateHub: React.FC<KidsCertificateHubProps> = ({
  language,
  soundEnabled,
  initialAchievementType,
}) => {
  const isHi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [childName, setChildName] = useState<string>('आरव चौहान');
  const [childPhoto, setChildPhoto] = useState<string | null>(null);
  const [achievementType, setAchievementType] = useState<string>(initialAchievementType || 'super_reader');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialAchievementType) {
      setAchievementType(initialAchievementType);
    }
  }, [initialAchievementType]);

  const achievementOptions = [
    {
      id: 'super_reader',
      titleHi: '🌟 बालवार्ता सुपर स्टोरी रीडर (Super Reader)',
      titleEn: 'Super Story Reader Certificate',
      descHi: '50+ सचित्र हिंदी नैतिक कहानियाँ ध्यानपूर्वक पढ़ने, समझने व शिक्षा ग्रहण करने के उपलक्ष्य में।',
      descEn: 'For reading & understanding 50+ illustrated moral stories with excellence.',
      gradient: 'from-amber-500 via-orange-500 to-rose-500',
      badgeColor: '#EA580C',
      badgeEmoji: '🌟',
      stars: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'panchatantra_master',
      titleHi: '🏆 पंचतंत्र नैतिक ज्ञान मास्टर (Panchatantra Master)',
      titleEn: 'Panchatantra Wisdom Master',
      descHi: 'पंचतंत्र व हितोपदेश की कहानियों से नीति, सूझबूझ व जीवनोपयोगी संस्कार सीखने के लिए।',
      descEn: 'For mastering moral wisdom & life values from Panchatantra stories.',
      gradient: 'from-purple-600 via-indigo-600 to-blue-600',
      badgeColor: '#7C3AED',
      badgeEmoji: '🏆',
      stars: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'quiz_champion',
      titleHi: '🎯 बाल क्विज़ ऑलराउंडर चैंपियन (Quiz Champion)',
      titleEn: 'Kids Quiz All-Rounder Champion',
      descHi: 'विज्ञान, प्रकृति, पशु-पक्षी, सामान्य ज्ञान व बाल साहित्य क्विज़ में शत-प्रतिशत प्रदर्शन हेतु।',
      descEn: 'For outstanding 100% scores in Science, Nature, Animals & Literature quizzes.',
      gradient: 'from-rose-500 via-pink-500 to-purple-600',
      badgeColor: '#E11D48',
      badgeEmoji: '🎯',
      stars: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'shiksha_ratna',
      titleHi: '👑 ज्ञान व संस्कार बाल रत्न (Baal Ratna Scholar)',
      titleEn: 'Baal Ratna National Scholar',
      descHi: 'दैनिक ज्ञान अर्जन, नैतिक आचरण, सचित्र वर्कशीट अभ्यास व अच्छी आदतों के सर्वोत्तम प्रदर्शन हेतु।',
      descEn: 'For daily excellence in reading, moral values, worksheets and good habits.',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      badgeColor: '#059669',
      badgeEmoji: '👑',
      stars: '⭐⭐⭐⭐⭐'
    },
  ];

  const currentAch = achievementOptions.find((a) => a.id === achievementType) || achievementOptions[0];
  const currentDate = new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Handle Child Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (soundEnabled) playPopSound();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setChildPhoto(event.target.result as string);
        if (soundEnabled) playSuccessSound();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (soundEnabled) playPopSound();
    setChildPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadCertificate = async () => {
    if (soundEnabled) playSuccessSound();
    setIsGenerating(true);

    // High-Resolution 1400x980 Canvas Generation
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 980;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // 1. Vibrant Multi-Color Parchment Background Gradient (Rose -> Amber -> Mint -> Sky Blue)
    const bgGrad = ctx.createLinearGradient(0, 0, 1400, 980);
    bgGrad.addColorStop(0, '#FFF5F5');    // Soft Rose
    bgGrad.addColorStop(0.3, '#FFFBEB');  // Warm Cream Gold
    bgGrad.addColorStop(0.7, '#F0FDF4');  // Fresh Mint
    bgGrad.addColorStop(1, '#EFF6FF');    // Sky Tint
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1400, 980);

    // Festive Confetti Particles Sprinkles
    const confettiColors = ['#FF007F', '#FFB703', '#06D6A0', '#118AB2', '#8338EC', '#FB5607', '#E63946', '#3A86FF'];
    for (let i = 0; i < 90; i++) {
      const x = (i * 15.5) % 1400;
      const y = (i * 24.3) % 980;
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.arc(x, y, (i % 4) + 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 2. Rich Multi-Tier Royal Borders
    // Outer Royal Sapphire Border
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1340, 920);

    // Middle Radiant Golden Border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 6;
    ctx.strokeRect(48, 48, 1304, 884);

    // Inner Ruby Crimson Border
    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 3;
    ctx.strokeRect(58, 58, 1284, 864);

    // Fine Emerald Accent Border
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(64, 64, 1272, 852);

    // Corner Festive Golden Stars
    ctx.fillStyle = '#D97706';
    ctx.font = '42px system-ui';
    ctx.fillText('🌟', 80, 115);
    ctx.fillText('🌟', 1280, 115);
    ctx.fillText('🌟', 80, 900);
    ctx.fillText('🌟', 1280, 900);

    // 3. Header Title & Branding
    ctx.textAlign = 'center';
    
    // Top Organization Banner
    ctx.fillStyle = '#9A3412';
    ctx.font = 'bold 30px "Baloo 2", sans-serif';
    ctx.fillText('✨ बालवार्ता (BAALVARTA) बाल साहित्य व ज्ञान मंच ✨', 700, 115);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 18px "Baloo 2", sans-serif';
    ctx.fillText('राष्ट्रीय बाल प्रतिभा एवं ज्ञान संवर्धन सम्मान • NATIONAL CHILD EXCELLENCE AWARDS', 700, 145);

    // Large Certificate Title with Vibrant Gradient
    const titleGrad = ctx.createLinearGradient(350, 0, 1050, 0);
    titleGrad.addColorStop(0, '#B91C1C');  // Deep Red
    titleGrad.addColorStop(0.5, '#D97706'); // Gold
    titleGrad.addColorStop(1, '#4338CA');  // Indigo
    ctx.fillStyle = titleGrad;
    ctx.font = 'bold 50px "Baloo 2", serif';
    ctx.fillText('प्रमाण पत्र • CERTIFICATE OF ACHIEVEMENT', 700, 205);

    // Decorative Ribbon Line
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(300, 222);
    ctx.lineTo(1100, 222);
    ctx.stroke();

    // =========================================================================
    // 4. MAIN BODY (LEFT: TEXT & DETAILS, RIGHT: LARGE SQUARE PHOTO CARD)
    // =========================================================================

    // LEFT SECTION: Text & Recipient Details
    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.font = '22px "Baloo 2", sans-serif';
    ctx.fillText('यह गौरवशाली सम्मान पत्र अत्यंत हर्ष, गर्व व स्नेह के साथ प्रदान किया जाता है:', 100, 275);

    // Recipient Child Name in Grand Font
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 62px "Baloo 2", sans-serif';
    ctx.fillText(childName || 'नन्हा पाठक', 100, 360);

    // Multi-color Name Underline
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, 385);
    ctx.lineTo(920, 385);
    ctx.stroke();

    // Award Category Badge Title
    ctx.fillStyle = currentAch.badgeColor;
    ctx.font = 'bold 32px "Baloo 2", sans-serif';
    ctx.fillText(currentAch.titleHi, 100, 440);

    // Award Description
    ctx.fillStyle = '#475569';
    ctx.font = '20px "Baloo 2", sans-serif';
    // Wrap text if needed
    const descText = currentAch.descHi;
    if (descText.length > 55) {
      ctx.fillText(descText.slice(0, 52) + '...', 100, 480);
      ctx.fillText(descText.slice(52), 100, 510);
    } else {
      ctx.fillText(descText, 100, 480);
    }

    // 5 Gold Stars
    ctx.fillStyle = '#F59E0B';
    ctx.font = '36px system-ui';
    ctx.fillText('⭐⭐⭐⭐⭐', 100, 560);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 19px "Baloo 2", sans-serif';
    ctx.fillText('🎖️ पठन तपस्या, नैतिक आचरण व ज्ञान संवर्धन में सर्वोच्च प्रदर्शन', 100, 605);

    // =========================================================================
    // RIGHT SECTION: LARGE SQUARE / PORTRAIT PHOTO CARD (Width: 290, Height: 330)
    // =========================================================================
    const photoBoxX = 980;
    const photoBoxY = 265;
    const photoBoxW = 280;
    const photoBoxH = 320;
    const cornerRadius = 18;

    // Helper: Rounded Rect
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // Golden Outer Drop-Shadow & Frame
    ctx.save();
    roundRect(photoBoxX - 6, photoBoxY - 6, photoBoxW + 12, photoBoxH + 12, cornerRadius + 4);
    const photoFrameGrad = ctx.createLinearGradient(photoBoxX, photoBoxY, photoBoxX + photoBoxW, photoBoxY + photoBoxH);
    photoFrameGrad.addColorStop(0, '#F59E0B');
    photoFrameGrad.addColorStop(0.5, '#FDE68A');
    photoFrameGrad.addColorStop(1, '#D97706');
    ctx.fillStyle = photoFrameGrad;
    ctx.fill();
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner White Card
    roundRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, cornerRadius);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    if (childPhoto) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = childPhoto;
        });

        // Clip child photo inside the rounded card (leave 40px at bottom for name tag)
        const innerImgH = photoBoxH - 46;
        ctx.save();
        roundRect(photoBoxX + 6, photoBoxY + 6, photoBoxW - 12, innerImgH, cornerRadius - 4);
        ctx.clip();

        // Object cover logic
        const targetRatio = (photoBoxW - 12) / innerImgH;
        const imgRatio = img.width / img.height;
        let sx, sy, sw, sh;
        if (imgRatio > targetRatio) {
          sh = img.height;
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = img.width / targetRatio;
          sx = 0;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, photoBoxX + 6, photoBoxY + 6, photoBoxW - 12, innerImgH);
        ctx.restore();

        // Bottom Child Star Badge inside Photo Frame
        roundRect(photoBoxX + 8, photoBoxY + photoBoxH - 40, photoBoxW - 16, 32, 10);
        ctx.fillStyle = '#0F172A';
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 15px "Baloo 2", sans-serif';
        ctx.fillText('🌟 ' + (childName || 'बाल प्रतिभा') + ' 🌟', photoBoxX + (photoBoxW / 2), photoBoxY + photoBoxH - 18);

        // Crown on Top of Frame
        ctx.font = '36px system-ui';
        ctx.fillText('👑', photoBoxX + (photoBoxW / 2), photoBoxY - 12);
      } catch {
        // fallback to placeholder
      }
    } else {
      // Elegant Placeholder Frame if No Photo is uploaded
      ctx.textAlign = 'center';
      
      // Decorative Circle
      ctx.beginPath();
      ctx.arc(photoBoxX + (photoBoxW / 2), photoBoxY + 110, 55, 0, Math.PI * 2);
      ctx.fillStyle = '#FEF3C7';
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '48px system-ui';
      ctx.fillText(currentAch.badgeEmoji, photoBoxX + (photoBoxW / 2), photoBoxY + 128);

      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 18px "Baloo 2", sans-serif';
      ctx.fillText('आधिकारिक बाल फ़ोटो', photoBoxX + (photoBoxW / 2), photoBoxY + 205);

      ctx.fillStyle = '#64748B';
      ctx.font = '13px "Baloo 2", sans-serif';
      ctx.fillText('PORTRAIT PHOTOGRAPH', photoBoxX + (photoBoxW / 2), photoBoxY + 230);

      // Bottom Badge
      roundRect(photoBoxX + 10, photoBoxY + photoBoxH - 42, photoBoxW - 20, 32, 10);
      ctx.fillStyle = '#EA580C';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px "Baloo 2", sans-serif';
      ctx.fillText('★ EXCELLENCE AWARD ★', photoBoxX + (photoBoxW / 2), photoBoxY + photoBoxH - 21);
    }
    ctx.restore();

    // =========================================================================
    // 5. FOOTER: DATE & SERIAL (LEFT), EMBOSSED SEAL (CENTER), LOGO & SIGN (RIGHT)
    // =========================================================================

    // Left: Date & Serial ID
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 19px "Baloo 2", sans-serif';
    ctx.fillText('जारी करने का दिनांक (Date):', 100, 770);
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 23px "Baloo 2", sans-serif';
    ctx.fillText(currentDate, 100, 802);

    ctx.fillStyle = '#64748B';
    ctx.font = '15px "Baloo 2", sans-serif';
    ctx.fillText('प्रमाण पत्र क्रमांक: BV-2026-' + Math.floor(100000 + Math.random() * 900000), 100, 835);
    ctx.fillText('आधिकारिक वेबसाइट: www.baalvarta.com', 100, 860);

    // Center: PERMANENT OFFICIAL CIRCULAR EMBOSSED SEAL
    const sealX = 700;
    const sealY = 785;
    const sealRadius = 70;

    // Seal Ribbon Tails
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(sealX - 42, sealY + 40);
    ctx.lineTo(sealX - 58, sealY + 125);
    ctx.lineTo(sealX - 32, sealY + 110);
    ctx.lineTo(sealX - 10, sealY + 125);
    ctx.lineTo(sealX - 15, sealY + 40);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sealX + 15, sealY + 40);
    ctx.lineTo(sealX + 10, sealY + 125);
    ctx.lineTo(sealX + 32, sealY + 110);
    ctx.lineTo(sealX + 58, sealY + 125);
    ctx.lineTo(sealX + 42, sealY + 40);
    ctx.fill();

    // Outer Seal Golden Sun Rays
    ctx.fillStyle = '#F59E0B';
    for (let a = 0; a < 36; a++) {
      const angle = (a * Math.PI * 2) / 36;
      const r = sealRadius + 8;
      const px = sealX + Math.cos(angle) * r;
      const py = sealY + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main Gold Circular Seal Body
    const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, sealRadius);
    sealGrad.addColorStop(0, '#FEF3C7');
    sealGrad.addColorStop(0.7, '#FDE68A');
    sealGrad.addColorStop(1, '#D97706');
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner Ring
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, sealRadius - 10, 0, Math.PI * 2);
    ctx.stroke();

    // Seal Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 12px "Baloo 2", sans-serif';
    ctx.fillText('★ BAALVARTA OFFICIAL ★', sealX, sealY - 38);
    ctx.fillText('★ बालवार्ता प्रमाणित मुहर ★', sealX, sealY + 44);

    ctx.font = '26px system-ui';
    ctx.fillText('📖', sealX, sealY - 8);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 14px "Baloo 2", sans-serif';
    ctx.fillText('SEAL OF EXCELLENCE', sealX, sealY + 16);

    // Right: CHANNEL LOGO & AUTHORISED SIGNATORY
    const sigX = 1270;
    ctx.textAlign = 'right';

    ctx.fillStyle = '#EA580C';
    ctx.font = 'bold 30px "Baloo 2", sans-serif';
    ctx.fillText('बालवार्ता (Baalvarta)', sigX, 735);

    // Digital Signature Script
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sigX - 220, 775);
    ctx.bezierCurveTo(sigX - 180, 745, sigX - 140, 805, sigX - 80, 765);
    ctx.bezierCurveTo(sigX - 50, 735, sigX - 30, 785, sigX - 10, 770);
    ctx.stroke();

    // Signatory Underline
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sigX - 240, 790);
    ctx.lineTo(sigX, 790);
    ctx.stroke();

    // Authorised Signatory Titles
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 19px "Baloo 2", sans-serif';
    ctx.fillText('अधिकृत हस्ताक्षर (Authorised Signatory)', sigX, 818);

    ctx.fillStyle = '#475569';
    ctx.font = '15px "Baloo 2", sans-serif';
    ctx.fillText('संपादक व संस्थापक • बालवार्ता डिजिटल मंच', sigX, 845);

    // Trigger PNG download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `Baalvarta-Certificate-${childName.replace(/\s+/g, '_')}.png`;
    a.href = dataUrl;
    a.click();

    setIsGenerating(false);
    setDownloadSuccess(true);
    confetti({ particleCount: 90, spread: 100 });
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrintCertificate = () => {
    if (soundEnabled) playPopSound();
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (soundEnabled) playPopSound();
    const shareText = `🎉 *बालवार्ता बाल पाठक प्रमाण पत्र!*\n\nहमारे प्यारे बच्चे *${childName}* को बालवार्ता पोर्टल पर *${currentAch.titleHi}* का गौरवशाली रंग-बिरंगा प्रमाण पत्र मिला है! ⭐⭐⭐⭐⭐\n\n📖 आप भी अपने बच्चों के लिए सुंदर हिंदी कहानियाँ पढ़ें व बड़े फोटो के साथ प्रमाण पत्र बनाएँ:\n${window.location.origin}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 font-kids">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-2xl p-3 sm:p-4 text-white shadow-md relative overflow-hidden border-2 border-amber-300">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Award className="w-6 h-6 text-amber-200 shrink-0" />
            <h1 className="text-base sm:text-xl font-black text-white tracking-tight truncate">
              🏆 {isHi ? 'आधिकारिक बाल पाठक प्रमाण पत्र' : 'Official Kids Star Certificate'}
            </h1>
          </div>
          <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black border border-white/30 shrink-0">
            {isHi ? 'मुफ़्त जनरेट करें' : 'Free Download'}
          </span>
        </div>
      </div>

      {/* Editor & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Form: Customization */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md space-y-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600" />
            <span>{isHi ? 'प्रमाण पत्र विवरण भरें' : 'Certificate Details'}</span>
          </h3>

          {/* Child's Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 block">
              {isHi ? 'बच्चे का नाम (Child\'s Name):' : 'Child\'s Name:'}
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="उदा. आरव चौहान, अदिति, रोहन..."
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-amber-400 focus:border-amber-600 focus:outline-hidden text-sm font-bold text-slate-900 bg-amber-50/50"
            />
          </div>

          {/* 📸 CHILD PHOTO UPLOAD SECTION */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 border-2 border-amber-200">
            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-500" />
                <span>{isHi ? 'बच्चे का बड़ा फोटो जोड़ें (Square Photo):' : 'Upload Child Square Photo:'}</span>
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                {isHi ? 'दाईं ओर दिखेगा' : 'Shows on Right'}
              </span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="child-photo-input"
            />

            {childPhoto ? (
              <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-amber-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-500 shadow-xs relative shrink-0">
                    <img src={childPhoto} alt="Child Preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> बड़ा फोटो जोड़ा गया ✓
                    </span>
                    <span className="text-[10px] text-slate-500">सर्टिफिकेट में दाईं ओर दिखेगा</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  title="फोटो हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="child-photo-input"
                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-amber-400 hover:border-amber-600 bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-2xs"
              >
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-black text-amber-900">
                  {isHi ? '📁 गैलरी / कैमरे से बच्चे का फोटो चुनें' : 'Choose Child Photo'}
                </span>
              </label>
            )}
          </div>

          {/* Achievement Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block">
              {isHi ? 'उपलब्धि / पुरस्कार श्रेणी:' : 'Award Category:'}
            </label>
            <div className="space-y-2">
              {achievementOptions.map((opt) => {
                const isSelected = achievementType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      setAchievementType(opt.id);
                    }}
                    className={`w-full p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-400/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="font-black text-xs text-slate-900 block leading-tight">
                      {opt.titleHi}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5 line-clamp-1">
                      {opt.descHi}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleDownloadCertificate}
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-amber-100" />
              <span>{isGenerating ? (isHi ? 'तैयार हो रहा है...' : 'Generating...') : (isHi ? '📥 रंगीन प्रमाण पत्र डाउनलोड करें (PNG)' : 'Download Color Certificate')}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <span>📲</span>
              <span>{isHi ? 'परिवार को WhatsApp पर भेजें' : 'Share on WhatsApp'}</span>
            </button>

            <button
              onClick={handlePrintCertificate}
              className="w-full py-2 rounded-2xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHi ? '🖨️ अभी प्रिंट करें (Print)' : 'Print Certificate'}</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white font-black text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHi ? 'प्रमाण पत्र सफलतापूर्वक डाउनलोड हो गया!' : 'Certificate downloaded!'}</span>
            </div>
          )}

        </div>

        {/* Right Live Preview: Super Vibrant Multi-Color Certificate with Large Right Square Photo */}
        <div className="lg:col-span-2">
          <div
            className="bg-gradient-to-br from-rose-50/90 via-amber-50/80 to-indigo-50/90 rounded-3xl p-5 sm:p-8 lg:p-9 border-8 border-double border-indigo-700 shadow-2xl relative overflow-hidden space-y-4"
          >
            {/* Multi-color inner decorative borders */}
            <div className="absolute inset-2 border-2 border-dashed border-amber-400/90 rounded-2xl pointer-events-none" />
            <div className="absolute inset-3 border border-rose-400/40 rounded-xl pointer-events-none" />

            {/* Corner Decorative Festive Stars */}
            <span className="absolute top-4 left-5 text-2xl animate-pulse">🌟</span>
            <span className="absolute top-4 right-5 text-2xl animate-pulse">🌟</span>
            <span className="absolute bottom-4 left-5 text-2xl animate-pulse">🌟</span>
            <span className="absolute bottom-4 right-5 text-2xl animate-pulse">🌟</span>

            {/* Header Badge */}
            <div className="space-y-1 relative z-10 text-center">
              <span className="text-xs sm:text-sm font-black text-amber-950 tracking-wider uppercase block bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 inline-block px-4 py-1 rounded-full border border-amber-400 shadow-2xs">
                ✨ बालवार्ता (BAALVARTA) बाल साहित्य व ज्ञान मंच ✨
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-rose-700 via-amber-700 to-indigo-800 bg-clip-text text-transparent font-serif tracking-tight mt-1">
                प्रमाण पत्र (CERTIFICATE OF ACHIEVEMENT)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 font-bold">
                राष्ट्रीय बाल प्रतिभा एवं ज्ञान संवर्धन सम्मान
              </p>
            </div>

            {/* ========================================================================= */}
            {/* MAIN CERTIFICATE BODY: LEFT DETAILS + RIGHT LARGE SQUARE PHOTO CARD */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10 pt-1">
              
              {/* Left Details (8 cols) */}
              <div className="md:col-span-8 text-center md:text-left space-y-3">
                <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                  यह गौरवशाली सम्मान पत्र अत्यंत हर्ष, गर्व व स्नेह के साथ हमारे प्रिय नन्हे पाठक को प्रदान किया जाता है:
                </p>

                {/* Child's Name */}
                <div>
                  <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-kids tracking-tight border-b-4 border-rose-500 pb-1 inline-block drop-shadow-xs">
                    {childName || 'नन्हा पाठक'}
                  </span>
                </div>

                {/* Award Title & Description */}
                <div className="space-y-1.5">
                  <span className="text-sm sm:text-base lg:text-lg font-black text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 py-1.5 px-4 rounded-xl shadow-sm inline-block">
                    {currentAch.titleHi}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold max-w-md">
                    {currentAch.descHi}
                  </p>
                </div>

                {/* 5 Golden Stars */}
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-xl sm:text-2xl text-amber-500">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
              </div>

              {/* Right Large Square Photo Card (4 cols) */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative group w-44 sm:w-48 aspect-[1/1.15] rounded-2xl p-1.5 bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 shadow-xl border-2 border-amber-300 flex flex-col items-center justify-between">
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl z-20">👑</span>
                  
                  {/* Photo Container */}
                  <div className="w-full flex-1 rounded-xl overflow-hidden bg-white/90 border border-amber-200 flex items-center justify-center relative">
                    {childPhoto ? (
                      <img
                        src={childPhoto}
                        alt={childName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-3 space-y-1">
                        <span className="text-3xl block">{currentAch.badgeEmoji}</span>
                        <span className="text-[11px] font-black text-amber-900 block leading-tight">
                          बच्चे का फोटो
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold block">
                          Square Portrait
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Ribbon Label */}
                  <div className="w-full mt-1 py-1 rounded-lg bg-slate-950 text-amber-300 text-center border border-amber-400/50 shadow-xs">
                    <span className="text-[10px] font-black truncate block px-1">
                      🌟 {childName || 'बाल प्रतिभा'} 🌟
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Signatures, Permanent Official Round Seal & Channel Logo */}
            <div className="pt-5 border-t-2 border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-700 font-bold relative z-10">
              
              {/* Left Side: Date & Serial ID */}
              <div className="text-center sm:text-left space-y-0.5">
                <span className="block text-[11px] text-slate-500 font-bold">जारी करने का दिनांक</span>
                <span className="text-sm font-black text-slate-900">{currentDate}</span>
                <span className="block text-[10px] text-indigo-800 font-mono font-bold">BV-CERT-2026-VERIFIED ✓</span>
              </div>

              {/* Center: PERMANENT OFFICIAL CIRCULAR ROUND SEAL */}
              <div className="relative group">
                {/* Crimson Ribbon Tails */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 -z-10">
                  <div className="w-4 h-9 bg-rose-600 border border-rose-700 transform -rotate-12 rounded-b-xs shadow-xs" />
                  <div className="w-4 h-9 bg-rose-600 border border-rose-700 transform rotate-12 rounded-b-xs shadow-xs" />
                </div>

                {/* Main 3D Circular Embossed Seal */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 shadow-lg border-2 border-amber-700 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900 flex flex-col items-center justify-center text-amber-950 p-1 bg-gradient-to-tr from-amber-300 via-yellow-100 to-amber-200">
                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider text-amber-950">★ BAALVARTA ★</span>
                    <span className="text-base sm:text-lg my-0.5">📖</span>
                    <span className="text-[6px] sm:text-[7px] font-black uppercase text-rose-900 bg-rose-100 px-1 rounded-full border border-rose-300">SEAL OF EXCELLENCE</span>
                    <span className="text-[6px] font-extrabold text-amber-900 mt-0.5">बालवार्ता प्रमाणित</span>
                  </div>
                </div>
              </div>

              {/* Right Side: CHANNEL LOGO + AUTHORISED SIGNATORY */}
              <div className="text-center sm:text-right flex flex-col items-center sm:items-end">
                {/* Channel Logo */}
                <div className="mb-1">
                  <BaalvartaLogo variant="compact" />
                </div>
                
                {/* Digital Calligraphy Stroke */}
                <div className="w-32 h-6 border-b-2 border-blue-900 font-serif italic text-blue-900 text-xs flex items-center justify-end px-2">
                  <span className="font-bold">Baalvarta Team</span>
                </div>

                <div className="mt-1 space-y-0.5">
                  <span className="block text-xs font-black text-slate-900 uppercase">
                    अधिकृत हस्ताक्षर (Authorised Signatory)
                  </span>
                  <span className="block text-[11px] text-slate-600 font-semibold">
                    संपादक व संस्थापक • बालवार्ता डिजिटल मंच
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
