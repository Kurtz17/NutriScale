'use client';

import AdminHeader from '@/components/admin/layout/admin-header';
import ProductFilters from '@/components/admin/products/product-filters';
import ProductTable, {
  type Produk,
} from '@/components/admin/products/product-table';
import { useEffect, useMemo, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch data produk
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // sesuaikan dengan struktur response API project kamu
        setProducts(data.products ?? data ?? []);
      } catch (error) {
        console.error('Gagal fetch produk:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Ambil daftar kategori unik
  const kategoriOptions = useMemo(() => {
    const all = products.map((p) => p.category).filter((k): k is string => !!k);
    return [...new Set(all)].sort();
  }, [products]);

  // Filter data
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = search
        ? p.name?.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchKategori = selectedKategori
        ? p.category === selectedKategori
        : true;

      const matchStatus =
        selectedStatus === 'aktif'
          ? (p.stok ?? 0) > 0
          : selectedStatus === 'habis'
            ? (p.stok ?? 0) === 0
            : true;

      return matchSearch && matchKategori && matchStatus;
    });
  }, [products, search, selectedKategori, selectedStatus]);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader
        title="Product Catalog"
        subtitle="Kelola semua produk makanan NutriScale"
      />

      <div className="p-6">
        {/* Stats ringkas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-sm text-gray-500">Total Produk</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {products.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-sm text-gray-500">Produk Aktif</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {products.filter((p) => (p.stok ?? 0) > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-sm text-gray-500">Stok Habis</p>
            <p className="text-2xl font-bold text-red-500 mt-1">
              {products.filter((p) => (p.stok ?? 0) === 0).length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          selectedKategori={selectedKategori}
          onKategoriChange={setSelectedKategori}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          kategoriOptions={kategoriOptions}
        />

        {/* Tabel */}
        <ProductTable data={filteredProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}
