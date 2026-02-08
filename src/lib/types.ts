// Agent Types
export interface Agent {
  id: string;
  name: string;
  role: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
  avatar: string;
  position?: { x: number; y: number };
  status: 'active' | 'idle' | 'thinking' | 'offline';
}

// Event Types
export type EventType = 'pulse' | 'message' | 'proposal' | 'trade' | 'analysis' | 'alert';

export interface AgentEvent {
  id: string;
  timestamp: Date;
  agentId: string;
  type: EventType;
  content: string;
  metadata?: {
    targetAgent?: string;
    token?: string;
    amount?: number;
    sentiment?: 'bullish' | 'bearish' | 'neutral';
    priority?: 'low' | 'medium' | 'high';
  };
}

// Mission Types
export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
  totalSteps: number;
  currentStep: number;
  assignedAgents: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Types
export interface Position {
  id: string;
  token: string;
  symbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  chain: string;
}

export interface Trade {
  id: string;
  timestamp: Date;
  type: 'buy' | 'sell';
  token: string;
  symbol: string;
  amount: number;
  price: number;
  total: number;
  agentId: string;
  reason: string;
}

// Theme Types
export type ThemeStyle = 'pixel' | 'modern';

export interface ThemeConfig {
  style: ThemeStyle;
  isDark: boolean;
}
