import type { PlatformApp } from '../../hooks/usePlatformApp';

interface WorkspaceTopbarProps {
  app: PlatformApp;
}

export function WorkspaceTopbar({ app }: WorkspaceTopbarProps) {
  return (
    <header className="workspace-topbar">
      <div>
        <span>当前项目</span>
        <strong>{app.selectedProject?.name ?? '未选择项目'}</strong>
      </div>
      <div className="topbar-stats" aria-label="工作台状态">
        <span>项目 {app.projects.length}</span>
        <span>模型 {app.models.length}</span>
        <span>Agent {app.agents.length}</span>
      </div>
    </header>
  );
}
