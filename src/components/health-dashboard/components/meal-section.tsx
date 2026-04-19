'use client';

import { meals } from '../data/dummy-data';
import MealCard from './meal-card';

export default function MealSection() {
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

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {meals.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))}
      </div>
    </div>
  );
}
