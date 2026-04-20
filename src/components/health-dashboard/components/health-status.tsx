'use client';

import { Activity, AlertCircle, ShieldCheck } from 'lucide-react';

interface HealthStatusProps {
  status: string;
}

export default function HealthStatus({ status }: HealthStatusProps) {
  const isNormal = status.toLowerCase() === 'normal';
  const isUnderweight = status.toLowerCase().includes('underweight');
  const isOverweight =
    status.toLowerCase().includes('overweight') ||
    status.toLowerCase().includes('obese');

  return (
    <div
      className={`rounded-2xl shadow-md p-5 w-full border ${
        isNormal
          ? 'bg-green-50 border-green-100'
          : isUnderweight
            ? 'bg-blue-50 border-blue-100'
            : isOverweight
              ? 'bg-orange-50 border-orange-100'
              : 'bg-white border-gray-100'
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Activity
          className={`w-5 h-5 ${
            isNormal
              ? 'text-green-600'
              : isUnderweight
                ? 'text-blue-600'
                : isOverweight
                  ? 'text-orange-600'
                  : 'text-gray-500'
          }`}
        />
        <span className="font-medium">Nutritional Category</span>
      </div>

      {/* STATUS */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            {status}
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">
            Current Standing
          </p>
        </div>

        {isNormal ? (
          <ShieldCheck className="text-green-600 w-8 h-8" />
        ) : (
          <AlertCircle
            className={
              isUnderweight
                ? 'text-blue-600 w-8 h-8'
                : 'text-orange-600 w-8 h-8'
            }
          />
        )}
      </div>
    </div>
  );
}
