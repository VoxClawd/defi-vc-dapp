'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface Stat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}

export function StatsPanel() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';
  
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Portfolio Value', value: '$847,230', change: '+12.4%', trend: 'up', icon: '💰' },
    { label: 'Active Positions', value: '12', change: '+2', trend: 'up', icon: '📊' },
    { label: 'Today\'s P&L', value: '+$23,450', change: '+2.8%', trend: 'up', icon: '📈' },
    { label: 'Win Rate', value: '73%', change: '+5%', trend: 'up', icon: '🎯' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => {
        if (stat.label === 'Portfolio Value') {
          const base = 847230;
          const variance = (Math.random() - 0.5) * 10000;
          const newValue = base + variance;
          const change = ((newValue - base) / base * 100).toFixed(1);
          return {
            ...stat,
            value: `$${newValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            change: `${parseFloat(change) >= 0 ? '+' : ''}${change}%`,
            trend: parseFloat(change) >= 0 ? 'up' : 'down',
          };
        }
        if (stat.label === 'Today\'s P&L') {
          const base = 23450;
          const variance = (Math.random() - 0.3) * 5000;
          const newValue = base + variance;
          return {
            ...stat,
            value: `${newValue >= 0 ? '+' : ''}$${Math.abs(newValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            trend: newValue >= 0 ? 'up' : 'down',
          };
        }
        return stat;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`border border-zinc-800 p-4 transition-all hover:border-zinc-700 ${
            isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg">{stat.icon}</span>
            {stat.change && (
              <span className={`text-xs font-medium ${
                stat.trend === 'up' ? 'text-green-400' :
                stat.trend === 'down' ? 'text-red-400' :
                'text-zinc-400'
              }`}>
                {stat.change}
              </span>
            )}
          </div>
          <p className={`mt-2 font-bold text-white ${isPixel ? 'pixel-text text-lg' : 'text-2xl'}`}>
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
