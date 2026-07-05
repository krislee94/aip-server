import {
  emptyProjectForm,
  projectStatusLabels,
} from '../../domain/constants';
import type { ProjectStatus } from '../../domain/types';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { EmptyState } from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import { StatusMessage } from '../common/StatusMessage';
import { StatusPill } from '../common/StatusPill';

interface ProjectsViewProps {
  app: PlatformApp;
}

export function ProjectsView({ app }: ProjectsViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="项目管理"
        subtitle="项目是 Agent 编排的边界，先把业务场景分清楚。"
      />

      <section className="toolbar-strip" aria-label="项目筛选状态">
        <span>全部项目 {app.projects.length}</span>
        <span>进行中 {app.activeProjectsCount}</span>
        <span>当前 {app.selectedProject?.name ?? '未选择'}</span>
      </section>

      <section className="management-layout section-gap">
        <form className="panel-form" onSubmit={app.handleProjectSubmit}>
          <h2>{app.editingProjectId ? '编辑项目' : '新建项目'}</h2>
          <label>
            项目名称
            <input
              maxLength={120}
              minLength={2}
              onChange={(event) =>
                app.setProjectForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              required
              value={app.projectForm.name}
            />
          </label>
          <label>
            项目描述
            <textarea
              maxLength={500}
              onChange={(event) =>
                app.setProjectForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              value={app.projectForm.description}
            />
          </label>
          <label>
            项目状态
            <select
              onChange={(event) =>
                app.setProjectForm((current) => ({
                  ...current,
                  status: event.target.value as ProjectStatus,
                }))
              }
              value={app.projectForm.status}
            >
              <option value="draft">草稿</option>
              <option value="active">进行中</option>
              <option value="archived">已归档</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="primary-action" disabled={app.isProjectSaving}>
              {app.isProjectSaving
                ? '保存中'
                : app.editingProjectId
                  ? '保存修改'
                  : '创建项目'}
            </button>
            {app.editingProjectId ? (
              <button
                type="button"
                className="ghost-action"
                onClick={() => {
                  app.setEditingProjectId('');
                  app.setProjectForm(emptyProjectForm);
                }}
              >
                取消
              </button>
            ) : null}
          </div>
          <StatusMessage message={app.projectMessage} />
        </form>

        <section className="management-list" aria-label="项目列表">
          {app.projects.length === 0 ? <EmptyState>暂无项目</EmptyState> : null}
          {app.projects.map((project) => (
            <article key={project.id} className="project-row">
              <div>
                <StatusPill
                  label={projectStatusLabels[project.status]}
                  status={project.status}
                />
                <h3>{project.name}</h3>
                <p>{project.description || '暂无描述'}</p>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() => app.handleProjectOpen(project)}
                >
                  详情
                </button>
                <button
                  type="button"
                  onClick={() => app.handleProjectEdit(project)}
                >
                  编辑
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => void app.handleProjectDelete(project.id)}
                >
                  删除
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </>
  );
}
