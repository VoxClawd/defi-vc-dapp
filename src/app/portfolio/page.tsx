'use client';

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
          Current positions and recent trading activity.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
          <p className="text-sm text-zinc-500">Total Value</p>
          <p className={`mt-1 font-bold text-white ${isPixel ? 'pixel-text text-lg' : 'text-2xl'}`}>
            {formatCurrency(totalValue)}
          </p>
        </div>
        <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
          <p className="text-sm text-zinc-500">Total P&L</p>
          <p className={`mt-1 font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'} ${isPixel ? 'pixel-text text-lg' : 'text-2xl'}`}>
            {formatCurrency(totalPnl)}
          </p>
        </div>
        <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
          <p className="text-sm text-zinc-500">Return</p>
          <p className={`mt-1 font-bold ${totalPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'} ${isPixel ? 'pixel-text text-lg' : 'text-2xl'}`}>
            {formatPercent(totalPnlPercent)}
          </p>
        </div>
        <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
          <p className="text-sm text-zinc-500">Positions</p>
          <p className={`mt-1 font-bold text-white ${isPixel ? 'pixel-text text-lg' : 'text-2xl'}`}>
            {positions.length}
          </p>
        </div>
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
              {positions.map((position) => (
                <tr key={position.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center bg-zinc-700 text-sm font-bold ${isPixel ? '' : 'rounded-full'}`}>
                        {position.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{position.token}</p>
                        <p className="text-xs text-zinc-500">{position.chain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-300">
                    {position.amount.toLocaleString()} {position.symbol}
                  </td>
                  <td className="p-4 text-zinc-400">
                    ${position.entryPrice.toLocaleString()}
                  </td>
                  <td className="p-4 text-white">
                    ${position.currentPrice.toLocaleString()}
                  </td>
                  <td className="p-4 text-white">
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
              <div key={trade.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center text-xs font-bold ${
                      trade.type === 'buy'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    } ${isPixel ? '' : 'rounded-lg'}`}
                  >
                    {trade.type === 'buy' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.amount.toLocaleString()} {trade.symbol}
                    </p>
                    <p className="text-sm text-zinc-500">
                      @ ${trade.price} • {trade.reason}
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

      {/* Allocation chart placeholder */}
      <div className={`border border-zinc-800 p-6 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
        <h2 className={`mb-4 font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
          Allocation
        </h2>
        <div className="flex h-8 overflow-hidden rounded-full">
          {positions.map((position, i) => {
            const value = position.amount * position.currentPrice;
            const percent = (value / totalValue) * 100;
            const colors = ['bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500'];
            return (
              <div
                key={position.id}
                className={`${colors[i % colors.length]} relative`}
                style={{ width: `${percent}%` }}
                title={`${position.symbol}: ${percent.toFixed(1)}%`}
              />
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          {positions.map((position, i) => {
            const value = position.amount * position.currentPrice;
            const percent = (value / totalValue) * 100;
            const colors = ['bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500'];
            return (
              <div key={position.id} className="flex items-center gap-2">
                <div className={`h-3 w-3 ${colors[i % colors.length]} ${isPixel ? '' : 'rounded'}`} />
                <span className="text-sm text-zinc-400">
                  {position.symbol} {percent.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
