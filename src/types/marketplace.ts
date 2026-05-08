export interface Product {
  id: string | number;
  name: string;
  category: string;
  image: string;
  badges: {
    healthSafe: boolean;
    aiRecommended: boolean;
  };
  tags: string[];
  calories: number;
  protein: number;
  price: number;
  stok: number | null;
}

export interface CartItem extends Product {
  quantity: number;
}
