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
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { BaalvartaLogo } from './BaalvartaLogo';

interface KidsCertificateHubProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
}

export const KidsCertificateHub: React.FC<KidsCertificateHubProps> = ({
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const certRef = useRef<HTMLDivElement | null>(null);

  const [childName, setChildName] = useState<string>('आरव चौहान');
  const [achievementType, setAchievementType] = useState<string>('super_reader');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const achievementOptions = [
    {
      id: 'super_reader',
      titleHi: '🌟 बालवार्ता सुपर स्टोरी रीडर (Super Reader)',
      titleEn: 'Super Story Reader Certificate',
      descHi: '50+ सचित्र हिंदी नैतिक कहानियाँ ध्यानपूर्वक पढ़ने, समझने व शिक्षा ग्रहण करने के उपलक्ष्य में।',
      descEn: 'For reading & understanding 50+ illustrated moral stories with excellence.',
      color: 'from-amber-500 to-orange-600',
      badgeEmoji: '🌟',
      stars: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'panchatantra_master',
      titleHi: '🏆 पंचतंत्र नैतिक ज्ञान मास्टर (Panchatantra Master)',
      titleEn: 'Panchatantra Wisdom Master',
      descHi: 'पंचतंत्र व हितोपदेश की कहानियों से नीति, सूझबूझ व जीवनोपयोगी संस्कार सीखने के लिए।',
      descEn: 'For mastering moral wisdom & life values from Panchatantra stories.',
      color: 'from-purple-500 to-indigo-600',
      badgeEmoji: '🏆',
      stars: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'quiz_champion',
      titleHi: '🎯 बाल क्विज़ ऑलराउंडर चैंपियन (Quiz Champion)',
      titleEn: 'Kids Quiz All-Rounder Champion',
      descHi: 'विज्ञान, प्रकृति, पशु-पक्षी, सामान्य ज्ञान व बाल साहित्य क्विज़ में शत-प्रतिशत प्रदर्शन हेतु।',
      descEn: 'For outstanding 100% scores in Science, Nature, Animals & Literature quizzes.',
      color: 'from-rose-500 to-pink-600',
      badgeEmoji: '🎯',
      stars: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'shiksha_ratna',
      titleHi: '👑 ज्ञान व संस्कार बाल रत्न (Baal Ratna Scholar)',
      titleEn: 'Baal Ratna National Scholar',
      descHi: 'दैनिक ज्ञान अर्जन, नैतिक आचरण, सचित्र वर्कशीट अभ्यास व अच्छी आदतों के सर्वोत्तम प्रदर्शन हेतु।',
      descEn: 'For daily excellence in reading, moral values, worksheets and good habits.',
      color: 'from-emerald-500 to-teal-600',
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

  const handleDownloadCertificate = () => {
    if (soundEnabled) playSuccessSound();

    // High-Resolution 1400x950 Canvas Generation
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 950;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Rich Parchment Background Gradient with Warm Tones
    const bgGrad = ctx.createLinearGradient(0, 0, 1400, 950);
    bgGrad.addColorStop(0, '#FFFDF0');
    bgGrad.addColorStop(0.3, '#FFF7D6');
    bgGrad.addColorStop(0.7, '#FFF3C2');
    bgGrad.addColorStop(1, '#FFFDF0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1400, 950);

    // Subtle celebration confetti sprinkles on canvas
    const confettiColors = ['#FF4D6D', '#FFB703', '#06D6A0', '#118AB2', '#8338EC', '#FB5607'];
    for (let i = 0; i < 60; i++) {
      const x = (i * 23.5) % 1400;
      const y = (i * 37.3) % 950;
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(x, y, (i % 4) + 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 2. Multi-Color Royal Border
    // Outer Rainbow/Gold Border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 14;
    ctx.strokeRect(35, 35, 1330, 880);

    // Inner Crimson Border
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.strokeRect(52, 52, 1296, 846);

    // Fine Gold Border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, 1280, 830);

    // Corner Festive Stars
    ctx.fillStyle = '#D97706';
    ctx.font = '40px system-ui';
    ctx.fillText('🌟', 75, 110);
    ctx.fillText('🌟', 1280, 110);
    ctx.fillText('🌟', 75, 870);
    ctx.fillText('🌟', 1280, 870);

    // 3. Header Title & Branding
    ctx.textAlign = 'center';
    
    // Top Organization Banner
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 30px "Baloo 2", sans-serif';
    ctx.fillText('✨ बालवार्ता (BAALVARTA) बाल साहित्य व ज्ञान मंच ✨', 700, 125);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 18px "Baloo 2", sans-serif';
    ctx.fillText('राष्ट्रीय बाल प्रतिभा एवं ज्ञान संवर्धन सम्मान • NATIONAL CHILD EXCELLENCE AWARDS', 700, 155);

    // Large Certificate Title
    const titleGrad = ctx.createLinearGradient(400, 0, 1000, 0);
    titleGrad.addColorStop(0, '#B45309');
    titleGrad.addColorStop(0.5, '#EA580C');
    titleGrad.addColorStop(1, '#B45309');
    ctx.fillStyle = titleGrad;
    ctx.font = 'bold 54px "Baloo 2", serif';
    ctx.fillText('प्रमाण पत्र • CERTIFICATE OF ACHIEVEMENT', 700, 225);

    // Decorative Line
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(350, 245);
    ctx.lineTo(1050, 245);
    ctx.stroke();

    // Subtitle
    ctx.fillStyle = '#334155';
    ctx.font = '22px "Baloo 2", sans-serif';
    ctx.fillText('यह गौरवशाली सम्मान पत्र अत्यंत हर्ष, गर्व व स्नेह के साथ प्रदान किया जाता है:', 700, 290);

    // 4. Recipient Child Name
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 66px "Baloo 2", sans-serif';
    ctx.fillText(childName || 'नन्हा पाठक', 700, 380);

    // Name Underline with Golden Diamond
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(380, 405);
    ctx.lineTo(1020, 405);
    ctx.stroke();

    // 5. Achievement Badge & Award Details
    ctx.fillStyle = '#C2410C';
    ctx.font = 'bold 34px "Baloo 2", sans-serif';
    ctx.fillText(currentAch.titleHi, 700, 470);

    ctx.fillStyle = '#475569';
    ctx.font = '22px "Baloo 2", sans-serif';
    ctx.fillText(currentAch.descHi, 700, 520);

    // 5 Gold Stars
    ctx.fillStyle = '#F59E0B';
    ctx.font = '38px system-ui';
    ctx.fillText('⭐⭐⭐⭐⭐', 700, 580);

    // 6. Left: Issue Date & Verification Info
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 20px "Baloo 2", sans-serif';
    ctx.fillText('जारी करने का दिनांक (Date):', 120, 710);
    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 24px "Baloo 2", sans-serif';
    ctx.fillText(currentDate, 120, 745);

    ctx.fillStyle = '#64748B';
    ctx.font = '16px "Baloo 2", sans-serif';
    ctx.fillText('प्रमाण पत्र क्रमांक: BV-2026-' + Math.floor(100000 + Math.random() * 900000), 120, 780);
    ctx.fillText('आधिकारिक वेबसाइट: www.baalvarta.com', 120, 805);

    // 7. Center: PERMANENT OFFICIAL CIRCULAR EMBOSSED SEAL
    const sealX = 700;
    const sealY = 735;
    const sealRadius = 72;

    // Seal Ribbon Tails (Crimson & Gold at bottom of seal)
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(sealX - 45, sealY + 40);
    ctx.lineTo(sealX - 60, sealY + 130);
    ctx.lineTo(sealX - 35, sealY + 115);
    ctx.lineTo(sealX - 10, sealY + 130);
    ctx.lineTo(sealX - 15, sealY + 40);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sealX + 15, sealY + 40);
    ctx.lineTo(sealX + 10, sealY + 130);
    ctx.lineTo(sealX + 35, sealY + 115);
    ctx.lineTo(sealX + 60, sealY + 130);
    ctx.lineTo(sealX + 45, sealY + 40);
    ctx.fill();

    // Outer Seal Jagged / Golden Sun Rays
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

    // Seal Circular & Center Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 13px "Baloo 2", sans-serif';
    ctx.fillText('★ BAALVARTA OFFICIAL ★', sealX, sealY - 40);
    ctx.fillText('★ बालवार्ता प्रमाणित मुहर ★', sealX, sealY + 46);

    ctx.font = '28px system-ui';
    ctx.fillText('📖', sealX, sealY - 8);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 15px "Baloo 2", sans-serif';
    ctx.fillText('SEAL OF EXCELLENCE', sealX, sealY + 18);

    // 8. Right: CHANNEL LOGO & AUTHORISED SIGNATORY
    const sigX = 1260;
    
    // Draw Channel Logo in Badge Box
    ctx.textAlign = 'right';

    // Channel Logo Text Callout (Rainbow Colors)
    ctx.fillStyle = '#EA580C';
    ctx.font = 'bold 32px "Baloo 2", sans-serif';
    ctx.fillText('बालवार्ता (Baalvarta)', sigX, 690);

    // Digital Signature Script
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sigX - 220, 730);
    ctx.bezierCurveTo(sigX - 180, 700, sigX - 140, 760, sigX - 80, 720);
    ctx.bezierCurveTo(sigX - 50, 690, sigX - 30, 740, sigX - 10, 725);
    ctx.stroke();

    // Signatory Underline
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sigX - 240, 745);
    ctx.lineTo(sigX, 745);
    ctx.stroke();

    // Authorised Signatory Titles
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px "Baloo 2", sans-serif';
    ctx.fillText('अधिकृत हस्ताक्षर (Authorised Signatory)', sigX, 775);

    ctx.fillStyle = '#475569';
    ctx.font = '16px "Baloo 2", sans-serif';
    ctx.fillText('संपादक व संस्थापक • बालवार्ता डिजिटल मंच', sigX, 802);

    // Trigger PNG download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `Baalvarta-Certificate-${childName.replace(/\s+/g, '_')}.png`;
    a.href = dataUrl;
    a.click();

    setDownloadSuccess(true);
    confetti({ particleCount: 80, spread: 90 });
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrintCertificate = () => {
    if (soundEnabled) playPopSound();
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (soundEnabled) playPopSound();
    const shareText = `🎉 *बालवार्ता बाल पाठक प्रमाण पत्र!*\n\nहमारे प्यारे बच्चे *${childName}* को बालवार्ता पोर्टल पर *${currentAch.titleHi}* का गौरवशाली रंग-बिरंगा प्रमाण पत्र मिला है! ⭐⭐⭐⭐⭐\n\n📖 आप भी अपने बच्चों के लिए सुंदर हिंदी कहानियाँ पढ़ें व उनका प्रमाण पत्र बनाएँ:\n${window.location.origin}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 font-kids">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-2 border-amber-300">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-2 border border-white/30">
            <Award className="w-4 h-4 text-amber-200" />
            <span>{isHi ? 'रंग-बिरंगा बाल पुरस्कार व सम्मान केंद्र' : 'Kids Honors & Awards'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🏆 आधिकारिक बाल पाठक प्रमाण पत्र</span>
          </h1>
          <p className="text-white/95 text-xs sm:text-sm font-bold mt-1">
            {isHi
              ? 'बच्चे का नाम भरें और बालवार्ता की स्थायी मुहर व आधिकारिक हस्ताक्षर के साथ रंग-बिरंगा सम्मान पत्र डाउनलोड करें।'
              : 'Enter child’s name and download vibrant certificate with official round seal & channel logo!'}
          </p>
        </div>
      </div>

      {/* Editor & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Form: Customization */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md space-y-5">
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
                    className={`w-full p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
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
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-100" />
              <span>{isHi ? '📥 रंगीन प्रमाण पत्र डाउनलोड करें (PNG)' : 'Download Color Certificate'}</span>
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

        {/* Right Live Preview: Color-Rich Certificate */}
        <div className="lg:col-span-2">
          <div
            ref={certRef}
            className="bg-gradient-to-br from-amber-50 via-yellow-50/70 to-orange-50/60 rounded-3xl p-6 sm:p-10 border-8 border-double border-amber-500 shadow-2xl relative overflow-hidden text-center space-y-4"
          >
            {/* Multi-color festive corner flourishes */}
            <div className="absolute inset-2 border-2 border-dashed border-amber-300/80 rounded-2xl pointer-events-none" />

            {/* Corner Decorative Stars */}
            <span className="absolute top-4 left-5 text-2xl animate-pulse">🌟</span>
            <span className="absolute top-4 right-5 text-2xl animate-pulse">🌟</span>
            <span className="absolute bottom-4 left-5 text-2xl animate-pulse">🌟</span>
            <span className="absolute bottom-4 right-5 text-2xl animate-pulse">🌟</span>

            {/* Header Badge */}
            <div className="space-y-1 relative z-10">
              <span className="text-xs sm:text-sm font-black text-amber-900 tracking-wider uppercase block bg-amber-100/80 inline-block px-3 py-0.5 rounded-full border border-amber-300">
                ✨ बालवार्ता (BAALVARTA) बाल साहित्य व ज्ञान मंच ✨
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-amber-950 font-serif tracking-tight mt-1">
                प्रमाण पत्र (CERTIFICATE OF ACHIEVEMENT)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-bold">
                राष्ट्रीय बाल प्रतिभा एवं ज्ञान संवर्धन सम्मान
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-bold max-w-lg mx-auto leading-relaxed">
              यह सम्मान पत्र अत्यंत हर्ष, गर्व व स्नेह के साथ हमारे प्रिय नन्हे पाठक को प्रदान किया जाता है:
            </p>

            {/* Child's Name */}
            <div className="py-2">
              <span className="text-3xl sm:text-5xl font-black text-slate-900 font-kids tracking-tight border-b-4 border-amber-500 pb-1 inline-block px-6 drop-shadow-xs">
                {childName || 'नन्हा पाठक'}
              </span>
            </div>

            {/* Award Title & Description */}
            <div className="space-y-1.5 max-w-xl mx-auto">
              <span className="text-base sm:text-xl font-black text-orange-950 bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 py-1 px-4 rounded-xl border border-amber-300 inline-block">
                {currentAch.titleHi}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold px-2">
                {currentAch.descHi}
              </p>
            </div>

            {/* 5 Golden Stars */}
            <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl text-amber-500">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>

            {/* Footer Signatures, Permanent Official Round Seal & Channel Logo */}
            <div className="pt-6 border-t-2 border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-700 font-bold relative z-10">
              
              {/* Left Side: Date & Serial ID */}
              <div className="text-center sm:text-left space-y-0.5">
                <span className="block text-[11px] text-slate-500 font-bold">जारी करने का दिनांक</span>
                <span className="text-sm font-black text-slate-900">{currentDate}</span>
                <span className="block text-[10px] text-slate-400 font-mono">BV-CERT-2026-VERIFIED ✓</span>
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
