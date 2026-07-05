import { detailTabLabels } from '../../domain/constants';
import type { DetailTab } from '../../domain/types';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { cx } from '../../lib/classNames';
import { EmptyState } from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import { AgentsTab } from './AgentsTab';
import { McpTab } from './McpTab';
import { PromptTab } from './PromptTab';
import { SkillTab } from './SkillTab';

interface AgentWorkspaceProps {
  app: PlatformApp;
}

const tabs: DetailTab[] = ['agents', 'prompts', 'skills', 'mcp'];

export function AgentWorkspace({ app }: AgentWorkspaceProps) {
  function renderDetailContent() {
    if (!app.selectedProject) {
      return <EmptyState>请先从首页选择一个项目</EmptyState>;
    }

    if (app.detailTab === 'prompts') {
      return <PromptTab app={app} />;
    }

    if (app.detailTab === 'skills') {
      return <SkillTab app={app} />;
    }

    if (app.detailTab === 'mcp') {
      return <McpTab app={app} />;
    }

    return <AgentsTab app={app} />;
  }

  return (
    <section className="agent-page">
      <div className="page-actions">
        <button
          type="button"
          className="ghost-action"
          onClick={() => app.setView('home')}
        >
          返回首页
        </button>
        <button
          type="button"
          className="ghost-action"
          onClick={() => app.setView('projects')}
        >
          项目管理
        </button>
      </div>

      <PageHeader
        eyebrow="Project"
        title={app.selectedProject?.name ?? '项目详情'}
        subtitle={app.selectedProject?.description ?? '未选择项目'}
      />

      <nav className="detail-tabs" aria-label="项目详情标签">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={cx(app.detailTab === tab && 'active')}
            onClick={() => app.setDetailTab(tab)}
          >
            {detailTabLabels[tab]}
          </button>
        ))}
      </nav>

      {renderDetailContent()}
    </section>
  );
}
