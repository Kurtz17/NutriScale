export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  calories: number;
  protein: number;
  image: string;
  tags: string[];
  isAIRecommended?: boolean;
}
export interface CartItem extends Product {
  quantity: number;
}
