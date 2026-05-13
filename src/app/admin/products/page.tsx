'use client';

import DeleteConfirmModal from '@/components/admin/products/form/delete-confirm-modal';
import ProductFormModal from '@/components/admin/products/form/product-form-modal';
import ProductFilters from '@/components/admin/products/product-filters';
import { ProductHeader } from '@/components/admin/products/product-header';
import { ProductStatsSection } from '@/components/admin/products/product-stats-section';
import ProductTable from '@/components/admin/products/table/product-table';
import { useProductManager } from '@/hooks/admin/useProductManager';

export default function AdminProductsPage() {
  const {
    products,
    filteredProducts,
    isLoading,
    kategoriOptions,
    search,
    setSearch,
    selectedKategori,
    setSelectedKategori,
    selectedStatus,
    setSelectedStatus,
    isFormOpen,
    setIsFormOpen,
    editData,
    isDeleteOpen,
    setIsDeleteOpen,
    deleteTarget,
    isDeleting,
    openTambah,
    openEdit,
    openDelete,
    handleDeleteConfirm,
    handleFormSuccess,
  } = useProductManager();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <ProductHeader onAdd={openTambah} />

      {/* Stats Section */}
      <ProductStatsSection products={products} />

      {/* Main Content Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-2xl text-[#1A1A1B] tracking-tight">
              Database Produk
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              List & Filter Persediaan
            </p>
          </div>
          <div className="flex-1 max-w-2xl">
            <ProductFilters
              search={search}
              onSearchChange={setSearch}
              selectedKategori={selectedKategori}
              onKategoriChange={setSelectedKategori}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              kategoriOptions={kategoriOptions}
            />
          </div>
        </div>

        <ProductTable
          data={filteredProducts}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        editData={editData}
      />

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
