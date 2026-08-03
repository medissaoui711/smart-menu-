import React from 'react';
import { Language, RestaurantConfig } from '../types';
import { QrCode, Settings, Search, Globe, MapPin, Store, CheckCircle2, Menu } from 'lucide-react';

interface HeaderProps {
  config: RestaurantConfig;
  lang: Language;
  onLanguageToggle: () => void;
  onOpenAdmin: () => void;
  onOpenQrGenerator: () => void;
  onOpenMobileMenu?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tableNumber: string | null;
  appMode?: 'customer' | 'admin';
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  lang,
  onLanguageToggle,
  onOpenAdmin,
  onOpenQrGenerator,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  tableNumber,
  appMode = 'customer',
  onLogoClick,
}) => {
  const isAr = lang === 'ar';
  const isAdminMode = appMode === 'admin';

  return (
    <header className="bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-4 py-1.5 text-xs font-medium">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isAr ? 'مفتوح واستقبال الطلبات مباشر' : 'Open & Receiving Orders'}</span>
          </div>
          {tableNumber && (
            <div className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 text-white font-bold">
              <span>{isAr ? `طاولة رقم ${tableNumber}` : `Table #${tableNumber}`}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1 hover:opacity-80 transition cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-bold">{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Info */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Name - Double tap logo triggers PIN modal */}
          <div 
            onClick={onLogoClick} 
            className="flex items-center gap-3 cursor-pointer select-none group"
            title={isAr ? 'نقرتان للموظفين والإدارة' : 'Double tap for admin login'}
          >
            <img
              src={config.logoUrl}
              alt={config.nameAr}
              className="w-13 h-13 rounded-2xl object-cover border border-amber-200 shadow-xs group-active:scale-95 transition"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-lg md:text-xl text-slate-900 leading-tight">
                  {isAr ? config.nameAr : config.nameEn}
                </h1>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {isAr ? config.subtitleAr : config.subtitleEn}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span>{isAr ? config.addressAr : config.addressEn}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onOpenMobileMenu && (
              <button
                type="button"
                onClick={onOpenMobileMenu}
                className="md:hidden p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition flex items-center justify-center cursor-pointer shadow-xs"
                title={isAr ? 'القائمة الجانبية' : 'Menu'}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {isAdminMode && (
              <>
                <button
                  type="button"
                  onClick={onOpenQrGenerator}
                  className="hidden md:flex p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 text-slate-700 transition items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  title={isAr ? 'توليد واستندات QR' : 'QR Stands'}
                >
                  <QrCode className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'استندات QR' : 'QR Stands'}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hidden md:flex p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                  title={isAr ? 'لوحة التحكم' : 'Admin Panel'}
                >
                  <Settings className="w-4 h-4" />
                  <span>{isAr ? 'لوحة التحكم' : 'Admin'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isAr ? 'ابحث عن وجبة أو طبق...' : 'Search for a dish...'}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl ps-10 pe-4 py-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
