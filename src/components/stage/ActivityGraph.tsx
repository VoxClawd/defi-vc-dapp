'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export function ActivityGraph() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';
  
  const [data, setData] = useState<number[]>([30, 45, 35, 50, 40, 55, 45, 60, 50, 65, 55, 70]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(20, Math.min(80, lastValue + (Math.random() - 0.5) * 20));
        newData.push(newValue);
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);

  return (
    <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className={`font-medium text-white ${isPixel ? 'pixel-text text-xs' : 'text-sm'}`}>
          Agent Activity
        </h4>
        <span className="text-xs text-zinc-500">Last hour</span>
      </div>
      
      <div className="flex h-24 items-end gap-1">
        {data.map((value, i) => (
          <div
            key={i}
            className={`flex-1 transition-all duration-500 ${
              isPixel ? '' : 'rounded-t'
            }`}
            style={{
              height: `${((value - minValue) / (maxValue - minValue)) * 100}%`,
              minHeight: '10%',
              backgroundColor: value > 50 ? '#22c55e' : value > 35 ? '#eab308' : '#ef4444',
              opacity: 0.5 + (i / data.length) * 0.5,
            }}
          />
        ))}
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span>Low</span>
        <span className="text-green-400">{Math.round(data[data.length - 1])} events/5min</span>
        <span>High</span>
      </div>
    </div>
  );
}
