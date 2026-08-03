import React from 'react';
import { RestaurantConfig } from '../types';

interface AppFooterProps {
  config: RestaurantConfig;
  isAr: boolean;
  setInfoModalType: (type: 'faq' | 'privacy' | 'terms' | null) => void;
}

export function AppFooter({ config, isAr, setInfoModalType }: AppFooterProps) {
  return (
    <footer className="mt-16 mb-24 sm:mb-8 pt-8 border-t border-slate-200">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-xs font-semibold text-slate-500">
        <button 
          onClick={() => setInfoModalType('faq')}
          className="hover:text-amber-600 transition-colors"
        >
          {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
        </button>
        <button 
          onClick={() => setInfoModalType('privacy')}
          className="hover:text-amber-600 transition-colors"
        >
          {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </button>
        <button 
          onClick={() => setInfoModalType('terms')}
          className="hover:text-amber-600 transition-colors"
        >
          {isAr ? 'شروط الاستخدام' : 'Terms of Use'}
        </button>
      </div>
      <div className="text-center mt-6 text-[10px] text-slate-400">
        © {new Date().getFullYear()} {isAr ? config.nameAr : config.nameEn}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
      </div>
    </footer>
  );
}
