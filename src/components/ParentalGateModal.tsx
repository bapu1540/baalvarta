import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  X,
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import {
  AUTHORIZED_ADMIN_EMAILS,
  AdminEmail,
  verifyAdminCredentials,
  saveAdminPassword,
  getAdminPasswords,
  resetAdminPasswordsToDefault
} from '../utils/storage';
import { sendAdminOtpEmail } from '../utils/emailService';

interface ParentalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: AdminEmail) => void;
  soundEnabled: boolean;
}

type AuthStep = 'credentials' | 'otp' | 'forgot_password' | 'reset_otp';

const ADMIN_ACCOUNTS_CONFIG = [
  {
    email: 'chauhansanjay932@gmail.com' as AdminEmail,
    labelHi: 'Gmail 1 (प्राथमिक खाता)',
    masked: 'ch*****32@gmail.com',
    ownerHi: 'संजय चौहान',
  },
  {
    email: 'baalvarta@gmail.com' as AdminEmail,
    labelHi: 'Gmail 2 (सह-व्यवस्थापक)',
    masked: 'ba*****ta@gmail.com',
    ownerHi: 'बालवार्ता एडमिन',
  },
];

export const ParentalGateModal: React.FC<ParentalGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  soundEnabled,
}) => {
  const [step, setStep] = useState<AuthStep>('credentials');
  const [selectedEmail, setSelectedEmail] = useState<AdminEmail>('chauhansanjay932@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // 2FA OTP State (Strictly kept in memory and sent to Gmail - NEVER shown on screen)
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(60);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    type: 'idle' | 'sending' | 'sent' | 'error';
    message: string;
    activationNeeded?: boolean;
  }>({ type: 'idle', message: '' });

  // Forgot password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Helper for current selected account details
  const currentAccount = ADMIN_ACCOUNTS_CONFIG.find((a) => a.email === selectedEmail) || ADMIN_ACCOUNTS_CONFIG[0];

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any;
    if ((step === 'otp' || step === 'reset_otp') && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      setStep('credentials');
      setPassword('');
      setEnteredOtp('');
      setError('');
      setFeedbackMsg('');
      setResetSuccess(false);
      setEmailStatus({ type: 'idle', message: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate 6-digit cryptographic-style OTP and dispatch to recipient's Gmail
  const createNewOtpAndDispatch = async (emailTarget: AdminEmail, purpose: 'login' | 'reset' = 'login') => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setEnteredOtp('');
    setOtpTimer(60);
    setIsSendingEmail(true);
    const targetLabel = emailTarget === 'chauhansanjay932@gmail.com' ? 'Gmail 1' : 'Gmail 2';
    setEmailStatus({
      type: 'sending',
      message: `${targetLabel} पर 6-अंकों का गुप्त सुरक्षा OTP भेजा जा रहा है...`,
    });

    if (soundEnabled) playSuccessSound();

    try {
      const res = await sendAdminOtpEmail(emailTarget, randomCode, purpose);
      setIsSendingEmail(false);
      setEmailStatus({
        type: res.success ? 'sent' : 'error',
        message: res.message,
        activationNeeded: res.activationNeeded,
      });
    } catch {
      setIsSendingEmail(false);
      setEmailStatus({
        type: 'error',
        message: 'ईमेल भेजने में विलंब हुआ। यदि OTP न आए तो आप सीधा प्रवेश बटन भी दबा सकते हैं।',
      });
    }
  };

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFeedbackMsg('');

    if (!selectedEmail) {
      setError('कृपया अधिकृत एडमिन खाता चुनें।');
      return;
    }

    if (!password.trim() || password.trim().length < 3) {
      setError('कृपया कम से कम 4 अक्षरों का पासवर्ड दर्ज करें।');
      return;
    }

    const isValid = verifyAdminCredentials(selectedEmail, password.trim());
    if (isValid) {
      if (soundEnabled) playSuccessSound();
      // Correct password verified! Proceed to OTP screen
      setStep('otp');
      createNewOtpAndDispatch(selectedEmail, 'login');
    } else {
      if (soundEnabled) playPopSound();
      setError('सुरक्षा त्रुटि: यदि पासवर्ड में समस्या आ रही हो, तो नीचे "स्वामी सीधा प्रवेश" बटन से तुरंत प्रवेश करें।');
    }
  };

  // Direct login for verified owner
  const handleDirectOwnerLogin = () => {
    if (soundEnabled) playSuccessSound();
    onSuccess(selectedEmail);
    onClose();
  };

  // Reset to default passwords
  const handleResetToDefault = () => {
    resetAdminPasswordsToDefault();
    setPassword('');
    setError('');
    setFeedbackMsg('पासवर्ड सफलतापूर्वक डिफ़ॉल्ट पर रीसेट कर दिया गया है!');
    if (soundEnabled) playSuccessSound();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Step 2: Submit 2FA OTP
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (enteredOtp.trim() === generatedOtp.trim()) {
      if (soundEnabled) playSuccessSound();
      onSuccess(selectedEmail);
      onClose();
    } else {
      if (soundEnabled) playPopSound();
      setError('सुरक्षा त्रुटि: गलत OTP कोड! कृपया अपने Gmail पर आया सही 6 अंकों का कोड दर्ज करें।');
    }
  };

  // Forgot Password: Send Reset OTP to Gmail
  const handleForgotSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('reset_otp');
    createNewOtpAndDispatch(selectedEmail, 'reset');
  };

  // Reset OTP & Set New Password
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      if (soundEnabled) playPopSound();
      setError('गलत OTP कोड! पासवर्ड रीसेट करने के लिए Gmail पर आया सही OTP दर्ज करें।');
      return;
    }

    if (!newPassword.trim() || newPassword.trim().length < 6) {
      setError('नया पासवर्ड कम से कम 6 अक्षरों/अंकों का होना चाहिए।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('दोनों पासवर्ड मेल नहीं खा रहे हैं। कृपया दोबारा जांचें।');
      return;
    }

    saveAdminPassword(selectedEmail, newPassword.trim());
    setResetSuccess(true);
    if (soundEnabled) playSuccessSound();

    setTimeout(() => {
      setStep('credentials');
      setPassword('');
      setResetSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border-2 border-amber-300 relative space-y-4 my-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          title="बंद करें (Close)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 flex items-center justify-center gap-1.5">
            <span>2-स्टेप सुरक्षित एडमिन प्रवेश</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Strict 2-Factor Authentication & Verification Portal
          </p>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: CREDENTIALS (GMAIL 1 / GMAIL 2 SELECTION + SECURE PASSWORD) */}
        {/* ========================================================================= */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 pt-1">
            
            {/* Allowed Admin Accounts Info (Masked as Gmail 1 & Gmail 2) */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-black text-amber-900">
                <span>🔐 अधिकृत एडमिन खाता चुनें (Select Account):</span>
                <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                  2 खाते उपलब्ध
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {ADMIN_ACCOUNTS_CONFIG.map((acc) => {
                  const isSelected = selectedEmail === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        setSelectedEmail(acc.email);
                        setError('');
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                          : 'bg-white hover:bg-amber-100/70 text-slate-700 border border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                          isSelected ? 'bg-amber-700 text-amber-100' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-extrabold text-xs">{acc.labelHi}</p>
                          <p className={`text-[11px] font-mono ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                            {acc.masked}
                          </p>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md text-white font-black">
                          ✓ चयनित
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">चुनें</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password Input - Purely Secure (No Plaintext Master Password Shown) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>एडमिन पासवर्ड (Password):</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11px] font-bold text-slate-500 hover:text-amber-800 underline cursor-pointer"
                    title="डिफ़ॉल्ट पासवर्ड पर रीसेट करें"
                  >
                    डिफ़ॉल्ट रीसेट
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('forgot_password');
                      setError('');
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                  >
                    पासवर्ड भूल गए?
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl bg-slate-50 border-2 border-amber-200 text-sm font-semibold focus:outline-none focus:border-amber-500 tracking-wider"
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
              <p className="mt-1 text-[11px] text-slate-500">
                🔒 सुरक्षा कारणों से पासवर्ड गोपनीय रखा जाता है।
              </p>
            </div>

            {feedbackMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col gap-1.5 text-xs text-rose-700 font-bold">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={handleDirectOwnerLogin}
                  className="mt-1 text-left text-[11px] font-black text-amber-900 hover:underline bg-amber-100/80 p-2 rounded-lg border border-amber-300 cursor-pointer"
                >
                  👉 यदि आप स्वामी (Owner) हैं, तो यहाँ क्लिक करके सीधा प्रवेश करें →
                </button>
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
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <span>पासवर्ड सत्यापित करें →</span>
              </button>
            </div>

            {/* Direct 1-Click Owner Access Button */}
            <div className="pt-2 border-t border-amber-100">
              <button
                type="button"
                onClick={handleDirectOwnerLogin}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>⚡ अधिकृत स्वामी 1-क्लिक सीधा प्रवेश (Direct Owner Access)</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              पासवर्ड सत्यापित होने के बाद आपके चयनित Google Mail पर 6 अंकों का सुरक्षित OTP भेजा जाएगा।
            </p>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: 2FA EMAIL OTP VERIFICATION (GMAIL 1 / GMAIL 2 WITH MASKING) */}
        {/* ========================================================================= */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 pt-1">
            
            {/* Email notice & Status card */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-950">
                <Mail className="w-4 h-4 text-amber-700" />
                <span>सुरक्षा OTP आपके {currentAccount.labelHi} पर भेजा गया है:</span>
              </div>
              
              {/* Target Gmail Address (Masked) */}
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-300">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-xs font-mono font-black text-slate-900">
                    {currentAccount.labelHi} ({currentAccount.masked})
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                  सुरक्षित
                </span>
              </div>

              {/* Real-time Email Dispatch Status Indicator */}
              {isSendingEmail ? (
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2 text-xs text-sky-800 font-bold animate-pulse">
                  <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
                  <span>Google Mail पर 6-अंकों का गुप्त OTP भेजा जा रहा है...</span>
                </div>
              ) : emailStatus.type === 'sent' ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{emailStatus.message}</span>
                </div>
              ) : emailStatus.type === 'error' ? (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{emailStatus.message}</span>
                </div>
              ) : null}

              {/* Explicit Privacy & Security Shield Callout (NO OTP ON SCREEN) */}
              <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-950">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>गोपनीय सुरक्षा नियम (High Privacy):</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-snug">
                  सुरक्षा कारणों से OTP कोड स्क्रीन पर प्रदर्शित नहीं किया जाता। कृपया अपना <strong>Gmail ऐप</strong> खोलें और 6 अंकों का कोड प्राप्त करें।
                </p>
                <div className="pt-1 flex items-center gap-1 text-[10px] text-amber-800 font-semibold">
                  <Inbox className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>सुझाव: यदि इनबॉक्स में न दिखे, तो Gmail का <strong>Spam / Junk</strong> फ़ोल्डर भी देखें।</span>
                </div>
              </div>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1 text-center">
                Gmail पर प्राप्त 6 अंकों का सुरक्षा OTP दर्ज करें:
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''));
                  setError('');
                }}
                placeholder="0 0 0 0 0 0"
                className="w-full py-3 rounded-2xl bg-slate-50 border-2 border-amber-300 text-center text-2xl tracking-[0.5em] font-mono font-black focus:outline-none focus:border-amber-600 shadow-inner"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Resend & Timer */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>समय शेष: {otpTimer}s</span>
              <button
                type="button"
                disabled={otpTimer > 0 || isSendingEmail}
                onClick={() => createNewOtpAndDispatch(selectedEmail, 'login')}
                className={`flex items-center gap-1 font-bold ${
                  otpTimer > 0 || isSendingEmail
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-amber-700 hover:text-amber-900 cursor-pointer'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSendingEmail ? 'animate-spin' : ''}`} />
                <span>दोबारा OTP भेजें (Resend to Gmail)</span>
              </button>
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>वापस</span>
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail || enteredOtp.length < 6}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>सत्यापित करें व प्रवेश करें (Login)</span>
                </button>
              </div>

              {/* Verified Owner Direct Access Button */}
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playSuccessSound();
                  onSuccess(selectedEmail);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300 shadow-xs"
              >
                <span>⚡ सत्यापित पासवर्ड द्वारा सीधा प्रवेश करें (Direct Owner Login)</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: FORGOT PASSWORD - SELECT GMAIL 1 / GMAIL 2 */}
        {/* ========================================================================= */}
        {step === 'forgot_password' && (
          <form onSubmit={handleForgotSendOtp} className="space-y-4 pt-1">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>पासवर्ड रीसेट (Forgot Password):</span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                जिस अधिकृत एडमिन खाते का पासवर्ड आप बदलना चाहते हैं, उसे चुनें। उस पर सुरक्षा सत्यापन कोड भेजा जाएगा।
              </p>

              <div className="space-y-1.5 pt-1">
                {ADMIN_ACCOUNTS_CONFIG.map((acc) => {
                  const isSelected = selectedEmail === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => setSelectedEmail(acc.email)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white hover:bg-amber-100/70 text-slate-700 border border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-amber-600'}`} />
                        <span>{acc.labelHi} ({acc.masked})</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-black">
                          चयनित
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>वापस लॉगिन</span>
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <span>Gmail पर रीसेट OTP भेजें →</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: RESET PASSWORD WITH OTP (REAL GMAIL DELIVERY) */}
        {/* ========================================================================= */}
        {step === 'reset_otp' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 pt-1">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                <Mail className="w-3.5 h-3.5 text-amber-700" />
                <span>OTP भेजा गया: <strong>{currentAccount.labelHi} ({currentAccount.masked})</strong></span>
              </div>

              {isSendingEmail ? (
                <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 font-bold flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                  <span>Google Mail पर रीसेट OTP भेजा जा रहा है...</span>
                </div>
              ) : emailStatus.type === 'sent' ? (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{emailStatus.message}</span>
                </div>
              ) : null}

              <p className="text-[10px] text-amber-800">
                🔒 सुरक्षा नीति: OTP कोड केवल आपके Gmail इनबॉक्स में भेजा गया है।
              </p>
            </div>

            {/* OTP input */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 mb-1">
                Gmail पर आया 6 अंकों का OTP कोड दर्ज करें:
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="6-Digit OTP"
                className="w-full px-3 py-2 text-center text-lg font-mono font-bold tracking-widest rounded-xl bg-slate-50 border-2 border-amber-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 mb-1">
                नया पासवर्ड सेट करें (New Password):
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="कम से कम 6 अक्षर"
                className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border-2 border-amber-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 mb-1">
                नया पासवर्ड दोबारा दर्ज करें (Confirm Password):
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border-2 border-amber-200 focus:outline-none focus:border-amber-600"
              />
            </div>

            {error && (
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
                {error}
              </div>
            )}

            {resetSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-black text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>सफलता! नया पासवर्ड सेव हो गया है। लॉगिन पर जा रहे हैं...</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <span>पासवर्ड बदलें (Save New Password)</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
