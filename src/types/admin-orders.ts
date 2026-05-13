export const ORDER_STATUS_OPTIONS = [
  { value: 'TERTUNDA', label: 'Tertunda' },
  { value: 'DIPROSES', label: 'Diproses' },
  { value: 'DIKIRIM', label: 'Dikirim' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'DIBATALKAN', label: 'Dibatalkan' },
] as const;

export type AdminOrderStatus = (typeof ORDER_STATUS_OPTIONS)[number]['value'];

export type AdminOrderStatusFilter = AdminOrderStatus | 'ALL';

export const ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  TERTUNDA: 'Tertunda',
  DIPROSES: 'Diproses',
  DIKIRIM: 'Dikirim',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
};

export const PAYMENT_STATUS_LABELS = {
  BERHASIL: 'Dibayar',
  GAGAL: 'Gagal',
  TERTUNDA: 'Tertunda',
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
