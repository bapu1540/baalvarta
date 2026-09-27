import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { Language } from '../types';
import {
  PRO_PLANS,
  getProSubscription,
  activateProPlan,
  cancelProPlan,
  ProSubscription
} from '../utils/proManager';
import { playPopSound } from '../utils/soundEffects';

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
  const [upiId, setUpiId] = useState<string>('');

  if (!isOpen) return null;

  const currentPlanDetails = PRO_PLANS[selectedPlan];

  const handleSelectPlan = (plan: 'monthly' | 'annual') => {
    if (soundEnabled) playPopSound();
    setSelectedPlan(plan);
  };

  const handleProceedToPayment = () => {
    if (soundEnabled) playPopSound();
    setPaymentStep('checkout');
  };

  const handleCompleteActivation = () => {
    if (soundEnabled) playPopSound();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn font-sans">
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
        className="relative w-full max-w-2xl bg-white rounded-3xl border-3 border-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-4 sm:p-5 relative border-b-2 border-slate-900 shrink-0">
          <button
            onClick={() => {
              if (soundEnabled) playPopSound();
              onClose();
            }}
            className="absolute right-3.5 top-3.5 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95"
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
                  <span>{isHi ? 'बालवार्ता प्रो (Baalvarta Pro)' : 'Baalvarta Pro'}</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  VIP Pass
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 font-bold mt-0.5">
                {isHi
                  ? 'रोजाना ₹1 से भी कम में अपने बच्चे को दें सुरक्षित व असीमित ज्ञान!'
                  : 'Empower your child with 100% ad-free & unlimited learning for less than ₹1/day!'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. BODY CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-slate-300">
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
                      <span>{isHi ? 'सक्रिय प्रो सदस्य (Active VIP Member)' : 'Active Pro Member'}</span>
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      {subscription.plan === 'annual'
                        ? isHi ? 'वार्षिक वीआईपी पास (₹299/वर्ष)' : 'Annual VIP Pass (₹299/year)'
                        : isHi ? 'मासिक पास (₹29/माह)' : 'Monthly Pass (₹29/month)'}
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
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>

              {/* Active Pro Benefits */}
              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 space-y-2.5">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isHi ? 'आपकी सक्रिय प्रो सुविधाएं:' : 'Your Active Pro Benefits:'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-emerald-500">✓</span> 100% Ad-Free Experience
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-emerald-500">✓</span> Unlimited Printable Worksheets
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-emerald-500">✓</span> Unlimited Audio Stories
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-emerald-500">✓</span> Unlimited AI Baalmitra
                  </div>
                </div>
              </div>
            </div>
          ) : paymentStep === 'plans' ? (
            /* B. PLAN SELECTION STEP */
            <div className="space-y-4">
              {/* PLAN SELECTION CARDS (₹29 vs ₹299) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* 1. Monthly Plan (₹29) */}
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
                      <span className="text-2xl sm:text-3xl font-black text-blue-600">₹29</span>
                      <span className="text-xs text-slate-400 line-through font-bold">₹49</span>
                      <span className="text-xs text-slate-600 font-bold">/ {isHi ? 'माह' : 'month'}</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                      {isHi ? PRO_PLANS.monthly.dailyCostHi : PRO_PLANS.monthly.dailyCostEn}
                    </div>
                  </div>

                  <ul className="text-xs space-y-1.5 text-slate-700 font-semibold border-t border-slate-200/80 pt-2.5">
                    {(isHi ? PRO_PLANS.monthly.featuresHi : PRO_PLANS.monthly.featuresEn).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Annual VIP Plan (₹299) - BEST VALUE */}
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
                    👑 {isHi ? 'सबसे लोकप्रिय • 15% बचत' : 'Best Value • Save 15%'}
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
                      <span className="text-2xl sm:text-3xl font-black text-amber-600">₹299</span>
                      <span className="text-xs text-slate-400 line-through font-bold">₹499</span>
                      <span className="text-xs text-slate-600 font-bold">/ {isHi ? 'वर्ष' : 'year'}</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
                      {isHi ? PRO_PLANS.annual.dailyCostHi : PRO_PLANS.annual.dailyCostEn} (~₹24/माह)
                    </div>
                  </div>

                  <ul className="text-xs space-y-1.5 text-slate-700 font-semibold border-t border-amber-200/80 pt-2.5">
                    {(isHi ? PRO_PLANS.annual.featuresHi : PRO_PLANS.annual.featuresEn).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-bold text-slate-800">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FEATURES COMPARISON TABLE (FREE VS PRO) */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 sm:p-4 space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'मुफ़्त बनाम बालवार्ता प्रो तुलना' : 'Free vs Baalvarta Pro Comparison'}</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold">
                        <th className="py-1.5">{isHi ? 'सुविधाएं' : 'Feature'}</th>
                        <th className="py-1.5 text-center">{isHi ? 'मुफ़्त (Free)' : 'Free'}</th>
                        <th className="py-1.5 text-center text-amber-700 font-black">{isHi ? 'प्रो (VIP)' : 'Pro VIP'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                      <tr>
                        <td className="py-1.5 flex items-center gap-1.5">
                          <span>🚫</span> {isHi ? 'विज्ञापन-मुक्त अनुभव' : 'Ad-Free Website'}
                        </td>
                        <td className="text-center text-slate-500">{isHi ? 'विज्ञापन सहित' : 'With Ads'}</td>
                        <td className="text-center font-bold text-emerald-600">100% Ad-Free ✓</td>
                      </tr>
                      <tr>
                        <td className="py-1.5">
                          <span>📥</span> {isHi ? 'प्रिंटेबल वर्कशीट्स' : 'Worksheets PDF'}
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
            /* C. CHECKOUT & PAYMENT STEP */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-800 uppercase">
                    {isHi ? 'चयनित सदस्यता:' : 'Selected Plan:'}
                  </div>
                  <div className="text-base font-black text-slate-900">
                    {selectedPlan === 'annual'
                      ? isHi ? 'वार्षिक VIP पास (12 महीने)' : 'Annual VIP Pass (12 Months)'
                      : isHi ? 'मासिक पास (1 महीना)' : 'Monthly Pass (1 Month)'}
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600">
                  ₹{selectedPlan === 'annual' ? '299' : '29'}
                </div>
              </div>

              {/* UPI & Payment Options */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>{isHi ? 'UPI / PhonePe / Google Pay / Paytm' : 'Pay via UPI / GPay / PhonePe'}</span>
                </label>

                {/* Simulated QR Code / Instant Pay */}
                <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-xs">
                    <QrCode className="w-20 h-20 text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-black text-slate-900">
                      {isHi ? 'स्कैन करें या UPI आईडी दर्ज करें' : 'Scan QR or Enter UPI ID'}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {isHi
                        ? 'सुरक्षित UPI गेटवे द्वारा तत्काल एक्टिवेशन। कोई अतिरिक्त शुल्क नहीं।'
                        : 'Instant instant activation via secure UPI gateway. No hidden fees.'}
                    </p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@oksbi / mobile@upi"
                      className="w-full px-3 py-1.5 rounded-xl border-2 border-slate-300 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* D. SUCCESS CONFIRMATION STEP */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-sm animate-bounce">
                🎉
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {isHi ? 'बधाई हो! बालवार्ता प्रो सक्रिय हो गया है!' : 'Congratulations! Baalvarta Pro is Active!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium mt-1">
                  {isHi
                    ? 'अब आप और आपके बच्चे 100% विज्ञापन-मुक्त, असीमित वर्कशीट्स, ऑडियो कहानियों और AI बालमित्र का आनंद ले सकते हैं।'
                    : 'You and your child now have 100% ad-free and unlimited access to all worksheets, audio stories, and AI Baalmitra!'}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 inline-block text-xs font-bold text-amber-900">
                👑 {isHi ? 'प्लान:' : 'Plan:'}{' '}
                {selectedPlan === 'annual' ? 'Annual VIP (₹299/year)' : 'Monthly Pass (₹29/month)'}
              </div>
            </div>
          )}
        </div>

        {/* 3. MODAL FOOTER */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between gap-3 shrink-0">
          {paymentStep === 'checkout' ? (
            <>
              <button
                onClick={() => setPaymentStep('plans')}
                className="px-4 py-2 rounded-xl bg-white border-2 border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
              >
                {isHi ? 'वापस' : 'Back'}
              </button>

              <button
                onClick={handleCompleteActivation}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span>{isHi ? `भुगतान पूरा करें (₹${selectedPlan === 'annual' ? '299' : '29'})` : `Pay ₹${selectedPlan === 'annual' ? '299' : '29'} & Activate`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : paymentStep === 'success' || subscription.isPro ? (
            <button
              onClick={() => {
                if (soundEnabled) playPopSound();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm transition-all shadow-xs"
            >
              {isHi ? 'आनंद लें (Continue Reading)' : 'Continue to Baalvarta'}
            </button>
          ) : (
            <>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  {isHi ? 'चयनित प्लान:' : 'Selected:'}
                </div>
                <div className="text-sm font-black text-slate-900">
                  ₹{selectedPlan === 'annual' ? '299 / वर्ष' : '29 / माह'}
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>{isHi ? 'अभी प्रो अपग्रेड करें 👑' : 'Upgrade to Pro Now 👑'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
