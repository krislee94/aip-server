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
        subtitle="从一个项目进入智能体、Prompt、Skill 和 MCP 的配置工作流。"
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
          { label: '项目总数', value: app.projects.length },
          { label: '进行中', value: app.activeProjectsCount },
          { label: '当前用户', value: app.user?.name ?? '-' },
        ]}
      />

      <section className="project-card-grid" aria-label="项目列表">
        {app.isProjectLoading ? <EmptyState>加载项目中</EmptyState> : null}
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
    </>
  );
}
