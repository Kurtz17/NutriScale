'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = [
  { day: 'Mon', protein: 30 },
  { day: 'Tue', protein: 40 },
  { day: 'Wed', protein: 35 },
  { day: 'Thu', protein: 50 },
  { day: 'Fri', protein: 45 },
  { day: 'Sat', protein: 55 },
  { day: 'Sun', protein: 48 },
];

export default function ProteinChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full">
      {/* TITLE */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Protein Intake Progress
        </h3>
        <p className="text-sm text-gray-500">Your weekly protein consumption</p>
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
              dataKey="protein"
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
