import { Plus } from 'lucide-react';

type ProductHeaderProps = {
  onAdd: () => void;
};

export function ProductHeader({ onAdd }: ProductHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-4xl font-black text-[#1A1A1B] tracking-tighter">
          Katalog Produk
        </h2>
        <p className="text-gray-500 font-medium mt-2">
          Kelola stok dan informasi produk makanan NutriScale
        </p>
      </div>
      <button
        onClick={onAdd}
        className="bg-[#1A1A1B] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
      >
        <Plus size={20} /> Tambah Produk
      </button>
    </div>
  );
}
