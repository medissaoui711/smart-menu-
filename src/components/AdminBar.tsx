import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, LogOut, KeyRound, QrCode, Settings, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface AdminBarProps {
  lang: Language;
  onOpenAdmin: () => void;
  onOpenQrGenerator: () => void;
  onLogout: () => void;
  onUpdatePin: (newPin: string) => boolean;
  currentPin: string;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  lang,
  onOpenAdmin,
  onOpenQrGenerator,
  onLogout,
  onUpdatePin,
  currentPin,
}) => {
  const [copiedCustomer, setCopiedCustomer] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');

  const isAr = lang === 'ar';

  const copyCustomerLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    navigator.clipboard.writeText(url.origin + url.pathname);
    setCopiedCustomer(true);
    setTimeout(() => setCopiedCustomer(false), 2000);
  };

  const copyAdminLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'admin');
    navigator.clipboard.writeText(url.toString());
    setCopiedAdmin(true);
    setTimeout(() => setCopiedAdmin(false), 2000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      alert(isAr ? 'يجب أن يتكون رمز PIN من 4 أرقام على الأقل' : 'PIN must be at least 4 digits');
      return;
    }
    const success = onUpdatePin(newPinInput.trim());
    if (success) {
      setPinSuccessMsg(isAr ? 'تم حفظ رمز PIN الجديد بنجاح!' : 'New PIN saved successfully!');
      setTimeout(() => {
        setIsPinModalOpen(false);
        setNewPinInput('');
        setPinSuccessMsg('');
      }, 1500);
    }
  };

  return (
    <>
      <div className="bg-slate-900 border-b border-amber-500/30 text-white px-4 py-2 shadow-md no-print sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-extrabold text-amber-400 flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'وضع الإدارة نشط' : 'Admin Mode Active'}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isAr ? 'لوحة التحكم' : 'Admin Panel'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenQrGenerator}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer border border-amber-500/20 active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{isAr ? 'استندات QR' : 'QR Stands'}</span>
            </button>

            <button
              type="button"
              onClick={copyCustomerLink}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition flex items-center gap-1 cursor-pointer border border-slate-700 active:scale-95"
              title={isAr ? 'نسخ رابط الزبون الخالي من عناصر الإدارة' : 'Copy Customer Menu URL'}
            >
              {copiedCustomer ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedCustomer ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'رابط الزبون' : 'Customer Link')}</span>
            </button>

            <button
              type="button"
              onClick={copyAdminLink}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition flex items-center gap-1 cursor-pointer border border-slate-700 active:scale-95"
              title={isAr ? 'نسخ رابط الإدارة الخاص بك' : 'Copy Admin Portal URL'}
            >
              {copiedAdmin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedAdmin ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'رابط الإدارة' : 'Admin Link')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPinModalOpen(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center justify-center cursor-pointer border border-slate-700"
              title={isAr ? 'تغيير رمز PIN' : 'Change PIN Code'}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 font-bold rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PIN Update Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-amber-400 flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              <span>{isAr ? 'تغيير رمز PIN للإدارة' : 'Change Admin PIN Code'}</span>
            </h3>

            <p className="text-xs text-slate-400">
              {isAr ? 'الرمز الحالي:' : 'Current PIN:'} <span className="font-mono font-bold text-amber-300">{currentPin}</span>
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'رمز PIN الجديد (4 أرقام على الأقل):' : 'New PIN Code (min 4 digits):'}
                </label>
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="e.g. 5678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  autoFocus
                />
              </div>

              {pinSuccessMsg && (
                <p className="text-xs text-emerald-400 font-bold text-center bg-emerald-950/50 border border-emerald-900 p-2 rounded-xl">
                  {pinSuccessMsg}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl"
                >
                  {isAr ? 'حفظ الرمز' : 'Save PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
