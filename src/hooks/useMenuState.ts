import { useCallback } from 'react';
import { useMenu } from './useMenu';
import { useCart } from './useCart';

export function useMenuState() {
  const menu = useMenu();
  const cart = useCart();

  const handleResetToDefaults = useCallback(() => {
    menu.handleResetToDefaults();
    cart.handleClearCart();
  }, [menu, cart]);

  return {
    config: menu.config,
    setConfig: menu.setConfig,
    categories: menu.categories,
    setCategories: menu.setCategories,
    menuItems: menu.menuItems,
    setMenuItems: menu.setMenuItems,
    cartItems: cart.cartItems,
    handleResetToDefaults,
    handleAddToCart: cart.handleAddToCart,
    handleAddToCartWithOptions: cart.handleAddToCartWithOptions,
    handleRemoveCartItem: cart.handleRemoveCartItem,
    handleUpdateQuantity: cart.handleUpdateQuantity,
    handleClearCart: cart.handleClearCart,
    totalItemCount: cart.totalItemCount,
    subtotal: cart.subtotal,
  };
}
