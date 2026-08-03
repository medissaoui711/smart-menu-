import React, { useState } from 'react';
import { CartItem, CustomerDetails, Language, RestaurantConfig, ServiceType } from '../types';
import { X, Trash2, Plus, Minus, Send, Utensils, ShoppingBag, Truck, MapPin, User, Phone, MessageSquare, AlertCircle, Navigation, Loader2, CheckCircle2, Car, Clock } from 'lucide-react';
import { openWhatsAppOrder } from '../utils/whatsapp';
import { AnimatePresence, motion } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  config: RestaurantConfig;
  lang: Language;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  defaultTableNumber: string | null;
  onOrderSent: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  config,
  lang,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  defaultTableNumber,
  onOrderSent,
}) => {
  const isAr = lang === 'ar';
  const currency = isAr ? config.currencyAr : config.currencyEn;

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    serviceType: defaultTableNumber ? 'dine_in' : 'takeaway',
    tableNumber: defaultTableNumber || '1',
    address: '',
    notes: '',
    pickupTime: 'خلال 15 دقيقة',
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [locationSource, setLocationSource] = useState<'ip' | 'gps' | null>(null);

  // Dynamic automatic IP Geolocation on choosing delivery
  React.useEffect(() => {
    if (customer.serviceType === 'delivery' && !customer.locationUrl && !isLocating) {
      setIsLocating(true);
      setLocationStatus(isAr ? 'جاري التحديد التلقائي للموقع...' : 'Auto-detecting location...');

      fetch('https://ipwho.is/')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            const lat = data.latitude;
            const lng = data.longitude;
            const city = data.city || '';
            const country = data.country || '';
            const ipUrl = `https://maps.google.com/?q=${lat},${lng}`;

            setCustomer((prev) => ({
              ...prev,
              locationUrl: prev.locationUrl || ipUrl,
              address: prev.address || (city ? `${city}${country ? `, ${country}` : ''}` : ''),
            }));
            setLocationSource('ip');
            setLocationStatus(
              isAr
                ? `تم تحديد موقعك تلقائياً (${city || country || 'IP Geolocation'})`
                : `Auto-located via IP (${city || country})`
            );
          }
        })
        .catch(() => {
          // Silent fallback
        })
        .finally(() => {
          setIsLocating(false);
        });
    }
  }, [customer.serviceType]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(isAr ? 'متصفحك لا يدعم تحديد موقع الـ GPS' : 'Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const url = `https://maps.google.com/?q=${lat},${lng}`;
        setCustomer((prev) => ({ ...prev, locationUrl: url }));
        setLocationSource('gps');
        setIsLocating(false);
        setLocationStatus(isAr ? 'تم تحديد موقعك بدقة عالية عبر الـ GPS!' : 'High-precision GPS position captured!');
      },
      (error) => {
        setIsLocating(false);
        let errMsg = isAr
          ? 'تعذر الوصول للـ GPS، تم الاعتماد على موقع الـ IP.'
          : 'Could not fetch GPS, relied on IP location.';
        if (error.code === error.PERMISSION_DENIED) {
          errMsg = isAr ? 'تم رفض إذن الـ GPS. الاعتماد على موقع الـ IP.' : 'GPS access denied. Relying on IP.';
        }
        setLocationStatus(errMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = customer.serviceType === 'delivery' ? config.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSendOrder = () => {
    // Validation checks
    if (customer.serviceType === 'dine_in' && !customer.tableNumber) {
      setValidationError(isAr ? 'يرجى تحديد رقم الطاولة للخدمة داخل المطعم' : 'Please specify table number');
      return;
    }

    if (customer.serviceType === 'drive_in' && !customer.carPlate && !customer.carDetails) {
      setValidationError(isAr ? 'يرجى كتابة رقم / لوحة السيارة لتقديم الطلب بالسيارة' : 'Please enter car plate / number for drive-in');
      return;
    }

    if (customer.serviceType === 'takeaway' && !customer.pickupTime) {
      setValidationError(isAr ? 'يرجى تحديد الوقت المتوقع للوصول واستلام الطلب' : 'Please select your estimated pickup time');
      return;
    }

    if (customer.serviceType === 'delivery' && !customer.address) {
      setValidationError(isAr ? 'يرجى كتابة عنوان التوصيل' : 'Please enter delivery address');
      return;
    }

    setValidationError(null);

    // Send order via WhatsApp
    openWhatsAppOrder(config, items, customer, lang);

    // Clear cart items immediately after sending order
    onClearCart();

    // Trigger success callback
    onOrderSent();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end no-print pb-15 md:pb-0">
          {/* Backdrop overlay click to close drawer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose} 
          />

          <motion.div 
            initial={{ x: isAr ? "-100%" : "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isAr ? "-100%" : "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl relative z-10"
          >
            {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-base">
              {isAr ? 'سلة الطلبات الحية' : 'Your Live Order'}
            </h2>
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تفريغ السلة' : 'Clear'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label={isAr ? 'إغلاق السلة' : 'Close Cart'}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-100">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg">
              {isAr ? 'السلة فارغة حالياً' : 'Your Order is Empty'}
            </h3>
            <p className="text-slate-500 text-xs max-w-xs mt-1 leading-relaxed">
              {isAr
                ? 'استعرض أقسام المنيو واختر وجباتك المفضلة لإضافتها إلى الطلب'
                : 'Browse our menu categories and add your favorite dishes to start your order'}
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-amber-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs hover:bg-amber-600 transition cursor-pointer"
            >
              {isAr ? 'تصفح قائمة الطعام' : 'Browse Menu'}
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Itemized Cart List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isAr ? 'الأصناف المختارة' : 'Selected Items'}
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {items.map((cartItem) => (
                  <div key={cartItem.id} className="p-3 flex items-start justify-between gap-3 bg-white hover:bg-slate-50/50 transition">
                    <img
                      src={cartItem.menuItem.image}
                      alt={cartItem.menuItem.nameAr}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">
                        {isAr ? cartItem.menuItem.nameAr : cartItem.menuItem.nameEn}
                      </h4>

                      {/* Selected Options summary */}
                      {cartItem.selectedOptions && cartItem.selectedOptions.length > 0 && (
                        <p className="text-[11px] text-amber-700 bg-amber-50 rounded-md px-1.5 py-0.5 mt-1 inline-block">
                          {cartItem.selectedOptions.map((o) => o.choiceName).join(' • ')}
                        </p>
                      )}

                      {/* Item Notes */}
                      {cartItem.itemNotes && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5">
                          📝 {cartItem.itemNotes}
                        </p>
                      )}

                      <div className="font-black text-amber-600 text-xs mt-1">
                        {cartItem.unitPrice * cartItem.quantity} {currency}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white shadow-2xs hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{cartItem.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white shadow-2xs hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Type Selection */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isAr ? 'إختر نوع الخدمه' : 'Select Service Type'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Dine-In */}
                <button
                  type="button"
                  onClick={() => setCustomer({ ...customer, serviceType: 'dine_in' })}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    customer.serviceType === 'dine_in'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-extrabold ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <Utensils className="w-5 h-5 text-amber-600" />
                  <span className="text-[11px] leading-tight">{isAr ? 'محلي' : 'Dine-In'}</span>
                </button>

                {/* Drive-In / Car Service */}
                <button
                  type="button"
                  onClick={() => setCustomer({ ...customer, serviceType: 'drive_in' })}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    customer.serviceType === 'drive_in'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-extrabold ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <Car className="w-5 h-5 text-amber-600" />
                  <span className="text-[11px] leading-tight">{isAr ? 'خدمة السيارة' : 'Drive-In'}</span>
                </button>

                {/* Takeaway / Pickup */}
                <button
                  type="button"
                  onClick={() => setCustomer({ ...customer, serviceType: 'takeaway' })}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    customer.serviceType === 'takeaway'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-extrabold ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                  <span className="text-[11px] leading-tight">{isAr ? 'تجهيز طلب' : 'Pickup'}</span>
                </button>

                {/* Delivery */}
                <button
                  type="button"
                  onClick={() => setCustomer({ ...customer, serviceType: 'delivery' })}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    customer.serviceType === 'delivery'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-extrabold ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span className="text-[11px] leading-tight">{isAr ? 'توصيل' : 'Delivery'}</span>
                </button>
              </div>

              {/* Service Details Inputs */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-3">
                {customer.serviceType === 'dine_in' && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      {isAr ? 'رقم الطاولة (ضروري)' : 'Table Number (Required)'}
                    </label>
                    <select
                      value={customer.tableNumber}
                      onChange={(e) => setCustomer({ ...customer, tableNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {Array.from({ length: config.tableCount }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num.toString()}>
                          {isAr ? `طاولة رقم ${num}` : `Table #${num}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {customer.serviceType === 'takeaway' && (
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{isAr ? 'وقت الوصول لاستلام الطلب (ضروري)' : 'Estimated Pickup Time'}</span>
                      </label>
                      
                      {/* Quick Pickup Time Options */}
                      <div className="grid grid-cols-3 gap-1.5 mb-2">
                        {[
                          { labelAr: 'خلال 15 دقيقة', labelEn: 'In 15 mins' },
                          { labelAr: 'خلال 30 دقيقة', labelEn: 'In 30 mins' },
                          { labelAr: 'خلال 45 دقيقة', labelEn: 'In 45 mins' },
                        ].map((timeOpt) => {
                          const targetVal = isAr ? timeOpt.labelAr : timeOpt.labelEn;
                          const isSelected = customer.pickupTime === targetVal;
                          return (
                            <button
                              key={timeOpt.labelAr}
                              type="button"
                              onClick={() => setCustomer({ ...customer, pickupTime: targetVal })}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {targetVal}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Time Input */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          {isAr ? 'أو حدد وقت/ساعة مخصصة للوصول:' : 'Or set specific arrival time:'}
                        </label>
                        <input
                          type="text"
                          value={customer.pickupTime || ''}
                          onChange={(e) => setCustomer({ ...customer, pickupTime: e.target.value })}
                          placeholder={isAr ? 'مثال: الساعة 8:30 مساءً' : 'e.g. 8:30 PM'}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px] flex items-center gap-2">
                      <span className="text-base shrink-0">🛍️</span>
                      <span>
                        {isAr
                          ? 'سيتم تجهيز وجبتك في الوقت المحدد لتجدها ساخنة وجاهزة فور وصولك للمطعم دون إنتظار!'
                          : 'Your order will be freshly prepared and hot for immediate pickup upon your arrival!'}
                      </span>
                    </div>
                  </div>
                )}

                {customer.serviceType === 'drive_in' && (
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1 flex items-center gap-1">
                        <Car className="w-4 h-4 text-amber-600" />
                        <span>{isAr ? 'بيانات السيارة (ضروري لتسليم الطلب لسيارتك)' : 'Car Details (Required)'}</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {isAr ? 'رقم / لوحة السيارة *' : 'Car Plate / Number *'}
                          </label>
                          <input
                            type="text"
                            value={customer.carPlate || ''}
                            onChange={(e) => setCustomer({ ...customer, carPlate: e.target.value })}
                            placeholder={isAr ? 'مثال: 4521 أ ب ج' : 'e.g. 4521 ABC'}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {isAr ? 'نوع / لون السيارة (اختياري)' : 'Color / Model (Optional)'}
                          </label>
                          <input
                            type="text"
                            value={customer.carColor || ''}
                            onChange={(e) => setCustomer({ ...customer, carColor: e.target.value })}
                            placeholder={isAr ? 'مثال: كامري أبيض' : 'e.g. White Camry'}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px] flex items-center gap-2">
                      <span className="text-base shrink-0">🚗</span>
                      <span>
                        {isAr
                          ? 'اصفف سيارتك أمام المطعم وسيقوم النادل بتقديم وجبتك مباشرة إلى نافذة سيارتك!'
                          : 'Park outside and our waiter will serve your order directly to your car!'}
                      </span>
                    </div>
                  </div>
                )}

                {customer.serviceType === 'delivery' && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isAr ? 'عنوان التوصيل (ضروري)' : 'Delivery Address'}</span>
                      </label>
                      <input
                        type="text"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder={isAr ? 'اسم الشارع، رقم العمارة، الشقة...' : 'Street name, building #, apt...'}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Automatic IP & GPS Location Feedback */}
                    <div className="pt-1 space-y-1.5">
                      {/* Status / Captured Badge */}
                      {customer.locationUrl ? (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-[11px] flex items-center justify-between gap-1 shadow-2xs">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-bold truncate">
                                {locationSource === 'ip'
                                  ? isAr ? '🌐 تم تحديد موقعك التلقائي من شبكة الـ IP!' : '🌐 Auto-located via IP Geolocation!'
                                  : isAr ? '📍 تم تحديد موقعك بدقة عالية (GPS)' : '📍 High-precision GPS location!'}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-medium">
                                {isAr ? 'سيرسل رابط الخريطة المباشر مع رسالة الواتساب' : 'Map link attached to WhatsApp order'}
                              </span>
                            </div>
                          </div>
                          <a
                            href={customer.locationUrl?.startsWith('http') ? customer.locationUrl : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded-lg underline font-extrabold shrink-0 text-[10px] transition"
                          >
                            {isAr ? 'معاينة' : 'View'}
                          </a>
                        </div>
                      ) : isLocating ? (
                        <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                          <span>{isAr ? 'جاري التعرف على موقعك تلقائياً عبر الـ IP...' : 'Auto-detecting location via IP...'}</span>
                        </div>
                      ) : null}

                      {/* Optional manual GPS refine button if desired */}
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 border border-slate-200 transition cursor-pointer disabled:opacity-60"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          {customer.locationUrl
                            ? isAr ? 'تحسين الدقة عبر الـ GPS المباشر 📍' : 'Refine with exact GPS 📍'
                            : isAr ? 'إعادة جلب موقع الـ GPS 📍' : 'Fetch GPS Location 📍'}
                        </span>
                      </button>

                      {locationStatus && !customer.locationUrl && (
                        <p className="text-[11px] text-slate-500 font-medium">{locationStatus}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Customer Name Input (Phone excluded as WhatsApp message arrives with phone) */}
                {customer.serviceType !== 'dine_in' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{isAr ? 'اسم الزبون (اختياري)' : 'Customer Name (Optional)'}</span>
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder={isAr ? 'اسمك' : 'Your name'}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* Overall Order Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    <span>{isAr ? 'ملاحظات خاصة على الطلب كامل' : 'General Order Notes'}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    placeholder={isAr ? 'مثال: زيادة صوصات، أدوات بلاستيك، بدون بصل...' : 'Extra sauces, cutlery...'}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="font-bold">{validationError}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Checkout Action */}
        {items.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-bold text-slate-900">{subtotal} {currency}</span>
              </div>
              {customer.serviceType === 'delivery' && (
                <div className="flex justify-between">
                  <span>{isAr ? 'رسوم التوصيل:' : 'Delivery Fee:'}</span>
                  <span className="font-bold text-slate-900">{deliveryFee} {currency}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>{isAr ? 'الإجمالي الكلي:' : 'Total Amount:'}</span>
                <span className="text-amber-600">{grandTotal} {currency}</span>
              </div>
            </div>

            {/* Main WhatsApp Button */}
            <button
              onClick={handleSendOrder}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer active:scale-98"
            >
              <Send className="w-5 h-5" />
              <span className="text-sm">
                {isAr ? 'إرسال الطلب عبر الواتساب مباشرة' : 'Send Order via WhatsApp'}
              </span>
            </button>
          </div>
        )}
      </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
