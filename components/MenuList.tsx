"use client";

import { MenuItem as MenuItemType } from '@/types';
import MenuItem from './MenuItem';

interface MenuListProps {
  items: MenuItemType[];
  cartItems: { [key: string]: number };
  onAddToCart: (item: MenuItemType) => void;
  onRemoveFromCart: (item: MenuItemType) => void;
}

export default function MenuList({
  items,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
}: MenuListProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            quantity={cartItems[item.id] || 0}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
        ))}
      </div>
    </div>
  );
}