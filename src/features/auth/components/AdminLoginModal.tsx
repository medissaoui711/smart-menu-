import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Lock, X, KeyRound, ShieldAlert, Delete, Clock } from 'lucide-react';
import { Language } from '../../../types';
import { adminLoginSchema } from '../../../utils/validationSchemas';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (pin: string) => boolean;
  lang: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  lang,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPin, setShowPin] = useState(false);
  const isAr = lang === 'ar';

  // Rate Limiting State (Brute force protection)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Countdown timer for rate limiting lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleKeyPress = (num: string) => {
    if (lockoutSeconds > 0) return;
    if (pin.length < 8) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg('');
    }
  };

  const handleDelete = () => {
    if (lockoutSeconds > 0) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    if (lockoutSeconds > 0) return;
    setPin('');
    setErrorMsg('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (lockoutSeconds > 0) {
      setErrorMsg(
        isAr
          ? `تم حظر المحاولات مؤقتاً لحماية الحساب. انتظر ${lockoutSeconds} ثانية`
          : `Rate limit active. Please wait ${lockoutSeconds} seconds`
      );
      return;
    }

    // 1. Zod Validation
    const validationResult = adminLoginSchema.safeParse({ pin });
    if (!validationResult.success) {
      const rawError = validationResult.error.issues[0]?.message || 'Invalid PIN';
      const localizedError = isAr ? rawError.split('|')[0].trim() : (rawError.split('|')[1] || rawError).trim();
      setErrorMsg(localizedError);
      return;
    }

    // 2. Auth Attempt
    const success = onLogin(pin);
    if (!success) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLockoutSeconds(60);
        setErrorMsg(
          isAr
            ? 'تم تجاوز عدد المحاولات المسموحة! تم تفعيل حظر الحماية لمدة 60 ثانية'
            : 'Too many failed attempts! Rate limit active for 60 seconds'
        );
      } else {
        const remaining = 5 - newAttempts;
        setErrorMsg(
          isAr
            ? `رمز PIN غير صحيح. (متبقي ${remaining} محاولات قبل الحظر)`
            : `Incorrect PIN code. (${remaining} attempts left before lockout)`
        );
      }
      setPin('');
    } else {
      setFailedAttempts(0);
      setLockoutSeconds(0);
      setPin('');
      setErrorMsg('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto no-print flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-sm bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-5 text-center relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 end-3 p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 mx-auto bg-slate-950/20 rounded-2xl flex items-center justify-center text-white mb-2 backdrop-blur-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-extrabold text-lg text-white">
                {isAr ? 'تسجيل دخول لوحة التحكم' : 'Admin Portal Login'}
              </h2>
              <p className="text-xs text-amber-100/90 font-medium mt-1">
                {isAr ? 'أدخل رمز PIN المخصص لإدارة المطعم' : 'Enter PIN to manage menu & settings'}
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* PIN Visual Dots / Field */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={isAr ? 'أدخل رمز PIN' : 'Enter PIN'}
                    className="w-full text-center text-2xl tracking-widest font-mono bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-amber-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    maxLength={8}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                  >
                    {showPin ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار' : 'Show')}
                  </button>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-xs text-red-400 font-bold bg-red-950/50 border border-red-900/60 p-2.5 rounded-xl justify-center"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </div>

              {/* Numerical Keypad */}
              <div className="grid grid-cols-3 gap-2 py-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(num)}
                    className="py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-amber-600 text-white font-bold text-xl rounded-2xl transition shadow-xs cursor-pointer active:scale-95 flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-3 bg-slate-800/40 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-2xl transition cursor-pointer active:scale-95 flex items-center justify-center"
                >
                  {isAr ? 'مسح' : 'Clear'}
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="py-3 bg-slate-800/80 hover:bg-slate-700 active:bg-amber-600 text-white font-bold text-xl rounded-2xl transition shadow-xs cursor-pointer active:scale-95 flex items-center justify-center"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="py-3 bg-slate-800/40 hover:bg-slate-800 text-slate-300 font-bold text-sm rounded-2xl transition cursor-pointer active:scale-95 flex items-center justify-center"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl transition cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isAr ? 'دخول الإدارة' : 'Enter Admin'}</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-500 pt-1">
                {isAr ? 'رمز الدخول الافتراضي: 1234' : 'Default PIN Code: 1234'}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
