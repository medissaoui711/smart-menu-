import { useState, useCallback } from 'react';
import { MenuItem } from '../types';

export function useAppNavigation() {
  // UI Navigation & Search state
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQrGeneratorOpen, setIsQrGeneratorOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'faq' | 'privacy' | 'terms' | null>(null);
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'search' | 'cart' | 'menu' | 'qr'>('home');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  const handleOpenCart = useCallback(() => {
    setIsCartOpen(true);
    setActiveBottomTab('cart');
  }, []);

  const handleCloseCart = useCallback(() => {
    setIsCartOpen(false);
    setActiveBottomTab((prev) => (prev === 'cart' ? 'home' : prev));
  }, []);

  const handleBottomTabSelect = useCallback((tab: 'home' | 'search' | 'cart' | 'menu' | 'qr') => {
    setActiveBottomTab(tab);

    if (tab === 'home') {
      setIsAdminOpen(false);
      setIsMobileSidebarOpen(false);
      setIsQrGeneratorOpen(false);
      setIsCartOpen(false);
      setSelectedItemForModal(null);
      setActiveCategoryId('all');
      setSearchQuery('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'search') {
      setIsAdminOpen(false);
      setIsMobileSidebarOpen(false);
      setIsQrGeneratorOpen(false);
      setIsCartOpen(false);
      setSelectedItemForModal(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) searchInput.focus();
    } else if (tab === 'cart') {
      setIsAdminOpen(false);
      setIsMobileSidebarOpen(false);
      setIsQrGeneratorOpen(false);
      setSelectedItemForModal(null);
      setIsCartOpen((prev) => !prev);
    } else if (tab === 'qr') {
      setIsAdminOpen(false);
      setIsMobileSidebarOpen(false);
      setIsCartOpen(false);
      setSelectedItemForModal(null);
      setIsQrGeneratorOpen(true);
    } else if (tab === 'menu') {
      setIsAdminOpen(false);
      setIsCartOpen(false);
      setIsQrGeneratorOpen(false);
      setSelectedItemForModal(null);
      setIsMobileSidebarOpen(true);
    }
  }, []);

  return {
    activeCategoryId,
    setActiveCategoryId,
    searchQuery,
    setSearchQuery,
    isCartOpen,
    setIsCartOpen,
    isAdminOpen,
    setIsAdminOpen,
    isQrGeneratorOpen,
    setIsQrGeneratorOpen,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    infoModalType,
    setInfoModalType,
    activeBottomTab,
    setActiveBottomTab,
    selectedItemForModal,
    setSelectedItemForModal,
    handleOpenCart,
    handleCloseCart,
    handleBottomTabSelect,
  };
}
