import { CartItem, Product } from '@/types/marketplace';

export const mockProduct: Product = {
  id: 'prod-1',
  name: 'Oatmeal Pisang',
  category: 'Sarapan',
  image: 'OAT',
  badges: {},
  tags: ['Low Sugar', 'High Fiber'],
  calories: 320,
  protein: 12,
  fat: 5,
  carbs: 58,
  sugars: 8,
  sodium: 90,
  cholesterol: 0,
  foodType: 'carb',
  allergens: [],
  ingredients: ['oats', 'banana'],
  cookingMethod: 'boiled',
  spicyLevel: 0,
  price: 25000,
  stok: 5,
};

export const mockSecondProduct: Product = {
  id: 'prod-2',
  name: 'Salad Ayam',
  category: 'Makan Siang',
  image: 'SALAD',
  badges: {},
  tags: ['Protein'],
  calories: 450,
  protein: 32,
  fat: 12,
  carbs: 20,
  sugars: 3,
  sodium: 150,
  cholesterol: 70,
  foodType: 'protein',
  allergens: [],
  ingredients: ['chicken', 'lettuce', 'tomato'],
  cookingMethod: 'grilled',
  spicyLevel: 0,
  price: 42000,
  stok: 10,
};

export const mockCartItem: CartItem = {
  ...mockProduct,
  quantity: 2,
};
