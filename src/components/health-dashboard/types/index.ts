export interface Stat {
  title: string;
  value: string;
  subtitle?: string;
  progress?: number;
  status?: string;
}

export interface Meal {
  productId?: string;
  image?: string;
  price?: number;
  recommended_quantity?: number;
  title: string;
  time: string;
  calories: number;
  protein: number;
  tags: string[];
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}
