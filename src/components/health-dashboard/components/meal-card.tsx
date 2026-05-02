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

interface MealCardProps {
  meal: Meal;
  isChecked: boolean;
  onToggle: () => void;
}

export default function MealCard({ meal, isChecked, onToggle }: MealCardProps) {
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
    <div
      onClick={onToggle}
      className={`rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5 w-full cursor-pointer border-2 ${
        isChecked
          ? 'bg-green-50 border-green-400'
          : 'bg-white border-transparent'
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* CHECKBOX */}
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
              isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'
            }`}
          >
            {isChecked && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium text-gray-600">{meal.type}</span>
        </div>
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
            className={`text-xs px-3 py-1 rounded-full transition ${
              isChecked
                ? 'bg-green-100 text-green-700'
                : 'bg-[#E6F4EA] text-[#4B7F6B]'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CONSUMED LABEL */}
      {isChecked && (
        <p className="text-xs text-green-600 font-medium mt-3">
          ✓ Sudah dikonsumsi
        </p>
      )}
    </div>
  );
}
