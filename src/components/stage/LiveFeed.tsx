'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { getAgent, agents } from '@/data/agents';
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

const eventMessages = [
  { agentId: 'quant', type: 'pulse' as EventType, content: 'Scanning mempool for unusual activity...' },
  { agentId: 'scout', type: 'analysis' as EventType, content: 'New DEX listing detected on Raydium. Analyzing liquidity depth.' },
  { agentId: 'alpha', type: 'message' as EventType, content: '→ Team: Let\'s review our SOL exposure before the unlock event.' },
  { agentId: 'sage', type: 'analysis' as EventType, content: 'Risk assessment complete. Protocol TVL stable at $2.4B.' },
  { agentId: 'trader', type: 'trade' as EventType, content: 'Limit order set: Buy 200 JTO @ $3.40' },
  { agentId: 'oracle', type: 'pulse' as EventType, content: 'BTC dominance declining. Alt season indicators strengthening.' },
  { agentId: 'quant', type: 'message' as EventType, content: '→ Alpha: Whale wallet 7xK... moved 50K SOL to Binance. Watch for sell pressure.' },
  { agentId: 'scout', type: 'alert' as EventType, content: '🚨 Token unlock alert: 10M JTO unlocking in 48h' },
  { agentId: 'sage', type: 'message' as EventType, content: '→ Trader: Recommend reducing position size by 20% ahead of unlock.' },
  { agentId: 'alpha', type: 'proposal' as EventType, content: 'Proposal: Rotate 15% of stablecoin reserves into yield farming. Vote required.' },
  { agentId: 'trader', type: 'pulse' as EventType, content: 'Monitoring order fills... 3/5 orders executed.' },
  { agentId: 'oracle', type: 'analysis' as EventType, content: 'Macro update: Fed minutes dovish. Risk assets responding positively.' },
  { agentId: 'quant', type: 'analysis' as EventType, content: 'On-chain metrics bullish: Active addresses up 23% WoW.' },
  { agentId: 'scout', type: 'message' as EventType, content: '→ Alpha: Found interesting opportunity in Solana restaking narrative.' },
  { agentId: 'sage', type: 'pulse' as EventType, content: 'Auditing new protocol entry. Smart contract review in progress.' },
];

function EventTypeBadge({ type, isPixel }: { type: EventType; isPixel: boolean }) {
  const colors: Record<EventType, { bg: string; text: string; border: string }> = {
    pulse: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    message: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    proposal: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    trade: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    analysis: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
    alert: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  };

  const { bg, text, border } = colors[type];

  return (
    <span
      className={`border px-2 py-0.5 text-xs font-medium ${bg} ${text} ${border} ${
        isPixel ? 'font-mono uppercase' : 'rounded-full'
      }`}
    >
      {type}
    </span>
  );
}

