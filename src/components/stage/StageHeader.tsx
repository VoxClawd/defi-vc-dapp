'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export function StageHeader() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';
  const [eventCount, setEventCount] = useState(200);
  const [nextIn, setNextIn] = useState(6);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'tasks' | 'social'>('feed');

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setNextIn(prev => {
        if (prev <= 1) {
          setEventCount(c => c + 1);
          return 6;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="mb-6 flex items-center justify-between">
      {/* Title and stats */}
      <div className="flex items-center gap-4">
        <h1 className={`font-bold text-white ${isPixel ? 'pixel-text text-xl' : 'text-3xl'}`}>
          The Stage
        </h1>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="text-zinc-600">⏱</span>
            Next in {nextIn}s
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Live
          </span>
          <span>{eventCount} events</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Pause button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`flex items-center gap-2 border px-3 py-2 text-sm font-medium transition-colors ${
            isPaused
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          } ${isPixel ? '' : 'rounded-lg'}`}
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>

        {/* Tab buttons */}
        <div className={`flex border border-zinc-700 ${isPixel ? '' : 'rounded-lg'} overflow-hidden`}>
          {(['feed', 'tasks', 'social'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {tab === 'feed' && '📊 '}
              {tab === 'tasks' && '📋 '}
              {tab === 'social' && '💬 '}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
