'use client';

import { type Produk } from '@/types/admin/product';
import { Loader2 } from 'lucide-react';

import { ProductTableRow } from './product-table-row';

type ProductTableProps = {
  data: Produk[];
  isLoading: boolean;
  onEdit: (produk: Produk) => void;
  onDelete: (produk: Produk) => void;
};

export default function ProductTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] border border-white/50 overflow-hidden shadow-sm">
        <div className="p-20 text-center text-gray-400">
          <Loader2 className="animate-spin w-10 h-10 text-[#7CB342] mx-auto mb-4" />
          <p className="font-bold text-sm uppercase tracking-widest animate-pulse">
            Menyinkronkan database...
          </p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-white/50 overflow-hidden shadow-sm">
        <div className="p-20 text-center text-gray-400">
          <p className="text-lg font-black text-[#1A1A1B]">Produk Kosong</p>
          <p className="text-sm mt-2 uppercase tracking-widest font-bold">
            Tidak ada data yang sesuai dengan filter kamu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-white/50 overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b-2 border-gray-50">
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-left">
                Produk
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Kategori
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Nutrisi
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Harga
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Stok
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((produk) => (
              <ProductTableRow
                key={produk.id}
                produk={produk}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Total Database:{' '}
          <span className="text-[#1A1A1B]">{data.length} Products</span>
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#7CB342] animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Live Sync Active
          </span>
        </div>
      </div>
    </div>
  );
}
