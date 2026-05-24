import { CancelConfirmationModal } from '@/components/orders/CancelConfirmationModal';
import { OrderCancelButton } from '@/components/orders/OrderCancelButton';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('order components', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-10T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('OrderStatusBadge should map statuses to user-facing labels', () => {
    const { rerender } = render(<OrderStatusBadge status="SELESAI" />);
    expect(screen.getByText(/Selesai/)).toBeTruthy();

    rerender(<OrderStatusBadge status="DIBATALKAN" />);
    expect(screen.getByText(/Dibatalkan/)).toBeTruthy();

    rerender(<OrderStatusBadge status="DIPROSES" />);
    expect(screen.getByText(/Diproses/)).toBeTruthy();
  });

  it('CancelConfirmationModal should call close and confirm callbacks', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(<CancelConfirmationModal onClose={onClose} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: /Kembali/i }));
    fireEvent.click(screen.getByRole('button', { name: /Ya, Batalkan/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('OrderCancelButton should hide after cancellation window expires', () => {
    render(
      <OrderCancelButton
        rawDate="2026-05-10T11:30:00.000Z"
        orderId="ORD-001"
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByText('Batalkan Pesanan')).toBeNull();
  });

  it('OrderCancelButton should call cancel API and refresh callback', async () => {
    const onCancel = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <OrderCancelButton
        rawDate="2026-05-10T11:55:00.000Z"
        orderId="ORD-001"
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Batalkan Pesanan/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Ya, Batalkan/i }));
      await Promise.resolve();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/orders/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: 'ORD-001' }),
    });
  });
});
