'use client';

import Link from 'next/link';

import { Meal } from '../types';
import MealCard from './meal-card';

interface MealSectionProps {
  meals: Meal[];
  activeDay: number;
  onDayChange: (day: number) => void;
  checkedMeals: Set<string>;
  onToggleMeal: (key: string) => void;
}

export default function MealSection({
  meals,
  activeDay,
  onDayChange,
  checkedMeals,
  onToggleMeal,
}: MealSectionProps) {
  if (meals.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            AI Meal Recommendations
          </h2>
          <p className="text-sm text-gray-500">
            Personalized meal suggestions based on your health profile
          </p>
        </div>
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <span className="text-5xl">🥗</span>
          <h3 className="text-lg font-semibold text-gray-700 mt-4">
            Belum ada rekomendasi makanan
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            Isi Health Assessment terlebih dahulu agar AI bisa membuat meal plan
            untukmu.
          </p>
          <Link
            href="/health-assessment"
            className="inline-block mt-6 px-6 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition"
          >
            Isi Health Assessment →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          AI Meal Recommendations
        </h2>
        <p className="text-sm text-gray-500">
          Personalized meal suggestions based on your health profile
        </p>
      </div>

      {/* DAY FILTER */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeDay === day
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {meals.map((meal, index) => {
          const mealKey = `${activeDay}-${meal.type}-${meal.title}`;
          return (
            <MealCard
              key={index}
              meal={meal}
              isChecked={checkedMeals.has(mealKey)}
              onToggle={() => onToggleMeal(mealKey)}
            />
          );
        })}
      </div>
    </div>
  );
}
