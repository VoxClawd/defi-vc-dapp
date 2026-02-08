import { SupabaseClient } from '@supabase/supabase-js';
import { ProposedStep, DbPolicy } from '../supabase/types';

interface CreateProposalInput {
  agentId: string;
  title: string;
  description?: string;
  proposedSteps: ProposedStep[];
}

interface ProposalResult {
  success: boolean;
  proposalId?: string;
  missionId?: string;
  autoApproved?: boolean;
  rejected?: boolean;
  rejectionReason?: string;
}

// Step kinds that can be auto-approved (low risk)
const AUTO_APPROVE_KINDS = ['analyze', 'research', 'alert', 'report', 'observe'];

// Cap gates - check quotas before allowing proposals
const STEP_KIND_QUOTAS: Record<string, { policyKey: string; countKind: string }> = {
  trade: { policyKey: 'trade_daily_quota', countKind: 'trade' },
  alert: { policyKey: 'alert_daily_quota', countKind: 'alert' },
};

async function getPolicy(sb: SupabaseClient, key: string): Promise<DbPolicy['value'] | null> {
  const { data } = await sb
    .from('ops_policy')
    .select('value')
    .eq('key', key)
    .single();
  return data?.value || null;
}

async function countTodaySteps(sb: SupabaseClient, kind: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count } = await sb
    .from('ops_mission_steps')
    .select('*', { count: 'exact', head: true })
    .eq('kind', kind)
    .gte('created_at', today.toISOString());
  
  return count || 0;
}

async function checkCapGates(
  sb: SupabaseClient,
  steps: ProposedStep[]
): Promise<{ ok: boolean; reason?: string }> {
  for (const step of steps) {
    const quota = STEP_KIND_QUOTAS[step.kind];
    if (!quota) continue;

    const policy = await getPolicy(sb, quota.policyKey);
    if (!policy || typeof policy.limit !== 'number') continue;

    const todayCount = await countTodaySteps(sb, quota.countKind);
    if (todayCount >= policy.limit) {
      return {
        ok: false,
        reason: `${step.kind} quota full (${todayCount}/${policy.limit} today)`,
      };
    }
  }
  return { ok: true };
}

function shouldAutoApprove(steps: ProposedStep[], autoApprovePolicy: DbPolicy['value'] | null): boolean {
  if (!autoApprovePolicy || !autoApprovePolicy.enabled) return false;
  
  const allowedKinds = (autoApprovePolicy.allowed_step_kinds as string[]) || AUTO_APPROVE_KINDS;
  return steps.every(step => allowedKinds.includes(step.kind));
}

export async function createProposalAndMaybeAutoApprove(
  sb: SupabaseClient,
  input: CreateProposalInput
): Promise<ProposalResult> {
  const { agentId, title, description, proposedSteps } = input;

  // 1. Check cap gates
  const gateCheck = await checkCapGates(sb, proposedSteps);
  if (!gateCheck.ok) {
    // Create rejected proposal for audit trail
    const { data: proposal } = await sb
      .from('ops_mission_proposals')
      .insert({
        agent_id: agentId,
        title,
        description,
        proposed_steps: proposedSteps,
        status: 'rejected',
        rejection_reason: gateCheck.reason,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'system',
      })
      .select('id')
      .single();

    // Fire rejection event
    await sb.from('ops_agent_events').insert({
      agent_id: agentId,
      kind: 'proposal',
      title: 'Proposal Rejected',
      content: `Proposal "${title}" was rejected: ${gateCheck.reason}`,
      tags: ['proposal', 'rejected'],
      metadata: { proposal_id: proposal?.id, reason: gateCheck.reason },
    });

    return {
      success: false,
      proposalId: proposal?.id,
      rejected: true,
      rejectionReason: gateCheck.reason,
    };
  }

  // 2. Create the proposal
  const { data: proposal, error: proposalError } = await sb
    .from('ops_mission_proposals')
    .insert({
      agent_id: agentId,
      title,
      description,
      proposed_steps: proposedSteps,
      status: 'pending',
    })
    .select('id')
    .single();

  if (proposalError || !proposal) {
    return { success: false, rejectionReason: proposalError?.message };
  }

  // 3. Check auto-approve policy
  const autoApprovePolicy = await getPolicy(sb, 'auto_approve');
  const autoApprove = shouldAutoApprove(proposedSteps, autoApprovePolicy);

  if (autoApprove) {
    // 4. Auto-approve: create mission and steps
    const { data: mission, error: missionError } = await sb
      .from('ops_missions')
      .insert({
        proposal_id: proposal.id,
        title,
        description,
        status: 'approved',
        created_by: agentId,
        assigned_agents: [agentId],
        total_steps: proposedSteps.length,
        current_step: 0,
      })
      .select('id')
      .single();

    if (missionError || !mission) {
      return { success: false, proposalId: proposal.id, rejectionReason: missionError?.message };
    }

    // Create mission steps
    const steps = proposedSteps.map((step, index) => ({
      mission_id: mission.id,
      kind: step.kind,
      title: step.title,
      payload: step.payload || {},
      step_order: index,
      status: 'queued',
    }));

    await sb.from('ops_mission_steps').insert(steps);

    // Update proposal status
    await sb
      .from('ops_mission_proposals')
      .update({
        status: 'accepted',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'auto',
      })
      .eq('id', proposal.id);

    // Fire approval event
    await sb.from('ops_agent_events').insert({
      agent_id: agentId,
      kind: 'proposal',
      title: 'Proposal Auto-Approved',
      content: `Proposal "${title}" was auto-approved and mission created`,
      tags: ['proposal', 'approved', 'auto'],
      metadata: { proposal_id: proposal.id, mission_id: mission.id },
      mission_id: mission.id,
    });

    return {
      success: true,
      proposalId: proposal.id,
      missionId: mission.id,
      autoApproved: true,
    };
  }

  // 5. Not auto-approved, wait for review
  await sb.from('ops_agent_events').insert({
    agent_id: agentId,
    kind: 'proposal',
    title: 'Proposal Pending Review',
    content: `Proposal "${title}" submitted and pending review`,
    tags: ['proposal', 'pending'],
    metadata: { proposal_id: proposal.id },
  });

  return {
    success: true,
    proposalId: proposal.id,
    autoApproved: false,
  };
}

export async function fireAgentEvent(
  sb: SupabaseClient,
  agentId: string,
  kind: string,
  content: string,
  metadata?: Record<string, unknown>
) {
  return sb.from('ops_agent_events').insert({
    agent_id: agentId,
    kind,
    content,
    tags: [kind],
    metadata: metadata || {},
  });
}
