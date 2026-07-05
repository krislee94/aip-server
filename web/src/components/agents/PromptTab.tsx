import { emptyPromptForm } from '../../domain/constants';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { EmptyState } from '../common/EmptyState';
import { StatusMessage } from '../common/StatusMessage';
import { StatusPill } from '../common/StatusPill';
import { AgentSelector } from './AgentSelector';

interface PromptTabProps {
  app: PlatformApp;
}

export function PromptTab({ app }: PromptTabProps) {
  return (
    <section className="resource-layout">
      <form className="panel-form" onSubmit={app.handlePromptSubmit}>
        <h2>{app.editingPromptId ? '编辑 Prompt' : '新增 Prompt'}</h2>
        <AgentSelector app={app} />
        <label>
          Prompt 名称
          <input
            maxLength={128}
            minLength={2}
            onChange={(event) =>
              app.setPromptForm((current) => ({
                ...current,
                promptName: event.target.value,
              }))
            }
            required
            value={app.promptForm.promptName}
          />
        </label>
        <label>
          版本
          <input
            maxLength={32}
            onChange={(event) =>
              app.setPromptForm((current) => ({
                ...current,
                promptVersion: event.target.value,
              }))
            }
            value={app.promptForm.promptVersion}
          />
        </label>
        <label>
          角色定义
          <textarea
            maxLength={2000}
            onChange={(event) =>
              app.setPromptForm((current) => ({
                ...current,
                roleDefinition: event.target.value,
              }))
            }
            value={app.promptForm.roleDefinition}
          />
        </label>
        <label>
          系统 Prompt
          <textarea
            maxLength={20000}
            onChange={(event) =>
              app.setPromptForm((current) => ({
                ...current,
                systemPrompt: event.target.value,
              }))
            }
            required
            value={app.promptForm.systemPrompt}
          />
        </label>
        <label>
          输出格式
          <textarea
            maxLength={4000}
            onChange={(event) =>
              app.setPromptForm((current) => ({
                ...current,
                outputFormat: event.target.value,
              }))
            }
            value={app.promptForm.outputFormat}
          />
        </label>
        <label className="checkbox-field">
          <input
            checked={app.promptForm.isDefault}
            onChange={(event) =>
              app.setPromptForm((current) => ({
                ...current,
                isDefault: event.target.checked,
              }))
            }
            type="checkbox"
          />
          设置为默认 Prompt
        </label>
        <div className="form-actions">
          <button className="primary-action" disabled={!app.selectedAgentId}>
            {app.editingPromptId ? '保存 Prompt' : '创建 Prompt'}
          </button>
          {app.editingPromptId ? (
            <button
              type="button"
              className="ghost-action"
              onClick={() => {
                app.setEditingPromptId('');
                app.setPromptForm(emptyPromptForm);
              }}
            >
              取消
            </button>
          ) : null}
        </div>
        <StatusMessage message={app.promptMessage} />
      </form>

      <section className="resource-list" aria-label="Prompt 列表">
        {app.prompts.length === 0 ? <EmptyState>暂无 Prompt</EmptyState> : null}
        {app.prompts.map((prompt) => (
          <article key={prompt.id} className="agent-card">
            <div className="agent-card-header">
              <StatusPill label={prompt.isDefault ? '默认' : '可用'} />
              <small>{prompt.promptVersion}</small>
            </div>
            <h3>{prompt.promptName}</h3>
            <p>{prompt.roleDefinition || prompt.systemPrompt}</p>
            <div className="row-actions">
              <button type="button" onClick={() => app.handlePromptEdit(prompt)}>
                编辑
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => void app.handlePromptDelete(prompt.id)}
              >
                删除
              </button>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}
