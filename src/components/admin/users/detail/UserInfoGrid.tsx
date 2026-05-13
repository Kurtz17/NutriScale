'use client';

import { AdminUser } from '@/types/admin/users';
import { Calendar, Mail, Power, Shield } from 'lucide-react';

interface UserInfoGridProps {
  user: AdminUser;
  isInactive: boolean;
}

export function UserInfoGrid({ user, isInactive }: UserInfoGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-500">
          <Mail className="w-4 h-4" />{' '}
          <span className="text-xs font-bold uppercase tracking-widest">
            Email
          </span>
        </div>
        <span className="text-sm font-bold text-gray-900">{user.email}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-500">
          <Shield className="w-4 h-4" />{' '}
          <span className="text-xs font-bold uppercase tracking-widest">
            Role
          </span>
        </div>
        <span className="text-sm font-bold text-gray-900 capitalize">
          {user.role}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-500">
          <Calendar className="w-4 h-4" />{' '}
          <span className="text-xs font-bold uppercase tracking-widest">
            Join Date
          </span>
        </div>
        <span className="text-sm font-bold text-gray-900">
          {new Date(user.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-500">
          <Power className="w-4 h-4" />{' '}
          <span className="text-xs font-bold uppercase tracking-widest">
            Status
          </span>
        </div>
        <span
          className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${
            user.banned
              ? 'bg-red-100 text-red-700'
              : isInactive
                ? 'bg-gray-100 text-gray-500'
                : 'bg-green-100 text-green-700'
          }`}
        >
          {user.banned ? 'Banned' : isInactive ? 'Nonaktif' : 'Aktif'}
        </span>
      </div>
    </div>
  );
}
