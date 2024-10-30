"use client";

import Image from 'next/image';
import { MenuItem as MenuItemType } from '@/types';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MenuItemProps {
  item: MenuItemType;
  quantity: number;
  onAddToCart: (item: MenuItemType) => void;
  onRemoveFromCart: (item: MenuItemType) => void;
}

export default function MenuItem({
  item,
  quantity,
  onAddToCart,
  onRemoveFromCart,
}: MenuItemProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="relative w-48 h-48">
            <Image
              src={item.imageUrl}
              alt={item.itemName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 p-6 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">{item.itemName}</h3>
              <p className="text-sm text-muted-foreground mb-1">{item.itemCategory}</p>
              <p className="text-lg font-bold text-primary">₹{item.itemCost}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              {quantity === 0 ? (
                <Button
                  onClick={() => onAddToCart(item)}
                  className="w-32"
                >
                  Add to Plate
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveFromCart(item)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold w-6 text-center">{quantity}</span>
                  <Button
                    size="icon"
                    onClick={() => onAddToCart(item)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}