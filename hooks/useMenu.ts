"use client";

import { useState, useEffect } from 'react';
import { MenuItem as MenuItemType } from '@/types';

export default function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('https://tabulator-backend.vercel.app/api/menu');
        const data = await response.json();
        setMenuItems(data);
        
        const uniqueCategories = Array.from(
          new Set<string>(data.map((item: MenuItemType) => item.itemCategory))
        );
        setCategories(uniqueCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return {
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    isCartOpen,
    setIsCartOpen,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    isLoading
  };
}
