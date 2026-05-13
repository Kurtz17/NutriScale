import { formatHarga } from '@/lib/utils';
import { type Produk } from '@/types/admin/product';
import { Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

import ProductStatusBadge from './product-status-badge';

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
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {produk.image &&
            (produk.image.startsWith('http') ||
              produk.image.startsWith('/')) ? (
              <Image
                src={produk.image}
                alt={produk.name ?? 'Produk'}
                width={48}
                height={48}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="text-2xl">
                {produk.image || produk.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-black text-[#1A1A1B] text-sm truncate max-w-[200px]">
              {produk.name ?? '-'}
            </p>
            <div className="mt-1">
              <ProductStatusBadge
                stok={produk.stok}
                labelRisiko={produk.label_risiko}
              />
            </div>
          </div>
        </div>
      </td>
      <td className="p-6 text-center">
        <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider">
          {produk.category ?? 'Uncategorized'}
        </span>
      </td>
      <td className="p-6 text-center">
        <div className="inline-block text-center space-y-1">
          <p className="text-xs font-bold text-gray-700">
            <span className="font-mono">{produk.calories ?? 0}</span>{' '}
            <span className="text-[10px] text-gray-400 uppercase">kkal</span>
          </p>
          <p className="text-[10px] font-bold text-[#7CB342] flex items-center justify-center gap-1">
            <span className="font-mono">{produk.protein ?? 0}</span>
            <span className="uppercase">gr Protein</span>
          </p>
        </div>
      </td>
      <td className="p-6 text-center">
        <p className="text-sm font-black text-[#1A1A1B] font-mono">
          {formatHarga(produk.price)}
        </p>
      </td>
      <td className="p-6 text-center">
        <div className="flex flex-col items-center">
          <span
            className={`text-sm font-black font-mono ${
              (produk.stok ?? 0) <= 5 ? 'text-red-500' : 'text-gray-700'
            }`}
          >
            {produk.stok ?? 0}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
            Available Unit
          </span>
        </div>
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
