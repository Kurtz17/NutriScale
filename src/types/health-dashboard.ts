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

export interface FoodItem {
  produk_id?: string;
  gambar?: string;
  harga?: number;
  nama_makanan: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  match_score: number;
  recommended_quantity?: number;
}

export interface MealPlanDetail {
  target_kalori_harian?: number;
  distribusi?: {
    protein_g?: number;
    fat_g?: number;
    carbs_g?: number;
  };
  narasiAI?: string;
  [key: string]: unknown; // For dynamic meal session keys
}

export interface DashboardData {
  stats: Stat[];
  meals: Meal[];
  narasiAI: string;
  targetCalories: number;
  targetProtein: number;
}
