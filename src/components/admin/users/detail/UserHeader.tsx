'use client';

import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { UserCircle } from 'lucide-react';

interface UserHeaderProps {
  name: string;
  id: string;
}

export function UserHeader({ name, id }: UserHeaderProps) {
  return (
    <div className="bg-[#f8faf7] p-8 text-center relative border-b border-gray-100">
      <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600 mx-auto mb-4">
        <UserCircle className="w-10 h-10" />
      </div>
      <DialogTitle className="text-2xl font-black text-gray-900">
        {name}
      </DialogTitle>
      <DialogDescription className="text-sm font-medium text-gray-500 mt-1">
        ID: {id}
      </DialogDescription>
    </div>
  );
}
