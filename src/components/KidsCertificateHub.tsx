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
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';

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
      titleEn: 'Super Story Reader',
      descHi: '50+ सचित्र हिंदी नैतिक कहानियाँ ध्यानपूर्वक पढ़ने व समझने के लिए।',
      descEn: 'For reading & understanding 50+ illustrated moral stories.',
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'panchatantra_master',
      titleHi: '🏆 पंचतंत्र नैतिक ज्ञान मास्टर (Panchatantra Master)',
      titleEn: 'Panchatantra Wisdom Master',
      descHi: 'पंचतंत्र व हितोपदेश की कहानियों से जीवनोपयोगी संस्कार सीखने के लिए।',
      descEn: 'For mastering moral wisdom & life values from Panchatantra.',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'quiz_champion',
      titleHi: '🎯 बाल क्विज़ चैंपियन (Quiz Champion)',
      titleEn: 'Kids Quiz Champion',
      descHi: 'विज्ञान, प्रकृति, पशु-पक्षी व बाल साहित्य क्विज़ में उत्कृष्ट प्रदर्शन हेतु।',
      descEn: 'For scoring top ranks in Science, Nature & Literature quizzes.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 'shiksha_ratna',
      titleHi: '👑 ज्ञान व संस्कार बाल रत्न (Baal Ratna Scholar)',
      titleEn: 'Baal Ratna Scholar',
      descHi: 'अक्षर ज्ञान, सचित्र साहित्य व अच्छी आदतों के नियमित अभ्यास के लिए।',
      descEn: 'For daily excellence in reading, good habits & learning.',
      color: 'from-emerald-500 to-teal-600',
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

    // Use Canvas to generate crisp downloadable certificate PNG
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 850);
    bgGrad.addColorStop(0, '#fffbeb');
    bgGrad.addColorStop(0.5, '#fef3c7');
    bgGrad.addColorStop(1, '#fffbeb');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 850);

    // Ornate Golden Borders
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 790);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, 1104, 754);

    // Corner decorative stars
    ctx.fillStyle = '#b45309';
    ctx.font = '36px system-ui';
    ctx.fillText('⭐', 65, 95);
    ctx.fillText('⭐', 1100, 95);
    ctx.fillText('⭐', 65, 780);
    ctx.fillText('⭐', 1100, 780);

    // Header Emblem
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 36px "Baloo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ बालवार्ता (Baalvarta) बाल साहित्य व शिक्षा परिषद ✨', 600, 125);

    // Certificate Title
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 50px "Baloo 2", serif';
    ctx.fillText('प्रमाण पत्र (CERTIFICATE OF ACHIEVEMENT)', 600, 195);

    // Subtitle
    ctx.fillStyle = '#475569';
    ctx.font = '24px "Baloo 2", sans-serif';
    ctx.fillText('यह गौरवशाली प्रमाण पत्र बड़े आदर व स्नेह के साथ प्रदान किया जाता है:', 600, 260);

    // Child Name in Golden Calligraphy
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 64px "Baloo 2", sans-serif';
    ctx.fillText(childName || 'नन्हा पाठक', 600, 350);

    // Underline
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(350, 375);
    ctx.lineTo(850, 375);
    ctx.stroke();

    // Achievement Title & Description
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 34px "Baloo 2", sans-serif';
    ctx.fillText(currentAch.titleHi, 600, 440);

    ctx.fillStyle = '#334155';
    ctx.font = '24px "Baloo 2", sans-serif';
    ctx.fillText(currentAch.descHi, 600, 490);

    // 5 Stars
    ctx.fillStyle = '#f59e0b';
    ctx.font = '40px system-ui';
    ctx.fillText('⭐⭐⭐⭐⭐', 600, 560);

    // Official Seal / Medal Box
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(600, 680, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 16px "Baloo 2", sans-serif';
    ctx.fillText('बालवार्ता', 600, 675);
    ctx.fillText('मुहर • SEAL', 600, 695);

    // Signatures
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 20px "Baloo 2", sans-serif';
    ctx.fillText(`दिनांक: ${currentDate}`, 120, 730);

    ctx.textAlign = 'right';
    ctx.fillText('संपादक व निदेशक, बालवार्ता', 1080, 730);
    ctx.font = '16px "Baloo 2", sans-serif';
    ctx.fillText('www.baalvarta.com', 1080, 755);

    // Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `Baalvarta-Certificate-${childName.replace(/\s+/g, '_')}.png`;
    a.href = dataUrl;
    a.click();

    setDownloadSuccess(true);
    confetti({ particleCount: 70, spread: 80 });
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrintCertificate = () => {
    if (soundEnabled) playPopSound();
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (soundEnabled) playPopSound();
    const shareText = `🎉 *बालवार्ता बाल पाठक प्रमाण पत्र!*\n\nहमारे प्यारे बच्चे *${childName}* को बालवार्ता पोर्टल पर *${currentAch.titleHi}* का गौरवशाली प्रमाण पत्र मिला है! ⭐⭐⭐⭐⭐\n\n📖 आप भी अपने बच्चों के लिए सुंदर हिंदी कहानियाँ पढ़ें व उनका प्रमाण पत्र बनाएँ:\n${window.location.origin}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 font-kids">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-2">
            <Award className="w-4 h-4 text-amber-200" />
            <span>{isHi ? 'बाल पुरस्कार व सम्मान केंद्र' : 'Kids Honors & Awards'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isHi ? '🏆 बालवार्ता बाल पाठक प्रमाण पत्र' : '🏆 Reader Star Certificate'}
          </h1>
          <p className="text-white/95 text-xs sm:text-sm font-bold mt-1">
            {isHi
              ? 'बच्चे का नाम दर्ज करें, पसंदीदा पुरस्कार चुनें और 1-क्लिक में आधिकारिक रंग-बिरंगा प्रमाण पत्र डाउनलोड या प्रिंट करें।'
              : 'Enter child’s name, select achievement award, and instantly download or print high-res certificate!'}
          </p>
        </div>
      </div>

      {/* Editor & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Form: Customization */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-5">
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
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-amber-300 focus:border-amber-500 focus:outline-hidden text-sm font-bold text-slate-900 bg-amber-50/40"
            />
          </div>

          {/* Achievement Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block">
              {isHi ? 'उपलब्धि / मेडल प्रकार:' : 'Award Category:'}
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
                        ? 'border-amber-500 bg-amber-50 shadow-xs'
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
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-200" />
              <span>{isHi ? '📥 प्रमाण पत्र डाउनलोड करें (PNG)' : 'Download Certificate'}</span>
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

        {/* Right Live Preview: Certificate */}
        <div className="lg:col-span-2">
          <div
            ref={certRef}
            className="bg-amber-50/90 rounded-3xl p-6 sm:p-10 border-8 border-double border-amber-500 shadow-xl relative overflow-hidden text-center space-y-4"
          >
            {/* Watermark Logo in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="text-9xl">📖</span>
            </div>

            {/* Corner Decorative Stars */}
            <span className="absolute top-3 left-4 text-2xl">⭐</span>
            <span className="absolute top-3 right-4 text-2xl">⭐</span>
            <span className="absolute bottom-3 left-4 text-2xl">⭐</span>
            <span className="absolute bottom-3 right-4 text-2xl">⭐</span>

            {/* Header Badge */}
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-black text-amber-900 tracking-wider uppercase block">
                ✨ बालवार्ता (Baalvarta) बाल साहित्य व ज्ञान मंच ✨
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-amber-950 font-serif">
                प्रमाण पत्र (Certificate of Achievement)
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-lg mx-auto">
              यह सम्मान पत्र अत्यंत हर्ष व गौरव के साथ हमारे प्रिय नन्हे पाठक को प्रदान किया जाता है:
            </p>

            {/* Child's Name */}
            <div className="py-2">
              <span className="text-3xl sm:text-5xl font-black text-slate-900 font-kids tracking-tight border-b-2 border-amber-400 pb-1 inline-block px-6">
                {childName || 'नन्हा पाठक'}
              </span>
            </div>

            {/* Award Title & Description */}
            <div className="space-y-1 max-w-xl mx-auto">
              <span className="text-base sm:text-lg font-black text-amber-900 block">
                {currentAch.titleHi}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                {currentAch.descHi}
              </p>
            </div>

            {/* 5 Golden Stars */}
            <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl text-amber-500">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>

            {/* Footer Signatures & Date */}
            <div className="pt-6 border-t border-amber-200/80 flex items-center justify-between text-xs sm:text-sm text-slate-700 font-bold">
              <div className="text-left">
                <span className="block text-[10px] text-slate-500">जारी करने का दिनांक</span>
                <span className="text-slate-900">{currentDate}</span>
              </div>

              {/* Official Stamp */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-600 bg-amber-100 flex flex-col items-center justify-center text-amber-900 shadow-inner">
                <span className="text-lg">🎖️</span>
                <span className="text-[8px] font-black uppercase">बालवार्ता SEAL</span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] text-slate-500">अधिकृत हस्ताक्षर</span>
                <span className="text-slate-900">संपादक, बालवार्ता</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
