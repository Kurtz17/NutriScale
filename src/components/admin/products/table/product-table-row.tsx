import { formatHarga } from '@/lib/utils';
import { type Produk } from '@/types/admin/product';
import { Edit2, Trash2 } from 'lucide-react';

import { ProductInfoCell } from './product-info-cell';
import { NutritionDisplay, StockDisplay } from './product-table-cells';

type ProductTableRowProps = {
  produk: Produk;
  onEdit: (produk: Produk) => void;
  onDelete: (produk: Produk) => void;
};

export function ProductTableRow({
  produk,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  return (
    <tr className="hover:bg-[#F8FAF7]/50 transition-colors group">
      <td className="p-6">
        <ProductInfoCell
          name={produk.name}
          image={produk.image}
          stok={produk.stok}
          labelRisiko={produk.label_risiko}
        />
      </td>
      <td className="p-6 text-center">
        <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider">
          {produk.category ?? 'Uncategorized'}
        </span>
      </td>
      <td className="p-6 text-center">
        <NutritionDisplay calories={produk.calories} protein={produk.protein} />
      </td>
      <td className="p-6 text-center">
        <p className="text-sm font-black text-[#1A1A1B] font-mono">
          {formatHarga(produk.price)}
        </p>
      </td>
      <td className="p-6 text-center">
        <StockDisplay stok={produk.stok} />
      </td>
      <td className="p-6">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(produk)}
            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 active:scale-95 transition-all shadow-sm"
            title="Edit Produk"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(produk)}
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 active:scale-95 transition-all shadow-sm"
            title="Hapus Produk"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
