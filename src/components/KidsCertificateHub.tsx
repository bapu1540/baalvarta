import React, { useState } from 'react';
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
  Crown,
  Smile,
  Eye,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { BaalvartaLogo } from './BaalvartaLogo';

interface KidsCertificateHubProps {
  language: Language;
  soundEnabled: boolean;
  onBackToHome?: () => void;
  onOpenProModal?: () => void;
  initialAchievementType?: string;
}

export const KidsCertificateHub: React.FC<KidsCertificateHubProps> = ({
  language,
  soundEnabled,
  onOpenProModal,
  initialAchievementType,
}) => {
  const isHi = language === 'hi';

  const [childName, setChildName] = useState<string>('आरव चौहान');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('scholar');
  const [achievementType, setAchievementType] = useState<string>(initialAchievementType || 'super_reader');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialAchievementType) {
      setAchievementType(initialAchievementType);
    }
  }, [initialAchievementType]);

  // Child-friendly Safe Avatars (Zero Personal Photo Upload for Child Privacy & Safety)
  const avatarOptions = [
    {
      id: 'scholar',
      emoji: '🎓',
      nameHi: 'नन्हा विद्वान',
      nameEn: 'Little Scholar',
      bgGradient: 'from-amber-400 to-orange-500',
      taglineHi: 'ज्ञान व संस्कार'
    },
    {
      id: 'superhero',
      emoji: '🦸‍♂️',
      nameHi: 'सुपरहीरो किड',
      nameEn: 'Superhero Kid',
      bgGradient: 'from-rose-500 to-red-600',
      taglineHi: 'साहसी व मददगार'
    },
    {
      id: 'princess',
      emoji: '👑',
      nameHi: 'राजकुमार / परी',
      nameEn: 'Prince / Princess',
      bgGradient: 'from-purple-500 to-pink-500',
      taglineHi: 'शालीन व दयालु'
    },
    {
      id: 'astronaut',
      emoji: '🚀',
      nameHi: 'अंतरिक्ष यात्री',
      nameEn: 'Space Explorer',
      bgGradient: 'from-indigo-600 to-blue-500',
      taglineHi: 'जिज्ञासु व खोजी'
    },
    {
      id: 'lion',
      emoji: '🦁',
      nameHi: 'साहसी शावक',
      nameEn: 'Brave Cub',
      bgGradient: 'from-amber-500 to-yellow-600',
      taglineHi: 'निर्भीक व निष्ठावान'
    },
    {
      id: 'owl',
      emoji: '🦉',
      nameHi: 'ज्ञानी उल्लू',
      nameEn: 'Wise Owl',
      bgGradient: 'from-teal-500 to-emerald-600',
      taglineHi: 'बुद्धिमान व शांत'
    },
    {
      id: 'artist',
      emoji: '🎨',
      nameHi: 'बाल कलाकार',
      nameEn: 'Little Artist',
      bgGradient: 'from-pink-500 to-rose-500',
      taglineHi: 'रचनात्मक व कल्पनाशील'
    },
    {
      id: 'scientist',
      emoji: '🔬',
      nameHi: 'नन्हा वैज्ञानिक',
      nameEn: 'Junior Scientist',
      bgGradient: 'from-cyan-500 to-blue-600',
      taglineHi: 'वैज्ञानिक सोच'
    },
    {
      id: 'yogi',
      emoji: '🧘',
      nameHi: 'शांत योगी',
      nameEn: 'Mindful Yogi',
      bgGradient: 'from-emerald-500 to-green-600',
      taglineHi: 'एकाग्र व संयमी'
    },
    {
      id: 'champion',
      emoji: '🏆',
      nameHi: 'गोल्ड चैंपियन',
      nameEn: 'Gold Champion',
      bgGradient: 'from-yellow-400 to-amber-600',
      taglineHi: 'सर्वश्रेष्ठ विजेता'
    },
    {
      id: 'musician',
      emoji: '🎵',
      nameHi: 'संगीत प्रेमी',
      nameEn: 'Little Musician',
      bgGradient: 'from-violet-500 to-purple-600',
      taglineHi: 'सदा मुस्कराता'
    },
    {
      id: 'reader',
      emoji: '📖',
      nameHi: 'पुस्तक मित्र',
      nameEn: 'Book Lover',
      bgGradient: 'from-sky-500 to-indigo-600',
      taglineHi: 'नियमित पाठक'
    }
  ];

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
  const currentAvatar = avatarOptions.find((av) => av.id === selectedAvatarId) || avatarOptions[0];

  const currentDate = new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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

    // 1. Multi-Color Parchment Background Gradient
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
    // 4. MAIN BODY (LEFT: TEXT & DETAILS, RIGHT: LARGE SQUARE AVATAR CARD)
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
    // RIGHT SECTION: LARGE SQUARE AVATAR BADGE CARD (Width: 280, Height: 320)
    // =========================================================================
    const photoBoxX = 980;
    const photoBoxY = 265;
    const photoBoxW = 280;
    const photoBoxH = 320;
    const cornerRadius = 18;

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

    // Render Chosen Cute Avatar with Circle & Glow
    ctx.textAlign = 'center';
    
    // Decorative Avatar Circle Background
    const avatarCircleGrad = ctx.createRadialGradient(
      photoBoxX + (photoBoxW / 2),
      photoBoxY + 115,
      10,
      photoBoxX + (photoBoxW / 2),
      photoBoxY + 115,
      68
    );
    avatarCircleGrad.addColorStop(0, '#FFFBEB');
    avatarCircleGrad.addColorStop(0.6, '#FEF3C7');
    avatarCircleGrad.addColorStop(1, '#FDE68A');

    ctx.beginPath();
    ctx.arc(photoBoxX + (photoBoxW / 2), photoBoxY + 115, 68, 0, Math.PI * 2);
    ctx.fillStyle = avatarCircleGrad;
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Large Avatar Emoji
    ctx.font = '72px system-ui';
    ctx.fillText(currentAvatar.emoji, photoBoxX + (photoBoxW / 2), photoBoxY + 142);

    // Crown on Top of Frame
    ctx.font = '36px system-ui';
    ctx.fillText('👑', photoBoxX + (photoBoxW / 2), photoBoxY - 12);

    // Avatar Title and Tagline
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 20px "Baloo 2", sans-serif';
    ctx.fillText(currentAvatar.nameHi, photoBoxX + (photoBoxW / 2), photoBoxY + 218);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 14px "Baloo 2", sans-serif';
    ctx.fillText(`✨ ${currentAvatar.taglineHi} ✨`, photoBoxX + (photoBoxW / 2), photoBoxY + 244);

    // Bottom Badge: Star Reader
    roundRect(photoBoxX + 10, photoBoxY + photoBoxH - 46, photoBoxW - 20, 36, 12);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 15px "Baloo 2", sans-serif';
    ctx.fillText('🌟 ' + (childName || 'बाल प्रतिभा') + ' 🌟', photoBoxX + (photoBoxW / 2), photoBoxY + photoBoxH - 22);

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
    const shareText = `🎉 *बालवार्ता बाल पाठक प्रमाण पत्र!*\n\nहमारे प्यारे बच्चे *${childName}* को बालवार्ता पोर्टल पर *${currentAch.titleHi}* का गौरवशाली रंग-बिरंगा प्रमाण पत्र मिला है! ⭐⭐⭐⭐⭐\n\n📖 आप भी अपने बच्चों के लिए सुंदर हिंदी कहानियाँ पढ़ें व सुरक्षित सुंदर अवतार के साथ प्रमाण पत्र बनाएँ:\n${window.location.origin}`;
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
            {isHi ? '100% मुफ़्त व सुरक्षित' : 'Free & Safe'}
          </span>
        </div>
      </div>

      {/* Child Privacy & Safety + VIP Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-rose-50 border-2 border-amber-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs text-slate-800 font-bold leading-relaxed">
            <span className="font-black text-emerald-900">
              {isHi ? '🛡️ सुरक्षित बाल वातावरण:' : '🛡️ Child Safety & Privacy:'}
            </span>{' '}
            {isHi
              ? 'यहाँ बच्चों की वास्तविक फोटो नहीं माँगी जाती। 12 सुंदर अवतारों में से चुनें! 100% विज्ञापन-मुक्त व अतिरिक्त सुरक्षा के लिए वीआईपी सदस्यता उपलब्ध है।'
              : 'Choose from 12 cute child avatars! VIP Pro membership available for 100% ad-free experience.'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playPopSound();
            if (onOpenProModal) {
              onOpenProModal();
            } else {
              window.dispatchEvent(new CustomEvent('baalvarta_open_pro_modal'));
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
        >
          <Crown className="w-3.5 h-3.5 text-amber-200" />
          <span>{isHi ? '👑 वीआईपी प्रो प्लान' : 'VIP Pro'}</span>
        </button>
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

          {/* 🌟 CUTE CHILD AVATAR PICKER (Zero photo upload for child privacy & safety) */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 border-2 border-amber-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-rose-500" />
                <span>{isHi ? 'मनपसंद बाल अवतार चुनें (Avatar):' : 'Select Kid Avatar:'}</span>
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-300">
                {isHi ? '12 प्यारे अवतार' : '12 Avatars'}
              </span>
            </div>

            {/* Avatars Grid */}
            <div className="grid grid-cols-4 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
              {avatarOptions.map((av) => {
                const isSelected = selectedAvatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      setSelectedAvatarId(av.id);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-white ring-2 ring-amber-400 shadow-md scale-105'
                        : 'border-amber-200/80 bg-white/70 hover:bg-white hover:border-amber-400'
                    }`}
                    title={isHi ? av.nameHi : av.nameEn}
                  >
                    <span className="text-2xl sm:text-3xl filter drop-shadow-xs">{av.emoji}</span>
                    <span className="text-[9px] font-black text-slate-800 mt-1 truncate max-w-full text-center">
                      {isHi ? av.nameHi : av.nameEn}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-slate-600 font-bold flex items-center gap-1 pt-1 text-center justify-center">
              <span>चयनित:</span>
              <span className="text-amber-800 font-black">{currentAvatar.emoji} {isHi ? currentAvatar.nameHi : currentAvatar.nameEn}</span>
              <span className="text-emerald-700">({isHi ? currentAvatar.taglineHi : 'Excellence'})</span>
            </div>
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

        {/* Right Live Preview: Super Vibrant Multi-Color Certificate with Avatar Badge */}
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
            {/* MAIN CERTIFICATE BODY: LEFT DETAILS + RIGHT LARGE AVATAR BADGE CARD */}
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

              {/* Right Large Avatar Badge Card (4 cols) */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative group w-44 sm:w-48 aspect-[1/1.15] rounded-2xl p-1.5 bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 shadow-xl border-2 border-amber-300 flex flex-col items-center justify-between">
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl z-20">👑</span>
                  
                  {/* Avatar Container */}
                  <div className="w-full flex-1 rounded-xl overflow-hidden bg-white/95 border border-amber-200 flex flex-col items-center justify-center p-2 relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 flex items-center justify-center shadow-inner mb-1">
                      <span className="text-4xl drop-shadow-xs">{currentAvatar.emoji}</span>
                    </div>
                    <span className="text-xs font-black text-amber-950 block text-center leading-tight">
                      {currentAvatar.nameHi}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 block text-center">
                      ✨ {currentAvatar.taglineHi} ✨
                    </span>
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

      {/* 📖 साथ पढ़ें, साथ सीखें (Co-reading & Family Bonding Guide) */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-900">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h3 className="font-black text-base sm:text-lg">
            {isHi ? 'साथ पढ़ें, साथ सीखें (Family Co-Reading & Moral Learning)' : 'Read Together, Learn Together'}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
          {isHi
            ? 'अभिभावक एवं शिक्षक बच्चों के साथ बैठकर कहानियाँ पढ़ें, चित्रों पर चर्चा करें और नैतिक शिक्षा पर बातचीत करें। यह बच्चों के मानसिक विकास, भाषा ज्ञान और पारिवारिक जुड़ाव को मजबूत करता है।'
            : 'Parents and teachers are encouraged to sit with children, discuss illustrations, and reflect on the moral lessons together for healthy cognitive growth and strong family bonding.'}
        </p>
      </div>

    </div>
  );
};
