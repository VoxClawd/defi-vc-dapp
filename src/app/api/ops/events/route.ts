import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/client');
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const sb = createServerClient();
  const searchParams = request.nextUrl.searchParams;
  
  const limit = parseInt(searchParams.get('limit') || '50');
  const kind = searchParams.get('kind');
  const agentId = searchParams.get('agent_id');

  let query = sb
    .from('ops_agent_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (kind && kind !== 'all') {
    query = query.eq('kind', kind);
  }

  if (agentId) {
    query = query.eq('agent_id', agentId);
  }

  const { data: events, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/client');
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const sb = createServerClient();
  
  try {
    const body = await request.json();
    const { agent_id, kind, content, title, tags, metadata, mission_id } = body;

    if (!agent_id || !kind || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_id, kind, content' },
        { status: 400 }
      );
    }

    const { data: event, error } = await sb
      .from('ops_agent_events')
      .insert({
        agent_id,
        kind,
        content,
        title,
        tags: tags || [kind],
        metadata: metadata || {},
        mission_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 400 }
    );
  }
}
