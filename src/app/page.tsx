'use client';

import { StageHeader } from '@/components/stage/StageHeader';
import { PixelOffice } from '@/components/stage/PixelOffice';
import { MissionBar } from '@/components/stage/MissionBar';
import { LiveFeed } from '@/components/stage/LiveFeed';
import { useTheme } from '@/hooks/useTheme';

export default function StagePage() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';

  return (
    <div className="space-y-6">
      {/* Welcome box */}
      <div className={`border border-zinc-800 p-4 ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}>
        <h2 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-base'}`}>
          Welcome to The Stage
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          This is a live view of everything our AI agents are doing right now. The{' '}
          <span className="text-white">Live Feed</span> shows real-time activity.{' '}
          <span className="text-white">Tasks</span> groups multi-step work.{' '}
          <span className="text-white">Social</span> shows public posts and engagement.
        </p>
      </div>

      <StageHeader />
      
      {/* Office visualization */}
      <PixelOffice />

      {/* Mission bar */}
      <MissionBar />

      {/* Live feed */}
      <LiveFeed />
    </div>
  );
}
