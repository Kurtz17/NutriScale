import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import React from 'react';

interface Product {
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
    <div className="bg-white rounded-3xl shadow p-4 flex flex-col gap-4">
      {/* Image Section */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-xl p-6">
          <span className="text-4xl">{product.image}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2">
        {product.badges.healthSafe && (
          <Badge className="bg-green-500 text-white">Health-Safe</Badge>
        )}
        {product.badges.aiRecommended && (
          <Badge className="bg-blue-500 text-white">AI Recommended</Badge>
        )}
      </div>

      {/* Title & Category */}
      <div>
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.category}</p>
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {product.tags.map((tag, index) => (
          <Badge
            key={index}
            className={`${
              tag === 'Tinggi Gula'
                ? 'border-red-500 text-red-500'
                : 'border-gray-300 text-gray-500'
            }`}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Nutrition Box */}
      <div className="bg-green-100/50 rounded-lg p-4 flex justify-between text-sm">
        <span>Calories: {product.calories}</span>
        <span>Protein: {product.protein}g</span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">Price</p>
          <p className="font-bold">Rp {product.price.toLocaleString()}</p>
        </div>
        <Button
          className="bg-black text-white rounded-lg"
          onClick={() => onAdd(product)}
        >
          + Add
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
