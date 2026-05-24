import { CartItem, Product } from '@/types/marketplace';

export const mockProduct: Product = {
  id: 'prod-1',
  name: 'Oatmeal Pisang',
  category: 'Sarapan',
  image: 'OAT',
  badges: {
    healthSafe: true,
    aiRecommended: true,
  },
  tags: ['Low Sugar', 'High Fiber'],
  calories: 320,
  protein: 12,
  price: 25000,
  stok: 5,
};

export const mockSecondProduct: Product = {
  id: 'prod-2',
  name: 'Salad Ayam',
  category: 'Makan Siang',
  image: 'SALAD',
  badges: {
    healthSafe: true,
    aiRecommended: false,
  },
  tags: ['Protein'],
  calories: 450,
  protein: 32,
  price: 42000,
  stok: 10,
};

export const mockCartItem: CartItem = {
  ...mockProduct,
  quantity: 2,
};
