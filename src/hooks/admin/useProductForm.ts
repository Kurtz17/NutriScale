'use client';

import { type ProductFormData, type Produk } from '@/types/admin/product';
import { useEffect, useState } from 'react';

const emptyForm: ProductFormData = {
  name: '',
  category: '',
  calories: '',
  protein: '',
  harga: '',
  stok: '',
  label_risiko: '',
  image: '',
};

type UseProductFormProps = {
  editData?: Produk | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

export function useProductForm({
  editData,
  isOpen,
  onClose,
  onSuccess,
}: UseProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name ?? '',
        category: editData.category ?? '',
        calories: editData.calories?.toString() ?? '',
        protein: editData.protein?.toString() ?? '',
        harga: editData.price?.toString() ?? '',
        stok: editData.stok?.toString() ?? '',
        label_risiko: editData.label_risiko ?? '',
        image: editData.image ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [editData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('Nama produk wajib diisi.');
      return;
    }
    if (!form.harga || isNaN(Number(form.harga))) {
      setError('Harga harus berupa angka.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const url = isEdit
        ? `/api/admin/products/${editData?.id}`
        : `/api/admin/products`;
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaProduk: form.name,
          kategori: form.category,
          harga: Number(form.harga),
          stok: Number(form.stok),
          labelRisiko: form.label_risiko,
          gambar: form.image,
          nilaiGizi: {
            calories: Number(form.calories),
            protein: Number(form.protein),
          },
        }),
      });
      if (!res.ok) throw new Error();
      onSuccess(
        isEdit ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!',
      );
      onClose();
    } catch {
      setError('Gagal menyimpan data produk.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    isEdit,
    handleChange,
    handleSubmit,
  };
}
