import { projectStatusLabels } from '../../domain/constants';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { formatDateTime } from '../../lib/format';
import { EmptyState } from '../common/EmptyState';
import { MetricGrid } from '../common/MetricGrid';
import { PageHeader } from '../common/PageHeader';
import { StatusPill } from '../common/StatusPill';

interface HomeViewProps {
  app: PlatformApp;
}

export function HomeView({ app }: HomeViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="项目总览"
        subtitle="从项目进入 Agent、Prompt、Skill、MCP 和模型绑定的配置工作流。"
        actions={
          <button
            type="button"
            className="primary-action compact"
            onClick={() => app.setView('projects')}
          >
            新建项目
          </button>
        }
      />

      <MetricGrid
        metrics={[
          { label: '项目总数', value: app.projects.length, tone: 'accent' },
          { label: '进行中', value: app.activeProjectsCount, tone: 'success' },
          { label: '模型数量', value: app.models.length, tone: 'warning' },
        ]}
      />

      <section className="dashboard-grid section-gap">
        <article className="dashboard-panel graph-panel">
          <div className="panel-heading">
            <span>Workspace graph</span>
            <strong>{app.user?.name ?? '当前用户'}</strong>
          </div>
          <div className="mini-graph" aria-hidden="true">
            <span className="graph-node core">AIP</span>
            <span className="graph-node node-project">Project</span>
            <span className="graph-node node-model">Model</span>
            <span className="graph-node node-agent">Agent</span>
            <span className="graph-node node-skill">Skill</span>
            <span className="graph-line line-a" />
            <span className="graph-line line-b" />
            <span className="graph-line line-c" />
            <span className="graph-line line-d" />
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <span>最近项目</span>
            <strong>{app.projects.length} 个</strong>
          </div>
          <section className="recent-list" aria-label="项目列表">
            {app.isProjectLoading ? <EmptyState>正在加载项目</EmptyState> : null}
            {!app.isProjectLoading && app.projects.length === 0 ? (
              <EmptyState>暂无项目，先创建一个工作空间</EmptyState>
            ) : null}
            {app.projects.map((project) => (
              <button
                type="button"
                className="project-card"
                key={project.id}
                onClick={() => app.handleProjectOpen(project)}
              >
                <StatusPill
                  label={projectStatusLabels[project.status]}
                  status={project.status}
                />
                <h2>{project.name}</h2>
                <p>{project.description || '暂无描述'}</p>
                <small>更新于 {formatDateTime(project.updatedAt)}</small>
              </button>
            ))}
          </section>
        </article>
      </section>
    </>
  );
}
