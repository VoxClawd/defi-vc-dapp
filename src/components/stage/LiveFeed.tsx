'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { getAgent } from '@/data/agents';
import { generateEvents } from '@/data/events';
import { AgentEvent, EventType } from '@/lib/types';

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function EventTypeBadge({ type, isPixel }: { type: EventType; isPixel: boolean }) {
  const colors: Record<EventType, string> = {
    pulse: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    message: 'bg-green-500/20 text-green-400 border-green-500/30',
    proposal: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    trade: 'bg-red-500/20 text-red-400 border-red-500/30',
    analysis: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    alert: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };

  return (
    <span
      className={`border px-2 py-0.5 text-xs font-medium ${colors[type]} ${
        isPixel ? 'font-mono uppercase' : 'rounded-full'
      }`}
    >
      {type}
    </span>
  );
}

function EventItem({ event, isPixel }: { event: AgentEvent; isPixel: boolean }) {
  const agent = getAgent(event.agentId);
  if (!agent) return null;

  const borderColors: Record<EventType, string> = {
    pulse: 'border-l-indigo-500',
    message: 'border-l-green-500',
    proposal: 'border-l-amber-500',
    trade: 'border-l-red-500',
    analysis: 'border-l-purple-500',
    alert: 'border-l-pink-500',
  };

  return (
    <div
      className={`border-l-2 py-3 pl-4 pr-2 transition-colors hover:bg-zinc-800/30 ${borderColors[event.type]} ${
        isPixel ? '' : 'rounded-r-lg'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-500">{formatTimeAgo(event.timestamp)}</span>
        <span className="font-semibold" style={{ color: agent.color }}>
          {agent.name}
        </span>
        <span className="text-zinc-600">›</span>
        <EventTypeBadge type={event.type} isPixel={isPixel} />
      </div>
      <p className={`mt-1.5 text-zinc-300 ${isPixel ? 'font-mono text-sm' : 'text-sm'}`}>
        {event.content}
      </p>
      {event.metadata?.targetAgent && (
        <p className="mt-1 text-xs text-zinc-500">
          ↳ {event.metadata.targetAgent === 'all' ? 'To all agents' : `To ${event.metadata.targetAgent}`}
        </p>
      )}
    </div>
  );
}

export function LiveFeed() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [filter, setFilter] = useState<EventType | 'all'>('all');

  useEffect(() => {
    setEvents(generateEvents());
    
    // Simulate new events
    const interval = setInterval(() => {
      setEvents(prev => {
        const newEvent: AgentEvent = {
          id: `new-${Date.now()}`,
          timestamp: new Date(),
          agentId: ['alpha', 'scout', 'sage', 'quant', 'trader', 'oracle'][Math.floor(Math.random() * 6)],
          type: ['pulse', 'message', 'analysis'][Math.floor(Math.random() * 3)] as EventType,
          content: [
            'Monitoring market conditions...',
            'Scanning for opportunities...',
            'Analyzing on-chain data...',
            'Reviewing portfolio positions...',
            'Checking sentiment indicators...',
          ][Math.floor(Math.random() * 5)],
        };
        return [newEvent, ...prev.slice(0, 19)];
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  const filterOptions: (EventType | 'all')[] = ['all', 'pulse', 'message', 'trade', 'analysis', 'alert'];

  return (
    <div className={`${isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50'} p-4`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
          Live Feed
        </h3>
        <div className="flex gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                filter === opt
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              } ${isPixel ? 'uppercase' : 'rounded-md'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div className="max-h-[500px] space-y-1 overflow-y-auto">
        {filteredEvents.map((event) => (
          <EventItem key={event.id} event={event} isPixel={isPixel} />
        ))}
      </div>
    </div>
  );
}
