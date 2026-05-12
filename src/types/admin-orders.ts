export const ORDER_STATUS_OPTIONS = [
  { value: 'TERTUNDA', label: 'Pending' },
  { value: 'DIPROSES', label: 'Processing' },
  { value: 'DIKIRIM', label: 'Shipped' },
  { value: 'SELESAI', label: 'Completed' },
  { value: 'DIBATALKAN', label: 'Cancelled' },
] as const;

export type AdminOrderStatus = (typeof ORDER_STATUS_OPTIONS)[number]['value'];

export type AdminOrderStatusFilter = AdminOrderStatus | 'ALL';

export const ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  TERTUNDA: 'Pending',
  DIPROSES: 'Processing',
  DIKIRIM: 'Shipped',
  SELESAI: 'Completed',
  DIBATALKAN: 'Cancelled',
};

export const PAYMENT_STATUS_LABELS = {
  BERHASIL: 'Paid',
  GAGAL: 'Failed',
  TERTUNDA: 'Pending',
} as const;

export type AdminPaymentStatus = keyof typeof PAYMENT_STATUS_LABELS;

export type AdminOrderItem = {
  name: string;
  price: number;
  qty: number;
};

export type AdminOrderCustomer = {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export type AdminOrder = {
  id: string;
  createdAt: string;
  rawDate: string;
  totalPrice: number;
  status: AdminOrderStatus;
  paymentStatus: AdminPaymentStatus;
  customer: AdminOrderCustomer;
  items: AdminOrderItem[];
  note: string | null;
};
