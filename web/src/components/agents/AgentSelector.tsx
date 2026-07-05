import type { PlatformApp } from '../../hooks/usePlatformApp';
import { EmptyState } from '../common/EmptyState';

interface AgentSelectorProps {
  app: PlatformApp;
}

export function AgentSelector({ app }: AgentSelectorProps) {
  if (app.agents.length === 0) {
    return <EmptyState>请先创建一个智能体</EmptyState>;
  }

  return (
    <label className="compact-field">
      当前智能体
      <select
        onChange={(event) => app.setSelectedAgentId(event.target.value)}
        value={app.selectedAgentId}
      >
        {app.agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.agentName}
          </option>
        ))}
      </select>
    </label>
  );
}
