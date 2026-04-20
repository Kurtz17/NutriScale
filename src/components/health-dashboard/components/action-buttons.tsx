'use client';

import { Plus, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ActionButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full">
      {/* LEFT */}
      <button
        onClick={() => router.push('/marketplace')}
        className="flex-1 flex items-center justify-center gap-3 bg-black text-white py-4 rounded-xl font-medium shadow-sm hover:bg-gray-900 hover:scale-[1.01] active:scale-[0.98] transition"
      >
        <ShoppingCart className="w-5 h-5" />
        Browse Health Marketplace
      </button>

      {/* RIGHT */}
      <button
        onClick={() => router.push('/health-assessment')}
        className="flex-1 flex items-center justify-center gap-3 border-2 border-black text-black py-4 rounded-xl font-medium bg-white hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.98] transition"
      >
        <Plus className="w-5 h-5" />
        Update Health Data
      </button>
    </div>
  );
}
