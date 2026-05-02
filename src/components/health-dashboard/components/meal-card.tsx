'use client';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/useCartStore';
import { Clock, Drumstick, Flame, ShoppingCart } from 'lucide-react';

import { Meal } from '../types';

export default function MealCard({ meal }: { meal: Meal }) {
  const addToCart = useCartStore((state) => state.addToCart);

  // 🔹 emoji/icon berdasarkan tipe meal
  const getMealIcon = () => {
    switch (meal.type) {
      case 'Breakfast':
        return '🍳';
      case 'Lunch':
        return '🍗';
      case 'Dinner':
        return '🍽️';
      case 'Snack':
        return '🥜';
      default:
        return '🍴';
    }
  };

  const handleAdd = () => {
    if (!meal.productId) return;

    const productToAdd = {
      id: meal.productId,
      name: meal.title,
      category: 'AI Recommendation',
      image: meal.image || getMealIcon(),
      badges: { healthSafe: true, aiRecommended: true },
      tags: meal.tags,
      calories: meal.calories,
      protein: meal.protein,
      price: meal.price || 0,
      stok: 99,
    };

    addToCart(productToAdd, meal.recommended_quantity || 1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5 w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{meal.type}</span>

        <span className="text-xl">{getMealIcon()}</span>
      </div>

      {/* TITLE */}
      <h3 className="text-base font-semibold text-gray-800 leading-snug">
        {meal.title}
      </h3>

      {/* TIME */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
        <Clock className="w-4 h-4" />
        <span>{meal.time}</span>
      </div>

      {/* NUTRITION */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Flame className="w-4 h-4" />
          <span>{meal.calories} kcal</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <Drumstick className="w-4 h-4" />
          <span>{meal.protein}g protein</span>
        </div>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-4">
        {meal.tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs px-3 py-1 rounded-full bg-[#E6F4EA] text-[#4B7F6B]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ACTION */}
      {meal.productId && (
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500 flex flex-col">
            <span className="font-bold text-gray-800">
              {meal.recommended_quantity || 1} Porsi
            </span>
            <span>Rekomendasi AI</span>
          </div>
          <Button
            onClick={handleAdd}
            size="sm"
            className="rounded-xl bg-black hover:bg-gray-800 text-white flex items-center gap-2 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
}
