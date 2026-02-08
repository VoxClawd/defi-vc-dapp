-- =============================================
-- DeFi VC Agents - Memory & Relationships
-- =============================================

-- Agent Memory - learned knowledge
CREATE TABLE IF NOT EXISTS ops_agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES ops_agents(id),
  type TEXT NOT NULL CHECK (type IN ('insight', 'pattern', 'strategy', 'preference', 'lesson')),
  content TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.60 CHECK (confidence >= 0 AND confidence <= 1),
  tags TEXT[] DEFAULT '{}',
  source_type TEXT, -- conversation, outcome, mission
  source_trace_id TEXT, -- for idempotent dedup
  superseded_by UUID REFERENCES ops_agent_memory(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agent Relationships - dynamic affinity between agents
CREATE TABLE IF NOT EXISTS ops_agent_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_a TEXT NOT NULL REFERENCES ops_agents(id),
  agent_b TEXT NOT NULL REFERENCES ops_agents(id),
  affinity NUMERIC(3,2) NOT NULL DEFAULT 0.50 CHECK (affinity >= 0.10 AND affinity <= 0.95),
  total_interactions INTEGER DEFAULT 0,
  positive_interactions INTEGER DEFAULT 0,
  negative_interactions INTEGER DEFAULT 0,
  drift_log JSONB DEFAULT '[]',
  backstory TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_a, agent_b),
  CHECK(agent_a < agent_b) -- alphabetical ordering ensures uniqueness
);

-- Trigger rules - what conditions trigger actions
CREATE TABLE IF NOT EXISTS ops_trigger_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  action_config JSONB DEFAULT '{}',
  cooldown_minutes INTEGER DEFAULT 60,
  enabled BOOLEAN DEFAULT true,
  fire_count INTEGER DEFAULT 0,
  last_fired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agent Reactions queue
CREATE TABLE IF NOT EXISTS ops_agent_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_agent_id TEXT NOT NULL REFERENCES ops_agents(id),
  target_agent_id TEXT NOT NULL REFERENCES ops_agents(id),
  trigger_event_id UUID REFERENCES ops_agent_events(id),
  reaction_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Roundtable conversations queue
CREATE TABLE IF NOT EXISTS ops_roundtable_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format TEXT NOT NULL, -- standup, debate, watercooler, brainstorm, etc.
  topic TEXT,
  participants TEXT[] NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'succeeded', 'failed', 'cancelled')),
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  messages JSONB DEFAULT '[]',
  extracted_memories JSONB DEFAULT '[]',
  extracted_drift JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Initiative queue - agents proposing their own ideas
CREATE TABLE IF NOT EXISTS ops_initiative_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL REFERENCES ops_agents(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  generated_proposal_id UUID REFERENCES ops_mission_proposals(id),
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Action runs - audit log for heartbeat actions
CREATE TABLE IF NOT EXISTS ops_action_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'succeeded', 'failed')),
  details JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_memory_agent ON ops_agent_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_memory_type ON ops_agent_memory(type);
CREATE INDEX IF NOT EXISTS idx_memory_confidence ON ops_agent_memory(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_relationships_agents ON ops_agent_relationships(agent_a, agent_b);
CREATE INDEX IF NOT EXISTS idx_roundtable_status ON ops_roundtable_queue(status);
CREATE INDEX IF NOT EXISTS idx_reactions_status ON ops_agent_reactions(status);
CREATE INDEX IF NOT EXISTS idx_initiative_status ON ops_initiative_queue(status);

-- Update trigger for relationships
CREATE TRIGGER update_relationships_updated_at
  BEFORE UPDATE ON ops_agent_relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
