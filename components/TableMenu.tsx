"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MenuItem as MenuItemType, CartItem } from '@/types';
import MenuFilter from '@/components/MenuFilter';
import MenuList from '@/components/MenuList';
import Cart from '@/components/Cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Utensils } from 'lucide-react';
import useMenu from '@/hooks/useMenu';

export default function TableMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('tableNumber');
  
  const { 
    menuItems, 
    categories, 
    isLoading, 
    cartItems, 
    setCartItems, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    isCartOpen, 
    setIsCartOpen 
  } = useMenu();

  useEffect(() => {
    if (!tableNumber) {
      router.push('/?tableNumber=1');
      return;
    }

    if (!sessionStorage.getItem('isVerified')) {
      sessionStorage.setItem('isVerified', 'false');
    }
    sessionStorage.setItem('tableNumber', tableNumber);
  }, [tableNumber, router]);

  const filteredItems = menuItems
    .filter(item => item.isAvailable)
    .filter(item => 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCategory.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(item => selectedCategory === 'All' || item.itemCategory === selectedCategory);

  const cartItemsList: CartItem[] = Object.entries(cartItems)
    .map(([id, quantity]) => {
      const item = menuItems.find(item => item.id === id);
      return item ? { ...item, quantity } : null;
    })
    .filter((item): item is CartItem => item !== null);

  const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0);

  const handleAddToCart = (item: MenuItemType) => {
    setCartItems(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (item: MenuItemType | CartItem) => {
    setCartItems(prev => {
      const newQuantity = (prev[item.id] || 0) - 1;
      const newCart = { ...prev };
      if (newQuantity <= 0) {
        delete newCart[item.id];
      } else {
        newCart[item.id] = newQuantity;
      }
      return newCart;
    });
  };

  if (!tableNumber) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="bg-background border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold">Restaurant Menu</h1>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <Utensils className="h-5 w-5 mr-2" />
              Plate
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <MenuFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <MenuList
        items={filteredItems}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItemsList}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </main>
  );
}