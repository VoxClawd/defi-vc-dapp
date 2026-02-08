'use client';

import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { agents } from '@/data/agents';
import { Agent } from '@/lib/types';

function AgentCard({ agent, isPixel, isSelected, onSelect }: { 
  agent: Agent; 
  isPixel: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const statusColors = {
    active: { bg: 'bg-green-500', text: 'text-green-400', label: 'Active' },
    idle: { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Idle' },
    thinking: { bg: 'bg-blue-500', text: 'text-blue-400', label: 'Thinking' },
    offline: { bg: 'bg-zinc-500', text: 'text-zinc-400', label: 'Offline' },
  };

  const status = statusColors[agent.status];

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer border p-6 transition-all ${
        isSelected 
          ? 'border-amber-500/50 bg-amber-500/5' 
          : 'border-zinc-800 hover:border-zinc-700'
      } ${isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/70'}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div
            className={`flex h-16 w-16 items-center justify-center text-3xl transition-transform hover:scale-110 ${
              isPixel ? '' : 'rounded-xl'
            }`}
            style={{
              background: isPixel ? agent.color : `linear-gradient(135deg, ${agent.color}, ${agent.color}66)`,
              boxShadow: isPixel
                ? `4px 4px 0 0 ${agent.color}44`
                : `0 8px 32px -8px ${agent.color}66`,
            }}
          >
            {agent.emoji}
          </div>
          {/* Status pulse */}
          <div 
            className={`absolute -bottom-1 -right-1 h-4 w-4 ${status.bg} ${isPixel ? '' : 'rounded-full'}`}
            style={{ 
              boxShadow: `0 0 10px ${agent.status === 'active' ? '#22c55e' : '#eab308'}`,
              animation: agent.status === 'active' ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          />
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
            <span className={`text-xs ${status.text}`}>{status.label}</span>
          </div>
          <p className="text-sm text-zinc-400">{agent.title}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-300">
        {agent.description}
      </p>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800 pt-4">
        <div>
          <p className="text-xs text-zinc-500">Decisions</p>
          <p className="text-lg font-bold text-white">{Math.floor(Math.random() * 500) + 100}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Accuracy</p>
          <p className="text-lg font-bold text-green-400">{(75 + Math.random() * 20).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Uptime</p>
          <p className="text-lg font-bold text-white">99.{Math.floor(Math.random() * 9)}%</p>
        </div>
      </div>
    </div>
  );
}

function AgentRelationshipGraph({ isPixel }: { isPixel: boolean }) {
  return (
    <div className={`border border-zinc-800 p-6 ${isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50'}`}>
      <h3 className={`mb-4 font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
        Agent Relationships
      </h3>
      <div className="relative h-64">
        {/* Central node - Alpha */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div 
            className={`flex h-12 w-12 items-center justify-center text-xl ${isPixel ? '' : 'rounded-full'}`}
            style={{ backgroundColor: '#FFD700', boxShadow: '0 0 20px #FFD70066' }}
          >
            👑
          </div>
          <p className="mt-1 text-center text-xs text-amber-400">Alpha</p>
        </div>
        
        {/* Surrounding nodes */}
        {[
          { emoji: '🔍', name: 'Scout', color: '#00D4FF', angle: 0 },
          { emoji: '🧠', name: 'Sage', color: '#9B59B6', angle: 60 },
          { emoji: '📊', name: 'Quant', color: '#2ECC71', angle: 120 },
          { emoji: '⚡', name: 'Trader', color: '#E74C3C', angle: 180 },
          { emoji: '👁️', name: 'Oracle', color: '#F39C12', angle: 240 },
        ].map((node, i) => {
          const radius = 90;
          const angleRad = (node.angle - 90) * (Math.PI / 180);
          const x = 50 + Math.cos(angleRad) * 35;
          const y = 50 + Math.sin(angleRad) * 35;
          
          return (
            <div 
              key={node.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* Connection line */}
              <svg className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 overflow-visible">
                <line
                  x1="16"
                  y1="16"
                  x2="64"
                  y2="64"
                  stroke={node.color}
                  strokeWidth="1"
                  opacity="0.3"
                  strokeDasharray="4 4"
                />
              </svg>
              <div 
                className={`relative flex h-8 w-8 items-center justify-center text-sm ${isPixel ? '' : 'rounded-full'}`}
                style={{ backgroundColor: node.color, boxShadow: `0 0 15px ${node.color}66` }}
              >
                {node.emoji}
              </div>
              <p className="mt-1 text-center text-xs" style={{ color: node.color }}>{node.name}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-zinc-500">
        All agents report to Alpha for final investment decisions
      </p>
    </div>
  );
}

export default function AboutPage() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -top-4 left-0 text-6xl opacity-10">◈</div>
        <h1 className={`font-bold text-white ${isPixel ? 'pixel-text text-xl' : 'text-4xl'}`}>
          About DeFi VC
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Meet the team of autonomous AI agents managing our DeFi investment fund.
          Each agent has specialized skills and works together to identify opportunities,
          manage risk, and execute trades 24/7.
        </p>
      </div>

      {/* Mission statement */}
      <div
        className={`relative overflow-hidden border border-amber-500/20 p-6 ${
          isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent'
        }`}
      >
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        <h2 className={`font-semibold text-amber-400 ${isPixel ? 'pixel-text text-sm' : 'text-lg'}`}>
          Our Mission
        </h2>
        <p className="relative mt-2 max-w-3xl text-zinc-300">
          We're building the future of autonomous investing. Our AI agents work around the clock 
          to analyze markets, identify alpha, and execute with precision — all while maintaining 
          strict risk management protocols. <span className="text-amber-400">No sleep. No emotions. Just data-driven decisions.</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-zinc-400">24/7 Market Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-zinc-400">Multi-Agent Consensus</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span className="text-zinc-400">Risk-Adjusted Returns</span>
          </div>
        </div>
      </div>

      {/* Agent grid */}
      <div>
        <h2 className={`mb-4 font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-2xl'}`}>
          The Team
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              isPixel={isPixel}
              isSelected={selectedAgent === agent.id}
              onSelect={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            />
          ))}
        </div>
      </div>

      {/* Relationship graph */}
      <AgentRelationshipGraph isPixel={isPixel} />

      {/* How it works */}
      <div className={`border border-zinc-800 p-6 ${isPixel ? 'bg-zinc-900' : 'rounded-2xl bg-zinc-900/50'}`}>
        <h2 className={`font-semibold text-white ${isPixel ? 'pixel-text text-sm' : 'text-2xl'}`}>
          How It Works
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="relative">
            <div className={`mb-3 flex h-12 w-12 items-center justify-center text-2xl ${isPixel ? 'bg-blue-500' : 'rounded-xl bg-blue-500/20'}`}>
              🔍
            </div>
            <div className="absolute left-14 top-6 hidden h-px w-full bg-gradient-to-r from-blue-500/50 to-transparent md:block" />
            <h3 className="font-medium text-white">1. Research</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Scout and Oracle continuously monitor markets, social sentiment, and on-chain data
              to surface opportunities before they go mainstream.
            </p>
          </div>
          <div className="relative">
            <div className={`mb-3 flex h-12 w-12 items-center justify-center text-2xl ${isPixel ? 'bg-purple-500' : 'rounded-xl bg-purple-500/20'}`}>
              🧠
            </div>
            <div className="absolute left-14 top-6 hidden h-px w-full bg-gradient-to-r from-purple-500/50 to-transparent md:block" />
            <h3 className="font-medium text-white">2. Analysis</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Quant runs the numbers while Sage performs due diligence. Alpha synthesizes
              everything into actionable investment decisions.
            </p>
          </div>
          <div>
            <div className={`mb-3 flex h-12 w-12 items-center justify-center text-2xl ${isPixel ? 'bg-red-500' : 'rounded-xl bg-red-500/20'}`}>
              ⚡
            </div>
            <h3 className="font-medium text-white">3. Execution</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Trader executes positions with optimal timing and sizing, managing slippage
              and maintaining portfolio balance for maximum efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Agents', value: '6', icon: '🤖' },
          { label: 'Decisions/Day', value: '~500', icon: '🎯' },
          { label: 'Avg Response', value: '<2s', icon: '⚡' },
          { label: 'Uptime', value: '99.9%', icon: '📊' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`border border-zinc-800 p-4 text-center ${isPixel ? 'bg-zinc-900' : 'rounded-xl bg-zinc-900/50'}`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className={`mt-2 font-bold text-white ${isPixel ? 'pixel-text text-xl' : 'text-3xl'}`}>
              {stat.value}
            </p>
            <p className="text-sm text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
