import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import React from 'react';

// Tambah export di sini biar bisa dibaca sama page.tsx
export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  badges: { healthSafe: boolean; aiRecommended: boolean };
  tags: string[];
  calories: number;
  protein: number;
  price: number;
}

const ProductCard: React.FC<{
  product: Product;
  onAdd: (product: Product) => void;
}> = ({ product, onAdd }) => {
  return (
    <Card className="rounded-3xl border-none shadow-sm flex flex-col gap-4 p-4 bg-white">
      <CardContent className="p-0">
        <div className="flex justify-center">
          <div className="bg-gray-50 rounded-2xl w-full flex items-center justify-center py-8 border border-gray-100">
            <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
              {product.image}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {product.badges.healthSafe && (
            <Badge className="bg-green-500 text-white hover:bg-green-600">
              Health-Safe
            </Badge>
          )}
          {product.badges.aiRecommended && (
            <Badge className="bg-blue-500 text-white hover:bg-blue-600">
              AI Recommended
            </Badge>
          )}
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-gray-500 text-sm">{product.category}</p>
        </div>

        <div className="flex gap-2 flex-wrap mt-4">
          {product.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`${
                tag === 'High Sugar'
                  ? 'border-red-500 text-red-500'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="bg-green-100/50 rounded-lg p-4 flex justify-between text-sm mt-4">
          <span className="font-medium text-gray-700">
            Calories: {product.calories}
          </span>
          <span className="font-medium text-gray-700">
            Protein: {product.protein}g
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-0 justify-between mt-auto pb-2 items-center">
        <div className="flex flex-col">
          <p className="text-xs text-gray-500 mb-1">Price</p>
          <p className="font-bold text-base leading-none">
            Rp {product.price.toLocaleString()}
          </p>
        </div>
        <Button
          className="bg-black text-white rounded-xl hover:bg-gray-800"
          onClick={() => onAdd(product)}
        >
          + Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

// Data yang sempet dihilangin Copilot kita balikin ke sini
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Brown Rice',
    category: 'Grains',
    image: '🌾',
    badges: { healthSafe: true, aiRecommended: true },
    tags: ['Low Sodium', 'Whole Grain'],
    calories: 110,
    protein: 3,
    price: 25000,
  },
  {
    id: 2,
    name: 'Fresh Chicken Breast',
    category: 'Meat',
    image: '🍗',
    badges: { healthSafe: true, aiRecommended: false },
    tags: ['High Protein'],
    calories: 165,
    protein: 31,
    price: 45000,
  },
  {
    id: 3,
    name: 'Greek Yogurt',
    category: 'Dairy',
    image: '🥛',
    badges: { healthSafe: true, aiRecommended: true },
    tags: ['Low Fat', 'Probiotic'],
    calories: 59,
    protein: 10,
    price: 20000,
  },
  {
    id: 4,
    name: 'Salmon Fillet',
    category: 'Seafood',
    image: '🐟',
    badges: { healthSafe: true, aiRecommended: false },
    tags: ['Omega-3', 'High Protein'],
    calories: 208,
    protein: 22,
    price: 75000,
  },
  {
    id: 5,
    name: 'Sweet Potato',
    category: 'Vegetables',
    image: '🍠',
    badges: { healthSafe: true, aiRecommended: false },
    tags: ['High Fiber', 'Low Fat'],
    calories: 86,
    protein: 2,
    price: 15000,
  },
  {
    id: 6,
    name: 'Honey',
    category: 'Sweeteners',
    image: '🍯',
    badges: { healthSafe: true, aiRecommended: true },
    tags: ['Natural Sugar', 'High Sugar'],
    calories: 64,
    protein: 0,
    price: 30000,
  },
];
