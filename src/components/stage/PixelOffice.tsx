'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { agents } from '@/data/agents';
import { Agent } from '@/lib/types';

interface AgentSpriteProps {
  agent: Agent;
  isPixel: boolean;
  isAnimated: boolean;
}

function AgentSprite({ agent, isPixel, isAnimated }: AgentSpriteProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!isAnimated) return;
    
    // Random movement
    const moveInterval = setInterval(() => {
      setOffset({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 10,
      });
    }, 2000 + Math.random() * 2000);

    // Random thinking state
    const thinkInterval = setInterval(() => {
      setIsThinking(Math.random() > 0.7);
    }, 3000 + Math.random() * 3000);

    return () => {
      clearInterval(moveInterval);
      clearInterval(thinkInterval);
    };
  }, [isAnimated]);

  const statusColors = {
    active: '#22c55e',
    idle: '#eab308',
    thinking: '#3b82f6',
    offline: '#71717a',
  };

  const baseX = agent.position?.x || 0;
  const baseY = agent.position?.y || 0;

  if (isPixel) {
    return (
      <div
        className="absolute flex flex-col items-center transition-all duration-1000 ease-in-out"
        style={{
          left: baseX + offset.x,
          top: baseY + offset.y,
        }}
      >
        {/* Thinking bubble */}
        {isThinking && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="bg-zinc-800 px-2 py-1 text-xs">💭</div>
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-800" />
          </div>
        )}
        
        {/* Pixel avatar */}
        <div
          className="relative flex h-12 w-12 items-center justify-center text-2xl transition-transform hover:scale-110"
          style={{
            backgroundColor: agent.color,
            boxShadow: `0 4px 0 0 ${agent.color}66, inset -2px -2px 0 0 rgba(0,0,0,0.3), inset 2px 2px 0 0 rgba(255,255,255,0.1)`,
            imageRendering: 'pixelated',
          }}
        >
          {agent.emoji}
          {/* Status indicator */}
          <div
            className="absolute -bottom-1 -right-1 h-3 w-3 animate-pulse"
            style={{
              backgroundColor: statusColors[agent.status],
              boxShadow: `0 0 6px ${statusColors[agent.status]}`,
            }}
          />
        </div>
        
        {/* Name tag */}
        <div
          className="mt-1 bg-zinc-900/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
          style={{ color: agent.color, textShadow: `0 0 10px ${agent.color}66` }}
        >
          {agent.name}
        </div>
      </div>
    );
  }

  // Modern style
  return (
    <div
      className="absolute flex flex-col items-center transition-all duration-1000 ease-in-out"
      style={{
        left: baseX + offset.x,
        top: baseY + offset.y,
      }}
    >
      {isThinking && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="rounded-full bg-zinc-800/90 px-3 py-1 text-sm backdrop-blur-sm">💭</div>
        </div>
      )}
      
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${agent.color}, ${agent.color}88)`,
          boxShadow: `0 4px 20px ${agent.color}44`,
        }}
      >
        {agent.emoji}
        <div
          className="absolute -bottom-0.5 -right-0.5 h-4 w-4 animate-pulse rounded-full border-2 border-zinc-900"
          style={{ 
            backgroundColor: statusColors[agent.status],
            boxShadow: `0 0 8px ${statusColors[agent.status]}`,
          }}
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

function Desk({ x, y, isPixel, hasMonitor = true }: { x: number; y: number; isPixel: boolean; hasMonitor?: boolean }) {
  const [screenGlow, setScreenGlow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScreenGlow(prev => !prev);
    }, 2000 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isPixel) {
    return (
      <div className="absolute" style={{ left: x, top: y }}>
        {/* Desk surface */}
        <div
          className="h-8 w-24 bg-gradient-to-b from-zinc-600 to-zinc-700"
          style={{
            boxShadow: '3px 3px 0 0 rgba(0,0,0,0.5), inset -2px -2px 0 0 rgba(0,0,0,0.3)',
          }}
        />
        {/* Chair */}
        <div
          className="absolute -bottom-4 left-8 h-6 w-8 bg-zinc-800"
          style={{ boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)' }}
        />
        {/* Monitor */}
        {hasMonitor && (
          <div
            className="absolute -top-12 left-4 h-10 w-16 bg-zinc-800"
            style={{ boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)' }}
          >
            <div 
              className="m-1 h-8 w-14 transition-all duration-500"
              style={{ 
                backgroundColor: screenGlow ? '#1e3a5f' : '#0f172a',
                boxShadow: screenGlow ? '0 0 10px #3b82f6' : 'none',
              }}
            >
              {/* Screen content lines */}
              <div className="space-y-1 p-1">
                <div className="h-1 w-10 bg-green-500/50" />
                <div className="h-1 w-8 bg-blue-500/50" />
                <div className="h-1 w-12 bg-amber-500/50" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div className="h-6 w-28 rounded-lg bg-gradient-to-b from-zinc-600 to-zinc-700 shadow-lg" />
      {hasMonitor && (
        <div className="absolute -top-14 left-4 h-12 w-20 rounded-lg bg-zinc-800 shadow-lg">
          <div 
            className="m-1.5 h-9 w-17 rounded transition-all duration-500"
            style={{
              background: screenGlow 
                ? 'linear-gradient(135deg, #1e3a5f, #1e1b4b)' 
                : 'linear-gradient(135deg, #0f172a, #0c0a1d)',
              boxShadow: screenGlow ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}

function ServerRack({ x, y, isPixel }: { x: number; y: number; isPixel: boolean }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div
        className={`${isPixel ? 'h-28 w-14' : 'h-32 w-18 rounded-lg'} bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-xl`}
        style={isPixel ? { boxShadow: '3px 3px 0 0 rgba(0,0,0,0.5)' } : {}}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`mx-2 mt-2 flex h-4 items-center gap-1 bg-zinc-900 px-1 ${isPixel ? '' : 'rounded'}`}
          >
            <div 
              className={`h-2 w-2 ${isPixel ? '' : 'rounded-full'}`}
              style={{
                backgroundColor: ['#22c55e', '#eab308', '#22c55e', '#3b82f6', '#22c55e'][i],
                boxShadow: `0 0 6px ${['#22c55e', '#eab308', '#22c55e', '#3b82f6', '#22c55e'][i]}`,
                animation: `pulse ${1 + i * 0.3}s ease-in-out infinite`,
              }}
            />
            <div className={`h-1 flex-1 bg-zinc-700 ${isPixel ? '' : 'rounded'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TradingChart({ x, y, isPixel }: { x: number; y: number; isPixel: boolean }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div 
        className={`${isPixel ? 'h-20 w-32' : 'h-24 w-36 rounded-lg'} bg-zinc-800 p-2`}
        style={isPixel ? { boxShadow: '3px 3px 0 0 rgba(0,0,0,0.5)' } : { boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
      >
        <div className="text-xs text-green-400">SOL/USD</div>
        <svg className="h-12 w-full" viewBox="0 0 100 40">
          <polyline
            points="0,35 15,30 25,32 35,20 45,22 55,15 65,18 75,10 85,12 100,5"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
          />
          <polyline
            points="0,35 15,30 25,32 35,20 45,22 55,15 65,18 75,10 85,12 100,5"
            fill="url(#gradient)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-right text-xs text-zinc-400">+12.4%</div>
      </div>
    </div>
  );
}

function Whiteboard({ x, y, isPixel }: { x: number; y: number; isPixel: boolean }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div 
        className={`${isPixel ? 'h-16 w-24' : 'h-20 w-28 rounded-lg'} bg-zinc-100 p-2`}
        style={isPixel ? { boxShadow: '3px 3px 0 0 rgba(0,0,0,0.5)' } : {}}
      >
        <div className="space-y-1">
          <div className="h-1.5 w-16 rounded bg-blue-400" />
          <div className="h-1.5 w-12 rounded bg-red-400" />
          <div className="h-1.5 w-20 rounded bg-green-400" />
          <div className="h-1.5 w-8 rounded bg-amber-400" />
        </div>
      </div>
      <div className={`text-center text-xs mt-1 ${isPixel ? 'pixel-text' : ''} text-zinc-500`}>
        Q1 GOALS
      </div>
    </div>
  );
}

export function PixelOffice() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';
  const [isAnimated, setIsAnimated] = useState(true);

  return (
    <div className="relative">
      {/* Animation toggle */}
      <button
        onClick={() => setIsAnimated(!isAnimated)}
        className={`absolute right-2 top-2 z-10 px-2 py-1 text-xs ${
          isPixel ? 'bg-zinc-800' : 'rounded-lg bg-zinc-800/80 backdrop-blur-sm'
        } text-zinc-400 hover:text-white transition-colors`}
      >
        {isAnimated ? '⏸️ Pause' : '▶️ Play'}
      </button>

      <div
        className={`relative h-[420px] w-full overflow-hidden ${
          isPixel
            ? 'bg-zinc-900'
            : 'rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-zinc-900'
        }`}
        style={isPixel ? {
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
        } : {}}
      >
        {/* Floor gradient */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/3"
          style={{
            background: isPixel 
              ? 'linear-gradient(to top, rgba(39, 39, 42, 0.8), transparent)'
              : 'linear-gradient(to top, rgba(39, 39, 42, 0.5), transparent)',
          }}
        />

        {/* Room divider */}
        <div
          className={`absolute left-2/3 top-0 h-full w-px ${
            isPixel ? 'bg-zinc-700' : 'bg-gradient-to-b from-transparent via-zinc-700/50 to-transparent'
          }`}
        />

        {/* Desks - Trading floor */}
        <Desk x={80} y={180} isPixel={isPixel} />
        <Desk x={220} y={180} isPixel={isPixel} />
        <Desk x={80} y={280} isPixel={isPixel} />
        <Desk x={220} y={280} isPixel={isPixel} />
        <Desk x={360} y={230} isPixel={isPixel} />

        {/* Server rack area */}
        <ServerRack x={520} y={80} isPixel={isPixel} />
        <ServerRack x={560} y={80} isPixel={isPixel} />
        <ServerRack x={520} y={220} isPixel={isPixel} />

        {/* Trading chart display */}
        <TradingChart x={480} y={340} isPixel={isPixel} />

        {/* Whiteboard */}
        <Whiteboard x={340} y={60} isPixel={isPixel} />

        {/* Agents */}
        {agents.map((agent) => (
          <AgentSprite key={agent.id} agent={agent} isPixel={isPixel} isAnimated={isAnimated} />
        ))}

        {/* Room labels */}
        <div className={`absolute left-4 top-4 ${isPixel ? 'pixel-text text-xs' : 'text-sm font-medium'} text-zinc-500`}>
          🏢 Trading Floor
        </div>
        <div className={`absolute right-4 top-4 ${isPixel ? 'pixel-text text-xs' : 'text-sm font-medium'} text-zinc-500`}>
          🖥️ Server Room
        </div>

        {/* Activity particles */}
        {isAnimated && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-amber-400/30"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animation: `float ${3 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
