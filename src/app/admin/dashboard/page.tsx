'use client';

import { DashboardHeader } from '@/components/admin/dashboard/dashboard-header';
import { DashboardStatsGrid } from '@/components/admin/dashboard/dashboard-stats-grid';
import { RevenueChart } from '@/components/admin/dashboard/revenue-chart';
import { useDashboardStats } from '@/hooks/admin/useDashboardStats';

export default function AdminDashboardPage() {
  const { stats, loading, range, setRange } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E1EEDD] font-black text-[#1A1A1B]">
        Sinkronisasi Data NutriScale...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 space-y-10">
      <DashboardHeader />

      {/* Card Overview */}
      <DashboardStatsGrid stats={stats} />

      {/* Grafik Weekly Orders */}
      <RevenueChart
        data={stats?.weeklySummary || []}
        range={range}
        onRangeChange={setRange}
      />
    </div>
  );
}
