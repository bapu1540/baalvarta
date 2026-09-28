import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  Crown,
  ShieldCheck,
  Download,
  Volume2,
  Bot,
  Award,
  Zap,
  QrCode,
  Smartphone,
  CreditCard,
  Heart,
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  Building2,
  MessageCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Language, PaymentSettings } from '../types';
import {
  PRO_PLANS,
  getProSubscription,
  activateProPlan,
  cancelProPlan,
  ProSubscription
} from '../utils/proManager';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { safeCopyToClipboard } from '../utils/clipboard';
import { getStoredPaymentSettings } from '../utils/storage';
import { subscribeToFirestorePaymentSettings, fetchPaymentSettingsFromFirestore } from '../utils/firebase';

interface BaalvartaProModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundEnabled: boolean;
}

export const BaalvartaProModal: React.FC<BaalvartaProModalProps> = ({
  isOpen,
  onClose,
  language,
  soundEnabled,
}) => {
  const isHi = language === 'hi';
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [subscription, setSubscription] = useState<ProSubscription>(() => getProSubscription());
  const [paymentStep, setPaymentStep] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [activePaymentTab, setActivePaymentTab] = useState<'upi' | 'bank' | 'whatsapp'>('upi');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Live Payment Settings (Admin Configured Bank, UPI, QR Code, WhatsApp)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => getStoredPaymentSettings());

  useEffect(() => {
    // Initial fetch from Firestore
    fetchPaymentSettingsFromFirestore().then((remote) => {
      if (remote) setPaymentSettings(remote);
    });

    // Real-time listener
    const unsub = subscribeToFirestorePaymentSettings((remote) => {
      if (remote) setPaymentSettings(remote);
    });

    const handleLocalChange = () => {
      setPaymentSettings(getStoredPaymentSettings());
      setSubscription(getProSubscription());
    };
    window.addEventListener('baalvarta_payment_settings_change', handleLocalChange);
    window.addEventListener('baalvarta_pro_status_change', handleLocalChange);

    return () => {
      if (unsub) unsub();
      window.removeEventListener('baalvarta_payment_settings_change', handleLocalChange);
      window.removeEventListener('baalvarta_pro_status_change', handleLocalChange);
    };
  }, []);

  if (!isOpen) return null;

  const activePrice = selectedPlan === 'annual'
    ? (paymentSettings.annualPrice || PRO_PLANS.annual.price)
    : (paymentSettings.monthlyPrice || PRO_PLANS.monthly.price);

  const handleSelectPlan = (plan: 'monthly' | 'annual') => {
    if (soundEnabled) playPopSound();
    setSelectedPlan(plan);
  };

  const handleProceedToPayment = () => {
    if (soundEnabled) playPopSound();
    setPaymentStep('checkout');
  };

  const handleCopy = async (text: string, label: string) => {
    if (soundEnabled) playPopSound();
    await safeCopyToClipboard(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleCompleteActivation = () => {
    if (soundEnabled) playSuccessSound();
    const newSub = activateProPlan(selectedPlan);
    setSubscription(newSub);
    setPaymentStep('success');
  };

  const handleCancelSubscription = () => {
    if (soundEnabled) playPopSound();
    cancelProPlan();
    setSubscription(getProSubscription());
    setPaymentStep('plans');
  };

  const planName = selectedPlan === 'annual'
    ? (isHi ? 'वार्षिक VIP पास (12 महीने)' : 'Annual VIP Pass (12 Months)')
    : (isHi ? 'मासिक पास (1 महीना)' : 'Monthly Pass (1 Month)');

  const handleOpenWhatsAppProof = () => {
    if (soundEnabled) playPopSound();
    const cleanPhone = (paymentSettings.whatsappNumber || '919876543210').replace(/\D/g, '');
    const message = isHi
      ? `नमस्ते! मैंने बालवार्ता वीआईपी (${planName} - ₹${activePrice}) के लिए भुगतान कर दिया है।\nमेरा यूटीआर / ट्रांजेक्शन आईडी: ${transactionRef.trim() || '[कृपया यहाँ भरें]'}\nकृपया मेरा खाता वीआईपी में अपग्रेड कर दें। धन्यवाद!`
      : `Hello! I have completed payment for Baalvarta VIP (${planName} - ₹${activePrice}).\nMy Transaction Ref/UTR: ${transactionRef.trim() || '[Please check attached screenshot]'}\nPlease activate my VIP pass. Thank you!`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // UPI Payment URL
  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(paymentSettings.upiId || 'chauhansanjay932@okhdfcbank')}&pn=${encodeURIComponent(paymentSettings.upiName || 'Baalvarta')}&am=${activePrice}&cu=INR&tn=${encodeURIComponent(`Baalvarta VIP ${selectedPlan}`)}`;
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiPayUrl)}`;

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn font-sans pb-safe">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (soundEnabled) playPopSound();
          onClose();
        }}
      />

      {/* Main Modal Card */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border-2 sm:border-3 border-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] z-10 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-4 sm:p-5 relative border-b-2 border-slate-900 shrink-0">
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onClose();
            }}
            className="absolute right-3.5 top-3.5 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95 cursor-pointer"
            title={isHi ? 'बंद करें (Esc)' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-amber-200 flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>{isHi ? 'बालवार्ता वीआईपी व प्रो सदस्यता' : 'Baalvarta VIP & Pro'}</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                  100% Ad-Free
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 font-bold mt-0.5">
                {isHi
                  ? 'बिना किसी विज्ञापन के असीमित कहानियाँ, वर्कशीट्स और सुरक्षित वातावरण!'
                  : '100% ad-free stories, unlimited worksheets, and safe kids learning!'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. BODY CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-slate-300">
          
          {/* Toast / Copy Feedback Alert */}
          {copyFeedback && (
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{copyFeedback} क्लिपबोर्ड में कॉपी हो गया!</span>
            </div>
          )}

          {/* A. IF ALREADY PRO SUBSCRIBER */}
          {subscription.isPro && paymentStep !== 'success' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-xs">
                    👑
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isHi ? 'सक्रिय वीआईपी प्रो सदस्य (100% विज्ञापन-मुक्त)' : 'Active VIP Member (100% Ad-Free)'}</span>
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      {subscription.plan === 'annual'
                        ? isHi ? `वार्षिक वीआईपी पास (₹${paymentSettings.annualPrice}/वर्ष)` : `Annual VIP Pass (₹${paymentSettings.annualPrice}/year)`
                        : isHi ? `मासिक पास (₹${paymentSettings.monthlyPrice}/माह)` : `Monthly Pass (₹${paymentSettings.monthlyPrice}/month)`}
                    </div>
                    {subscription.expiryDate && (
                      <div className="text-[11px] text-slate-600 font-semibold mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {isHi ? 'वैधता:' : 'Valid until:'}{' '}
                          {new Date(subscription.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCancelSubscription}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>

              {/* Active Pro Benefits */}
              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 space-y-2.5">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isHi ? 'आपकी सक्रिय वीआईपी प्रो सुविधाएं:' : 'Your Active VIP Pro Benefits:'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-emerald-500 font-black">✓</span> 🚫 100% विज्ञापन-मुक्त (No Ads Anywhere)
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-emerald-500 font-black">✓</span> 📥 असीमित HD प्रिंटेबल वर्कशीट्स
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-emerald-500 font-black">✓</span> 🎧 असीमित ऑडियो कहानियाँ
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-emerald-500 font-black">✓</span> 🤖 असीमित AI बालमित्र प्रश्न
                  </div>
                </div>
              </div>
            </div>
          ) : paymentStep === 'plans' ? (
            /* B. PLAN SELECTION STEP */
            <div className="space-y-4">
              {/* PLAN SELECTION CARDS (Monthly vs Annual) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* 1. Monthly Plan */}
                <div
                  onClick={() => handleSelectPlan('monthly')}
                  className={`relative p-4 sm:p-5 rounded-2xl border-2 sm:border-3 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    selectedPlan === 'monthly'
                      ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-400/40 shadow-md scale-[1.01]'
                      : 'bg-white hover:bg-slate-50 border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {isHi ? PRO_PLANS.monthly.tagHi : PRO_PLANS.monthly.tagEn}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === 'monthly'
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selectedPlan === 'monthly' && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-900 mt-2">
                      {isHi ? 'मासिक पास (Monthly)' : 'Monthly Pass'}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-blue-600">₹{paymentSettings.monthlyPrice || 29}</span>
                      <span className="text-xs text-slate-400 line-through font-bold">₹49</span>
                      <span className="text-xs text-slate-600 font-bold">/ {isHi ? 'माह' : 'month'}</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                      {isHi ? 'रोजाना ₹1 से भी कम' : 'Less than ₹1/day'}
                    </div>
                  </div>

                  <ul className="text-xs space-y-1.5 text-slate-700 font-semibold border-t border-slate-200/80 pt-2.5">
                    <li className="flex items-start gap-1.5 leading-tight font-black text-emerald-700">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>🚫 100% विज्ञापन-मुक्त अनुभव (Ad-Free)</span>
                    </li>
                    {(isHi ? PRO_PLANS.monthly.featuresHi : PRO_PLANS.monthly.featuresEn).slice(1).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Annual VIP Plan - BEST VALUE */}
                <div
                  onClick={() => handleSelectPlan('annual')}
                  className={`relative p-4 sm:p-5 rounded-2xl border-2 sm:border-3 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    selectedPlan === 'annual'
                      ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/50 shadow-md scale-[1.01]'
                      : 'bg-white hover:bg-slate-50 border-slate-300'
                  }`}
                >
                  {/* Best Value Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
                    👑 {isHi ? 'सबसे लोकप्रिय • पूरे साल VIP' : 'Most Popular • Full Year VIP'}
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {isHi ? '12 महीने (Full Year)' : '12 Months (Full Year)'}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === 'annual'
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selectedPlan === 'annual' && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-900 mt-2 flex items-center gap-1.5">
                      <span>{isHi ? 'वार्षिक VIP पास (Annual VIP)' : 'Annual VIP Pass'}</span>
                      <span className="text-xs">🌟</span>
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-amber-600">₹{paymentSettings.annualPrice || 299}</span>
                      <span className="text-xs text-slate-400 line-through font-bold">₹499</span>
                      <span className="text-xs text-slate-600 font-bold">/ {isHi ? 'वर्ष' : 'year'}</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                      {isHi ? `केवल ~₹${Math.round((paymentSettings.annualPrice || 299) / 12)}/माह (80 पैसे/दिन)` : 'Only ~80 paise/day'}
                    </div>
                  </div>

                  <ul className="text-xs space-y-1.5 text-slate-700 font-semibold border-t border-amber-200/80 pt-2.5">
                    <li className="flex items-start gap-1.5 leading-tight font-black text-emerald-700">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>🚫 पूरे 12 महीने 100% विज्ञापन-मुक्त (No Ads)</span>
                    </li>
                    {(isHi ? PRO_PLANS.annual.featuresHi : PRO_PLANS.annual.featuresEn).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-bold text-slate-800">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FEATURES COMPARISON TABLE */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 sm:p-4 space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'मुफ़्त बनाम बालवार्ता VIP तुलना' : 'Free vs Baalvarta VIP Comparison'}</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold">
                        <th className="py-1.5">{isHi ? 'सुविधाएं' : 'Feature'}</th>
                        <th className="py-1.5 text-center">{isHi ? 'मुफ़्त (Free)' : 'Free'}</th>
                        <th className="py-1.5 text-center text-amber-700 font-black">{isHi ? 'VIP प्रो सदस्य' : 'VIP Pro'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      <tr className="bg-emerald-50/50">
                        <td className="py-2 font-black text-emerald-950 flex items-center gap-1.5">
                          <span>🚫</span> {isHi ? 'विज्ञापन-मुक्त अनुभव (Ad-Free)' : 'Ad-Free Website'}
                        </td>
                        <td className="text-center text-rose-600 font-bold">{isHi ? 'विज्ञापन दिखाई देंगे' : 'With Ads'}</td>
                        <td className="text-center font-black text-emerald-700">100% Ad-Free (कोई Ad नहीं) ✓</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">
                          <span>📥</span> {isHi ? 'प्रिंटेबल वर्कशीट्स व कलरिंग' : 'Worksheets PDF'}
                        </td>
                        <td className="text-center text-slate-500">{isHi ? '2 / दिन' : '2 / day'}</td>
                        <td className="text-center font-bold text-emerald-600">{isHi ? 'असीमित (Unlimited)' : 'Unlimited'} ✓</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">
                          <span>🎧</span> {isHi ? 'ऑडियो कहानियाँ' : 'Audio Stories'}
                        </td>
                        <td className="text-center text-slate-500">{isHi ? '3 / दिन' : '3 / day'}</td>
                        <td className="text-center font-bold text-emerald-600">{isHi ? 'असीमित' : 'Unlimited'} ✓</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">
                          <span>🤖</span> {isHi ? 'AI बालमित्र प्रश्न' : 'AI Baalmitra'}
                        </td>
                        <td className="text-center text-slate-500">{isHi ? '5 / दिन' : '5 / day'}</td>
                        <td className="text-center font-bold text-emerald-600">{isHi ? 'असीमित सवाल' : 'Unlimited'} ✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : paymentStep === 'checkout' ? (
            /* C. FULL PAYMENT GATEWAY STEP (UPI, QR CODE, BANK ACCOUNT, WHATSAPP) */
            <div className="space-y-4">
              {/* Selected Plan Summary Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    {isHi ? 'चयनित वीआईपी सदस्यता:' : 'Selected VIP Membership:'}
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>👑 {planName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    100% Ad-Free Active
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  ₹{activePrice}
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActivePaymentTab('upi');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activePaymentTab === 'upi'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>1. UPI / QR कोड</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActivePaymentTab('bank');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activePaymentTab === 'bank'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>2. बैंक खाता (NEFT/IMPS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setActivePaymentTab('whatsapp');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activePaymentTab === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>3. व्हाट्सएप सहायता</span>
                </button>
              </div>

              {/* TAB 1: UPI & QR CODE */}
              {activePaymentTab === 'upi' && (
                <div className="p-4 bg-slate-50 border-2 border-purple-200 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    {/* QR Code */}
                    <div className="relative p-2 bg-white rounded-2xl border-2 border-slate-900 shadow-sm shrink-0 group">
                      <img
                        src={paymentSettings.upiQrCodeUrl || dynamicQrUrl}
                        alt="UPI Payment QR Code"
                        className="w-36 h-36 object-contain rounded-lg"
                      />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                        स्कैन करें ₹{activePrice}
                      </div>
                    </div>

                    <div className="space-y-2 flex-1">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">
                          Google Pay • PhonePe • Paytm • BHIM
                        </span>
                        <h4 className="text-sm font-black text-slate-900">
                          {paymentSettings.upiName || 'Baalvarta Kids Portal'}
                        </h4>
                      </div>

                      {/* UPI ID Box with 1-click Copy */}
                      <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-purple-300">
                        <span className="text-xs font-mono font-black text-purple-950 flex-1 truncate">
                          {paymentSettings.upiId || 'chauhansanjay932@okhdfcbank'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(paymentSettings.upiId || 'chauhansanjay932@okhdfcbank', 'UPI ID')}
                          className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-black flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>कॉपी</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium">
                        {isHi
                          ? 'ऊपर दिए गए QR कोड को किसी भी UPI ऐप से स्कैन करें या UPI ID कॉपी करके भुगतान करें।'
                          : 'Scan the QR code with any UPI app or copy the UPI ID to pay.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BANK TRANSFER DETAILS */}
              {activePaymentTab === 'bank' && (
                <div className="p-4 bg-slate-50 border-2 border-blue-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-blue-900 border-b border-blue-200 pb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>सीधे बैंक खाते में ट्रांसफर (Direct Bank Transfer):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* Bank Name */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">बैंक का नाम (Bank Name):</span>
                      <span className="font-black text-slate-900">{paymentSettings.bankName || 'State Bank of India (SBI)'}</span>
                    </div>

                    {/* Account Holder */}
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">खाता धारक (Account Holder):</span>
                      <span className="font-black text-slate-900">{paymentSettings.accountHolderName || 'Sanjay Chauhan'}</span>
                    </div>

                    {/* Account Number with 1-click Copy */}
                    <div className="p-2.5 bg-white rounded-xl border border-blue-300 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-blue-700 font-bold block">खाता संख्या (Account Number):</span>
                        <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                          {paymentSettings.accountNumber || '394857201948'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentSettings.accountNumber || '394857201948', 'Account Number')}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                        <span>कॉपी</span>
                      </button>
                    </div>

                    {/* IFSC Code with 1-click Copy */}
                    <div className="p-2.5 bg-white rounded-xl border border-blue-300 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-blue-700 font-bold block">IFSC कोड:</span>
                        <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                          {paymentSettings.ifscCode || 'SBIN0001234'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentSettings.ifscCode || 'SBIN0001234', 'IFSC Code')}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-black flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                        <span>कॉपी</span>
                      </button>
                    </div>
                  </div>

                  {paymentSettings.branchName && (
                    <p className="text-[10px] text-slate-500 font-medium">
                      शाखा (Branch): {paymentSettings.branchName}
                    </p>
                  )}
                </div>
              )}

              {/* TAB 3: WHATSAPP ASSISTANCE & SCREENSHOT */}
              {activePaymentTab === 'whatsapp' && (
                <div className="p-4 bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl space-y-3 text-center sm:text-left">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>व्हाट्सएप भुगतान सत्यापन (Instant WhatsApp Proof Submission):</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {isHi
                      ? 'यदि आपने भुगतान कर दिया है, तो उसका स्क्रीनशॉट नीचे दिए गए बटन से सीधे हमें व्हाट्सएप पर भेजें। हमारी टीम 5 मिनट में आपका VIP पास सक्रिय कर देगी!'
                      : 'After payment, send the screenshot to our official WhatsApp support for instant 5-minute activation.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenWhatsAppProof}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>📲 व्हाट्सएप पर स्क्रीनशॉट भेजें (+{paymentSettings.whatsappNumber || '919876543210'})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* UTR / Transaction ID Input Box */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                  <span>भुगतान का UTR / Transaction No. (वैकल्पिक):</span>
                  <span className="text-[10px] text-slate-500 font-normal">12-अंकों का UPI Ref No.</span>
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. 423984729184"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
                />
              </div>

              {/* Instructions text */}
              {paymentSettings.instructionsHi && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 whitespace-pre-line font-medium leading-relaxed">
                  {isHi ? paymentSettings.instructionsHi : (paymentSettings.instructionsEn || paymentSettings.instructionsHi)}
                </div>
              )}
            </div>
          ) : (
            /* D. SUCCESS CONFIRMATION STEP */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-sm animate-bounce">
                🎉
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {isHi ? 'बधाई हो! बालवार्ता VIP प्रो सक्रिय हो गया है!' : 'Congratulations! Baalvarta VIP Pro is Active!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium mt-1">
                  {isHi
                    ? 'आपकी सदस्यता 100% विज्ञापन-मुक्त हो गई है! अब आप असीमित कहानियों, वर्कशीट्स और ऑडियो का आनंद ले सकते हैं।'
                    : 'Your account is now 100% ad-free! Enjoy unlimited stories, worksheets, and audio.'}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 inline-block text-xs font-black text-amber-900">
                👑 {isHi ? 'प्लान:' : 'Plan:'} {planName} (₹{activePrice}) • 100% Ad-Free
              </div>
            </div>
          )}
        </div>

        {/* 3. MODAL FOOTER */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between gap-3 shrink-0">
          {paymentStep === 'checkout' ? (
            <>
              <button
                type="button"
                onClick={() => setPaymentStep('plans')}
                className="px-4 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                {isHi ? '← प्लान बदलें' : 'Back'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsAppProof}
                  className="hidden xs:flex px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>व्हाट्सएप</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteActivation}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <span>{isHi ? `भुगतान हो गया • VIP शुरू करें (₹${activePrice})` : `Payment Done • Start VIP (₹${activePrice})`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : paymentStep === 'success' || subscription.isPro ? (
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playPopSound();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              {isHi ? 'आनंद लें (Continue to Baalvarta)' : 'Continue to Baalvarta'}
            </button>
          ) : (
            <div className="w-full flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 sm:gap-3">
              <div className="text-left flex items-center justify-between xs:block">
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  {isHi ? 'चयनित प्लान:' : 'Selected:'}
                </div>
                <div className="text-sm font-black text-slate-900">
                  ₹{activePrice} {selectedPlan === 'annual' ? (isHi ? '/ वर्ष' : '/ yr') : (isHi ? '/ माह' : '/ mo')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full xs:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>{isHi ? 'अभी VIP प्रो अपग्रेड करें 👑' : 'Upgrade to VIP Pro Now 👑'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
