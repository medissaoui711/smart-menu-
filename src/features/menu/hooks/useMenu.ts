import { useState, useEffect, useCallback, useMemo } from 'react';
import { Category, MenuItem, RestaurantConfig } from '../../../types';
import { initialCategories, initialMenuItems, initialRestaurantConfig } from '../../../data/initialMenuData';

const CONFIG_KEY = 'smart_menu_config';
const CATEGORIES_KEY = 'smart_menu_categories';
const ITEMS_KEY = 'smart_menu_items';
const CACHE_TIMESTAMP_KEY = 'smart_menu_cache_updated_at';

export function useMenu() {
  const [lastCacheUpdate, setLastCacheUpdate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      return saved ? Number(saved) : Date.now();
    } catch {
      return Date.now();
    }
  });

  // Config
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      return saved ? JSON.parse(saved) : initialRestaurantConfig;
    } catch (e) {
      console.error('Error parsing menu config from localStorage:', e);
      return initialRestaurantConfig;
    }
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_KEY);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch (e) {
      console.error('Error parsing categories from localStorage:', e);
      return initialCategories;
    }
  });

  // Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(ITEMS_KEY);
      return saved ? JSON.parse(saved) : initialMenuItems;
    } catch (e) {
      console.error('Error parsing menu items from localStorage:', e);
      return initialMenuItems;
    }
  });

  // Active Category & Search
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cache Invalidation Trigger
  const invalidateCache = useCallback(() => {
    const now = Date.now();
    setLastCacheUpdate(now);
    try {
      localStorage.setItem(CACHE_TIMESTAMP_KEY, String(now));
    } catch (e) {
      console.error('Error invalidating menu cache:', e);
    }
  }, []);

  // LocalStorage Persist Effects with Cache Invalidation
  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      invalidateCache();
    } catch (e) {
      console.error('Error saving config to localStorage:', e);
    }
  }, [config, invalidateCache]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      invalidateCache();
    } catch (e) {
      console.error('Error saving categories to localStorage:', e);
    }
  }, [categories, invalidateCache]);

  useEffect(() => {
    try {
      localStorage.setItem(ITEMS_KEY, JSON.stringify(menuItems));
      invalidateCache();
    } catch (e) {
      console.error('Error saving menu items to localStorage:', e);
    }
  }, [menuItems, invalidateCache]);

  // Reset Data to Defaults
  const handleResetToDefaults = useCallback(() => {
    setConfig(initialRestaurantConfig);
    setCategories(initialCategories);
    setMenuItems(initialMenuItems);
    localStorage.removeItem(CONFIG_KEY);
    localStorage.removeItem(CATEGORIES_KEY);
    localStorage.removeItem(ITEMS_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    setLastCacheUpdate(Date.now());
  }, []);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategoryId === 'all' || item.categoryId === selectedCategoryId;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.nameAr.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        (item.descriptionAr && item.descriptionAr.toLowerCase().includes(q)) ||
        (item.descriptionEn && item.descriptionEn.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategoryId, searchQuery]);

  return {
    config,
    setConfig,
    categories,
    setCategories,
    menuItems,
    setMenuItems,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    filteredMenuItems,
    handleResetToDefaults,
    lastCacheUpdate,
    invalidateCache,
  };
}
