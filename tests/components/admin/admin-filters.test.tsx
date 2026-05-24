import { OrderFilters } from '@/components/admin/orders/OrderFilters';
import ProductFilters from '@/components/admin/products/product-filters';
import ProductTable from '@/components/admin/products/table/product-table';
import { UserFilterBar } from '@/components/admin/users/UserFilterBar';
import { Produk } from '@/types/admin/product';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const product: Produk = {
  id: 'prod-1',
  name: 'Oatmeal Pisang',
  category: 'Sarapan',
  calories: 320,
  protein: 12,
  price: 25000,
  stok: 5,
  label_risiko: 'LOW',
  image: 'OAT',
  tags: ['Low Sugar'],
};

describe('admin filters and tables', () => {
  it('ProductFilters should emit search, category, and status changes', () => {
    const onSearchChange = vi.fn();
    const onKategoriChange = vi.fn();
    const onStatusChange = vi.fn();

    render(
      <ProductFilters
        search=""
        onSearchChange={onSearchChange}
        selectedKategori=""
        onKategoriChange={onKategoriChange}
        selectedStatus=""
        onStatusChange={onStatusChange}
        kategoriOptions={['Sarapan']}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Cari nama produk...'), {
      target: { value: 'oat' },
    });
    fireEvent.change(screen.getByDisplayValue('Semua Kategori'), {
      target: { value: 'Sarapan' },
    });
    fireEvent.change(screen.getByDisplayValue('Semua Status'), {
      target: { value: 'habis' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('oat');
    expect(onKategoriChange).toHaveBeenCalledWith('Sarapan');
    expect(onStatusChange).toHaveBeenCalledWith('habis');
  });

  it('ProductTable should render loading, empty, and row action states', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const { rerender } = render(
      <ProductTable data={[]} isLoading onEdit={onEdit} onDelete={onDelete} />,
    );

    expect(screen.getByText('Menyinkronkan database...')).toBeTruthy();

    rerender(
      <ProductTable
        data={[]}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText('Produk Kosong')).toBeTruthy();

    rerender(
      <ProductTable
        data={[product]}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('Oatmeal Pisang')).toBeTruthy();
    fireEvent.click(screen.getByTitle('Edit Produk'));
    fireEvent.click(screen.getByTitle('Hapus Produk'));
    expect(onEdit).toHaveBeenCalledWith(product);
    expect(onDelete).toHaveBeenCalledWith(product);
  });

  it('UserFilterBar should emit search and status changes', () => {
    const onSearchChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <UserFilterBar
        searchQuery=""
        onSearchChange={onSearchChange}
        statusFilter="Semua"
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Cari nama atau email...'), {
      target: { value: 'nadia' },
    });
    fireEvent.change(screen.getByDisplayValue('Status: Semua'), {
      target: { value: 'Banned' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('nadia');
    expect(onStatusFilterChange).toHaveBeenCalledWith('Banned');
  });

  it('OrderFilters should emit search and status changes', () => {
    const onSearchChange = vi.fn();
    const onStatusChange = vi.fn();

    render(
      <OrderFilters
        searchQuery=""
        onSearchChange={onSearchChange}
        statusFilter="ALL"
        onStatusChange={onStatusChange}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Cari ID pesanan atau nama pengguna...'),
      { target: { value: 'ORD' } },
    );
    fireEvent.change(screen.getByDisplayValue('Status: Semua'), {
      target: { value: 'DIPROSES' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('ORD');
    expect(onStatusChange).toHaveBeenCalledWith('DIPROSES');
  });
});
