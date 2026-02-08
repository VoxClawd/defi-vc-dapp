'use client';

import { StageHeader } from '@/components/stage/StageHeader';
import { PixelOffice } from '@/components/stage/PixelOffice';
import { MissionBar } from '@/components/stage/MissionBar';
import { LiveFeed } from '@/components/stage/LiveFeed';
import { StatsPanel } from '@/components/stage/StatsPanel';
import { ActivityGraph } from '@/components/stage/ActivityGraph';
import { useTheme } from '@/hooks/useTheme';

export default function StagePage() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';

  return (
    <div className="space-y-6">
      {/* Welcome box */}
      <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-gradient-to-r from-zinc-900/80 to-zinc-800/50 backdrop-blur-sm'}`}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-base'}`}>
              Welcome to The Stage
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-400">
              Watch our AI agents work in real-time. The{' '}
              <span className="text-amber-400">Live Feed</span> shows agent activity,{' '}
              <span className="text-emerald-400">Tasks</span> tracks multi-step operations, and{' '}
              <span className="text-violet-400">Social</span> shows public engagement.
            </p>
          </div>
          <button className={`shrink-0 text-xs text-zinc-500 hover:text-zinc-300 ${isPixel ? '' : ''}`}>
            ✕
          </button>
        </div>
      </div>

      <StageHeader />
      
      {/* Stats panel */}
      <StatsPanel />
      
      {/* Office visualization */}
      <PixelOffice />

      {/* Mission bar */}
      <MissionBar />

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live feed - takes 2 columns */}
        <div className="lg:col-span-2">
          <LiveFeed />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          <ActivityGraph />
          
          {/* Quick actions */}
          <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
            <h4 className={`mb-3 font-medium text-white ${isPixel ? 'pixel-text text-xs' : 'text-sm'}`}>
              Quick Actions
            </h4>
            <div className="space-y-2">
              <button className={`w-full border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white ${isPixel ? '' : 'rounded-lg'}`}>
                📋 View Open Proposals
              </button>
              <button className={`w-full border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white ${isPixel ? '' : 'rounded-lg'}`}>
                📊 Portfolio Analysis
              </button>
              <button className={`w-full border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white ${isPixel ? '' : 'rounded-lg'}`}>
                ⚙️ Agent Settings
              </button>
            </div>
          </div>

          {/* Recent alerts */}
          <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
            <h4 className={`mb-3 font-medium text-white ${isPixel ? 'pixel-text text-xs' : 'text-sm'}`}>
              Recent Alerts
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-amber-400">⚠️</span>
                <div>
                  <p className="text-sm text-zinc-300">Token unlock in 48h</p>
                  <p className="text-xs text-zinc-500">JTO • 10M tokens</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✅</span>
                <div>
                  <p className="text-sm text-zinc-300">Trade executed</p>
                  <p className="text-xs text-zinc-500">Bought 500 JUP @ $1.24</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">ℹ️</span>
                <div>
                  <p className="text-sm text-zinc-300">Proposal pending</p>
                  <p className="text-xs text-zinc-500">Q1 Rebalance • 2 votes needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
