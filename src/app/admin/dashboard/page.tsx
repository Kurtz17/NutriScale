'use client';

import { authClient } from '@/lib/auth-client';
import { Activity, DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Update Interface biar Sesuai API Raymond
interface DashboardData {
  totalUser: number;
  totalOrder: number;
  totalRevenue: number;
  weeklySummary: { date: string; revenue: number; orders: number }[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        // Task 3 Arya: Fetch data real dari endpoint Raymond
        const response = await fetch('/api/admin/dashboard');
        const json = await response.json();

        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error('Gagal sinkronisasi API Admin:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E1EEDD] font-black text-[#1A1A1B]">
        Sinkronisasi Data NutriScale...
      </div>
    );

  return (
    <div className="animate-in fade-in duration-700 space-y-10">
      <header>
        <h2 className="text-4xl font-black text-[#1A1A1B] tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-gray-500 font-medium mt-1 italic">
          Data real-time dari sistem database NutriScale.
        </p>
      </header>

      {/* Card Overview - Integrasi Data API Raymond [cite: 13, 23] */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={(stats?.totalUser ?? 0).toLocaleString('id-ID')}
          trend="Pengguna terdaftar"
          icon={<Users className="text-[#7CB342]" />}
        />
        <StatCard
          title="Total Orders"
          value={(stats?.totalOrder ?? 0).toLocaleString('id-ID')}
          trend="Total pesanan masuk"
          icon={<Activity className="text-[#7CB342]" />}
        />
        <StatCard
          title="Total Revenue"
          value={`Rp ${(stats?.totalRevenue ?? 0).toLocaleString('id-ID')}`}
          trend="Pendapatan (Status SELESAI)"
          icon={<DollarSign className="text-white" />}
          highlight
        />
        <StatCard
          title="Weekly Summary"
          value={stats?.weeklySummary?.length ?? 0}
          trend="Data mingguan aktif"
          icon={<Package className="text-[#7CB342]" />}
        />
      </div>

      {/* Grafik Weekly Orders - Data dari weeklySummary */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#E1EEDD] rounded-2xl">
            <TrendingUp size={20} className="text-[#7CB342]" />
          </div>
          <h3 className="font-black text-xl text-[#1A1A1B]">
            Weekly Orders & Revenue Trend
          </h3>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.weeklySummary || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F0F0F0"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                // Format biar tanggalnya rapi (misal: "2026-05-11")
                tickFormatter={(str) => str.split('-').slice(1).join('/')}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
              />
              <Tooltip
                cursor={{ fill: '#F9FAFB' }}
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
              />
              {/* Bar buat jumlah pesanan */}
              <Bar
                dataKey="orders"
                fill="#7CB342"
                radius={[6, 6, 0, 0]}
                name="Jumlah Order"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Komponen StatCard (Sesuai Desain Figma maneh Ry)
function StatCard({
  title,
  value,
  trend,
  icon,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] shadow-sm border border-white/50 flex flex-col gap-6 transition-all hover:scale-[1.02] ${
        highlight ? 'bg-[#1A1A1B] text-white shadow-xl' : 'bg-white'
      }`}
    >
      <div
        className={`p-3 w-fit rounded-2xl ${highlight ? 'bg-[#7CB342]/20' : 'bg-[#E1EEDD]'}`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-[#7CB342]' : 'text-gray-400'}`}
        >
          {title}
        </p>
        <h4 className="text-3xl font-black mt-1 leading-none tracking-tighter">
          {value}
        </h4>
        <p
          className={`text-[10px] font-bold mt-4 italic ${highlight ? 'text-gray-500' : 'text-[#7CB342]'}`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}
