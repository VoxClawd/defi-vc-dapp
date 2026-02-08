'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { positions, recentTrades } from '@/data/events';
import { getAgent } from '@/data/agents';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function PriceChart({ isPixel }: { isPixel: boolean }) {
  const [data, setData] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate initial data
    const initial = [];
    let value = 800000;
    for (let i = 0; i < 30; i++) {
      value += (Math.random() - 0.45) * 10000;
      initial.push(value);
    }
    setData(initial);
    
    // Update periodically
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1];
        newData.push(lastValue + (Math.random() - 0.45) * 5000);
        return newData;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return null;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const isUp = data[data.length - 1] > data[0];

  return (
    <div className={`border border-zinc-800 p-6 ${isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
          Portfolio Value
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <button className="text-zinc-500 hover:text-white">1D</button>
          <button className="text-amber-400">1W</button>
          <button className="text-zinc-500 hover:text-white">1M</button>
          <button className="text-zinc-500 hover:text-white">ALL</button>
        </div>
      </div>
      
      <div className="mb-2 flex items-baseline gap-3">
        <span className={`font-bold text-white ${isPixel ? 'pixel-text text-2xl' : 'text-4xl'}`}>
          {formatCurrency(data[data.length - 1] || 0)}
        </span>
        <span className={`text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {formatPercent(((data[data.length - 1] - data[0]) / data[0]) * 100)}
        </span>
      </div>
      
      <svg className="h-48 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#27272a" strokeWidth="0.5" />
        ))}
        
        {/* Area fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#chartGradient)"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={isUp ? '#22c55e' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* End dot */}
        <circle
          cx="100"
          cy={100 - ((data[data.length - 1] - minValue) / range) * 100}
          r="3"
          fill={isUp ? '#22c55e' : '#ef4444'}
        >
          <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

function AllocationDonut({ isPixel }: { isPixel: boolean }) {
  const totalValue = positions.reduce((sum, p) => sum + p.amount * p.currentPrice, 0);
  const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444'];
  
  let cumulativePercent = 0;
  
  return (
    <div className={`border border-zinc-800 p-6 ${isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50'}`}>
      <h3 className={`mb-4 font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
        Allocation
      </h3>
      
      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
          {positions.map((position, i) => {
            const value = position.amount * position.currentPrice;
            const percent = (value / totalValue) * 100;
            const startPercent = cumulativePercent;
            cumulativePercent += percent;
            
            const startAngle = (startPercent / 100) * 360;
            const endAngle = (cumulativePercent / 100) * 360;
            
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            const largeArc = percent > 50 ? 1 : 0;
            
            return (
              <path
                key={position.id}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={colors[i % colors.length]}
                stroke="#18181b"
                strokeWidth="1"
              />
            );
          })}
          {/* Center hole */}
          <circle cx="50" cy="50" r="25" fill="#18181b" />
        </svg>
        
        {/* Legend */}
        <div className="flex-1 space-y-2">
          {positions.map((position, i) => {
            const value = position.amount * position.currentPrice;
            const percent = (value / totalValue) * 100;
            return (
              <div key={position.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className={`h-3 w-3 ${isPixel ? '' : 'rounded'}`}
                    style={{ backgroundColor: colors[i % colors.length] }}
                  />
                  <span className="text-sm text-zinc-300">{position.symbol}</span>
                </div>
                <span className="text-sm text-zinc-500">{percent.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';

  const totalValue = positions.reduce((sum, p) => sum + p.amount * p.currentPrice, 0);
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-bold text-white ${isPixel ? 'pixel-text text-xl' : 'text-4xl'}`}>
          Portfolio
        </h1>
        <p className="mt-2 text-zinc-400">
          Real-time positions, performance metrics, and trading activity.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Value', value: formatCurrency(totalValue), change: null, icon: '💰' },
          { label: 'Total P&L', value: formatCurrency(totalPnl), change: formatPercent(totalPnlPercent), trend: totalPnl >= 0, icon: '📈' },
          { label: 'Positions', value: positions.length.toString(), change: null, icon: '📊' },
          { label: 'Win Rate', value: '73%', change: '+5%', trend: true, icon: '🎯' },
        ].map((stat) => (
          <div 
            key={stat.label}
            className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">{stat.icon}</span>
              {stat.change && (
                <span className={`text-xs font-medium ${stat.trend ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            <p className={`mt-2 font-bold ${stat.trend === false ? 'text-red-400' : 'text-white'} ${isPixel ? 'pixel-text text-lg' : 'text-2xl'}`}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PriceChart isPixel={isPixel} />
        </div>
        <AllocationDonut isPixel={isPixel} />
      </div>

      {/* Positions table */}
      <div className={`border border-zinc-800 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'} overflow-hidden`}>
        <div className="border-b border-zinc-800 p-4">
          <h2 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
            Positions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-sm text-zinc-500">
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Entry</th>
                <th className="p-4 font-medium">Current</th>
                <th className="p-4 font-medium">Value</th>
                <th className="p-4 font-medium text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, i) => (
                <tr 
                  key={position.id} 
                  className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`flex h-10 w-10 items-center justify-center text-sm font-bold ${isPixel ? '' : 'rounded-full'}`}
                        style={{ 
                          backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444'][i % 5] + '33',
                          color: ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444'][i % 5],
                        }}
                      >
                        {position.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{position.token}</p>
                        <p className="text-xs text-zinc-500">{position.chain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-zinc-300">
                    {position.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-zinc-400">
                    ${position.entryPrice.toLocaleString()}
                  </td>
                  <td className="p-4 text-white">
                    ${position.currentPrice.toLocaleString()}
                  </td>
                  <td className="p-4 font-medium text-white">
                    {formatCurrency(position.amount * position.currentPrice)}
                  </td>
                  <td className="p-4 text-right">
                    <span className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(position.pnl)}
                    </span>
                    <span className={`ml-2 text-sm ${position.pnlPercent >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                      {formatPercent(position.pnlPercent)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent trades */}
      <div className={`border border-zinc-800 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
        <div className="border-b border-zinc-800 p-4">
          <h2 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
            Recent Trades
          </h2>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {recentTrades.map((trade) => {
            const agent = getAgent(trade.agentId);
            return (
              <div key={trade.id} className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-800/30">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center text-lg font-bold ${
                      trade.type === 'buy'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    } ${isPixel ? '' : 'rounded-xl'}`}
                  >
                    {trade.type === 'buy' ? '↗' : '↘'}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.amount.toLocaleString()} {trade.symbol}
                    </p>
                    <p className="text-sm text-zinc-500">
                      @ ${trade.price.toLocaleString()} • {trade.reason}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{formatCurrency(trade.total)}</p>
                  <p className="text-sm text-zinc-500">
                    {formatTimeAgo(trade.timestamp)} • {agent?.emoji} {agent?.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
