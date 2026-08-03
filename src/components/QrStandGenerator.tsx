import React, { useState, useMemo, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Language, RestaurantConfig } from '../types';
import { X, Printer, QrCode, Sparkles, Car, Utensils, Info, Smartphone, Copy, CheckCircle2, AlertCircle, Wifi } from 'lucide-react';

interface QrStandGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  lang: Language;
}

export const QrStandGenerator: React.FC<QrStandGeneratorProps> = React.memo(({
  isOpen,
  onClose,
  config,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedTable, setSelectedTable] = useState<string>('entrance');
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'writing' | 'success' | 'error' | 'unsupported'>('idle');
  const [nfcMessage, setNfcMessage] = useState<string>('');

  // Base app URL memoized
  const baseUrl = useMemo(() => {
    return typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://smart-menu.app';
  }, []);

  const fullQrUrl = useMemo(() => {
    return selectedTable === 'entrance'
      ? baseUrl
      : `${baseUrl}?table=${selectedTable}`;
  }, [baseUrl, selectedTable]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const writeNfc = async () => {
    if (!('NDEFReader' in window)) {
      setNfcStatus('unsupported');
      setNfcMessage(isAr ? 'المتصفح لا يدعم NFC (استخدم تطبيق NFC Tools في آيفون، أو كروم في أندرويد).' : 'NFC not supported (Use Chrome on Android, or NFC Tools on iOS).');
      return;
    }

    try {
      setNfcStatus('writing');
      setNfcMessage(isAr ? 'جاري البحث... قرّب الهاتف من شريحة NFC 📱' : 'Scanning... approach NFC tag 📱');
      
      // @ts-ignore
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: fullQrUrl }]
      });
      
      setNfcStatus('success');
      setNfcMessage(isAr ? 'تمت البرمجة بنجاح! الشريحة جاهزة للاستخدام.' : 'Tag programmed successfully!');
      
      setTimeout(() => {
        setNfcStatus('idle');
        setNfcMessage('');
      }, 5000);
    } catch (error: any) {
      console.error(error);
      setNfcStatus('error');
      setNfcMessage(isAr ? `فشل الكتابة، حاول مرة أخرى (${error.message || 'خطأ غير معروف'})` : `Write failed: ${error.message}`);
    }
  };

  // Dynamic Stand Data based on Selected Service Type (memoized)
  const currentDetails = useMemo(() => {
    if (selectedTable === 'entrance') {
      return {
        badgeText: isAr ? '🚪 منيو المطعم الرئيسي (عام / سفري)' : 'Main Entrance Menu',
        instruction: isAr ? '📲 امسح الكود لتصفح المنيو والطلب السريع' : 'Scan Code to View Menu & Order',
        subtitle: isAr ? 'منيو عام واستلام وسفري' : 'General & Takeaway Menu',
        subFooter: isAr ? 'تصفح الأصناف وأرسل طلبك عبر الواتساب مباشرة' : 'Browse dishes & send order via WhatsApp',
        hint: isAr
          ? '💡 هذا الباركود مخصص للمدخل الرئيسي، الدعاية، أو كروت الاستلام والتوصيل.'
          : '💡 Ideal for the main entrance, marketing cards, or takeaway packaging.',
        icon: 'entrance',
      };
    }
    if (selectedTable === 'drivein') {
      return {
        badgeText: isAr ? '🚘 كود خدمة السيارة (Drive-In Service)' : '🚘 Drive-In Car Pickup Service',
        instruction: isAr ? '🚗 امسح الكود واطلب وجبتك من داخل سيارتك' : 'Scan Code & Order directly from your car',
        subtitle: isAr ? 'خدمة السيارات والمواقف' : 'Car Pickup & Parking Service',
        subFooter: isAr ? 'أدخل رقم سيارتك وسيصلك الطلب مباشرة إلى نافذتك' : 'Enter car plate & waiter will bring your order',
        hint: isAr
          ? '💡 ثبت هذا الباركود في موقف السيارات؛ وسيقوم النظام بتحديد خيار "خدمة السيارة" تلقائياً عند مسحه.'
          : '💡 Place this QR in the parking lot; it automatically defaults to Drive-In mode.',
        icon: 'drivein',
      };
    }
    if (selectedTable === 'dine_in_general') {
      return {
        badgeText: isAr ? '🍽️ منيو داخل المطعم (طاولات عامة)' : 'Dine-In General Menu',
        instruction: isAr ? '🍽️ امسح الكود لطلب الوجبات داخل المطعم' : 'Scan Code for Dine-In Table Service',
        subtitle: isAr ? 'خدمة الصالة الداخلية' : 'General Dine-In Service',
        subFooter: isAr ? 'اختر أطباقك وسيقوم النادل بتقديمها لطاولتك' : 'Select items & waiter will serve your table',
        hint: isAr
          ? '💡 باركود عام لخدمة الطاولات الداخلية دون التقييد برقم طاولة ثابت.'
          : '💡 General QR for dine-in tables without fixed table numbers.',
        icon: 'table',
      };
    }
    // Specific table number
    return {
      badgeText: isAr ? `🪑 طاولة رقم (${selectedTable}) - خدمة صالة` : `Table #${selectedTable} - Dine-In`,
      instruction: isAr ? `🍽️ امسح الكود واطلب لطاولة رقم (${selectedTable})` : `Scan Code to Order at Table #${selectedTable}`,
      subtitle: isAr ? `طاولة مخصصة رقم (${selectedTable})` : `Dedicated Table #${selectedTable}`,
      subFooter: isAr ? `طلبك مرتبط تلقائياً بطاولة رقم (${selectedTable})` : `Order automatically linked to Table #${selectedTable}`,
      hint: isAr
        ? `💡 عند مسح هذا الباركود، سيتم تثبيت رقم الطاولة (${selectedTable}) تلقائياً في سلة الطلب!`
        : `💡 Scanning this QR automatically locks Table #${selectedTable} in the customer cart!`,
      icon: 'table',
    };
  }, [selectedTable, isAr]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Backdrop overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white w-full max-w-2xl h-full max-h-[96vh] sm:max-h-[90vh] rounded-3xl flex flex-col shadow-2xl relative overflow-hidden z-10 my-auto">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-sm sm:text-base">
              {isAr ? 'إدارة مينيو المطعم الذكي (QR & NFC)' : 'Smart Restaurant Menu (QR & NFC)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label={isAr ? 'إغلاق النافذة' : 'Close Window'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 touch-manipulation flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Controls & Live Stand Preview - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 flex flex-col items-center justify-start gap-4 sm:gap-5 touch-pan-y">
          {/* Service Selector Control Bar */}
          <div className="w-full max-w-md bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0 no-print">
            <label className="text-xs font-black text-slate-900 shrink-0 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'إختر نوع الخدمه:' : 'Select Service Type:'}</span>
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full sm:flex-1 bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer touch-manipulation"
            >
              <option value="entrance">
                {isAr ? '🚪 منيو عام (الباب الرئيسي / سفري / توصيل)' : '🚪 General Entrance / Takeaway QR'}
              </option>
              <option value="drivein">
                {isAr ? '🚘 خدمة السيارة (موقف السيارات / Drive-In)' : '🚘 Drive-In Car Service QR'}
              </option>
              <option value="dine_in_general">
                {isAr ? '🍽️ داخل المطعم (منيو طاولات عام)' : '🍽️ Dine-In General QR'}
              </option>
              <optgroup label={isAr ? 'طاولات صالة محددة الرقم' : 'Specific Tables'}>
                {Array.from({ length: config.tableCount }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num.toString()}>
                    {isAr ? `🪑 طاولة رقم (${num}) - داخل المطعم` : `🪑 Table #${num} - Dine-In`}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Interactive Hint Indicator */}
          <div className="w-full max-w-md bg-amber-50/90 border border-amber-200 p-2.5 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-2 shrink-0 no-print">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] leading-tight">{currentDetails.hint}</span>
          </div>

          {/* PRINTABLE ACRYLIC TABLE STAND DESIGN */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] bg-white rounded-3xl border-4 border-slate-900 shadow-2xl overflow-hidden text-center relative p-5 sm:p-6 space-y-3.5 sm:space-y-4 print-stand-container my-auto shrink-0">
            {/* Top Stand Header */}
            <div className="bg-slate-900 text-white -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 p-4 border-b-4 border-amber-500 flex flex-col items-center justify-center">
              <img
                src={config.logoUrl}
                alt={config.nameAr}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-amber-400 mb-1.5 shadow-md"
              />
              <h3 className="font-black text-base sm:text-lg text-amber-400">
                {isAr ? config.nameAr : config.nameEn}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium">
                {currentDetails.subtitle}
              </p>
            </div>

            {/* Dynamic Instruction Banner */}
            <div className="bg-amber-50 border-2 border-amber-300 py-1.5 px-3 rounded-2xl text-amber-900 font-black text-[11px] sm:text-xs inline-block shadow-2xs max-w-full">
              {currentDetails.instruction}
            </div>

            {/* QR Code Graphic Frame (Generated Client-Side via SVG) */}
            <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 bg-white p-2 border-2 border-slate-900 rounded-2xl shadow-inner flex items-center justify-center">
              <QRCodeSVG
                value={fullQrUrl}
                size={170}
                level="H"
                bgColor="#ffffff"
                fgColor="#0f172a"
                className="w-full h-full"
              />
              {/* Center Overlay Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-amber-500 text-slate-900 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white flex items-center justify-center shadow-lg font-black">
                  {currentDetails.icon === 'drivein' ? (
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                  ) : currentDetails.icon === 'table' ? (
                    <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                  ) : (
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Table / Service Badge */}
            <div className="bg-slate-900 text-amber-400 font-black text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-800 shadow-xs flex items-center justify-center gap-1">
              <span>{currentDetails.badgeText}</span>
            </div>

            {/* Dynamic Sub-footer text */}
            <p className="text-[10px] text-slate-500 font-bold leading-tight">
              {currentDetails.subFooter}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-col gap-3 shrink-0 no-print">
          {/* NFC Status Banner */}
          {nfcStatus !== 'idle' && (
            <div className={`p-3 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-2 ${
              nfcStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              nfcStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              nfcStatus === 'unsupported' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              {nfcStatus === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {(nfcStatus === 'error' || nfcStatus === 'unsupported') && <AlertCircle className="w-5 h-5 shrink-0" />}
              {nfcStatus !== 'success' && nfcStatus !== 'error' && nfcStatus !== 'unsupported' && <Wifi className="w-5 h-5 shrink-0 animate-pulse" />}
              <span className="leading-tight">{nfcMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 touch-manipulation cursor-pointer transition"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 active:scale-95 touch-manipulation text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'طباعة QR' : 'Print QR'}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(fullQrUrl);
                  alert(isAr ? 'تم نسخ الرابط! يمكنك استخدامه في تطبيق NFC Tools للآيفون.' : 'URL Copied! Use NFC Tools app on iOS.');
                }}
                className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-900 active:scale-95 touch-manipulation text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition"
                title={isAr ? 'نسخ الرابط لبرمجة الآيفون' : 'Copy link for iOS programming'}
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'نسخ الرابط' : 'Copy URL'}</span>
              </button>
              
              <button
                type="button"
                onClick={writeNfc}
                className="flex-1 sm:flex-initial bg-indigo-500 hover:bg-indigo-600 active:scale-95 touch-manipulation text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isAr ? 'برمجة NFC' : 'Write NFC'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

QrStandGenerator.displayName = 'QrStandGenerator';



