import React, { useMemo, useCallback } from 'react';
import { useMenuState } from './hooks/useMenuState';
import { useLanguage } from './hooks/useLanguage';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useAppMode } from './hooks/useAppMode';

import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { MenuContent } from './components/MenuContent';
import { AppFooter } from './components/AppFooter';
import { ItemModal } from './components/ItemModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingCartButton } from './components/FloatingCartButton';
import { AdminPanel } from './components/AdminPanel';
import { QrStandGenerator } from './components/QrStandGenerator';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileSidebarDrawer } from './components/MobileSidebarDrawer';
import { SEO } from './components/SEO';
import { AdminBar } from './components/AdminBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import InfoModal from './components/InfoModal';
import { getFaqContent, getPrivacyContent, getTermsContent } from './data/policies';

export default function App() {
  const {
    config,
    setConfig,
    categories,
    setCategories,
    menuItems,
    setMenuItems,
    cartItems,
    handleResetToDefaults,
    handleAddToCart,
    handleAddToCartWithOptions,
    handleRemoveCartItem,
    handleUpdateQuantity,
    handleClearCart,
  } = useMenuState();

  const { lang, isAr, toggleLanguage } = useLanguage('en');
  const { tableNumberFromUrl } = useAppInitialization(config);

  const {
    appMode,
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    logout,
    updatePin,
    handleLogoClick,
    currentPin,
  } = useAppMode();

  const {
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
    handleOpenCart,
    handleCloseCart,
    handleBottomTabSelect,
    selectedItemForModal,
    setSelectedItemForModal,
  } = useAppNavigation();

  const handleOpenAdminGuard = useCallback(() => {
    if (appMode === 'admin') {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  }, [appMode, setIsAdminOpen, setIsLoginModalOpen]);

  const handleOpenQrGuard = useCallback(() => {
    if (appMode === 'admin') {
      setIsQrGeneratorOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  }, [appMode, setIsQrGeneratorOpen, setIsLoginModalOpen]);

  const handleOrderSentSuccess = useCallback(() => {
    handleClearCart();
    setIsCartOpen(false);
    setIsSuccessModalOpen(true);
  }, [handleClearCart, setIsCartOpen, setIsSuccessModalOpen]);

  // Memoized Category Counts Map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: menuItems.length };
    menuItems.forEach((item) => {
      counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
    });
    return counts;
  }, [menuItems]);

  const getCategoryCount = useCallback(
    (catId: string) => categoryCounts[catId] || 0,
    [categoryCounts]
  );

  // Filter menu items by category & search
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return menuItems.filter((item) => {
      const matchesCategory = activeCategoryId === 'all' || item.categoryId === activeCategoryId;
      const matchesSearch =
        !q ||
        item.nameAr.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.descriptionAr.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategoryId, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-['Cairo','Tajawal',sans-serif]">
      <SEO 
        title={`${isAr ? config.nameAr : config.nameEn} | ${isAr ? 'المنيو الرقمي' : 'Digital Menu'}`}
        description={isAr ? `تصفح قائمة الطعام الخاصة بـ ${config.nameAr} واطلب بكل سهولة.` : `Browse ${config.nameEn} menu and order with ease.`}
      />

      {/* Admin Mode Sticky Bar */}
      {appMode === 'admin' && (
        <AdminBar
          lang={lang}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenQrGenerator={() => setIsQrGeneratorOpen(true)}
          onLogout={logout}
          onUpdatePin={updatePin}
          currentPin={currentPin}
        />
      )}

      {/* PWA App Install Banner */}
      <PWAInstallBanner isAr={isAr} />

      {/* Sticky Top Header & Category Navigation */}
      <div className="sticky top-0 z-30 bg-white shadow-xs">
        <Header
          config={config}
          lang={lang}
          onLanguageToggle={toggleLanguage}
          onOpenAdmin={handleOpenAdminGuard}
          onOpenQrGenerator={handleOpenQrGuard}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tableNumber={tableNumberFromUrl}
          appMode={appMode}
          onLogoClick={handleLogoClick}
        />

        <CategoryNav
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
          lang={lang}
          getCategoryCount={getCategoryCount}
        />
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <MenuContent 
          filteredItems={filteredItems}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isAr={isAr}
          lang={lang}
          cartItems={cartItems}
          config={config}
          handleAddToCart={handleAddToCart}
          handleUpdateQuantity={handleUpdateQuantity}
          setSelectedItemForModal={setSelectedItemForModal}
        />
        <AppFooter config={config} isAr={isAr} setInfoModalType={setInfoModalType} />
      </main>

      {/* Info Modals (FAQ, Privacy, Terms) */}
      <InfoModal
        isOpen={infoModalType !== null}
        onClose={() => setInfoModalType(null)}
        lang={lang}
        title={
          infoModalType === 'faq' ? (isAr ? 'الأسئلة الشائعة' : 'FAQ') :
          infoModalType === 'privacy' ? (isAr ? 'سياسة الخصوصية' : 'Privacy Policy') :
          infoModalType === 'terms' ? (isAr ? 'شروط الاستخدام' : 'Terms of Use') : ''
        }
        content={
          infoModalType === 'faq' ? (
            <div className="space-y-6">
              {getFaqContent(lang).map((item, idx) => (
                <div key={idx}>
                  <h4 className="font-bold text-slate-800 mb-1">{item.q}</h4>
                  <p className="text-slate-600 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          ) : infoModalType === 'privacy' ? (
            <div className="whitespace-pre-line text-sm">{getPrivacyContent(lang)}</div>
          ) : infoModalType === 'terms' ? (
            <div className="whitespace-pre-line text-sm">{getTermsContent(lang)}</div>
          ) : null
        }
      />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartButton
        items={cartItems}
        config={config}
        lang={lang}
        onOpenCart={handleOpenCart}
      />

      {/* Item Detail / Option Selector Modal */}
      <ItemModal
        item={selectedItemForModal}
        config={config}
        lang={lang}
        onClose={() => setSelectedItemForModal(null)}
        onAddToCartWithOptions={handleAddToCartWithOptions}
      />

      {/* Live Cart & WhatsApp Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        items={cartItems}
        config={config}
        lang={lang}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        defaultTableNumber={tableNumberFromUrl}
        onOrderSent={handleOrderSentSuccess}
      />

      {/* Admin Panel Control View (Component Guarding - ONLY loaded in Admin mode) */}
      {appMode === 'admin' && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          config={config}
          onUpdateConfig={setConfig}
          categories={categories}
          onUpdateCategories={setCategories}
          menuItems={menuItems}
          onUpdateMenuItems={setMenuItems}
          lang={lang}
          onResetToDefaults={handleResetToDefaults}
        />
      )}

      {/* Printable QR Code Table Stand Generator (Component Guarding) */}
      {appMode === 'admin' && (
        <QrStandGenerator
          isOpen={isQrGeneratorOpen}
          onClose={() => setIsQrGeneratorOpen(false)}
          config={config}
          lang={lang}
        />
      )}

      {/* Admin PIN Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={login}
        lang={lang}
      />

      {/* WhatsApp Order Sent Success Modal */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        config={config}
        lang={lang}
      />

      {/* Mobile Sidebar Navigation Drawer */}
      <MobileSidebarDrawer
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        config={config}
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        lang={lang}
        onToggleLanguage={toggleLanguage}
        onOpenCart={handleOpenCart}
        onOpenAdmin={handleOpenAdminGuard}
        onOpenQrGenerator={handleOpenQrGuard}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        tableNumber={tableNumberFromUrl}
        appMode={appMode}
      />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeBottomTab}
        onTabSelect={handleBottomTabSelect}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        lang={lang}
        appMode={appMode}
      />
    </div>
  );
}
