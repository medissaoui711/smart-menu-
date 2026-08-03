import React from 'react';
import { CartItem, Language, RestaurantConfig } from '../types';
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';

interface FloatingCartButtonProps {
  items: CartItem[];
  config: RestaurantConfig;
  lang: Language;
  onOpenCart: () => void;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = React.memo(({
  items,
  config,
  lang,
  onOpenCart,
}) => {
  if (items.length === 0) return null;

  const isAr = lang === 'ar';
  const currency = isAr ? config.currencyAr : config.currencyEn;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="fixed bottom-18 md:bottom-4 inset-x-4 max-w-lg mx-auto z-40 no-print animate-in slide-in-from-bottom-5 duration-300">
      <button
        type="button"
        onClick={onOpenCart}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-3.5 shadow-xl shadow-slate-900/30 border border-slate-700/50 flex items-center justify-between cursor-pointer transition active:scale-98 group touch-manipulation"
      >
        <div className="flex items-center gap-3">
          <div className="relative bg-amber-500 text-white w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-xs">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -end-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
              {totalQuantity}
            </span>
          </div>
          <div className="text-start">
            <span className="font-extrabold text-sm block">
              {isAr ? 'عرض الطلب' : 'View Order'}
            </span>
            <span className="text-[11px] text-slate-300">
              {totalQuantity} {isAr ? 'أصناف مختارة' : 'items selected'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-amber-400 text-base md:text-lg bg-slate-800/80 px-3 py-1 rounded-xl">
            {totalPrice} {currency}
          </span>
          {isAr ? (
            <ArrowLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          )}
        </div>
      </button>
    </div>
  );
});
FloatingCartButton.displayName = 'FloatingCartButton';

