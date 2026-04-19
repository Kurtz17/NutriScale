'use client';

import { Heart } from 'lucide-react';

export default function HealthTip() {
  return (
    <div className="w-full bg-[#EAF2FF] border border-blue-400 rounded-2xl p-6 flex items-start gap-4">
      {/* ICON */}
      <div className="text-blue-500 mt-1">
        <Heart className="w-5 h-5" />
      </div>

      {/* TEXT */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Daily Health Tip
        </h3>

        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Stay hydrated! Aim for 8 glasses of water per day to support your
          metabolism and overall health.
        </p>
      </div>
    </div>
  );
}
