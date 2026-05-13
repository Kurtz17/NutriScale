'use client';

import { Button } from '@/components/ui/button';
import { AdminUser } from '@/types/admin/users';
import { UserCircle } from 'lucide-react';

interface UserTableRowProps {
  user: AdminUser;
  onOpenDetail: (user: AdminUser) => void;
}

export function UserTableRow({ user, onOpenDetail }: UserTableRowProps) {
  let userStatus = 'Aktif';
  let statusColor = 'bg-green-100 text-green-700';

  if (user.banned) {
    userStatus = 'Banned';
    statusColor = 'bg-red-100 text-red-700';
  } else if (!user.lastOnline) {
    userStatus = 'Nonaktif';
    statusColor = 'bg-gray-100 text-gray-500';
  } else {
    const lastOnlineDate = new Date(user.lastOnline);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    if (lastOnlineDate < oneMonthAgo) {
      userStatus = 'Nonaktif';
      statusColor = 'bg-gray-100 text-gray-500';
    }
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const lastActive = user.lastOnline
    ? new Date(user.lastOnline).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Belum pernah';

  return (
    <tr className="border-b border-gray-50 hover:bg-[#f8faf7]/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-400 font-medium">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className="text-sm font-bold text-gray-700 capitalize">
          {user.role}
        </span>
      </td>
      <td className="p-4">
        <span
          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg ${statusColor}`}
        >
          {userStatus}
        </span>
      </td>
      <td className="p-4">
        <span className="text-sm font-medium text-gray-500">{joinDate}</span>
      </td>
      <td className="p-4">
        <span className="text-sm font-medium text-gray-500">{lastActive}</span>
      </td>
      <td className="p-4 text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenDetail(user)}
          className="rounded-xl border-2 border-gray-100 font-bold hover:bg-gray-50 transition-all text-xs"
        >
          Detail
        </Button>
      </td>
    </tr>
  );
}
