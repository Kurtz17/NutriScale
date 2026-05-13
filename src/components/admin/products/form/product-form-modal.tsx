'use client';

import { useProductForm } from '@/hooks/admin/useProductForm';
import { type Produk } from '@/types/admin/product';

import { ProductFormActions } from './product-form-actions';
import { ProductFormFields } from './product-form-fields';
import { ErrorDisplay, ModalHeader } from './product-form-ui';

type ProductFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editData?: Produk | null;
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: ProductFormModalProps) {
  const {
    form,
    isLoading,
    error,
    isEdit,
    handleChange,
    handleAddTag,
    handleRemoveTag,
    handleSubmit,
  } = useProductForm({ editData, isOpen, onClose, onSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-[#1A1A1B]/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
        <ModalHeader
          title={isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
          subtitle="Informasi Nutrisi & Inventaris"
          onClose={onClose}
        />

        <div className="px-8 pt-6">
          <ErrorDisplay error={error} />
        </div>

        <ProductFormFields
          form={form}
          onChange={handleChange}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />

        <ProductFormActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
}
