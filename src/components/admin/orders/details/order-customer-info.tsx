import { AdminOrder } from '@/types/admin-orders';

type OrderCustomerInfoProps = {
  customer: AdminOrder['customer'];
};

export function OrderCustomerInfo({ customer }: OrderCustomerInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        Informasi Pelanggan
      </h3>
      <div className="space-y-3">
        <InfoRow label="Nama" value={customer.name} />
        <InfoRow label="Email" value={customer.email} />
        <InfoRow label="Telepon" value={customer.phone || '-'} />
        <InfoRow label="Alamat" value={customer.address || '-'} />
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-900 font-bold text-right">{value}</span>
  </div>
);
