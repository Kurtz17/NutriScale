'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ui/productCard';
import { Inter } from 'next/font/google';
import React, { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  badges: { healthSafe: boolean; aiRecommended: boolean };
  tags: string[];
  calories: number;
  protein: number;
  price: number;
};

type CartItem = Product & {
  quantity: number;
};

const mockProducts = [
  {
    id: 1,
    name: 'Organic Brown Rice',
    category: 'Grains',
    image: '🌾',
    badges: { healthSafe: true, aiRecommended: true },
    tags: ['Low Sodium', 'Whole Grain'],
    calories: 110,
    protein: 3,
    price: 25000,
  },
  {
    id: 2,
    name: 'Fresh Chicken Breast',
    category: 'Meat',
    image: '🍗',
    badges: { healthSafe: true, aiRecommended: false },
    tags: ['High Protein'],
    calories: 165,
    protein: 31,
    price: 45000,
  },
  {
    id: 3,
    name: 'Greek Yogurt',
    category: 'Dairy',
    image: '🥛',
    badges: { healthSafe: true, aiRecommended: true },
    tags: ['Low Fat', 'Probiotic'],
    calories: 59,
    protein: 10,
    price: 20000,
  },
  {
    id: 4,
    name: 'Salmon Fillet',
    category: 'Seafood',
    image: '🐟',
    badges: { healthSafe: true, aiRecommended: false },
    tags: ['Omega-3', 'High Protein'],
    calories: 208,
    protein: 22,
    price: 75000,
  },
  {
    id: 5,
    name: 'Sweet Potato',
    category: 'Vegetables',
    image: '🍠',
    badges: { healthSafe: true, aiRecommended: false },
    tags: ['High Fiber', 'Low Fat'],
    calories: 86,
    protein: 2,
    price: 15000,
  },
  {
    id: 6,
    name: 'Honey',
    category: 'Sweeteners',
    image: '🍯',
    badges: { healthSafe: true, aiRecommended: true },
    tags: ['Natural Sugar', 'Tinggi Gula'],
    calories: 64,
    protein: 0,
    price: 30000,
  },
];

export default function MarketplacePage() {
  // State untuk nyimpen barang di keranjang
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fungsi tambah ke keranjang
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

  // Fungsi kurangin barang di keranjang
  const handleRemove = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQ = item.quantity + delta;
          return newQ > 0 ? { ...item, quantity: newQ } : item;
        }
        return item;
      }),
    );
  };

  // Hitungan Otomatis
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCalories = cart.reduce(
    (sum, item) => sum + item.calories * item.quantity,
    0,
  );
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className={`${inter.className} bg-[#e2eddb] min-h-screen`}>
      {/* Container Pembatas Lebar */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-6 lg:pt-10">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-800">
            Health Marketplace
          </h1>
          <p className="text-gray-500 font-medium text-sm lg:text-base">
            Curated healthy foods & ingredients
          </p>
        </header>

        {/* Top Bar */}
        <div className="flex items-center gap-2 lg:gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>
            <Input
              placeholder="Search products..."
              className="pl-10 w-full rounded-xl"
            />
          </div>
          <Button variant="outline" className="rounded-xl hidden sm:flex">
            Filter
          </Button>
          <Button className="bg-black text-white relative rounded-xl">
            Cart
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white hover:bg-blue-600">
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>

        {/* Main Content (Sudah Responsif) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 flex-1 h-fit">
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => handleAddToCart(product)}
              />
            ))}
          </div>

          {/* Smart AI Cart Sidebar */}
          <aside className="w-full lg:w-[350px] bg-white rounded-3xl shadow-sm p-5 border border-gray-100 h-fit sticky top-6">
            <h2 className="font-bold text-lg mb-4">Smart AI Cart</h2>

            <div className="bg-blue-50/50 rounded-2xl p-4 mb-6 border border-blue-100">
              <p className="text-sm font-medium text-gray-600">
                Total Calories
              </p>
              <p className="font-bold text-xl text-black">
                {totalCalories} kcal
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="text-green-500">✓</span> Balanced selection
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">
                  Your cart is empty
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border border-gray-100 p-2.5 rounded-2xl bg-white"
                  >
                    <div className="bg-gray-50 rounded-xl p-2 w-12 h-12 flex items-center justify-center">
                      <span className="text-xl">{item.image}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.calories} kcal × {item.quantity}
                      </p>
                      <p className="text-sm font-bold mt-0.5">
                        Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-400 hover:text-red-600 px-1"
                      >
                        <span className="text-sm">✕</span>
                      </button>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => handleQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md"
                        >
                          -
                        </button>
                        <span className="text-xs font-medium w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="font-bold text-lg">
                  Rp {subtotal.toLocaleString()}
                </span>
              </div>
              <Button className="w-full bg-[#1a1a1a] hover:bg-black text-white py-6 rounded-xl text-base">
                Checkout
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
