import { useState, useCallback, useEffect } from 'react';
import { Language } from '../types';

export function useLanguage(initialLang: Language = 'en') {
  const [lang, setLang] = useState<Language>(initialLang);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  return {
    lang,
    setLang,
    isAr: lang === 'ar',
    toggleLanguage,
  };
}
