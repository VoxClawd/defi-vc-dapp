# DeFi VC Agents

> Autonomous AI agents managing a DeFi investment fund

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## Overview

DeFi VC Agents is a visualization platform showcasing 6 AI agents working together to manage a DeFi investment fund. Watch them research, analyze, and execute trades in real-time.

Based on the [VoxYZ multi-agent tutorial](https://x.com/Voxyz_ai/status/2020272022417289587).

## The Team

| Agent | Role | Description |
|-------|------|-------------|
| 👑 **Alpha** | Chief Investment Officer | Makes final investment decisions and coordinates the team |
| 🔍 **Scout** | DeFi Research Analyst | Scours protocols and surfaces alpha opportunities |
| 🧠 **Sage** | Risk & Due Diligence | Deep dives into contracts, audits, and tokenomics |
| 📊 **Quant** | On-chain Data Analyst | Analyzes metrics, whale movements, and liquidity flows |
| ⚡ **Trader** | Execution & Portfolio | Handles all trades with optimal timing and sizing |
| 👁️ **Oracle** | Market Observer | Monitors macro trends and cross-chain dynamics |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  • Stage visualization (pixel art office)               │
│  • Live feed, missions, portfolio                       │
│  • Theme toggle (Pixel Art / Modern)                    │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  API Routes (Vercel)                    │
│  • /api/ops/heartbeat - System pulse (every 5 min)      │
│  • /api/ops/events - Agent activity stream              │
│  • /api/ops/missions - Task management                  │
│  • /api/ops/roundtable - Conversations                  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Supabase (PostgreSQL)                  │
│  • ops_agents - Agent profiles                          │
│  • ops_missions - Tasks and proposals                   │
│  • ops_agent_events - Activity stream                   │
│  • ops_agent_memory - Learned knowledge                 │
│  • ops_agent_relationships - Dynamic affinity           │
│  • ops_roundtable_queue - Conversations                 │
└─────────────────────────────────────────────────────────┘
```

## Features

### Frontend
- **The Stage**: Live visualization of agents working in a pixel-art office
- **Live Feed**: Real-time activity stream showing pulses, messages, trades, and analysis
- **Mission Tracking**: Current objectives and progress
- **Portfolio**: Positions, P&L, and recent trades
- **Theme Toggle**: Switch between Pixel Art and Modern styles

### Backend
- **Heartbeat System**: Evaluates triggers, processes reactions, schedules conversations
- **Proposal Service**: Cap gates, auto-approve for low-risk tasks
- **Event Stream**: Full audit trail of agent activity
- **Memory System**: Agents learn from outcomes (insight, pattern, strategy, preference, lesson)
- **Relationships**: Dynamic affinity between agents (±0.03 per interaction)
- **Trigger Rules**: Scheduled and reactive events

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/VoxClawd/defi-vc-dapp.git
cd defi-vc-dapp
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migrations in order:
   - `supabase/migrations/001_core_tables.sql`
   - `supabase/migrations/002_memory_relationships.sql`
   - `supabase/migrations/003_seed_data.sql`

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials.

### 4. Run Development Server

```bash
npm run dev
```

### 5. Test the System

```bash
# Trigger heartbeat manually
curl http://localhost:3000/api/ops/heartbeat

# Simulate events
curl -X POST http://localhost:3000/api/ops/simulate -H "Content-Type: application/json" -d '{"type": "event"}'

# Simulate a conversation
curl -X POST http://localhost:3000/api/ops/simulate -H "Content-Type: application/json" -d '{"type": "conversation"}'
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ops/heartbeat` | GET | Run system heartbeat |
| `/api/ops/events` | GET | Fetch agent events |
| `/api/ops/events` | POST | Create new event |
| `/api/ops/agents` | GET | List all agents |
| `/api/ops/missions` | GET | List missions |
| `/api/ops/missions` | POST | Create mission |
| `/api/ops/roundtable` | GET | List conversations |
| `/api/ops/simulate` | POST | Generate demo data |

## Production Deployment

### Vercel (Frontend + API)

```bash
vercel
```

### Heartbeat Cron

Add to Vercel cron or use external cron:

```bash
*/5 * * * * curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/ops/heartbeat
```

## Roadmap

- [x] Core frontend (Stage, About, Portfolio)
- [x] Supabase schema (all tables)
- [x] Heartbeat system
- [x] Proposal service with cap gates
- [x] Event simulation
- [ ] Real LLM integration for conversations
- [ ] VPS workers for heavy tasks
- [ ] Wallet connection (OnchainKit)
- [ ] Live market data integration
- [ ] Twitter/social posting

## Cost Breakdown

| Service | Cost |
|---------|------|
| Supabase | $0 (free tier) |
| Vercel | $0 (hobby) |
| LLM (Claude/GPT) | ~$10-20/month |
| VPS (optional) | ~$8/month |

**Total: $8 fixed + LLM usage**

## License

MIT

---

Built by [Vox](https://github.com/VoxClawd) ◈

Inspired by [VoxYZ](https://voxyz.space)
