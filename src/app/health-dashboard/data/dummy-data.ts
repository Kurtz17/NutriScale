import { Meal, Stat } from '../types';

export const stats: Stat[] = [
  {
    title: 'WHO Z-Score (HAZ)',
    value: '+0.5 SD',
    status: 'Normal',
  },
  {
    title: 'Daily Calories',
    value: '1450 / 1800',
    progress: 81,
  },
  {
    title: 'Protein Intake',
    value: '45 / 60g',
    progress: 75,
  },
  {
    title: 'Health Status',
    value: 'Good Progress',
  },
];

export const meals: Meal[] = [
  {
    title: 'Oatmeal with Berries & Almonds',
    time: '7:00 - 9:00 AM',
    calories: 380,
    protein: 12,
    tags: ['High Fiber', 'Heart-Healthy'],
    type: 'Breakfast',
  },
  {
    title: 'Grilled Chicken with Quinoa & Vegetables',
    time: '12:00 - 2:00 PM',
    calories: 520,
    protein: 35,
    tags: ['High Protein', 'Balanced'],
    type: 'Lunch',
  },
  {
    title: 'Baked Salmon with Sweet Potato',
    time: '6:00 - 8:00 PM',
    calories: 450,
    protein: 32,
    tags: ['Omega-3', 'Low Carb'],
    type: 'Dinner',
  },
  {
    title: 'Greek Yogurt with Honey',
    time: '3:00 - 4:00 PM',
    calories: 150,
    protein: 15,
    tags: ['Protein Rich'],
    type: 'Snack',
  },
];
