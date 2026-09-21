import { useState, useEffect, useCallback, useRef } from 'react';

const ADMIN_SESSION_KEY = 'tutti_admin_session';
const ADMIN_PIN_KEY = 'tutti_admin_pin';
const DEFAULT_PIN = '1234';
const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes

export type AppMode = 'customer' | 'admin';

interface AdminSession {
  token: string;
  loginTime: number;
}

export function useAppMode() {
  const [appMode, setAppMode] = useState<AppMode>('customer');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Ref to track logo double clicks
  const lastLogoTapRef = useRef<number>(0);

  // Get current stored PIN or fallback
  const getStoredPin = useCallback(() => {
    return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
  }, []);

  // Check validity of stored session
  const checkSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!raw) return false;
      const session: AdminSession = JSON.parse(raw);
      const now = Date.now();
      if (now - session.loginTime < SESSION_TIMEOUT_MS) {
        return true;
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        return false;
      }
    } catch {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
  }, []);

  // Initialize mode from URL or session
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    const hasAdminHash = window.location.hash === '#admin';
    const isSessionValid = checkSession();

    if (isSessionValid) {
      setAppMode('admin');
    } else if (modeParam === 'admin' || hasAdminHash) {
      // User directly navigated to admin mode URL, open PIN modal
      setIsLoginModalOpen(true);
    } else {
      setAppMode('customer');
    }
  }, [checkSession]);

  // Periodic check for session expiration (every 1 minute)
  useEffect(() => {
    if (appMode !== 'admin') return;

    const interval = setInterval(() => {
      if (!checkSession()) {
        setAppMode('customer');
        setIsLoginModalOpen(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [appMode, checkSession]);

  // Login handler
  const login = useCallback((inputPin: string): boolean => {
    const validPin = getStoredPin();
    if (inputPin.trim() === validPin) {
      const session: AdminSession = {
        token: 'auth_' + Math.random().toString(36).substring(2),
        loginTime: Date.now(),
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setAppMode('admin');
      setIsLoginModalOpen(false);
      setLoginError(null);
      return true;
    } else {
      setLoginError('pin_incorrect');
      return false;
    }
  }, [getStoredPin]);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAppMode('customer');
    setIsLoginModalOpen(false);

    // Clean up URL mode parameter if present without full reload
    const url = new URL(window.location.href);
    if (url.searchParams.get('mode') === 'admin') {
      url.searchParams.delete('mode');
      window.history.replaceState({}, '', url.toString());
    }
    if (window.location.hash === '#admin') {
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Change PIN handler
  const updatePin = useCallback((newPin: string) => {
    if (newPin && newPin.trim().length >= 4) {
      localStorage.setItem(ADMIN_PIN_KEY, newPin.trim());
      return true;
    }
    return false;
  }, []);

  // Double tap handler for logo / header secret entry
  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    if (now - lastLogoTapRef.current < 400) {
      // Double tap detected!
      if (appMode === 'admin') {
        // Already admin
      } else {
        setIsLoginModalOpen(true);
      }
      lastLogoTapRef.current = 0;
    } else {
      lastLogoTapRef.current = now;
    }
  }, [appMode]);

  return {
    appMode,
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginError,
    setLoginError,
    login,
    logout,
    updatePin,
    handleLogoClick,
    currentPin: getStoredPin(),
  };
}
