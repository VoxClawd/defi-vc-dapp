-- =============================================
-- DeFi VC Agents - Core Tables
-- Based on VoxYZ tutorial architecture
-- =============================================

-- Agents table
CREATE TABLE IF NOT EXISTS ops_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'thinking', 'offline')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mission Proposals - agents propose ideas
CREATE TABLE IF NOT EXISTS ops_mission_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES ops_agents(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  proposed_steps JSONB DEFAULT '[]',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

-- Missions - approved proposals become missions
CREATE TABLE IF NOT EXISTS ops_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES ops_mission_proposals(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'running', 'succeeded', 'failed', 'cancelled')),
  created_by TEXT REFERENCES ops_agents(id),
  assigned_agents TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  progress INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  current_step INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mission Steps - concrete execution steps
CREATE TABLE IF NOT EXISTS ops_mission_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES ops_missions(id) ON DELETE CASCADE,
  kind TEXT NOT NULL, -- analyze, trade, research, alert, report, etc.
  title TEXT NOT NULL,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'skipped')),
  payload JSONB DEFAULT '{}',
  result JSONB,
  error_message TEXT,
  reserved_by TEXT, -- worker that claimed this step
  step_order INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agent Events - the activity stream
CREATE TABLE IF NOT EXISTS ops_agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES ops_agents(id),
  kind TEXT NOT NULL, -- pulse, message, proposal, trade, analysis, alert
  title TEXT,
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  mission_id UUID REFERENCES ops_missions(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Policy table - configuration and feature flags
CREATE TABLE IF NOT EXISTS ops_policy (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_proposals_status ON ops_mission_proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_agent ON ops_mission_proposals(agent_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON ops_missions(status);
CREATE INDEX IF NOT EXISTS idx_steps_status ON ops_mission_steps(status);
CREATE INDEX IF NOT EXISTS idx_steps_mission ON ops_mission_steps(mission_id);
CREATE INDEX IF NOT EXISTS idx_events_agent ON ops_agent_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_events_kind ON ops_agent_events(kind);
CREATE INDEX IF NOT EXISTS idx_events_created ON ops_agent_events(created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON ops_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_missions_updated_at
  BEFORE UPDATE ON ops_missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
