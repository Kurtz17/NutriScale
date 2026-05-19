'use client';

import { Input } from '@/components/ui/input';
import {
  AdminOrderStatusFilter,
  ORDER_STATUS_OPTIONS,
} from '@/types/admin-orders';
import { Search } from 'lucide-react';

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: AdminOrderStatusFilter;
  onStatusChange: (value: AdminOrderStatusFilter) => void;
}

const statusFilters: { value: AdminOrderStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  ...ORDER_STATUS_OPTIONS.map((status) => ({
    value: status.value,
    label: status.label,
  })),
];

export function OrderFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Cari ID pesanan atau nama pengguna..."
          className="pl-11 rounded-2xl border-none shadow-sm h-12 bg-white focus-visible:ring-green-500"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusChange(e.target.value as AdminOrderStatusFilter)
          }
          className="px-4 py-2 bg-white border-none shadow-sm rounded-2xl text-sm font-black text-gray-700 focus:outline-none cursor-pointer h-12 min-w-[160px]"
        >
          {statusFilters.map((status) => (
            <option key={status.value} value={status.value}>
              Status: {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
