'use client';

import { Input } from '@/components/ui/input';
import { UserStatus } from '@/types/admin/users';
import { Search } from 'lucide-react';

interface UserFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: UserStatus;
  onStatusFilterChange: (status: UserStatus) => void;
}

export function UserFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: UserFilterBarProps) {
  const statuses: UserStatus[] = ['Semua', 'Aktif', 'Nonaktif', 'Banned'];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Cari nama atau email..."
          className="pl-11 rounded-2xl border-none shadow-sm h-12 bg-white focus-visible:ring-green-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as UserStatus)}
          className="px-4 py-2 bg-white border-none shadow-sm rounded-2xl text-sm font-black text-gray-700 focus:outline-none cursor-pointer h-12 min-w-[160px]"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              Status: {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
