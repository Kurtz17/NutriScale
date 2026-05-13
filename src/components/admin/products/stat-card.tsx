import React from 'react';

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  isAlert?: boolean;
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  isAlert = false,
}: StatCardProps) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50 flex flex-col gap-6 transition-all hover:scale-[1.02]">
      <div
        className={`p-3 w-fit rounded-2xl ${isAlert ? 'bg-red-50' : 'bg-[#E1EEDD]'}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {title}
        </p>
        <h4 className="text-3xl font-black mt-1 leading-none tracking-tighter">
          {value}
        </h4>
        <p
          className={`text-[10px] font-bold mt-4 italic ${isAlert ? 'text-red-400' : 'text-[#7CB342]'}`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}
