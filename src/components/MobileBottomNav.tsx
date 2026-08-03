import React from 'react';
import { Home, Search, ShoppingCart, QrCode, LayoutGrid } from 'lucide-react';
import { Language } from '../types';

interface MobileBottomNavProps {
  activeTab: 'home' | 'search' | 'cart' | 'menu' | 'qr';
  onTabSelect: (tab: 'home' | 'search' | 'cart' | 'menu' | 'qr') => void;
  cartItemsCount: number;
  lang: Language;
  appMode?: 'customer' | 'admin';
}

interface NavTab {
  id: 'home' | 'search' | 'cart' | 'menu' | 'qr';
  labelAr: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabSelect,
  cartItemsCount,
  lang,
  appMode = 'customer',
}) => {
  const isAr = lang === 'ar';
  const isAdminMode = appMode === 'admin';

  const allNavItems: NavTab[] = [
    {
      id: 'home',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: Home,
    },
    {
      id: 'search',
      labelAr: 'البحث',
      labelEn: 'Search',
      icon: Search,
    },
    {
      id: 'cart',
      labelAr: 'السلة',
      labelEn: 'Cart',
      icon: ShoppingCart,
      badge: cartItemsCount,
    },
    {
      id: 'qr',
      labelAr: 'رمز QR',
      labelEn: 'QR Stands',
      icon: QrCode,
    },
    {
      id: 'menu',
      labelAr: 'الأقسام',
      labelEn: 'Categories',
      icon: LayoutGrid,
    },
  ];

  // In customer mode, hide the QR Stand tab for clean UX
  const navItems = allNavItems.filter((item) => {
    if (item.id === 'qr' && !isAdminMode) return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] md:hidden no-print pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = isAr ? item.labelAr : item.labelEn;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabSelect(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 cursor-pointer touch-manipulation active:scale-90 select-none ${
                isActive ? 'text-amber-600 font-black' : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              {/* Top active capsule indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-amber-500 rounded-b-full shadow-xs animate-in fade-in zoom-in-75 duration-150" />
              )}

              {/* Icon container with active soft circle background */}
              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-amber-100/90 text-amber-600 scale-105 shadow-2xs' : 'bg-transparent text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -end-2.5 bg-red-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Text label underneath */}
              <span className="text-[10px] mt-0.5 tracking-tight line-clamp-1 font-bold">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

