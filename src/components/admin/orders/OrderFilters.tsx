'use client';

import { Input } from '@/components/ui/input';
import {
  AdminOrderStatusFilter,
  ORDER_STATUS_OPTIONS,
} from '@/types/admin-orders';
import { Filter, Search } from 'lucide-react';

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: AdminOrderStatusFilter;
  onStatusChange: (value: AdminOrderStatusFilter) => void;
}

const statusFilters: { value: AdminOrderStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
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
          placeholder="Cari order ID atau nama user..."
          className="pl-11 rounded-2xl border-none shadow-sm h-12 bg-white focus-visible:ring-green-500"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto bg-white p-1.5 rounded-2xl shadow-sm overflow-x-auto">
        <Filter className="w-4 h-4 text-gray-400 ml-2 hidden sm:block" />
        {statusFilters.map((status) => (
          <button
            key={status.value}
            type="button"
            onClick={() => onStatusChange(status.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              statusFilter === status.value
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
