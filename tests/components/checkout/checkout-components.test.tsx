import { CheckoutModals } from '@/components/checkout/checkout-modals';
import { OrderList } from '@/components/checkout/order-list';
import { PaymentSummary } from '@/components/checkout/payment-summary';
import { ShippingForm } from '@/components/checkout/shipping-form';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockCartItem } from '../../fixtures/marketplace';

describe('checkout components', () => {
  it('ShippingForm should render values, update fields, and toggle default address', () => {
    const onFormChange = vi.fn();
    const onToggleDefault = vi.fn();

    render(
      <ShippingForm
        formData={{ name: 'Nadia', phone: '0812', address: 'Jl. Mawar' }}
        useDefaultAddress={false}
        onToggleDefault={onToggleDefault}
        onFormChange={onFormChange}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Nama Penerima'), {
      target: { value: 'Rafi' },
    });
    fireEvent.click(screen.getByText('Gunakan Alamat Default'));

    expect(onFormChange).toHaveBeenCalledWith({
      name: 'Rafi',
      phone: '0812',
      address: 'Jl. Mawar',
    });
    expect(onToggleDefault).toHaveBeenCalledTimes(1);
  });

  it('PaymentSummary should calculate total and disable payment for an empty cart', () => {
    const onPayment = vi.fn();

    render(
      <PaymentSummary
        totalCalories={640}
        subtotal={50000}
        shipping={15000}
        cartLength={0}
        isPending={false}
        onPayment={onPayment}
      />,
    );

    expect(screen.getByText('640 kcal')).toBeTruthy();
    expect(screen.getByText('Rp 65.000')).toBeTruthy();
    expect(
      (
        screen.getByRole('button', {
          name: /Bayar Sekarang/i,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });

  it('OrderList should render cart item quantity and line total', () => {
    render(<OrderList items={[mockCartItem]} />);

    expect(screen.getByText('Daftar Pesanan')).toBeTruthy();
    expect(screen.getByText('Oatmeal Pisang')).toBeTruthy();
    expect(screen.getByText('2 pcs')).toBeTruthy();
    expect(screen.getByText('Rp 50.000')).toBeTruthy();
  });

  it('CheckoutModals should call confirm, cancel, and notification close handlers', () => {
    const onConfirmClose = vi.fn();
    const onProcessPayment = vi.fn();
    const onNotificationClose = vi.fn();

    render(
      <CheckoutModals
        isConfirmOpen
        onConfirmClose={onConfirmClose}
        onProcessPayment={onProcessPayment}
        notification={{
          isOpen: true,
          message: 'Keranjang belanja Anda kosong!',
          type: 'warning',
        }}
        onNotificationClose={onNotificationClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Batal/i }));
    fireEvent.click(screen.getByRole('button', { name: /Ya, Proses/i }));
    fireEvent.click(screen.getByRole('button', { name: /Mengerti/i }));

    expect(onConfirmClose).toHaveBeenCalledTimes(1);
    expect(onProcessPayment).toHaveBeenCalledTimes(1);
    expect(onNotificationClose).toHaveBeenCalledTimes(1);
  });
});
