import { useState, useEffect, useCallback } from 'react';
import { CartItem, CartItemOptionChoice, Category, MenuItem, RestaurantConfig } from '../types';
import { initialCategories, initialMenuItems, initialRestaurantConfig } from '../data/initialMenuData';

export function useMenuState() {
  // Persistent Restaurant Config
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    const saved = localStorage.getItem('smart_menu_config');
    try {
      return saved ? JSON.parse(saved) : initialRestaurantConfig;
    } catch (e) {
      console.error("Error parsing smart_menu_config from localStorage:", e);
      return initialRestaurantConfig;
    }
  });

  // Persistent Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('smart_menu_categories');
    try {
      return saved ? JSON.parse(saved) : initialCategories;
    } catch (e) {
      console.error("Error parsing smart_menu_categories from localStorage:", e);
      return initialCategories;
    }
  });

  // Persistent Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('smart_menu_items');
    try {
      return saved ? JSON.parse(saved) : initialMenuItems;
    } catch (e) {
      console.error("Error parsing smart_menu_items from localStorage:", e);
      return initialMenuItems;
    }
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('smart_menu_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('smart_menu_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('smart_menu_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('smart_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('smart_menu_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Reset to Defaults
  const handleResetToDefaults = useCallback(() => {
    setConfig(initialRestaurantConfig);
    setCategories(initialCategories);
    setMenuItems(initialMenuItems);
    setCartItems([]);
    localStorage.clear();
  }, []);

  // Cart Handlers
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
          id: 'cart_' + Date.now(),
          menuItem: item,
          quantity: 1,
          unitPrice: item.price,
        };
        return [...prev, newCartItem];
      }
    });
  }, []);

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
        id: 'cart_' + Date.now(),
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

  const handleRemoveCartItem = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((c) => c.id !== cartItemId));
  }, []);

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

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return {
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
  };
}
