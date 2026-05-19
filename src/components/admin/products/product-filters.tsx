'use client';

import { Input } from '@/components/ui/input';

type ProductFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedKategori: string;
  onKategoriChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  kategoriOptions: string[];
};

export default function ProductFilters({
  search,
  onSearchChange,
  selectedKategori,
  onKategoriChange,
  selectedStatus,
  onStatusChange,
  kategoriOptions,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
      {/* Search */}
      <div className="relative flex-1 w-full">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          type="text"
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-12 rounded-2xl border-none shadow-sm bg-white focus-visible:ring-green-500"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Filter Kategori */}
        <select
          value={selectedKategori}
          onChange={(e) => onKategoriChange(e.target.value)}
          className="px-4 py-2 bg-white border-none shadow-sm rounded-2xl text-sm font-black text-gray-700 focus:outline-none cursor-pointer h-12 min-w-[160px]"
        >
          <option value="">Semua Kategori</option>
          {kategoriOptions.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        {/* Filter Status */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 bg-white border-none shadow-sm rounded-2xl text-sm font-black text-gray-700 focus:outline-none cursor-pointer h-12 min-w-[140px]"
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="habis">Habis</option>
        </select>
      </div>
    </div>
  );
}
