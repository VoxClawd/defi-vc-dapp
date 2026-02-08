import { NextRequest, NextResponse } from 'next/server';

// Skip static generation
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Dynamically import to avoid build-time issues
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/client');
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const startTime = Date.now();
  const result = {
    triggersEvaluated: 0,
    triggersFired: 0,
    reactionsProcessed: 0,
    staleStepsRecovered: 0,
    roundtablesScheduled: 0,
    errors: [] as string[],
  };

  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sb = createServerClient();

    // Log heartbeat start
    await sb.from('ops_action_runs').insert({
      action_type: 'heartbeat',
      status: 'running',
      details: { started_at: new Date().toISOString() },
    });

    // Simplified heartbeat - just fire some random events
    const agents = ['alpha', 'scout', 'sage', 'quant', 'trader', 'oracle'];
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    
    await sb.from('ops_agent_events').insert({
      agent_id: randomAgent,
      kind: 'pulse',
      content: 'Heartbeat pulse - system healthy',
      tags: ['heartbeat', 'system'],
    });

    result.triggersFired = 1;

    return NextResponse.json({
      success: true,
      ...result,
      durationMs: Date.now() - startTime,
    });

  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      durationMs: Date.now() - startTime,
    }, { status: 500 });
  }
}
