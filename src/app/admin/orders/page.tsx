import AdminOrdersClient from '@/components/admin/orders/AdminOrdersClient';

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-[#f8faf7] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1A1A1B] tracking-tighter">
            Manajemen Pesanan
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-bold uppercase tracking-widest">
            Kelola daftar pesanan, status pembayaran, dan proses pengiriman.
          </p>
        </div>

        <AdminOrdersClient />
      </div>
    </div>
  );
}
