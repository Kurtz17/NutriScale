import { formatHarga } from '@/lib/utils';
import { WeeklySummary } from '@/types/admin/dashboard';
import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type RevenueChartProps = {
  data: WeeklySummary[];
  range: string;
  onRangeChange: (range: string) => void;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: WeeklySummary;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as WeeklySummary;
    return (
      <div className="bg-[#1A1A1B] p-4 rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-[#7CB342] uppercase tracking-[0.2em] mb-2">
          {label}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-8">
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              Pesanan
            </span>
            <span className="text-white font-black text-sm">{data.orders}</span>
          </div>
          <div className="flex items-center justify-between gap-8 border-t border-white/5 pt-1 mt-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              Pendapatan
            </span>
            <span className="text-[#7CB342] font-black text-sm">
              {formatHarga(data.revenue)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart({
  data,
  range,
  onRangeChange,
}: RevenueChartProps) {
  const filterOptions = [
    { label: '7 Hari', value: '7d' },
    { label: '30 Hari', value: '30d' },
    { label: '3 Bulan', value: '90d' },
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#E1EEDD] rounded-2xl">
            <TrendingUp size={20} className="text-[#7CB342]" />
          </div>
          <h3 className="font-black text-xl text-[#1A1A1B]">
            Tren Pesanan & Pendapatan
          </h3>
        </div>

        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onRangeChange(opt.value)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${
                range === opt.value
                  ? 'bg-white text-[#7CB342] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
              tickFormatter={(str) => str.split('-').slice(1).join('/')}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#F9FAFB', radius: 10 }}
            />
            <Bar
              dataKey="orders"
              fill="#7CB342"
              radius={[6, 6, 0, 0]}
              name="Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
