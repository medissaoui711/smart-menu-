import React from 'react';
import { SearchX } from 'lucide-react';
import { MenuItemCard } from './MenuItemCard';
import { MenuItem, RestaurantConfig, CartItem } from '../types';

interface MenuContentProps {
  filteredItems: MenuItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAr: boolean;
  lang: 'ar' | 'en';
  cartItems: CartItem[];
  config: RestaurantConfig;
  handleAddToCart: (item: MenuItem) => void;
  handleUpdateQuantity: (id: string, delta: number) => void;
  setSelectedItemForModal: (item: MenuItem | null) => void;
}

export function MenuContent({
  filteredItems,
  searchQuery,
  setSearchQuery,
  isAr,
  lang,
  cartItems,
  config,
  handleAddToCart,
  handleUpdateQuantity,
  setSelectedItemForModal,
}: MenuContentProps) {
  return (
    <>
      {/* Active Filter Banner */}
      {searchQuery && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex justify-between items-center text-xs text-amber-900 font-semibold">
          <span>
            {isAr
              ? `نتائج البحث عن: "${searchQuery}" (${filteredItems.length} أصناف)`
              : `Search results for: "${searchQuery}" (${filteredItems.length} items)`}
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-amber-700 underline hover:text-amber-900 cursor-pointer"
          >
            {isAr ? 'مسح البحث' : 'Clear search'}
          </button>
        </div>
      )}

      {/* Empty state */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">
            {isAr ? 'لم يتم العثور على أي أطباق' : 'No items found'}
          </h3>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">
            {isAr
              ? 'جرب البحث بكلمة أخرى أو التبديل إلى قسم آخر في المنيو'
              : 'Try searching with a different term or select another category'}
          </p>
        </div>
      ) : (
        /* Grid of Menu Items */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {filteredItems.map((item) => {
            const cartItem = cartItems.find(
              (c) => c.menuItem.id === item.id && (!c.selectedOptions || c.selectedOptions.length === 0)
            );

            return (
              <MenuItemCard
                key={item.id}
                item={item}
                config={config}
                lang={lang}
                cartItem={cartItem}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                onOpenDetails={(selected) => setSelectedItemForModal(selected)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
