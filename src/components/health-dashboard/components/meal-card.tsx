'use client';

import { Clock, Drumstick, Flame } from 'lucide-react';

interface Meal {
  title: string;
  time: string;
  calories: number;
  protein: number;
  tags: string[];
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export default function MealCard({ meal }: { meal: Meal }) {
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
    </div>
  );
}
