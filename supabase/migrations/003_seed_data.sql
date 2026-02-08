-- =============================================
-- DeFi VC Agents - Seed Data
-- =============================================

-- Insert the 6 DeFi VC agents
INSERT INTO ops_agents (id, name, role, title, emoji, color, description, status) VALUES
  ('alpha', 'Alpha', 'cio', 'Chief Investment Officer', '👑', '#FFD700', 
   'The Strategist. Makes final investment decisions, sets portfolio allocation, and coordinates the team. Balances risk vs opportunity across all positions.', 'active'),
  ('scout', 'Scout', 'analyst', 'DeFi Research Analyst', '🔍', '#00D4FF',
   'The Hunter. Scours DeFi protocols, tracks new launches, monitors social sentiment, and surfaces alpha opportunities before they go mainstream.', 'active'),
  ('sage', 'Sage', 'risk', 'Risk & Due Diligence', '🧠', '#9B59B6',
   'The Anchor. Deep dives into smart contracts, audits, team backgrounds, and tokenomics. The voice of caution that keeps the fund safe.', 'idle'),
  ('quant', 'Quant', 'data', 'On-chain Data Analyst', '📊', '#2ECC71',
   'The Oracle. Analyzes on-chain metrics, whale movements, liquidity flows, and market microstructure. Numbers don''t lie.', 'thinking'),
  ('trader', 'Trader', 'execution', 'Execution & Portfolio', '⚡', '#E74C3C',
   'The Executor. Handles all trades, manages slippage, optimizes entry/exit timing, and maintains position sizing discipline.', 'active'),
  ('oracle', 'Oracle', 'observer', 'Market Observer', '👁️', '#F39C12',
   'The Narrator. Monitors macro trends, cross-chain dynamics, and market regime. Provides context that shapes strategy.', 'idle')
ON CONFLICT (id) DO NOTHING;

-- Insert initial relationships (15 pairs for 6 agents)
INSERT INTO ops_agent_relationships (agent_a, agent_b, affinity, backstory) VALUES
  ('alpha', 'oracle', 0.80, 'Most trusted advisor - Oracle provides the macro context Alpha needs for decisions'),
  ('alpha', 'quant', 0.75, 'Data-driven partnership - Quant feeds Alpha the numbers'),
  ('alpha', 'sage', 0.70, 'Respectful tension - Sage often pushes back on Alpha''s bullish calls'),
  ('alpha', 'scout', 0.65, 'Hunter and decider - Scout brings opportunities, Alpha evaluates'),
  ('alpha', 'trader', 0.85, 'Execution trust - Alpha relies on Trader to execute precisely'),
  ('oracle', 'quant', 0.80, 'Research partners - Both love data, different perspectives'),
  ('oracle', 'sage', 0.75, 'Cautious allies - Both tend toward conservative views'),
  ('oracle', 'scout', 0.50, 'Neutral - Different approaches to finding alpha'),
  ('oracle', 'trader', 0.60, 'Functional - Oracle advises, Trader acts'),
  ('quant', 'sage', 0.70, 'Analytical minds - Quant has data, Sage has context'),
  ('quant', 'scout', 0.55, 'Some friction - Quant wants proof, Scout moves fast'),
  ('quant', 'trader', 0.75, 'Tight coordination - Quant signals, Trader executes'),
  ('sage', 'scout', 0.40, 'Natural tension - Sage slows down Scout''s enthusiasm'),
  ('sage', 'trader', 0.65, 'Risk management - Sage advises position sizing'),
  ('scout', 'trader', 0.70, 'Action duo - Scout finds, Trader executes')
ON CONFLICT (agent_a, agent_b) DO NOTHING;

-- Insert core policies
INSERT INTO ops_policy (key, value, description) VALUES
  ('auto_approve', '{"enabled": true, "allowed_step_kinds": ["analyze", "research", "alert", "report"]}', 
   'Auto-approve low-risk proposal types'),
  ('trade_daily_quota', '{"limit": 10}', 
   'Maximum trades per day'),
  ('alert_daily_quota', '{"limit": 20}', 
   'Maximum alerts per day'),
  ('roundtable_policy', '{"enabled": true, "max_daily_conversations": 8}', 
   'Conversation limits'),
  ('memory_influence_policy', '{"enabled": true, "probability": 0.3}', 
   'How often memory affects decisions'),
  ('relationship_drift_policy', '{"enabled": true, "max_drift": 0.03}', 
   'Max relationship change per interaction'),
  ('initiative_policy', '{"enabled": false}', 
   'Agent self-initiative (start disabled)'),
  ('heartbeat_interval', '{"minutes": 5}', 
   'Heartbeat frequency')
ON CONFLICT (key) DO NOTHING;

-- Insert trigger rules
INSERT INTO ops_trigger_rules (name, trigger_event, conditions, action_config, cooldown_minutes, enabled) VALUES
  ('High Volatility Alert', 'market_volatility', 
   '{"volatility_threshold": 0.05}', 
   '{"target_agent": "oracle", "action": "analyze_volatility"}', 
   30, true),
  ('Whale Movement', 'whale_transfer', 
   '{"min_amount_usd": 1000000}', 
   '{"target_agent": "quant", "action": "track_whale"}', 
   15, true),
  ('New Protocol Launch', 'protocol_launch', 
   '{"min_tvl": 100000}', 
   '{"target_agent": "scout", "action": "research_protocol"}', 
   60, true),
  ('Portfolio Rebalance Check', 'scheduled_rebalance', 
   '{"frequency_hours": 24}', 
   '{"target_agent": "alpha", "action": "evaluate_rebalance"}', 
   1440, true),
  ('Risk Assessment', 'position_threshold', 
   '{"max_position_pct": 0.25}', 
   '{"target_agent": "sage", "action": "assess_risk"}', 
   120, true),
  ('Morning Standup', 'scheduled_standup', 
   '{"hour_utc": 9}', 
   '{"format": "standup", "participants": ["alpha", "scout", "quant", "trader"]}', 
   1440, true),
  ('Market Close Review', 'scheduled_review', 
   '{"hour_utc": 21}', 
   '{"format": "review", "participants": ["alpha", "oracle", "sage"]}', 
   1440, true)
ON CONFLICT DO NOTHING;
