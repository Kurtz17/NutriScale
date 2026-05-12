'use client';

import AdminHeader from '@/components/admin/layout/admin-header';
import DeleteConfirmModal from '@/components/admin/products/delete-confirm-modal';
import ProductFilters from '@/components/admin/products/product-filters';
import ProductFormModal from '@/components/admin/products/product-form-modal';
import ProductTable, {
  type Produk,
} from '@/components/admin/products/product-table';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // State modal form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<Produk | null>(null);

  // State modal hapus
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Produk | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products ?? data ?? []);
    } catch {
      toast.error('Gagal memuat data produk.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Buka modal tambah
  function handleTambah() {
    setEditData(null);
    setIsFormOpen(true);
  }

  // Buka modal edit
  function handleEdit(produk: Produk) {
    setEditData(produk);
    setIsFormOpen(true);
  }

  // Buka modal hapus
  function handleDeleteClick(produk: Produk) {
    setDeleteTarget(produk);
    setIsDeleteOpen(true);
  }

  // Eksekusi hapus
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success(`${deleteTarget.name} berhasil dihapus!`);
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      await fetchProducts();
    } catch {
      toast.error('Gagal menghapus produk. Pastikan API sudah berjalan.');
    } finally {
      setIsDeleting(false);
    }
  }

  // Setelah form berhasil submit
  async function handleFormSuccess(message: string) {
    toast.success(message);
    await fetchProducts();
  }

  const kategoriOptions = useMemo(() => {
    const all = products.map((p) => p.category).filter((k): k is string => !!k);
    return [...new Set(all)].sort();
  }, [products]);

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
        {/* Stats */}
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

        {/* Filter + Tombol Tambah */}
        <div className="flex items-center gap-3 mb-6">
          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            selectedKategori={selectedKategori}
            onKategoriChange={setSelectedKategori}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            kategoriOptions={kategoriOptions}
          />
          <button
            onClick={handleTambah}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shrink-0"
          >
            <span className="text-lg leading-none">+</span>
            Tambah Produk
          </button>
        </div>

        {/* Tabel */}
        <ProductTable
          data={filteredProducts}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Modal Form */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        editData={editData}
      />

      {/* Modal Hapus */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        productName={deleteTarget?.name ?? ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
