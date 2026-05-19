import { StatCard } from '@/components/admin/shared/stat-card';
import { DashboardData } from '@/types/admin/dashboard';
import { Clock, DollarSign, ShoppingBag, Users } from 'lucide-react';

type DashboardStatsGridProps = {
  stats: DashboardData | null;
};

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Pengguna"
        value={(stats?.totalUser ?? 0).toLocaleString('id-ID')}
        trend="Pengguna terdaftar"
        icon={<Users className="text-[#7CB342]" />}
      />
      <StatCard
        title="Total Pesanan"
        value={(stats?.totalOrder ?? 0).toLocaleString('id-ID')}
        trend="Seluruh pesanan masuk"
        icon={<ShoppingBag className="text-[#7CB342]" />}
      />
      <StatCard
        title="Total Pendapatan"
        value={`Rp ${(stats?.totalRevenue ?? 0).toLocaleString('id-ID')}`}
        trend="Pendapatan (Status Berhasil)"
        icon={<DollarSign className="text-white" />}
        highlight
      />
      <StatCard
        title="Pesanan Aktif"
        value={(stats?.activeOrders ?? 0).toLocaleString('id-ID')}
        trend="Sedang diproses/dikirim"
        icon={<Clock className="text-[#7CB342]" />}
      />
    </div>
  );
}
