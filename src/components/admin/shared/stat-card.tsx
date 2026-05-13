import React from 'react';

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
  isAlert?: boolean;
  highlight?: boolean;
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  isAlert = false,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`p-8 rounded-[2rem] shadow-sm border border-white/50 flex flex-col gap-6 transition-all hover:translate-y-[-2px] duration-300 ${
        highlight
          ? 'bg-[#1A1A1B] text-white shadow-xl'
          : 'bg-white hover:shadow-lg'
      }`}
    >
      <div
        className={`p-3 w-fit rounded-2xl ${
          highlight ? 'bg-[#7CB342]/20' : isAlert ? 'bg-red-50' : 'bg-[#F2F6F1]'
        }`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`text-[10px] font-black uppercase tracking-widest ${
            highlight ? 'text-[#7CB342]' : 'text-gray-400'
          }`}
        >
          {title}
        </p>
        <h4 className="text-3xl font-black mt-1 leading-none tracking-tighter">
          {value}
        </h4>
        <p
          className={`text-[10px] font-bold mt-4 italic ${
            highlight
              ? 'text-gray-500'
              : isAlert
                ? 'text-red-400'
                : 'text-[#7CB342]'
          }`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}
