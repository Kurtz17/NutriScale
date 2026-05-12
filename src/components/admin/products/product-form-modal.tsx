'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

import { type Produk } from './product-table';

type ProductFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editData?: Produk | null;
};

type FormData = {
  name: string;
  category: string;
  calories: string;
  protein: string;
  harga: string;
  stok: string;
  label_risiko: string;
  image: string;
};

const emptyForm: FormData = {
  name: '',
  category: '',
  calories: '',
  protein: '',
  harga: '',
  stok: '',
  label_risiko: '',
  image: '',
};

const kategoriOptions = [
  'Grains',
  'Vegetables',
  'Meat',
  'Seafood',
  'Dairy',
  'Dairy/Egg',
  'Fruits',
  'Legumes',
  'Nuts',
  'Beverages',
  'Snacks',
  'Other',
];

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: ProductFormModalProps) {
  const [form, setForm] = useState<FormData>(emptyForm);
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
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
      setError('Terjadi kesalahan. Pastikan API sudah berjalan.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <FormField label="Nama Produk" required>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Organic Brown Rice"
            />
          </FormField>

          <FormField label="Kategori">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white h-9"
            >
              <option value="">Pilih kategori</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kalori (kkal)">
              <Input
                type="number"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                placeholder="0"
              />
            </FormField>
            <FormField label="Protein (g)">
              <Input
                type="number"
                name="protein"
                value={form.protein}
                onChange={handleChange}
                placeholder="0"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Harga (Rp)" required>
              <Input
                type="number"
                name="harga"
                value={form.harga}
                onChange={handleChange}
                placeholder="0"
              />
            </FormField>
            <FormField label="Stok">
              <Input
                type="number"
                name="stok"
                value={form.stok}
                onChange={handleChange}
                placeholder="0"
              />
            </FormField>
          </div>

          <FormField label="Label Gizi / Risiko">
            <Input
              name="label_risiko"
              value={form.label_risiko}
              onChange={handleChange}
              placeholder="Contoh: Tinggi Serat, Rendah Lemak"
            />
          </FormField>

          <FormField label="URL Gambar">
            <Input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://... atau emoji 🍚"
            />
            <p className="text-xs text-gray-400 mt-1">
              Upload gambar akan diaktifkan setelah API Muel selesai.
            </p>
          </FormField>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading
              ? 'Menyimpan...'
              : isEdit
                ? 'Simpan Perubahan'
                : 'Tambah Produk'}
          </Button>
        </div>
      </div>
    </div>
  );
}
