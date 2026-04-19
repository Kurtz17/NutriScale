'use client';

import { Heart } from 'lucide-react';

interface HealthStatusProps {
  status: string;
  message?: string;
}

export default function HealthStatus({
  status,
  message = 'Keep up the great work!',
}: HealthStatusProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Heart className="w-5 h-5 text-gray-500" />
        <span>Health Status</span>
      </div>

      {/* STATUS */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800">{status}</h2>

        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
    </div>
  );
}
