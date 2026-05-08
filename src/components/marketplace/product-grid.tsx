import ProductCard from '@/components/ui/productCard';
import { Product } from '@/types/marketplace';
import { SearchX } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function ProductGrid({ products, onAdd }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 bg-white/40 rounded-[40px] border-2 border-dashed border-gray-200 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-full shadow-sm mb-6">
          <SearchX className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-black text-gray-800">No products found</h3>
        <p className="text-gray-500 font-medium mt-2 text-center max-w-[300px]">
          We couldn&apos;t find any products matching your current search or
          filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