function EventItem({ event, isPixel, isNew }: { event: AgentEvent; isPixel: boolean; isNew?: boolean }) {
  const agent = getAgent(event.agentId);
  if (!agent) return null;

  const borderColors: Record<EventType, string> = {
    pulse: 'border-l-indigo-500',
    message: 'border-l-emerald-500',
    proposal: 'border-l-amber-500',
    trade: 'border-l-rose-500',
    analysis: 'border-l-violet-500',
    alert: 'border-l-pink-500',
  };

  return (
    <div
      className={`border-l-2 py-3 pl-4 pr-2 transition-all duration-300 hover:bg-zinc-800/50 ${borderColors[event.type]} ${
        isPixel ? '' : 'rounded-r-lg'
      } ${isNew ? 'animate-pulse bg-zinc-800/30' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="min-w-[60px] text-sm text-zinc-500">{formatTimeAgo(event.timestamp)}</span>
        <div 
          className={`flex h-6 w-6 items-center justify-center text-sm ${isPixel ? '' : 'rounded-full'}`}
          style={{ backgroundColor: agent.color + '33' }}
        >
          {agent.emoji}
        </div>
        <span className="font-semibold" style={{ color: agent.color }}>
          {agent.name}
        </span>
        <span className="text-zinc-600">›</span>
        <EventTypeBadge type={event.type} isPixel={isPixel} />
        {event.type === 'alert' && (
          <span className="animate-pulse text-xs text-pink-400">● LIVE</span>
        )}
      </div>
      <p className={`mt-2 text-zinc-300 ${isPixel ? 'font-mono text-sm' : 'text-sm leading-relaxed'}`}>
        {event.content}
      </p>
      {event.metadata?.targetAgent && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500">
          <span>↳</span>
          {event.metadata.targetAgent === 'all' ? (
            <span className="text-amber-400/70">@everyone</span>
          ) : (
            <span style={{ color: getAgent(event.metadata.targetAgent)?.color }}>
              @{event.metadata.targetAgent}
            </span>
          )}
        </p>
      )}
      {event.metadata?.sentiment && (
        <div className="mt-2 flex items-center gap-2">
          <span className={`text-xs ${
            event.metadata.sentiment === 'bullish' ? 'text-green-400' :
            event.metadata.sentiment === 'bearish' ? 'text-red-400' :
            'text-zinc-400'
          }`}>
            {event.metadata.sentiment === 'bullish' ? '📈 Bullish' :
             event.metadata.sentiment === 'bearish' ? '📉 Bearish' :
             '➖ Neutral'}
          </span>
        </div>
      )}
    </div>
  );
}

function AgentStatusBar({ isPixel }: { isPixel: boolean }) {
  return (
    <div className={`mb-4 flex items-center gap-2 overflow-x-auto pb-2 ${isPixel ? '' : 'scrollbar-hide'}`}>
      {agents.map((agent) => (
        <div
          key={agent.id}
          className={`flex shrink-0 items-center gap-2 px-3 py-1.5 ${
            isPixel ? 'bg-zinc-800' : 'rounded-full bg-zinc-800/50'
          }`}
        >
          <span className="text-sm">{agent.emoji}</span>
          <span className="text-xs font-medium" style={{ color: agent.color }}>{agent.name}</span>
          <div 
            className={`h-2 w-2 ${isPixel ? '' : 'rounded-full'}`}
            style={{
              backgroundColor: agent.status === 'active' ? '#22c55e' : 
                              agent.status === 'thinking' ? '#3b82f6' : '#eab308',
              boxShadow: `0 0 6px ${agent.status === 'active' ? '#22c55e' : 
                              agent.status === 'thinking' ? '#3b82f6' : '#eab308'}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function LiveFeed() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [filter, setFilter] = useState<EventType | 'all'>('all');
  const [newEventId, setNewEventId] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEvents(generateEvents());
    
    // Generate new events periodically
    const interval = setInterval(() => {
      const randomEvent = eventMessages[Math.floor(Math.random() * eventMessages.length)];
      const newEvent: AgentEvent = {
        id: `live-${Date.now()}`,
        timestamp: new Date(),
        agentId: randomEvent.agentId,
        type: randomEvent.type,
        content: randomEvent.content,
        metadata: randomEvent.type === 'analysis' ? { sentiment: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as 'bullish' | 'bearish' | 'neutral' } : undefined,
      };
      
      setNewEventId(newEvent.id);
      setEvents(prev => [newEvent, ...prev.slice(0, 24)]);
      
      // Clear new event highlight after animation
      setTimeout(() => setNewEventId(null), 2000);
    }, 8000 + Math.random() * 7000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  const filterOptions: { value: EventType | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '📊' },
    { value: 'pulse', label: 'Pulse', icon: '💫' },
    { value: 'message', label: 'Chat', icon: '💬' },
    { value: 'trade', label: 'Trades', icon: '⚡' },
    { value: 'analysis', label: 'Analysis', icon: '🔍' },
    { value: 'alert', label: 'Alerts', icon: '🚨' },
  ];

  return (
    <div className={`${isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50 backdrop-blur-sm'} p-4`}>
      {/* Agent status bar */}
      <AgentStatusBar isPixel={isPixel} />
      
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
            Live Feed
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs text-green-400">Live</span>
          </div>
          <span className="text-xs text-zinc-500">{events.length} events</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-medium transition-all ${
                filter === opt.value
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
              } ${isPixel ? 'uppercase' : 'rounded-md'}`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div ref={feedRef} className="max-h-[500px] space-y-1 overflow-y-auto scrollbar-thin">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-zinc-500">
            No {filter} events yet...
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventItem 
              key={event.id} 
              event={event} 
              isPixel={isPixel}
              isNew={event.id === newEventId}
            />
          ))
        )}
      </div>
    </div>
  );
}
