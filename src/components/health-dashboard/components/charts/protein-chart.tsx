'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function ProteinChart({
  targetProtein = 50,
}: {
  targetProtein?: number;
}) {
  const data = [
    { day: 'Mon', target: targetProtein },
    { day: 'Tue', target: targetProtein },
    { day: 'Wed', target: targetProtein },
    { day: 'Thu', target: targetProtein },
    { day: 'Fri', target: targetProtein },
    { day: 'Sat', target: targetProtein },
    { day: 'Sun', target: targetProtein },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full">
      {/* TITLE */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recommended Protein Intake
        </h3>
        <p className="text-sm text-gray-500">
          Your daily protein target for the week
        </p>
      </div>

      {/* CHART */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                border: 'none',
              }}
            />

            <Line
              type="monotone"
              dataKey="target"
              stroke="#57aa70"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
