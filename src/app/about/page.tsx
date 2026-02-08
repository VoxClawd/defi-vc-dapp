'use client';

import { useTheme } from '@/hooks/useTheme';
import { agents } from '@/data/agents';
import { Agent } from '@/lib/types';

function AgentCard({ agent, isPixel }: { agent: Agent; isPixel: boolean }) {
  const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    thinking: 'bg-blue-500',
    offline: 'bg-zinc-500',
  };

  return (
    <div
      className={`border border-zinc-800 p-6 transition-all hover:border-zinc-700 ${
        isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/70'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`flex h-16 w-16 items-center justify-center text-3xl ${
            isPixel ? '' : 'rounded-xl'
          }`}
          style={{
            background: isPixel ? agent.color : `linear-gradient(135deg, ${agent.color}, ${agent.color}66)`,
            boxShadow: isPixel
              ? `3px 3px 0 0 ${agent.color}66`
              : `0 8px 32px -8px ${agent.color}66`,
          }}
        >
          {agent.emoji}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`font-bold ${isPixel ? 'pixel-text' : 'text-xl'}`}
              style={{ color: agent.color }}
            >
              {agent.name}
            </h3>
            <div className={`h-2 w-2 ${statusColors[agent.status]} ${isPixel ? '' : 'rounded-full'}`} />
          </div>
          <p className="text-sm text-zinc-400">{agent.title}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-300">
        {agent.description}
      </p>

      {/* Stats */}
      <div className="mt-4 flex gap-4 border-t border-zinc-800 pt-4">
        <div>
          <p className="text-xs text-zinc-500">Status</p>
          <p className="text-sm capitalize text-zinc-300">{agent.status}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Role</p>
          <p className="text-sm uppercase text-zinc-300">{agent.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`font-bold text-white ${isPixel ? 'pixel-text text-xl' : 'text-4xl'}`}>
          About
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Meet the team of autonomous AI agents managing our DeFi investment fund.
          Each agent has specialized skills and works together to identify opportunities,
          manage risk, and execute trades.
        </p>
      </div>

      {/* Mission statement */}
      <div
        className={`border border-zinc-800 p-6 ${
          isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5'
        }`}
      >
        <h2 className={`font-semibold text-amber-400 ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
          Our Mission
        </h2>
        <p className="mt-2 text-zinc-300">
          We're building the future of autonomous investing. Our AI agents work 24/7 to analyze
          markets, identify alpha, and execute with precision — all while maintaining strict
          risk management protocols. No sleep. No emotions. Just data-driven decisions.
        </p>
      </div>

      {/* Agent grid */}
      <div>
        <h2 className={`mb-4 font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-2xl'}`}>
          The Team
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} isPixel={isPixel} />
          ))}
        </div>
      </div>

      {/* How it works */}
      <div
        className={`border border-zinc-800 p-6 ${
          isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50'
        }`}
      >
        <h2 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-2xl'}`}>
          How It Works
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2 text-2xl">🔍</div>
            <h3 className="font-medium text-white">Research</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Scout and Oracle continuously monitor markets, social sentiment, and on-chain data
              to surface opportunities.
            </p>
          </div>
          <div>
            <div className="mb-2 text-2xl">🧠</div>
            <h3 className="font-medium text-white">Analysis</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Quant runs the numbers while Sage performs due diligence. Alpha synthesizes
              everything into investment decisions.
            </p>
          </div>
          <div>
            <div className="mb-2 text-2xl">⚡</div>
            <h3 className="font-medium text-white">Execution</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Trader executes positions with optimal timing and sizing, managing slippage
              and maintaining portfolio balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
