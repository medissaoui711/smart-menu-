import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  ShoppingCart,
  QrCode,
  Settings,
  Globe,
  MapPin,
  Phone,
  UtensilsCrossed,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Category, Language, RestaurantConfig } from '../types';

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (catId: string) => void;
  lang: Language;
  onToggleLanguage: () => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenQrGenerator: () => void;
  cartItemsCount: number;
  tableNumber: string | null;
  appMode?: 'customer' | 'admin';
}

export const MobileSidebarDrawer: React.FC<MobileSidebarDrawerProps> = ({
  isOpen,
  onClose,
  config,
  categories,
  activeCategoryId,
  onSelectCategory,
  lang,
  onToggleLanguage,
  onOpenCart,
  onOpenAdmin,
  onOpenQrGenerator,
  cartItemsCount,
  tableNumber,
  appMode = 'customer',
}) => {
  const isAr = lang === 'ar';
  const isAdminMode = appMode === 'admin';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden no-print">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />

          {/* Bottom Sheet Modal (iOS / Android Mobile Native Style) */}
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
            className="fixed inset-x-0 bottom-0 max-h-[88vh] w-full bg-slate-50 rounded-t-3xl shadow-2xl flex flex-col z-10 border-t border-slate-200"
          >
        {/* iOS Drag Handle */}
        <div className="pt-3 pb-1 w-full flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Mobile App Header Header */}
        <div className="bg-slate-900 text-white px-5 py-4 relative rounded-t-2xl mx-3 shrink-0 shadow-md">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 end-3.5 p-2 text-slate-300 hover:text-white rounded-full bg-slate-800/90 transition cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={config.logoUrl}
              alt={config.nameAr}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-500 shadow-md shrink-0 bg-white p-0.5"
            />
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base text-white truncate">
                  {isAr ? config.nameAr : config.nameEn}
                </h2>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[11px] text-amber-300/90 font-medium truncate">
                {isAr ? config.subtitleAr : config.subtitleEn}
              </p>
            </div>
          </div>

          {tableNumber && (
            <div className="mt-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-3 py-1.5 rounded-xl flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'جلسة طاولة جوال' : 'Mobile Table Session'}</span>
              </span>
              <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg font-black">
                #{tableNumber}
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Mobile App Screens & Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Section 1: Main Mobile App Screens Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAr ? 'شاشات التطبيق الرئيسية' : 'Main App Screens'}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Menu Home Screen Card */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  onClose();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-3 rounded-2xl border text-start transition flex flex-col justify-between gap-2 shadow-2xs active:scale-98 cursor-pointer ${
                  activeCategoryId === 'all'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold'
                    : 'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeCategoryId === 'all' ? 'bg-slate-950 text-amber-400' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  {isAr ? <ChevronLeft className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
                </div>
                <div>
                  <h3 className="font-bold text-xs">{isAr ? 'المنيو الرئيسي' : 'Full Menu'}</h3>
                  <p className="text-[10px] opacity-80 font-normal">{isAr ? 'تصفح كافة الأصناف' : 'All food items'}</p>
                </div>
              </button>

              {/* Cart & Order Screen Card */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="p-3 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-100 transition flex flex-col justify-between gap-2 shadow-2xs active:scale-98 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -end-1 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                  {isAr ? <ChevronLeft className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
                </div>
                <div>
                  <h3 className="font-bold text-xs">{isAr ? 'سلة الطلبات' : 'Cart & Order'}</h3>
                  <p className="text-[10px] text-slate-500 font-normal">
                    {cartItemsCount > 0 ? `${cartItemsCount} ${isAr ? 'عنصر بالطلب' : 'items added'}` : (isAr ? 'إرسال عبر الواتساب' : 'WhatsApp Checkout')}
                  </p>
                </div>
              </button>

              {/* Admin Mode Cards (Only shown if admin) */}
              {isAdminMode && (
                <>
                  {/* QR Stand Generator Screen Card */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenQrGenerator();
                    }}
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-100 transition flex flex-col justify-between gap-2 shadow-2xs active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <QrCode className="w-5 h-5" />
                      </div>
                      {isAr ? <ChevronLeft className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs">{isAr ? 'استندات QR' : 'QR Stand'}</h3>
                      <p className="text-[10px] text-slate-500 font-normal">{isAr ? 'رمز الطاولات والطباعة' : 'Table Stands'}</p>
                    </div>
                  </button>

                  {/* Admin Panel Screen Card */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 text-slate-800 hover:bg-slate-100 transition flex flex-col justify-between gap-2 shadow-2xs active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        <Settings className="w-5 h-5" />
                      </div>
                      {isAr ? <ChevronLeft className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs">{isAr ? 'إدارة المنيو' : 'Admin Panel'}</h3>
                      <p className="text-[10px] text-slate-500 font-normal">{isAr ? 'تعديل الأطباق والأسعار' : 'Manage Items'}</p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Interactive Categories Picker */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAr ? 'تصفح أصل الأقسام مباشرة' : 'Filter Categories'}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isSelected = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onClose();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs font-black'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg shrink-0">{cat.icon}</span>
                    <span className="truncate">{isAr ? cat.nameAr : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Language & Info */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onToggleLanguage}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 text-slate-800 transition text-xs font-bold shadow-2xs active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <span>{isAr ? 'تغيير لغة المنيو' : 'Switch Language'}</span>
              </div>
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl text-[11px] font-black">
                {isAr ? 'English' : 'العربية'}
              </span>
            </button>
          </div>

          {/* Branch Contact Details Card */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isAr ? config.addressAr : config.addressEn}</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-700">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span dir="ltr">{config.whatsappPhone}</span>
            </div>
          </div>
        </div>

        {/* Modal Sheet Footer */}
        <div className="p-3 bg-white border-t border-slate-200 text-center text-[10px] text-slate-400 font-bold shrink-0 rounded-b-3xl">
          {isAr ? 'تجربة تطبيق المنيو الذكي للهواتف الذكية' : 'Smart Native Mobile Menu Experience'}
        </div>
      </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

