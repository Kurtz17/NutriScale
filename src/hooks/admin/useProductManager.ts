'use client';

import { Produk } from '@/types/admin/product';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useProductModals } from './useProductModals';

export function useProductManager() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtering States
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals Logic
  const modals = useProductModals();

  async function fetchProducts() {
    try {
      setIsLoading(true);
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

  async function handleDeleteConfirm() {
    if (!modals.deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${modals.deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast.success(`${modals.deleteTarget.name} berhasil dihapus!`);
      modals.closeModals();
      await fetchProducts();
    } catch {
      toast.error('Gagal menghapus produk.');
    } finally {
      setIsDeleting(false);
    }
  }

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

  return {
    // Data & Loading
    products,
    filteredProducts,
    isLoading,
    isDeleting,

    // Filters
    search,
    setSearch,
    selectedKategori,
    setSelectedKategori,
    selectedStatus,
    setSelectedStatus,
    kategoriOptions,

    // Modal State & Actions
    ...modals,

    // Event Handlers
    handleDeleteConfirm,
    handleFormSuccess,
  };
}
