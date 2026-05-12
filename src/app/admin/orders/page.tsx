import AdminOrdersClient from '@/components/admin/orders/AdminOrdersClient';

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-[#f8faf7] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Kelola daftar pesanan, status pembayaran, dan proses pengiriman.
          </p>
        </div>

        <AdminOrdersClient />
      </div>
    </div>
  );
}
