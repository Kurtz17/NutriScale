import { Produk } from '@/types/admin/product';
import { AlertCircle, Package, ShoppingBag } from 'lucide-react';

import { StatCard } from './stat-card';

type ProductStatsSectionProps = {
  products: Produk[];
};

export function ProductStatsSection({ products }: ProductStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Produk"
        value={products.length}
        icon={<ShoppingBag className="text-[#7CB342]" />}
        trend="Semua produk terdaftar"
      />
      <StatCard
        title="Produk Aktif"
        value={products.filter((p) => (p.stok ?? 0) > 0).length}
        icon={<Package className="text-[#7CB342]" />}
        trend="Tersedia di marketplace"
      />
      <StatCard
        title="Stok Habis"
        value={products.filter((p) => (p.stok ?? 0) === 0).length}
        icon={<AlertCircle className="text-red-500" />}
        trend="Perlu segera restock"
        isAlert
      />
    </div>
  );
}
