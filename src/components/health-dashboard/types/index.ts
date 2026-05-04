export interface Stat {
  title: string;
  value: string;
  subtitle?: string;
  progress?: number;
  status?: string;
}

export interface MealItem {
  productId?: string;
  image?: string;
  price?: number;
  recommended_quantity?: number;
  title: string;
  calories: number;
  protein: number;
  tags: string[];
}

export interface Meal {
  time: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  totalCalories: number;
  totalProtein: number;
  items: MealItem[];
}
