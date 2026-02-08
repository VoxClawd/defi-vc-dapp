// Database types for Supabase

export interface DbAgent {
  id: string;
  name: string;
  role: string;
  title: string;
  emoji: string;
  color: string;
  description: string | null;
  status: 'active' | 'idle' | 'thinking' | 'offline';
  created_at: string;
  updated_at: string;
}

export interface DbProposal {
  id: string;
  agent_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  proposed_steps: ProposedStep[];
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface ProposedStep {
  kind: string;
  title: string;
  payload?: Record<string, unknown>;
}

export interface DbMission {
  id: string;
  proposal_id: string | null;
  title: string;
  description: string | null;
  status: 'approved' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  created_by: string | null;
  assigned_agents: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  progress: number;
  total_steps: number;
  current_step: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMissionStep {
  id: string;
  mission_id: string;
  kind: string;
  title: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'skipped';
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  error_message: string | null;
  reserved_by: string | null;
  step_order: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface DbEvent {
  id: string;
  agent_id: string;
  kind: 'pulse' | 'message' | 'proposal' | 'trade' | 'analysis' | 'alert';
  title: string | null;
  content: string;
  summary: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  mission_id: string | null;
  created_at: string;
}

export interface DbMemory {
  id: string;
  agent_id: string;
  type: 'insight' | 'pattern' | 'strategy' | 'preference' | 'lesson';
  content: string;
  confidence: number;
  tags: string[];
  source_type: string | null;
  source_trace_id: string | null;
  superseded_by: string | null;
  created_at: string;
}

export interface DbRelationship {
  id: string;
  agent_a: string;
  agent_b: string;
  affinity: number;
  total_interactions: number;
  positive_interactions: number;
  negative_interactions: number;
  drift_log: DriftEntry[];
  backstory: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriftEntry {
  drift: number;
  reason: string;
  conversation_id?: string;
  at: string;
}

export interface DbRoundtable {
  id: string;
  format: string;
  topic: string | null;
  participants: string[];
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  scheduled_for: string;
  started_at: string | null;
  completed_at: string | null;
  messages: RoundtableMessage[];
  extracted_memories: unknown[];
  extracted_drift: unknown[];
  created_at: string;
}

export interface RoundtableMessage {
  speaker: string;
  content: string;
  turn: number;
  timestamp: string;
}

export interface DbPolicy {
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_at: string;
}

export interface DbTriggerRule {
  id: string;
  name: string;
  trigger_event: string;
  conditions: Record<string, unknown>;
  action_config: Record<string, unknown>;
  cooldown_minutes: number;
  enabled: boolean;
  fire_count: number;
  last_fired_at: string | null;
  created_at: string;
}
