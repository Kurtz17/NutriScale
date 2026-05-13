'use client';

import { Input } from '@/components/ui/input';
import { UserStatus } from '@/types/admin/users';
import { Filter, Search } from 'lucide-react';

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
  const statuses: UserStatus[] = ['All', 'Aktif', 'Nonaktif', 'Banned'];

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

      <div className="flex items-center gap-2 w-full sm:w-auto bg-white p-1.5 rounded-2xl shadow-sm overflow-x-auto">
        <Filter className="w-4 h-4 text-gray-400 ml-2 hidden sm:block" />
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              statusFilter === status
                ? 'bg-black text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
