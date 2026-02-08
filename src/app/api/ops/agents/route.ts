import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/client');
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const sb = createServerClient();

  const { data: agents, error } = await sb
    .from('ops_agents')
    .select('*')
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agents });
}

export async function PATCH(request: NextRequest) {
  const { createServerClient, isSupabaseConfigured } = await import('@/lib/supabase/client');
  
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const sb = createServerClient();
  
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing agent id' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;

    const { data: agent, error } = await sb
      .from('ops_agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agent });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid request' },
      { status: 400 }
    );
  }
}
