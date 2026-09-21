import React from 'react';
import { Language, RestaurantConfig } from '../../../types';
import { CheckCircle2, UtensilsCrossed, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  lang: Language;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  config,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl relative z-10"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label={isAr ? 'إغلاق' : 'Close'}
              className="absolute top-3 end-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 15 }}
              className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <div>
              <h2 className="font-extrabold text-lg text-slate-900">
                {isAr ? 'تم فتح تطبيق الواتساب لإرسال الطلب' : 'WhatsApp Order Opened'}
              </h2>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                {isAr
                  ? 'يرجى النقر على زر الإرسال داخل تطبيق الواتساب لتأكيد الطلب مع المطبخ مباشرة.'
                  : 'Please press Send inside WhatsApp to finalize your order directly with our staff.'}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 font-medium flex items-center gap-2 text-start">
              <UtensilsCrossed className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                {isAr
                  ? 'سيقوم فريق العمل بتجهيز طلبك فور استلام رسالتك على الواتساب!'
                  : 'Our team will start preparing your meal as soon as your message is received!'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              {isAr ? 'حسناً، العودة للمنيو' : 'Back to Menu'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
