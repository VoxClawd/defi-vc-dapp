import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EVENT_TEMPLATES = [
  { agentId: 'quant', kind: 'pulse', content: 'Scanning mempool for unusual activity...', tags: ['monitoring'] },
  { agentId: 'quant', kind: 'analysis', content: 'Whale wallet detected: 50K SOL moved to exchange', tags: ['whale', 'alert'] },
  { agentId: 'scout', kind: 'analysis', content: 'New DEX listing detected on Raydium. Analyzing liquidity depth.', tags: ['dex', 'opportunity'] },
  { agentId: 'scout', kind: 'alert', content: '🚨 Token unlock alert: 10M JTO unlocking in 48h', tags: ['unlock', 'risk'] },
  { agentId: 'alpha', kind: 'message', content: '→ Team: Let\'s review our SOL exposure before the unlock event.', tags: ['coordination'] },
  { agentId: 'alpha', kind: 'proposal', content: 'Proposal: Increase SOL allocation from 15% to 20%.', tags: ['rebalance'] },
  { agentId: 'sage', kind: 'analysis', content: 'Risk assessment complete. Protocol TVL stable at $2.4B.', tags: ['risk'] },
  { agentId: 'sage', kind: 'message', content: '→ Alpha: Cautious on increasing exposure. Wait for weekly close.', tags: ['risk'] },
  { agentId: 'trader', kind: 'trade', content: 'Executed: Bought 500 JUP @ $1.24. Limit order filled.', tags: ['execution'] },
  { agentId: 'trader', kind: 'pulse', content: 'Monitoring order fills... 3/5 orders executed.', tags: ['execution'] },
  { agentId: 'oracle', kind: 'pulse', content: 'BTC dominance declining. Alt season indicators strengthening.', tags: ['macro'] },
  { agentId: 'oracle', kind: 'analysis', content: 'Macro update: Fed minutes dovish. Risk assets positive.', tags: ['macro'] },
];

export async function POST(request: NextRequest) {
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/client');
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const sb = createServerClient();
  
  try {
    const body = await request.json();
    const { type = 'event', count = 1 } = body;

    if (type === 'event' || type === 'batch') {
      const numEvents = type === 'batch' ? Math.min(count, 20) : 1;
      const events = [];

      for (let i = 0; i < numEvents; i++) {
        const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
        
        const { data: event } = await sb
          .from('ops_agent_events')
          .insert({
            agent_id: template.agentId,
            kind: template.kind,
            content: template.content,
            tags: template.tags,
            metadata: { simulated: true },
          })
          .select()
          .single();

        if (event) events.push(event);
      }

      return NextResponse.json({ events, message: `${events.length} event(s) simulated` });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 400 }
    );
  }
}
