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

  const handleAddAll = () => {
    meal.items.forEach((item) => {
      if (!item.productId) return;

      const productToAdd = {
        id: item.productId,
        name: item.title,
        category: 'AI Recommendation',
        image: item.image || getMealIcon(),
        badges: { healthSafe: true, aiRecommended: true },
        tags: item.tags,
        calories: item.calories,
        protein: item.protein,
        price: item.price || 0,
        stok: 99,
      };

      addToCart(productToAdd, item.recommended_quantity || 1);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5 w-full flex flex-col justify-between">
      <div>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            {meal.type} Package
          </span>
          <span className="text-xl">{getMealIcon()}</span>
        </div>

        {/* TIME */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <Clock className="w-4 h-4" />
          <span>{meal.time}</span>
        </div>

        {/* TOTAL NUTRITION */}
        <div className="flex items-center gap-4 mt-4 text-sm bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center gap-1 text-gray-800 font-semibold">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{meal.totalCalories} kcal</span>
          </div>

          <div className="flex items-center gap-1 text-gray-800 font-semibold">
            <Drumstick className="w-4 h-4 text-amber-600" />
            <span>{meal.totalProtein}g protein</span>
          </div>
        </div>

        {/* ITEMS */}
        <div className="mt-4 space-y-3">
          {meal.items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl">
                {item.image &&
                (item.image.startsWith('http') ||
                  item.image.startsWith('/')) ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{item.image || getMealIcon()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {item.recommended_quantity} Porsi
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(
                      item.calories * (item.recommended_quantity || 1),
                    )}{' '}
                    kcal
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION */}
      {meal.items.some((item) => item.productId) && (
        <div className="mt-5 pt-4 flex items-center justify-between w-full">
          <div className="text-xs text-gray-500 flex flex-col">
            <span className="font-bold text-gray-800">
              {meal.items.length} Menu
            </span>
            <span>Rekomendasi AI</span>
          </div>
          <Button
            onClick={handleAddAll}
            size="sm"
            className="rounded-xl bg-black hover:bg-gray-800 text-white flex items-center gap-2 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Add All to Cart
          </Button>
        </div>
      )}
    </div>
  );
}
