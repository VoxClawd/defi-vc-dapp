import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/client');
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const sb = createServerClient();
  const searchParams = request.nextUrl.searchParams;
  
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');

  let query = sb
    .from('ops_missions')
    .select(`*, steps:ops_mission_steps(*)`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: missions, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ missions });
}

export async function POST(request: NextRequest) {
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/client');
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const sb = createServerClient();
  
  try {
    const body = await request.json();
    const { title, description, created_by, assigned_agents, priority, steps } = body;

    if (!title || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields: title, created_by' },
        { status: 400 }
      );
    }

    const { data: mission, error: missionError } = await sb
      .from('ops_missions')
      .insert({
        title,
        description,
        created_by,
        assigned_agents: assigned_agents || [created_by],
        priority: priority || 'normal',
        total_steps: steps?.length || 0,
        status: 'approved',
      })
      .select()
      .single();

    if (missionError) {
      return NextResponse.json({ error: missionError.message }, { status: 500 });
    }

    if (steps && steps.length > 0) {
      const stepsToInsert = steps.map((step: { kind: string; title: string; payload?: Record<string, unknown> }, index: number) => ({
        mission_id: mission.id,
        kind: step.kind,
        title: step.title,
        payload: step.payload || {},
        step_order: index,
        status: 'queued',
      }));

      await sb.from('ops_mission_steps').insert(stepsToInsert);
    }

    await sb.from('ops_agent_events').insert({
      agent_id: created_by,
      kind: 'proposal',
      title: 'Mission Created',
      content: `New mission: ${title}`,
      tags: ['mission', 'created'],
      metadata: { mission_id: mission.id },
      mission_id: mission.id,
    });

    return NextResponse.json({ mission });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 400 }
    );
  }
}
