import { AdminOrder, AdminOrderStatus } from '@/types/admin-orders';

type OrdersResponse = { orders: AdminOrder[] };

type ErrorResponse = { error?: string };

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as ErrorResponse;
    return data?.error || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const response = await fetch('/api/admin/orders', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to load orders'));
  }

  const data = (await response.json()) as OrdersResponse;
  return Array.isArray(data.orders) ? data.orders : [];
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: AdminOrderStatus,
): Promise<void> {
  const response = await fetch('/api/admin/orders', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, status }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Failed to update order status'),
    );
  }
}
