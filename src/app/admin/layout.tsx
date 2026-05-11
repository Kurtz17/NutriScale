import AdminSidebar from '@/components/admin/layout/admin-sidebar';
import AdminTopbar from '@/components/admin/layout/admin-topbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex bg-gray-50 z-50">
      {/* Sidebar kiri */}
      <AdminSidebar />

      {/* Area kanan: topbar + konten */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
