export interface Product {
  id: string | number;
  name: string;
  category: string;
  image: string;
  badges?: {
    aiRecommended?: boolean;
  };
  tags: string[];
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugars: number;
  sodium: number;
  cholesterol: number;
  foodType: string;
  allergens: string[];
  ingredients?: string[];
  cookingMethod?: string;
  spicyLevel?: number;
  price: number;
  stok: number | null;
}

export interface CartItem extends Product {
  quantity: number;
}
