"use client";

import { Button } from "@/components/ui/button";

interface MenuFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function MenuFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: MenuFilterProps) {
  return (
    <div className="sticky top-[73px] bg-muted/50 backdrop-blur-sm border-b z-10">
      <div className="container mx-auto px-4 py-4">
        <h2 className="text-lg font-semibold mb-2">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            onClick={() => onSelectCategory('All')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}