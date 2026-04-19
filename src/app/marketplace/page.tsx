'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import ProductCard, {
  Product,
  mockProducts,
} from '@/components/ui/productCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Inter } from 'next/font/google';
import React, { useMemo, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

type CartItem = Product & {
  quantity: number;
};

export default function MarketplacePage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // State untuk Fitur Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Ambil daftar kategori
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(mockProducts.map((p) => p.category)),
    );
    return ['All', ...uniqueCategories];
  }, []);

  // Logika Saringan
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Logika Keranjang
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const totalCalories = cart.reduce(
    (total, item) => total + item.calories * item.quantity,
    0,
  );
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={`${inter.className} bg-[#e2eddb] min-h-screen`}>
      <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-6 lg:pt-10">
        <header className="mb-6 lg:mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-800">
            Health Marketplace
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Curated healthy foods & ingredients
          </p>
        </header>

        {/* Top Bar dengan Fitur Search & Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>
            <Input
              placeholder="Search products..."
              className="pl-10 w-full bg-white rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden sm:flex rounded-xl bg-white min-w-[100px]"
              >
                {selectedCategory === 'All' ? 'Filter' : selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuRadioGroup
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                {categories.map((category) => (
                  <DropdownMenuRadioItem
                    key={category}
                    value={category}
                    className="cursor-pointer"
                  >
                    {category}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="bg-black text-white relative rounded-xl hover:bg-gray-800">
            Cart
            {totalItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white border-none">
                {totalItemCount}
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Grid yang sudah Disaring */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                <span className="text-4xl mb-4">🕵️‍♂️</span>
                <h3 className="text-lg font-bold text-gray-800">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-fit">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Smart AI Cart Sidebar */}
          <Card className="w-full lg:w-[380px] rounded-3xl shadow-sm border-none h-fit sticky top-6 bg-white overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Smart AI Cart</CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 mb-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Calories
                </p>
                <p className="font-bold text-2xl text-black">
                  {totalCalories} kcal
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <span className="text-green-500">✓</span> Balanced selection
                </p>
              </div>

              <ScrollArea className="h-[380px] pr-4 -mr-4">
                <div className="flex flex-col gap-3 pb-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-10">
                      Your cart is empty
                    </p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border border-gray-100 p-3 rounded-2xl bg-white shadow-sm"
                      >
                        <div className="bg-gray-50 rounded-xl p-2 w-12 h-12 flex items-center justify-center shrink-0 border border-gray-100">
                          <span className="text-2xl">{item.image}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.calories * item.quantity} kcal
                          </p>
                          <p className="text-sm font-bold mt-1">
                            Rp {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <span className="text-sm font-medium">✕</span>
                          </button>
                          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-100">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md text-lg leading-none"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md text-lg leading-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <div className="px-6">
              <Separator />
            </div>

            <CardFooter className="flex-col pt-6 pb-6">
              <div className="flex justify-between w-full mb-4">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-bold text-lg">
                  Rp {subtotal.toLocaleString()}
                </span>
              </div>
              <Button className="w-full bg-[#1a1a1a] hover:bg-black text-white py-6 rounded-xl text-base font-medium transition-all">
                Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
