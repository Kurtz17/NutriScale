'use client';

import { Activity, Droplet, Flame, Heart } from 'lucide-react';

import ProgressBar from './progress-bar';

interface StatCardProps {
  stat: {
    title: string;
    value: string;
    progress?: number;
    status?: string;
  };
}

export default function StatCard({ stat }: StatCardProps) {
  // 🔹 Pilih icon berdasarkan title
  const getIcon = () => {
    switch (stat.title) {
      case 'WHO Z-Score (HAZ)':
        return <Activity className="w-5 h-5 text-gray-500" />;
      case 'Daily Calories':
        return <Flame className="w-5 h-5 text-gray-500" />;
      case 'Protein Intake':
        return <Droplet className="w-5 h-5 text-gray-500" />;
      case 'Health Status':
        return <Heart className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5 w-full">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {getIcon()}
        <span>{stat.title}</span>
      </div>

      {/* VALUE */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>

        {/* PROGRESS (Calories & Protein only) */}
        {stat.progress !== undefined && (
          <div className="mt-3">
            <ProgressBar
              value={stat.progress}
              color={stat.title === 'Protein Intake' ? 'green' : 'blue'}
            />
            <p className="text-xs text-gray-400 mt-1">
              {stat.progress}% of goal
            </p>
          </div>
        )}

        {/* STATUS BADGE (WHO) */}
        {stat.status && stat.title === 'WHO Z-Score (HAZ)' && (
          <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
            {stat.status}
          </span>
        )}

        {/* HEALTH STATUS TEXT */}
        {stat.title === 'Health Status' && (
          <div className="mt-2">
            <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">Keep up the great work!</p>
          </div>
        )}
      </div>
    </div>
  );
}
