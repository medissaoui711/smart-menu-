import React, { useState } from 'react';
import { Download, Smartphone, X, Share, PlusSquare } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallBannerProps {
  isAr: boolean;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ isAr }) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled || dismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      {/* PWA Install Banner */}
      <div className="bg-slate-900 text-white px-4 py-2.5 border-b border-slate-800 animate-in slide-in-from-top duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-100">
                {isAr ? 'تثبيت تطبيق المنيو على جهازك' : 'Install Smart Menu App'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isAr
                  ? 'وصول سريع ومباشر من الشاشة الرئيسية بدون متصفح'
                  : 'Fast access from your home screen without a browser'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isInstallable ? (
              <button
                type="button"
                onClick={promptInstall}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تثبيت الآن' : 'Install Now'}</span>
              </button>
            ) : isIOS ? (
              <button
                type="button"
                onClick={() => setShowIOSGuide(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'طريقة التثبيت' : 'Install Guide'}</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-900 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 start-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                {isAr ? 'تثبيت المنيو على iPhone / iPad' : 'Install Menu on iOS'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isAr
                  ? 'اتبع الخطوات البسيطة التالية لإضافة المنيو لشاشتك الرئيسية:'
                  : 'Follow these steps to add the app to your Home Screen:'}
              </p>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-[11px]">
                  1
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{isAr ? 'اضغط زر المشاركة' : 'Tap the Share button'}</span>
                  <Share className="w-4 h-4 text-sky-600 inline" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-[11px]">
                  2
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{isAr ? 'اختر "إضافة إلى الشاشة الرئيسية"' : 'Select "Add to Home Screen"'}</span>
                  <PlusSquare className="w-4 h-4 text-slate-700 inline" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-[11px]">
                  3
                </div>
                <span>{isAr ? 'اضغط "إضافة" في أعلى الشاشة' : 'Tap "Add" in top right corner'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 cursor-pointer"
            >
              {isAr ? 'تم، فهمت ذلك' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
