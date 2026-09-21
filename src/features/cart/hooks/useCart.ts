import { useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, CartItemOptionChoice, MenuItem } from '../../../types';

const CART_STORAGE_KEY = 'smart_menu_cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cartItems]);

  // Add simple item
  const handleAddToCart = useCallback((item: MenuItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (c) => c.menuItem.id === item.id && (!c.selectedOptions || c.selectedOptions.length === 0)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        const newCartItem: CartItem = {
          id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          menuItem: item,
          quantity: 1,
          unitPrice: item.price,
        };
        return [...prev, newCartItem];
      }
    });
  }, []);

  // Add item with custom options and notes
  const handleAddToCartWithOptions = useCallback(
    (
      item: MenuItem,
      quantity: number,
      selectedOptions: CartItemOptionChoice[],
      itemNotes: string
    ) => {
      const optionsExtra = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
      const unitPrice = item.price + optionsExtra;

      const newCartItem: CartItem = {
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        menuItem: item,
        quantity,
        selectedOptions,
        itemNotes,
        unitPrice,
      };

      setCartItems((prev) => [...prev, newCartItem]);
    },
    []
  );

  // Remove single item
  const handleRemoveCartItem = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((c) => c.id !== cartItemId));
  }, []);

  // Update item quantity
  const handleUpdateQuantity = useCallback(
    (cartItemId: string, newQty: number) => {
      if (newQty <= 0) {
        handleRemoveCartItem(cartItemId);
        return;
      }
      setCartItems((prev) =>
        prev.map((c) => (c.id === cartItemId ? { ...c, quantity: newQty } : c))
      );
    },
    [handleRemoveCartItem]
  );

  // Clear all items from cart
  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Total items count
  const totalItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    setCartItems,
    handleAddToCart,
    handleAddToCartWithOptions,
    handleRemoveCartItem,
    handleUpdateQuantity,
    handleClearCart,
    totalItemCount,
    subtotal,
  };
}
