import React, { useState, useEffect } from 'react';
import { CartItemOptionChoice, Language, MenuItem, RestaurantConfig } from '../types';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ItemModalProps {
  item: MenuItem | null;
  config: RestaurantConfig;
  lang: Language;
  onClose: () => void;
  onAddToCartWithOptions: (
    item: MenuItem,
    quantity: number,
    selectedOptions: CartItemOptionChoice[],
    itemNotes: string
  ) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  item,
  config,
  lang,
  onClose,
  onAddToCartWithOptions,
}) => {
  const isAr = lang === 'ar';
  const currency = isAr ? config.currencyAr : config.currencyEn;

  const [quantity, setQuantity] = useState(1);
  const [itemNotes, setItemNotes] = useState('');
  
  // State for selected choices per option id
  const [selectedChoices, setSelectedChoices] = useState<Record<string, { choiceName: string; price: number }>>({});

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setItemNotes('');
      const initial: Record<string, { choiceName: string; price: number }> = {};
      if (item.options) {
        item.options.forEach((opt) => {
          if (opt.required && opt.choices.length > 0) {
            initial[opt.id] = {
              choiceName: isAr ? opt.choices[0].nameAr : opt.choices[0].nameEn,
              price: opt.choices[0].price,
            };
          }
        });
      }
      setSelectedChoices(initial);
    }
  }, [item, isAr]);

  // Calculate unit price with options
  const extraPrice = (Object.values(selectedChoices) as Array<{ choiceName: string; price: number }>).reduce(
    (acc, c) => acc + (c?.price || 0),
    0
  );

  const finalUnitPrice = (item?.price || 0) + extraPrice;
  const totalPrice = finalUnitPrice * quantity;

  const handleSelectChoice = (optionId: string, choiceName: string, choicePrice: number) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [optionId]: { choiceName, price: choicePrice },
    }));
  };

  const handleAdd = () => {
    if (!item) return;
    const optionsArray: CartItemOptionChoice[] = [];
    if (item.options) {
      item.options.forEach((opt) => {
        const selected = selectedChoices[opt.id];
        if (selected) {
          optionsArray.push({
            optionTitle: isAr ? opt.titleAr : opt.titleEn,
            choiceName: selected.choiceName,
            price: selected.price,
          });
        }
      });
    }

    onAddToCartWithOptions(item, quantity, optionsArray, itemNotes);
    onClose();
  };

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
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
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
            className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10"
          >
            {/* Mobile Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden absolute top-0 z-40">
              <div className="w-12 h-1.5 bg-white/40 rounded-full backdrop-blur-md"></div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label={isAr ? 'إغلاق' : 'Close'}
              className="absolute top-4 end-4 z-30 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Container (Scrollable) */}
            <div className="overflow-y-auto flex-1 flex flex-col hide-scrollbar">
              {/* Hero Image */}
              <div className="relative h-64 md:h-72 w-full bg-slate-100 shrink-0">
                <img src={item.image} alt={item.nameAr} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-5 start-5 end-5 text-white">
                  <h2 className="font-black text-2xl md:text-3xl drop-shadow-sm leading-tight">
                    {isAr ? item.nameAr : item.nameEn}
                  </h2>
                  <p className="text-amber-400 font-extrabold text-xl mt-1.5 drop-shadow-sm">
                    {finalUnitPrice} {currency}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-7 space-y-6 flex-1 bg-white">
                {/* Description */}
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    {isAr ? 'الوصف والتفاصيل' : 'Description'}
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium">
                    {isAr ? item.descriptionAr : item.descriptionEn}
                  </p>
                </div>

                {/* Options Section */}
                {item.options && item.options.length > 0 && (
                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    {item.options.map((opt) => (
                      <div key={opt.id} className="space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                          <span className="text-sm">{isAr ? opt.titleAr : opt.titleEn}</span>
                          {opt.required && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                              {isAr ? 'مطلوب' : 'Required'}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {opt.choices.map((choice, idx) => {
                            const choiceName = isAr ? choice.nameAr : choice.nameEn;
                            const isSelected = selectedChoices[opt.id]?.choiceName === choiceName;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectChoice(opt.id, choiceName, choice.price)}
                                className={`flex items-center justify-between p-3 rounded-2xl border text-sm font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-amber-500 bg-amber-50/50 text-amber-900 shadow-sm shadow-amber-500/10'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                      isSelected ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                                  </div>
                                  <span>{choiceName}</span>
                                </div>
                                {choice.price > 0 && (
                                  <span className="text-amber-600 font-black text-xs">
                                    +{choice.price} {currency}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Item Notes Input */}
                <div className="pt-4 border-t border-slate-100 pb-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    {isAr ? 'ملاحظات إضافية لهذا الطبق' : 'Special Instructions'}
                  </label>
                  <input
                    type="text"
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: بدون بصل، زيادة صوص، طهي جيد...' : 'e.g. No onion, extra sauce...'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer with Quantity & Add Button */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-3 sm:gap-4 shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] relative z-20">
              {/* Quantity Selector */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shadow-sm border border-slate-100"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>
                <span className="w-10 text-center font-black text-slate-900 text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shadow-sm border border-slate-100"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{isAr ? 'إضافة إلى السلة' : 'Add to Order'}</span>
                </div>
                <span className="bg-white/20 text-white px-3 py-1 rounded-xl text-xs sm:text-sm font-black backdrop-blur-sm">
                  {totalPrice} {currency}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
