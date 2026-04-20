'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = [
  { day: 'Mon', calories: 1200 },
  { day: 'Tue', calories: 1400 },
  { day: 'Wed', calories: 1300 },
  { day: 'Thu', calories: 1600 },
  { day: 'Fri', calories: 1450 },
  { day: 'Sat', calories: 1700 },
  { day: 'Sun', calories: 1500 },
];

export default function CalorieChart() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full">
      {/* TITLE */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Calorie Intake Progress
        </h3>
        <p className="text-sm text-gray-500">Your weekly calorie consumption</p>
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
              dataKey="calories"
              stroke="#4c7dc1"
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
