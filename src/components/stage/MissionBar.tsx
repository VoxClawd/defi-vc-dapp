'use client';

import { useTheme } from '@/hooks/useTheme';
import { currentMission } from '@/data/events';
import { agents } from '@/data/agents';

export function MissionBar() {
  const { style } = useTheme();
  const isPixel = style === 'pixel';

  const assignedAgents = currentMission.assignedAgents
    .map(id => agents.find(a => a.id === id))
    .filter(Boolean);

  return (
    <div
      className={`flex items-center justify-between p-4 ${
        isPixel
          ? 'bg-zinc-800'
          : 'rounded-xl bg-gradient-to-r from-zinc-800 via-zinc-800/80 to-zinc-800'
      }`}
    >
      {/* Agent avatars */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {assignedAgents.map((agent) => (
            <div
              key={agent!.id}
              className={`flex h-8 w-8 items-center justify-center border-2 border-zinc-800 text-sm ${
                isPixel ? '' : 'rounded-full'
              }`}
              style={{ backgroundColor: agent!.color }}
              title={agent!.name}
            >
              {agent!.emoji}
            </div>
          ))}
        </div>
        {agents.length - assignedAgents.length > 0 && (
          <div className="flex -space-x-2">
            {agents
              .filter(a => !currentMission.assignedAgents.includes(a.id))
              .map((agent) => (
                <div
                  key={agent.id}
                  className={`flex h-8 w-8 items-center justify-center border-2 border-zinc-800 opacity-40 text-sm ${
                    isPixel ? '' : 'rounded-full'
                  }`}
                  style={{ backgroundColor: agent.color }}
                  title={`${agent.name} (idle)`}
                >
                  {agent.emoji}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Mission info */}
      <div className="flex items-center gap-4">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <div>
          <span className={`text-amber-400 ${isPixel ? 'pixel-text text-xs' : 'text-sm font-semibold'}`}>
            MISSION {currentMission.currentStep}/{currentMission.totalSteps}
          </span>
          <span className="ml-3 text-sm text-zinc-400">
            {currentMission.title}
          </span>
        </div>
      </div>

      {/* Time */}
      <div className="text-sm text-zinc-500">
        {Math.floor((Date.now() - currentMission.updatedAt.getTime()) / 60000)}m ago
      </div>
    </div>
  );
}
