import React, { useState, useEffect } from 'react';
import {
  Lock,
  KeyRound,
  Mail,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  Shield
} from 'lucide-react';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import {
  AdminEmail,
  PRIMARY_ADMIN_EMAIL,
  maskAdminEmail,
  verifyAdminCredentials,
  saveAdminPassword
} from '../utils/storage';
import {
  sendFirebaseEmailOtp,
  verifyFirebaseEmailOtp
} from '../utils/firebaseAuth';

interface ParentalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: AdminEmail) => void;
  soundEnabled: boolean;
}

type LoginTab = 'password' | 'email_otp';
type ModalStep = 'login' | 'otp_verify' | 'forgot_password' | 'reset_otp';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 300; // 5 minutes

export const ParentalGateModal: React.FC<ParentalGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  soundEnabled,
}) => {
  const [loginTab, setLoginTab] = useState<LoginTab>('password');
  const [step, setStep] = useState<ModalStep>('login');

  // Credentials
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // OTP Login State
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Security Lockout State (Anti Brute-Force)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Forgot / Reset password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Masked email: chauhansanjay932@gmail.com -> ••••••••••••••32@gmail.com (strictly only '32' visible)
  const maskedEmail = maskAdminEmail(PRIMARY_ADMIN_EMAIL);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemaining(diff);
      if (diff <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        setError('');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Timer countdown for OTP expiry
  useEffect(() => {
    let interval: any;
    if ((step === 'otp_verify' || step === 'reset_otp') && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      setStep('login');
      setLoginTab('password');
      setPassword('');
      setEnteredOtp('');
      setError('');
      setFeedbackMsg('');
      setOtpSent(false);
      setResetSuccess(false);
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLockedOut = lockoutUntil !== null && lockoutRemaining > 0;

  // Handle failed security attempts (Password or OTP)
  const recordFailedAttempt = (customMsg: string) => {
    const nextCount = failedAttempts + 1;
    setFailedAttempts(nextCount);
    if (soundEnabled) playPopSound();

    if (nextCount >= MAX_FAILED_ATTEMPTS) {
      const lockTime = Date.now() + LOCKOUT_SECONDS * 1000;
      setLockoutUntil(lockTime);
      setLockoutRemaining(LOCKOUT_SECONDS);
      setError(`⚠️ अत्यधिक असफल प्रयास! सुरक्षा कारणों से एडमिन लॉगिन ${Math.ceil(LOCKOUT_SECONDS / 60)} मिनट के लिए लॉक कर दिया गया है।`);
    } else {
      const attemptsLeft = MAX_FAILED_ATTEMPTS - nextCount;
      setError(`${customMsg} (शेष प्रयास: ${attemptsLeft})`);
    }
  };

  // 1. Password Login Handler (Direct 1-Step Login)
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setError('');
    setFeedbackMsg('');

    if (!password.trim()) {
      setError('कृपया एडमिन पासवर्ड दर्ज करें।');
      return;
    }

    const isValid = verifyAdminCredentials(PRIMARY_ADMIN_EMAIL, password.trim());
    if (isValid) {
      if (soundEnabled) playSuccessSound();
      setFailedAttempts(0);
      onSuccess(PRIMARY_ADMIN_EMAIL);
      onClose();
    } else {
      recordFailedAttempt('सुरक्षा त्रुटि: गलत एडमिन पासवर्ड! कृपया सही पासवर्ड दर्ज करें।');
    }
  };

  // 2. Dispatch Email OTP for Login
  const handleSendEmailOtp = async () => {
    if (isLockedOut || isSending) return;

    setError('');
    setIsSending(true);
    setOtpTimer(60);
    setEnteredOtp('');

    try {
      const res = await sendFirebaseEmailOtp(PRIMARY_ADMIN_EMAIL, 'login');
      setIsSending(false);
      if (res.success) {
        if (soundEnabled) playSuccessSound();
        setOtpSent(true);
        setStep('otp_verify');
        setFeedbackMsg(res.message);
      } else {
        setError(res.message || 'ईमेल OTP भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      setIsSending(false);
      console.warn('Email OTP dispatch error:', err);
      setError('ईमेल OTP भेजने में समस्या आई। कृपया पुनः प्रयास करें।');
    }
  };

  // 3. Verify Email OTP for Login (Direct 1-Step Login via OTP)
  const handleVerifyOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut || isSending) return;

    setError('');
    const trimmed = enteredOtp.trim();

    if (!trimmed || trimmed.length < 6) {
      setError('कृपया ईमेल पर आया पूरा 6-अंकों का OTP कोड दर्ज करें।');
      return;
    }

    setIsSending(true);
    const res = await verifyFirebaseEmailOtp(PRIMARY_ADMIN_EMAIL, trimmed);
    setIsSending(false);

    if (res.success) {
      if (soundEnabled) playSuccessSound();
      setFailedAttempts(0);
      onSuccess(PRIMARY_ADMIN_EMAIL);
      onClose();
    } else {
      recordFailedAttempt(res.error || 'सुरक्षा त्रुटि: गलत या समाप्त हो चुका ईमेल OTP कोड!');
    }
  };

  // 4. Forgot Password: Send Reset OTP to Email
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut || isSending) return;

    setError('');
    setIsSending(true);
    setOtpTimer(60);
    setEnteredOtp('');

    try {
      const res = await sendFirebaseEmailOtp(PRIMARY_ADMIN_EMAIL, 'reset');
      setIsSending(false);
      if (res.success) {
        if (soundEnabled) playSuccessSound();
        setStep('reset_otp');
        setFeedbackMsg(res.message);
      } else {
        setError(res.message || 'रीसेट OTP भेजने में त्रुटि हुई।');
      }
    } catch (err: any) {
      setIsSending(false);
      setError('रीसेट OTP भेजने में समस्या आई।');
    }
  };

  // 5. Reset Password: Verify OTP and Save New Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut || isSending) return;

    setError('');
    const trimmedOtp = enteredOtp.trim();

    if (!trimmedOtp || trimmedOtp.length < 6) {
      setError('कृपया ईमेल पर आया 6-अंकों का रीसेट OTP कोड दर्ज करें।');
      return;
    }

    if (!newPassword.trim() || newPassword.trim().length < 6) {
      setError('नया पासवर्ड कम से कम 6 अक्षरों या अंकों का होना चाहिए।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('दोनों पासवर्ड आपस में मेल नहीं खा रहे हैं। कृपया दोबारा जांचें।');
      return;
    }

    setIsSending(true);
    const verifyRes = await verifyFirebaseEmailOtp(PRIMARY_ADMIN_EMAIL, trimmedOtp);
    setIsSending(false);

    if (!verifyRes.success) {
      recordFailedAttempt(verifyRes.error || 'सुरक्षा त्रुटि: गलत या समाप्त हो चुका रीसेट OTP कोड!');
      return;
    }

    // Save newly configured password
    saveAdminPassword(PRIMARY_ADMIN_EMAIL, newPassword.trim());
    setResetSuccess(true);
    setFailedAttempts(0);
    if (soundEnabled) playSuccessSound();

    setTimeout(() => {
      setPassword(newPassword.trim());
      setStep('login');
      setLoginTab('password');
      setResetSuccess(false);
      setFeedbackMsg('✅ नया पासवर्ड सफलतापूर्वक सुरक्षित हो गया है! अब आप लॉगिन कर सकते हैं।');
      setTimeout(() => setFeedbackMsg(''), 5000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border-2 border-amber-300 relative space-y-4 my-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          title="बंद करें (Close)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <div className="w-13 h-13 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            बालवार्ता एडमिन प्रवेश (Admin Portal)
          </h3>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-bold">
            <Mail className="w-3.5 h-3.5 text-amber-700" />
            <span>अधिकृत ईमेल:</span>
            <span className="font-mono text-amber-900 font-black tracking-wide">{maskedEmail}</span>
          </div>
        </div>

        {/* Security Lockout Banner */}
        {isLockedOut && (
          <div className="p-3.5 rounded-2xl bg-rose-100 border-2 border-rose-300 text-rose-900 space-y-1 text-center animate-in fade-in">
            <div className="flex items-center justify-center gap-1.5 font-black text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>सुरक्षा लॉक सक्रिय (Security Lockout Active)</span>
            </div>
            <p className="text-[11px] font-bold">
              अत्यधिक गलत प्रयासों के कारण लॉगिन अस्थायी रूप से बंद है।
            </p>
            <p className="text-sm font-mono font-black text-rose-700">
              पुनः प्रयास में समय शेष: {Math.floor(lockoutRemaining / 60)}m {lockoutRemaining % 60}s
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP: MAIN LOGIN (WITH PASSWORD OR WITH EMAIL OTP) */}
        {/* ========================================================================= */}
        {step === 'login' && (
          <div className="space-y-4 pt-1">
            
            {/* Dual Login Options Tab Switcher */}
            <div className="p-1 rounded-2xl bg-slate-100 grid grid-cols-2 gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setLoginTab('password');
                  setError('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginTab === 'password'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>पासवर्ड से लॉगिन</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginTab('email_otp');
                  setError('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginTab === 'email_otp'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ईमेल OTP से लॉगिन</span>
              </button>
            </div>

            {/* TAB 1: LOGIN WITH PASSWORD */}
            {loginTab === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      <span>एडमिन पासवर्ड (Password):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setStep('forgot_password');
                      }}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      disabled={isLockedOut}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="एडमिन पासवर्ड दर्ज करें"
                      className="w-full px-3.5 py-2.5 pr-10 text-xs font-bold rounded-xl bg-slate-50 border-2 border-amber-300 focus:outline-none focus:border-amber-600 shadow-inner disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showPassword ? 'पासवर्ड छुपाएं' : 'पासवर्ड देखें'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    💡 पासवर्ड दर्ज करके आप सीधे 1-क्लिक में एडमिन पैनल में प्रवेश कर सकते हैं।
                  </p>
                </div>

                {feedbackMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{feedbackMsg}</span>
                  </div>
                )}

                {error && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    रद्द करें (Cancel)
                  </button>
                  <button
                    type="submit"
                    disabled={isLockedOut || !password.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>लॉगिन करें →</span>
                  </button>
                </div>

                {/* Quick Switch to Email OTP */}
                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginTab('email_otp');
                      setError('');
                    }}
                    className="text-xs text-sky-700 hover:text-sky-900 font-bold hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>या बिना पासवर्ड सीधे ईमेल OTP द्वारा लॉगिन करें</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: LOGIN WITH EMAIL OTP */}
            {loginTab === 'email_otp' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-2 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-sky-950">
                    सीधा ईमेल OTP लॉगिन (Password Free)
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    यदि आपको पासवर्ड याद नहीं है, तो आपके अधिकृत ईमेल <strong className="text-sky-950 font-mono">{maskedEmail}</strong> एवं बैक-अप ईमेल दोनों पर 6-अंकों का गुप्त OTP भेजकर सीधा प्रवेश प्राप्त कर सकते हैं।
                  </p>
                  <p className="text-[10px] text-sky-700 bg-sky-100/70 p-1.5 rounded-lg font-bold">
                    💡 सुझाव: यदि इनबॉक्स में न मिले तो Gmail का Spam / Promotions फ़ोल्डर अवश्य चेक करें।
                  </p>
                </div>

                {error && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="button"
                    disabled={isLockedOut || isSending}
                    onClick={handleSendEmailOtp}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{isSending ? 'OTP भेजा जा रहा है...' : 'ईमेल OTP प्राप्त करें →'}</span>
                  </button>
                </div>

                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginTab('password');
                      setError('');
                    }}
                    className="text-xs text-amber-700 hover:text-amber-900 font-bold hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>या पासवर्ड डालकर तुरंत लॉगिन करें</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP: OTP VERIFY (ENTER 6-DIGIT EMAIL OTP TO LOGIN) */}
        {/* ========================================================================= */}
        {step === 'otp_verify' && (
          <form onSubmit={handleVerifyOtpLogin} className="space-y-4 pt-1">
            <div className="p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-300 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-black text-sky-900">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-600" />
                <span>OTP भेजा गया: {maskedEmail}</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium pl-6 leading-relaxed">
                6-अंकों का गुप्त सुरक्षा कोड आपके Gmail इनबॉक्स/Spam में भेज दिया गया है। कृपया कोड नीचे दर्ज करें।
              </p>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 text-center">
                प्राप्त 6 अंकों का ईमेल सुरक्षा OTP दर्ज करें:
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                disabled={isLockedOut || isSending}
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''));
                  setError('');
                }}
                placeholder="0 0 0 0 0 0"
                className="w-full py-3.5 rounded-2xl bg-slate-50 border-2 border-sky-300 text-center text-2xl tracking-[0.5em] font-mono font-black focus:outline-none focus:border-sky-600 shadow-inner disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Resend & Timer */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>समय शेष: {otpTimer}s</span>
              <button
                type="button"
                disabled={otpTimer > 0 || isSending || isLockedOut}
                onClick={handleSendEmailOtp}
                className={`flex items-center gap-1 font-bold ${
                  otpTimer > 0 || isSending || isLockedOut
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-sky-700 hover:text-sky-900 cursor-pointer'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                <span>नया OTP भेजें (Resend OTP)</span>
              </button>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>वापस</span>
              </button>
              <button
                type="submit"
                disabled={isSending || enteredOtp.length < 6 || isLockedOut}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSending ? 'सत्यापित किया जा रहा है...' : 'सत्यापित करें व प्रवेश करें'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP: FORGOT PASSWORD (REQUEST RESET OTP VIA EMAIL) */}
        {/* ========================================================================= */}
        {step === 'forgot_password' && (
          <form onSubmit={handleForgotSendOtp} className="space-y-4 pt-1">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>एडमिन पासवर्ड रीसेट (Forgot Password):</span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                पासवर्ड रीसेट करने के लिए आपके अधिकृत ईमेल <strong className="text-amber-950 font-mono">{maskedEmail}</strong> एवं बैक-अप ईमेल दोनों पर 6-अंकों का गुप्त सुरक्षा कोड भेजा जाएगा, जिससे आप अपना नया पासवर्ड तुरंत सेट कर सकेंगे।
              </p>
              <p className="text-[10px] text-amber-900 bg-amber-100/70 p-1.5 rounded-lg font-bold">
                🔒 सुरक्षा बैक-अप: दोनों ईमेल पर OTP भेजा जाता है। इनबॉक्स न मिलने पर Spam फ़ोल्डर अवश्य जांचें।
              </p>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>वापस लॉगिन</span>
              </button>
              <button
                type="submit"
                disabled={isLockedOut || isSending}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Mail className="w-4 h-4" />
                <span>{isSending ? 'OTP भेजा जा रहा है...' : 'ईमेल पर रीसेट OTP भेजें →'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP: RESET OTP & SET NEW PASSWORD */}
        {/* ========================================================================= */}
        {step === 'reset_otp' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                <KeyRound className="w-4 h-4 text-amber-700" />
                <span>रीसेट OTP भेजा गया ({maskedEmail})</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                कृपया अपने ईमेल पर आया 6-अंकों का सुरक्षा OTP दर्ज करें और अपना नया पासवर्ड सेट करें।
              </p>
            </div>

            {/* OTP input */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 mb-1">
                ईमेल पर प्राप्त 6 अंकों का OTP कोड:
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                disabled={isLockedOut}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="6-Digit OTP"
                className="w-full px-3 py-2 text-center text-lg font-mono font-bold tracking-widest rounded-xl bg-slate-50 border-2 border-amber-200 focus:outline-none focus:border-amber-600 disabled:bg-slate-100"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 mb-1">
                नया पासवर्ड सेट करें (New Password):
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  disabled={isLockedOut}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="कम से कम 6 अक्षर या अंक"
                  className="w-full px-3 py-2 pr-10 text-xs font-bold rounded-xl bg-slate-50 border-2 border-amber-200 focus:outline-none focus:border-amber-600 disabled:bg-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 mb-1">
                नए पासवर्ड की पुष्टि करें (Confirm Password):
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                disabled={isLockedOut}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="नया पासवर्ड दोबारा दर्ज करें"
                className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border-2 border-amber-200 focus:outline-none focus:border-amber-600 disabled:bg-slate-100"
              />
            </div>

            {/* Timer and Resend */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>समय शेष: {otpTimer}s</span>
              <button
                type="button"
                disabled={otpTimer > 0 || isSending || isLockedOut}
                onClick={handleForgotSendOtp}
                className={`flex items-center gap-1 font-bold ${
                  otpTimer > 0 || isSending || isLockedOut
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-amber-700 hover:text-amber-900 cursor-pointer'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                <span>नया OTP भेजें</span>
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>सफलता! नया पासवर्ड सफलतापूर्वक सेट हो गया है। लॉगिन पर ले जाया जा रहा है...</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>रद्द करें</span>
              </button>
              <button
                type="submit"
                disabled={isLockedOut || enteredOtp.length < 6 || !newPassword || !confirmPassword || isSending}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSending ? 'सहेजा जा रहा है...' : 'नया पासवर्ड सुरक्षित करें'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
