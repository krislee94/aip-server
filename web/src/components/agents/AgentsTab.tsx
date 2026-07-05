import {
  agentRunModeLabels,
  agentStatusLabels,
  agentTypeLabels,
  emptyAgentForm,
  emptyAgentRelationForm,
} from '../../domain/constants';
import type { AgentRunMode, AgentStatus, AgentType } from '../../domain/types';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { cx } from '../../lib/classNames';
import { EmptyState } from '../common/EmptyState';
import { MetricGrid } from '../common/MetricGrid';
import { StatusMessage } from '../common/StatusMessage';
import { StatusPill } from '../common/StatusPill';
import { AgentSelector } from './AgentSelector';

interface AgentsTabProps {
  app: PlatformApp;
}

export function AgentsTab({ app }: AgentsTabProps) {
  return (
    <>
      <MetricGrid
        metrics={[
          { label: '智能体数量', value: app.agents.length },
          { label: '可用智能体', value: app.enabledAgentsCount },
          { label: '当前智能体', value: app.selectedAgent?.agentName ?? '-' },
        ]}
      />

      <section className="agent-management-layout">
        <form className="panel-form" onSubmit={app.handleAgentSubmit}>
          <h2>{app.editingAgentId ? '编辑智能体' : '创建智能体'}</h2>
          <label>
            智能体名称
            <input
              maxLength={128}
              minLength={2}
              onChange={(event) =>
                app.setAgentForm((current) => ({
                  ...current,
                  agentName: event.target.value,
                }))
              }
              required
              value={app.agentForm.agentName}
            />
          </label>
          <label>
            调用编码
            <input
              maxLength={64}
              onChange={(event) =>
                app.setAgentForm((current) => ({
                  ...current,
                  agentCode: event.target.value,
                }))
              }
              placeholder="留空自动生成"
              value={app.agentForm.agentCode}
            />
          </label>
          <label>
            简介
            <textarea
              maxLength={2000}
              onChange={(event) =>
                app.setAgentForm((current) => ({
                  ...current,
                  agentDesc: event.target.value,
                }))
              }
              value={app.agentForm.agentDesc}
            />
          </label>

          <div className="field-grid">
            <label>
              类型
              <select
                onChange={(event) =>
                  app.setAgentForm((current) => ({
                    ...current,
                    agentType: event.target.value as AgentType,
                  }))
                }
                value={app.agentForm.agentType}
              >
                <option value="standalone">独立 Agent</option>
                <option value="orchestrator">主 Agent</option>
                <option value="sub">子 Agent</option>
              </select>
            </label>
            <label>
              状态
              <select
                onChange={(event) =>
                  app.setAgentForm((current) => ({
                    ...current,
                    status: event.target.value as AgentStatus,
                  }))
                }
                value={app.agentForm.status}
              >
                <option value="draft">草稿</option>
                <option value="enabled">启用</option>
                <option value="disabled">禁用</option>
                <option value="pending_publish">待发布</option>
                <option value="published">已发布</option>
                <option value="offline">已下线</option>
              </select>
            </label>
          </div>

          <div className="field-grid">
            <label>
              运行模式
              <select
                onChange={(event) =>
                  app.setAgentForm((current) => ({
                    ...current,
                    runMode: event.target.value as AgentRunMode,
                  }))
                }
                value={app.agentForm.runMode}
              >
                <option value="sync">同步</option>
                <option value="async">异步</option>
              </select>
            </label>
            <label>
              模型
              <input
                maxLength={128}
                onChange={(event) =>
                  app.setAgentForm((current) => ({
                    ...current,
                    llmModel: event.target.value,
                  }))
                }
                placeholder="例如 gpt-4.1-mini"
                value={app.agentForm.llmModel}
              />
            </label>
          </div>

          <div className="field-grid">
            <label>
              超时秒数
              <input
                max={600}
                min={1}
                onChange={(event) =>
                  app.setAgentForm((current) => ({
                    ...current,
                    timeoutSeconds: Number(event.target.value),
                  }))
                }
                type="number"
                value={app.agentForm.timeoutSeconds}
              />
            </label>
            <label>
              上下文长度
              <input
                max={200000}
                min={1000}
                onChange={(event) =>
                  app.setAgentForm((current) => ({
                    ...current,
                    maxContextLength: Number(event.target.value),
                  }))
                }
                type="number"
                value={app.agentForm.maxContextLength}
              />
            </label>
          </div>

          <label className="checkbox-field">
            <input
              checked={app.agentForm.supportsSubAgents}
              onChange={(event) =>
                app.setAgentForm((current) => ({
                  ...current,
                  supportsSubAgents: event.target.checked,
                }))
              }
              type="checkbox"
            />
            支持挂载子 Agent
          </label>

          <div className="form-actions">
            <button className="primary-action" disabled={app.isAgentSaving}>
              {app.isAgentSaving
                ? '保存中'
                : app.editingAgentId
                  ? '保存修改'
                  : '创建智能体'}
            </button>
            {app.editingAgentId ? (
              <button
                type="button"
                className="ghost-action"
                onClick={() => {
                  app.setEditingAgentId('');
                  app.setAgentForm(emptyAgentForm);
                }}
              >
                取消
              </button>
            ) : null}
          </div>

          <StatusMessage message={app.agentMessage} />
        </form>

        <section className="agent-list" aria-label="智能体列表">
          {app.isAgentLoading ? <EmptyState>加载智能体中</EmptyState> : null}
          {!app.isAgentLoading && app.agents.length === 0 ? (
            <EmptyState>暂无智能体</EmptyState>
          ) : null}
          {app.agents.map((agent) => (
            <article
              key={agent.id}
              className={cx(
                'agent-card',
                app.selectedAgentId === agent.id && 'selected',
              )}
            >
              <div className="agent-card-header">
                <StatusPill
                  label={agentStatusLabels[agent.status]}
                  status={agent.status}
                />
                <small>{agent.agentCode}</small>
              </div>
              <h3>{agent.agentName}</h3>
              <p>{agent.agentDesc || '暂无描述'}</p>
              <dl>
                <div>
                  <dt>类型</dt>
                  <dd>{agentTypeLabels[agent.agentType]}</dd>
                </div>
                <div>
                  <dt>运行</dt>
                  <dd>{agentRunModeLabels[agent.runMode]}</dd>
                </div>
                <div>
                  <dt>模型</dt>
                  <dd>{agent.llmModel || '-'}</dd>
                </div>
              </dl>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() => app.setSelectedAgentId(agent.id)}
                >
                  选择
                </button>
                <button type="button" onClick={() => app.handleAgentEdit(agent)}>
                  编辑
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => void app.handleAgentDelete(agent.id)}
                >
                  删除
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>

      <AgentRelationsPanel app={app} />
    </>
  );
}

function AgentRelationsPanel({ app }: AgentsTabProps) {
  return (
    <section className="binding-panel" aria-label="子 Agent 绑定管理">
      <form className="inline-form" onSubmit={app.handleAgentRelationBind}>
        <h2>绑定子 Agent</h2>
        <AgentSelector app={app} />
        <label>
          子 Agent
          <select
            onChange={(event) =>
              app.setAgentRelationForm((current) => ({
                ...current,
                subAgentId: event.target.value,
              }))
            }
            value={app.agentRelationForm.subAgentId}
          >
            <option value="">选择子 Agent</option>
            {app.relationCandidates.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.agentName}
              </option>
            ))}
          </select>
        </label>
        <label>
          关系名称
          <input
            maxLength={128}
            onChange={(event) =>
              app.setAgentRelationForm((current) => ({
                ...current,
                relName: event.target.value,
              }))
            }
            placeholder="例如：检索助手"
            value={app.agentRelationForm.relName}
          />
        </label>
        <div className="form-actions">
          <button
            className="primary-action compact"
            disabled={!app.selectedAgentId || !app.agentRelationForm.subAgentId}
          >
            绑定子 Agent
          </button>
          {app.agentRelationForm.subAgentId || app.agentRelationForm.relName ? (
            <button
              type="button"
              className="ghost-action"
              onClick={() => app.setAgentRelationForm(emptyAgentRelationForm)}
            >
              清空
            </button>
          ) : null}
        </div>
        <StatusMessage message={app.agentRelationMessage} />
      </form>

      <section className="compact-list" aria-label="子 Agent 绑定列表">
        {app.relationCandidates.length === 0 ? (
          <EmptyState>至少需要两个智能体才能绑定</EmptyState>
        ) : null}
        {app.relationCandidates.length > 0 && app.agentRelations.length === 0 ? (
          <EmptyState>当前 Agent 暂无子 Agent 绑定</EmptyState>
        ) : null}
        {app.agentRelations.map((relation) => (
          <article key={relation.id} className="project-row">
            <div>
              <StatusPill
                label={relation.status === 1 ? '启用' : '停用'}
                status={relation.status === 1 ? 'enabled' : 'disabled'}
              />
              <h3>{relation.subAgent?.agentName ?? relation.subAgentId}</h3>
              <p>{relation.relName || relation.subAgent?.agentCode}</p>
            </div>
            <div className="row-actions">
              <button
                type="button"
                className="danger"
                onClick={() => void app.handleAgentRelationUnbind(relation.id)}
              >
                移除
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}
