import { Agent } from '@/lib/types';

export const agents: Agent[] = [
  {
    id: 'alpha',
    name: 'Alpha',
    role: 'cio',
    title: 'Chief Investment Officer',
    emoji: '👑',
    color: '#FFD700',
    description: 'The Strategist. Makes final investment decisions, sets portfolio allocation, and coordinates the team. Balances risk vs opportunity across all positions.',
    avatar: '/agents/alpha.png',
    position: { x: 180, y: 120 },
    status: 'active',
  },
  {
    id: 'scout',
    name: 'Scout',
    role: 'analyst',
    title: 'DeFi Research Analyst',
    emoji: '🔍',
    color: '#00D4FF',
    description: 'The Hunter. Scours DeFi protocols, tracks new launches, monitors social sentiment, and surfaces alpha opportunities before they go mainstream.',
    avatar: '/agents/scout.png',
    position: { x: 340, y: 180 },
    status: 'active',
  },
  {
    id: 'sage',
    name: 'Sage',
    role: 'risk',
    title: 'Risk & Due Diligence',
    emoji: '🧠',
    color: '#9B59B6',
    description: 'The Anchor. Deep dives into smart contracts, audits, team backgrounds, and tokenomics. The voice of caution that keeps the fund safe.',
    avatar: '/agents/sage.png',
    position: { x: 500, y: 120 },
    status: 'idle',
  },
  {
    id: 'quant',
    name: 'Quant',
    role: 'data',
    title: 'On-chain Data Analyst',
    emoji: '📊',
    color: '#2ECC71',
    description: 'The Oracle. Analyzes on-chain metrics, whale movements, liquidity flows, and market microstructure. Numbers don\'t lie.',
    avatar: '/agents/quant.png',
    position: { x: 180, y: 280 },
    status: 'thinking',
  },
  {
    id: 'trader',
    name: 'Trader',
    role: 'execution',
    title: 'Execution & Portfolio',
    emoji: '⚡',
    color: '#E74C3C',
    description: 'The Executor. Handles all trades, manages slippage, optimizes entry/exit timing, and maintains position sizing discipline.',
    avatar: '/agents/trader.png',
    position: { x: 340, y: 340 },
    status: 'active',
  },
  {
    id: 'oracle',
    name: 'Oracle',
    role: 'observer',
    title: 'Market Observer',
    emoji: '👁️',
    color: '#F39C12',
    description: 'The Narrator. Monitors macro trends, cross-chain dynamics, and market regime. Provides context that shapes strategy.',
    avatar: '/agents/oracle.png',
    position: { x: 500, y: 280 },
    status: 'idle',
  },
];

export const getAgent = (id: string): Agent | undefined => {
  return agents.find(a => a.id === id);
};

export const getAgentsByStatus = (status: Agent['status']): Agent[] => {
  return agents.filter(a => a.status === status);
};
