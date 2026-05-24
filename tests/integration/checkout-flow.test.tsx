import { CheckoutModals } from '@/components/checkout/checkout-modals';
import { PaymentSummary } from '@/components/checkout/payment-summary';
import { ShippingForm } from '@/components/checkout/shipping-form';
import { NotificationState, ShippingAddress } from '@/types/checkout';
import { CartItem } from '@/types/marketplace';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { mockCartItem } from '../fixtures/marketplace';

function CheckoutHarness({
  cart,
  onProcessPayment,
}: {
  cart: CartItem[];
  onProcessPayment: () => void;
}) {
  const [formData, setFormData] = useState<ShippingAddress>({
    name: '',
    phone: '',
    address: '',
  });
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handlePayment = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      setNotification({
        isOpen: true,
        message:
          'Harap lengkapi nama, nomor telepon, dan alamat pengiriman terlebih dahulu.',
        type: 'warning',
      });
      return;
    }

    setIsConfirmOpen(true);
  };

  return (
    <>
      <ShippingForm
        formData={formData}
        useDefaultAddress={false}
        onToggleDefault={vi.fn()}
        onFormChange={setFormData}
      />
      <PaymentSummary
        totalCalories={640}
        subtotal={subtotal}
        shipping={15000}
        cartLength={cart.length}
        isPending={false}
        onPayment={handlePayment}
      />
      <CheckoutModals
        isConfirmOpen={isConfirmOpen}
        onConfirmClose={() => setIsConfirmOpen(false)}
        onProcessPayment={onProcessPayment}
        notification={notification}
        onNotificationClose={() => setNotification(null)}
      />
    </>
  );
}

describe('checkout integration flow', () => {
  it('should validate shipping form before opening confirmation modal', () => {
    const onProcessPayment = vi.fn();

    render(
      <CheckoutHarness
        cart={[mockCartItem]}
        onProcessPayment={onProcessPayment}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Bayar Sekarang/i }));
    expect(
      screen.getByText(
        'Harap lengkapi nama, nomor telepon, dan alamat pengiriman terlebih dahulu.',
      ),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Mengerti/i }));
    fireEvent.change(screen.getByPlaceholderText('Nama Penerima'), {
      target: { value: 'Nadia' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nomor Telepon'), {
      target: { value: '08123456789' },
    });
    fireEvent.change(screen.getByPlaceholderText('Alamat Lengkap'), {
      target: { value: 'Jl. Mawar' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Bayar Sekarang/i }));

    expect(screen.getByText('Konfirmasi Pesanan')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Ya, Proses/i }));
    expect(onProcessPayment).toHaveBeenCalledTimes(1);
  });
});
