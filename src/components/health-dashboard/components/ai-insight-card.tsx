'use client';

import { Activity, Info, Sparkles } from 'lucide-react';

interface AIInsightCardProps {
  narrative: string;
}

export default function AIInsightCard({ narrative }: AIInsightCardProps) {
  // Split paragraphs if needed, or just display as matches formatting
  const paragraphs = narrative.split('\n\n').filter((p) => p.trim() !== '');

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-green-100 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-50 group-hover:bg-green-100 transition-colors duration-500"></div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-600 rounded-lg text-white shadow-md shadow-green-100">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              AI Health Insights
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Gemini Precision Model v2.1
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {paragraphs.map((p, idx) => (
            <p
              key={idx}
              className="text-gray-600 leading-relaxed text-sm md:text-base"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 italic">
          <div className="flex items-center gap-1.5">
            <Info size={14} className="text-green-500" />
            <span>Generated specifically for your health profile</span>
          </div>
          <Activity size={16} className="text-green-100" />
        </div>
      </div>
    </div>
  );
}
