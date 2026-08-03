import React from 'react';
import { CartItem, Language, MenuItem, RestaurantConfig } from '../types';
import { Plus, Minus, Star } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  config: RestaurantConfig;
  lang: Language;
  cartItem?: CartItem;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onOpenDetails: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = React.memo(({
  item,
  config,
  lang,
  cartItem,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
}) => {
  const isAr = lang === 'ar';
  const currency = isAr ? config.currencyAr : config.currencyEn;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 relative overflow-hidden group ${
        !item.isAvailable ? 'opacity-60 bg-slate-50' : ''
      }`}
    >
      {/* Out of Stock Overlay */}
      {!item.isAvailable && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <span className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
            {isAr ? 'غير متوفر حالياً' : 'Out of Stock'}
          </span>
        </div>
      )}

      {/* Main Content Info */}
      <div className="flex-1 cursor-pointer" onClick={() => onOpenDetails(item)}>
        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-1">
          {item.popularTag && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              {isAr ? 'الأكثر طلباً' : 'Popular'}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug group-hover:text-amber-600 transition-colors">
          {isAr ? item.nameAr : item.nameEn}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
          {isAr ? item.descriptionAr : item.descriptionEn}
        </p>

        {/* Price & Options Indicator */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="font-black text-amber-600 text-sm md:text-base">
            {item.price} {currency}
          </span>
          {item.options && item.options.length > 0 && (
            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
              {isAr ? 'خيارات متاحة' : 'Customizable'}
            </span>
          )}
        </div>
      </div>

      {/* Image & Action Controls */}
      <div className="flex flex-col items-center gap-2 relative">
        <div
          className="relative cursor-pointer overflow-hidden rounded-xl border border-slate-100 w-22 h-22 md:w-24 md:h-24 shadow-2xs"
          onClick={() => onOpenDetails(item)}
        >
          <img
            src={item.image}
            alt={item.nameAr}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        </div>

        {/* Add/Quantity Buttons */}
        {item.isAvailable && (
          <div className="w-full">
            {cartItem ? (
              <div className="flex items-center justify-between bg-amber-500 text-white rounded-xl px-1.5 py-1 text-xs font-bold shadow-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQuantity(cartItem.id, cartItem.quantity - 1);
                  }}
                  className="w-6 h-6 rounded-lg bg-amber-600 hover:bg-amber-700 flex items-center justify-center transition cursor-pointer active:scale-95 touch-manipulation"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-1">{cartItem.quantity}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQuantity(cartItem.id, cartItem.quantity + 1);
                  }}
                  className="w-6 h-6 rounded-lg bg-amber-600 hover:bg-amber-700 flex items-center justify-center transition cursor-pointer active:scale-95 touch-manipulation"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item);
                }}
                className="w-full bg-slate-900 hover:bg-amber-500 text-white py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition shadow-xs cursor-pointer group/btn active:scale-95 touch-manipulation"
              >
                <Plus className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
MenuItemCard.displayName = 'MenuItemCard';

