import { useState, useEffect } from 'react';
import { RestaurantConfig } from '../types';

export function useAppInitialization(config: RestaurantConfig) {
  // Detect table number from URL query (e.g. ?table=5)
  const [tableNumberFromUrl, setTableNumberFromUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tbl = params.get('table');
      if (tbl) {
        setTableNumberFromUrl(tbl);
      }
    }
  }, []);

  // Synchronize PWA App Icon and favicon with current restaurant logo
  useEffect(() => {
    if (config?.logoUrl && typeof document !== 'undefined') {
      const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (appleIcon) {
        appleIcon.setAttribute('href', config.logoUrl);
      }
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.setAttribute('href', config.logoUrl);
      }
    }
  }, [config?.logoUrl]);

  return { tableNumberFromUrl };
}
