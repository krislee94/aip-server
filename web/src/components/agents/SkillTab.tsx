import {
  emptySkillForm,
  skillTypeLabels,
  statusLabels,
} from '../../domain/constants';
import type { SkillStatus, SkillType } from '../../domain/types';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { EmptyState } from '../common/EmptyState';
import { StatusMessage } from '../common/StatusMessage';
import { StatusPill } from '../common/StatusPill';
import { AgentSelector } from './AgentSelector';

interface SkillTabProps {
  app: PlatformApp;
}

export function SkillTab({ app }: SkillTabProps) {
  return (
    <section className="resource-layout">
      <form className="panel-form" onSubmit={app.handleSkillSubmit}>
        <h2>{app.editingSkillId ? '编辑 Skill' : '新增 Skill'}</h2>
        <label>
          Skill 名称
          <input
            maxLength={128}
            minLength={2}
            onChange={(event) =>
              app.setSkillForm((current) => ({
                ...current,
                skillName: event.target.value,
              }))
            }
            required
            value={app.skillForm.skillName}
          />
        </label>
        <label>
          唯一编码
          <input
            maxLength={64}
            onChange={(event) =>
              app.setSkillForm((current) => ({
                ...current,
                skillCode: event.target.value,
              }))
            }
            placeholder="留空自动生成"
            value={app.skillForm.skillCode}
          />
        </label>
        <div className="field-grid">
          <label>
            类型
            <select
              onChange={(event) =>
                app.setSkillForm((current) => ({
                  ...current,
                  skillType: event.target.value as SkillType,
                }))
              }
              value={app.skillForm.skillType}
            >
              <option value="builtin_function">内置函数</option>
              <option value="http_api">HTTP 接口</option>
              <option value="database_query">数据库查询</option>
              <option value="custom_script">自定义脚本</option>
            </select>
          </label>
          <label>
            状态
            <select
              onChange={(event) =>
                app.setSkillForm((current) => ({
                  ...current,
                  status: event.target.value as SkillStatus,
                }))
              }
              value={app.skillForm.status}
            >
              <option value="enabled">启用</option>
              <option value="disabled">禁用</option>
            </select>
          </label>
        </div>
        <label>
          描述
          <textarea
            maxLength={2000}
            onChange={(event) =>
              app.setSkillForm((current) => ({
                ...current,
                skillDesc: event.target.value,
              }))
            }
            value={app.skillForm.skillDesc}
          />
        </label>
        <label>
          调用配置 JSON
          <textarea
            maxLength={12000}
            onChange={(event) =>
              app.setSkillForm((current) => ({
                ...current,
                invokeConfig: event.target.value,
              }))
            }
            value={app.skillForm.invokeConfig}
          />
        </label>
        <div className="form-actions">
          <button className="primary-action">
            {app.editingSkillId ? '保存 Skill' : '创建 Skill'}
          </button>
          {app.editingSkillId ? (
            <button
              type="button"
              className="ghost-action"
              onClick={() => {
                app.setEditingSkillId('');
                app.setSkillForm(emptySkillForm);
              }}
            >
              取消
            </button>
          ) : null}
        </div>
        <StatusMessage message={app.skillMessage} />
      </form>

      <section className="binding-panel">
        <form className="inline-form" onSubmit={app.handleSkillBind}>
          <h2>绑定到 Agent</h2>
          <AgentSelector app={app} />
          <label>
            Skill
            <select
              onChange={(event) =>
                app.setSkillBindingForm((current) => ({
                  ...current,
                  skillId: event.target.value,
                }))
              }
              required
              value={app.skillBindingForm.skillId}
            >
              <option value="">选择 Skill</option>
              {app.skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.skillName}
                </option>
              ))}
            </select>
          </label>
          <label>
            调用别名
            <input
              maxLength={128}
              onChange={(event) =>
                app.setSkillBindingForm((current) => ({
                  ...current,
                  aliasName: event.target.value,
                }))
              }
              value={app.skillBindingForm.aliasName}
            />
          </label>
          <button
            className="primary-action compact"
            disabled={!app.selectedAgentId}
          >
            绑定 Skill
          </button>
        </form>

        <section className="resource-list" aria-label="Skill 列表">
          {app.skills.length === 0 ? <EmptyState>暂无 Skill</EmptyState> : null}
          {app.skills.map((skill) => (
            <article key={skill.id} className="agent-card">
              <div className="agent-card-header">
                <StatusPill
                  label={statusLabels[skill.status]}
                  status={skill.status}
                />
                <small>{skill.skillCode}</small>
              </div>
              <h3>{skill.skillName}</h3>
              <p>{skill.skillDesc || skillTypeLabels[skill.skillType]}</p>
              <div className="row-actions">
                <button type="button" onClick={() => app.handleSkillEdit(skill)}>
                  编辑
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => void app.handleSkillDelete(skill.id)}
                >
                  删除
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="compact-list" aria-label="Skill 绑定列表">
          {app.skillBindings.length === 0 ? (
            <EmptyState>当前 Agent 暂无 Skill 绑定</EmptyState>
          ) : null}
          {app.skillBindings.map((binding) => (
            <article key={binding.id} className="project-row">
              <div>
                <StatusPill
                  label={binding.enableFlag ? '启用' : '停用'}
                  status={binding.enableFlag ? 'enabled' : 'disabled'}
                />
                <h3>{binding.skill?.skillName ?? binding.skillId}</h3>
                <p>{binding.aliasName || '未设置别名'}</p>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  className="danger"
                  onClick={() => void app.handleSkillUnbind(binding.id)}
                >
                  移除
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </section>
  );
}
