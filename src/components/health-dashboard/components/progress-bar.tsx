'use client';

import { useEffect, useState } from 'react';

export default function ProgressBar({
  value,
  color = 'blue',
}: {
  value: number;
  color?: 'blue' | 'green';
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => setWidth(value), 100);
  }, [value]);

  const getColor = () => {
    if (color === 'green') return '#57AA70'; // hijau baru
    return '#4C7DC1'; // biru baru
  };

  return (
    <div className="w-full">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${width}%`,
            backgroundColor: getColor(),
          }}
        />
      </div>
    </div>
  );
}
