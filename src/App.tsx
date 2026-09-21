import React, { useMemo, useCallback, lazy, Suspense } from 'react';
import { useMenuState } from './hooks/useMenuState';
import { useLanguage } from './hooks/useLanguage';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useAppMode } from './hooks/useAppMode';

import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { MenuContent } from './components/MenuContent';
import { AppFooter } from './components/AppFooter';
import { FloatingCartButton } from './components/FloatingCartButton';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileSidebarDrawer } from './components/MobileSidebarDrawer';
import { SEO } from './components/SEO';
import { AdminBar } from './components/AdminBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { getFaqContent, getPrivacyContent, getTermsContent } from './data/policies';

// Lazy-loaded heavy components
const ItemModal = lazy(() => import('./components/ItemModal').then(m => ({ default: m.ItemModal })));
const CartDrawer = lazy(() => import('./components/CartDrawer').then(m => ({ default: m.CartDrawer })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const QrStandGenerator = lazy(() => import('./components/QrStandGenerator').then(m => ({ default: m.QrStandGenerator })));
const OrderSuccessModal = lazy(() => import('./components/OrderSuccessModal').then(m => ({ default: m.OrderSuccessModal })));
const InfoModal = lazy(() => import('./components/InfoModal'));

// Loading Fallback Component
const LazyFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs">
    <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
      <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-bold text-slate-700">جاري التحميل...</span>
    </div>
  </div>
);

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

      {/* Lazy Loaded Components Wrapped in Suspense */}
      <Suspense fallback={<LazyFallback />}>
        {/* Info Modals (FAQ, Privacy, Terms) */}
        {infoModalType !== null && (
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
        )}

        {/* Item Detail / Option Selector Modal */}
        {selectedItemForModal && (
          <ItemModal
            item={selectedItemForModal}
            config={config}
            lang={lang}
            onClose={() => setSelectedItemForModal(null)}
            onAddToCartWithOptions={handleAddToCartWithOptions}
          />
        )}

        {/* Live Cart & WhatsApp Checkout Drawer */}
        {isCartOpen && (
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
        )}

        {/* Admin Panel Control View */}
        {appMode === 'admin' && isAdminOpen && (
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

        {/* Printable QR Code Table Stand Generator */}
        {appMode === 'admin' && isQrGeneratorOpen && (
          <QrStandGenerator
            isOpen={isQrGeneratorOpen}
            onClose={() => setIsQrGeneratorOpen(false)}
            config={config}
            lang={lang}
          />
        )}

        {/* WhatsApp Order Sent Success Modal */}
        {isSuccessModalOpen && (
          <OrderSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            config={config}
            lang={lang}
          />
        )}
      </Suspense>

      {/* Admin PIN Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={login}
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
