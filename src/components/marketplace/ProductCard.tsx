'use client';
import { Product } from '@/types/marketplace';

export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
}) {
  return (
    <div className="bg-white relative z-10 rounded-[2rem] p-5 shadow-sm border border-gray-50 flex flex-col gap-3 hover:shadow-md transition-all">
      <div className="bg-gray-50 rounded-2xl h-40 flex items-center justify-center text-5xl p-4">
        {product.image}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <span className="bg-[#7CB342] text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
          Health-Safe
        </span>
        {product.isAIRecommended && (
          <span className="bg-[#4A90E2] text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
            AI Recommended
          </span>
        )}
      </div>

      <div>
        <h3 className="font-bold text-[#1A1A1B] leading-tight">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs font-medium">{product.category}</p>
      </div>

      <div className="flex gap-2 mb-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="border border-blue-200 text-blue-500 text-[9px] px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="bg-[#E1EEDD] rounded-xl p-3 grid grid-cols-2 gap-2 text-center">
        <div>
          <p className="text-gray-500 text-[9px] uppercase font-bold">
            Calories:
          </p>
          <p className="font-bold text-xs">{product.calories} kcal</p>
        </div>
        <div>
          <p className="text-gray-500 text-[9px] uppercase font-bold">
            Protein:
          </p>
          <p className="font-bold text-xs">{product.protein}g</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="font-black text-sm">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <button
          onClick={() => {
            onAddToCart(product);
            console.log('Menambahkan produk:', product.name);
          }}
          className="bg-[#1A1A1B] text-white w-10 h-8 relative z-30 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>
    </div>
  );
}
