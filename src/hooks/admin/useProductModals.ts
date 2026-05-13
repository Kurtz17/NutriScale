'use client';

import { Produk } from '@/types/admin/product';
import { useState } from 'react';

export function useProductModals() {
  // State modal form (Tambah/Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<Produk | null>(null);

  // State modal hapus
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Produk | null>(null);

  const openTambah = () => {
    setEditData(null);
    setIsFormOpen(true);
  };

  const openEdit = (produk: Produk) => {
    setEditData(produk);
    setIsFormOpen(true);
  };

  const openDelete = (produk: Produk) => {
    setDeleteTarget(produk);
    setIsDeleteOpen(true);
  };

  const closeModals = () => {
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setEditData(null);
    setDeleteTarget(null);
  };

  return {
    isFormOpen,
    setIsFormOpen,
    editData,
    isDeleteOpen,
    setIsDeleteOpen,
    deleteTarget,
    openTambah,
    openEdit,
    openDelete,
    closeModals,
  };
}
