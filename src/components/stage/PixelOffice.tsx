'use client';

import { useTheme } from '@/hooks/useTheme';
import { agents } from '@/data/agents';
import { Agent } from '@/lib/types';

interface AgentSpriteProps {
  agent: Agent;
  isPixel: boolean;
}

function AgentSprite({ agent, isPixel }: AgentSpriteProps) {
  const statusColors = {
    active: '#22c55e',
    idle: '#eab308',
    thinking: '#3b82f6',
    offline: '#71717a',
  };

  if (isPixel) {
    return (
      <div
        className="absolute flex flex-col items-center transition-all duration-500"
        style={{
          left: agent.position?.x || 0,
          top: agent.position?.y || 0,
        }}
      >
        {/* Pixel avatar */}
        <div
          className="relative flex h-12 w-12 items-center justify-center text-2xl"
          style={{
            backgroundColor: agent.color,
            boxShadow: `0 4px 0 0 ${agent.color}66, inset -2px -2px 0 0 rgba(0,0,0,0.3)`,
          }}
        >
          {agent.emoji}
          {/* Status indicator */}
          <div
            className="absolute -bottom-1 -right-1 h-3 w-3"
            style={{
              backgroundColor: statusColors[agent.status],
              boxShadow: '1px 1px 0 0 rgba(0,0,0,0.5)',
            }}
          />
        </div>
        {/* Name tag */}
        <div
          className="mt-1 bg-zinc-900 px-2 py-0.5 text-xs font-bold"
          style={{ color: agent.color }}
        >
          {agent.name}
        </div>
      </div>
    );
  }

  // Modern style
  return (
    <div
      className="absolute flex flex-col items-center transition-all duration-500"
      style={{
        left: agent.position?.x || 0,
        top: agent.position?.y || 0,
      }}
    >
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${agent.color}, ${agent.color}88)`,
        }}
      >
        {agent.emoji}
        <div
          className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-zinc-900"
          style={{ backgroundColor: statusColors[agent.status] }}
        />
      </div>
      <div
        className="mt-2 rounded-full bg-zinc-800/80 px-3 py-1 text-xs font-medium backdrop-blur-sm"
        style={{ color: agent.color }}
      >
        {agent.name}
      </div>
    </div>
  );
}

function Desk({ x, y, isPixel }: { x: number; y: number; isPixel: boolean }) {
  if (isPixel) {
    return (
      <div
        className="absolute"
        style={{ left: x, top: y }}
      >
        {/* Desk surface */}
        <div
          className="h-8 w-20 bg-zinc-700"
          style={{
            boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5), inset -1px -1px 0 0 rgba(0,0,0,0.3)',
          }}
        />
        {/* Monitor */}
        <div
          className="absolute -top-10 left-2 h-8 w-16 bg-zinc-800"
          style={{
            boxShadow: '1px 1px 0 0 rgba(0,0,0,0.5)',
          }}
        >
          <div className="m-1 h-6 w-14 bg-blue-900/50" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute"
      style={{ left: x, top: y }}
    >
      <div className="h-6 w-24 rounded-lg bg-gradient-to-b from-zinc-600 to-zinc-700 shadow-lg" />
      <div className="absolute -top-12 left-3 h-10 w-18 rounded-lg bg-zinc-800 shadow-lg">
        <div className="m-1.5 h-7 w-15 rounded bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
      </div>
    </div>
  );
}

function ServerRack({ x, y, isPixel }: { x: number; y: number; isPixel: boolean }) {
  if (isPixel) {
    return (
      <div className="absolute" style={{ left: x, top: y }}>
        <div
          className="h-24 w-12 bg-zinc-800"
          style={{
            boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="m-1 flex h-4 items-center gap-1 bg-zinc-900 px-1">
              <div className="h-2 w-2 animate-pulse bg-green-500" />
              <div className="h-1 flex-1 bg-zinc-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div className="h-28 w-16 rounded-lg bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-xl">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mx-2 mt-2 flex h-5 items-center gap-2 rounded bg-zinc-900 px-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
            <div className="h-1 flex-1 rounded bg-zinc-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PixelOffice() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';

  return (
    <div
      className={`relative h-[400px] w-full overflow-hidden ${
        isPixel
          ? 'bg-zinc-900'
          : 'rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900'
      }`}
      style={isPixel ? {
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      } : {}}
    >
      {/* Room dividers */}
      <div
        className={`absolute left-1/2 top-0 h-full w-px ${
          isPixel ? 'bg-zinc-700' : 'bg-gradient-to-b from-transparent via-zinc-700 to-transparent'
        }`}
      />

      {/* Desks */}
      <Desk x={120} y={200} isPixel={isPixel} />
      <Desk x={280} y={260} isPixel={isPixel} />
      <Desk x={440} y={200} isPixel={isPixel} />
      <Desk x={120} y={320} isPixel={isPixel} />
      <Desk x={280} y={380} isPixel={isPixel} />
      <Desk x={440} y={320} isPixel={isPixel} />

      {/* Server rack */}
      <ServerRack x={580} y={100} isPixel={isPixel} />
      <ServerRack x={580} y={240} isPixel={isPixel} />

      {/* Agents */}
      {agents.map((agent) => (
        <AgentSprite key={agent.id} agent={agent} isPixel={isPixel} />
      ))}

      {/* Room labels */}
      <div className={`absolute left-4 top-4 ${isPixel ? 'pixel-text text-xs' : 'text-sm font-medium'} text-zinc-500`}>
        Trading Floor
      </div>
      <div className={`absolute right-4 top-4 ${isPixel ? 'pixel-text text-xs' : 'text-sm font-medium'} text-zinc-500`}>
        Server Room
      </div>
    </div>
  );
}
