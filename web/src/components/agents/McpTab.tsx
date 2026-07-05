import {
  emptyMcpForm,
  mcpTransportLabels,
  statusLabels,
} from '../../domain/constants';
import type { McpStatus, McpTransportType } from '../../domain/types';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { EmptyState } from '../common/EmptyState';
import { StatusMessage } from '../common/StatusMessage';
import { StatusPill } from '../common/StatusPill';
import { AgentSelector } from './AgentSelector';

interface McpTabProps {
  app: PlatformApp;
}

export function McpTab({ app }: McpTabProps) {
  return (
    <section className="resource-layout">
      <form className="panel-form" onSubmit={app.handleMcpSubmit}>
        <h2>{app.editingMcpId ? '编辑 MCP' : '新增 MCP'}</h2>
        <label>
          MCP 名称
          <input
            maxLength={128}
            minLength={2}
            onChange={(event) =>
              app.setMcpForm((current) => ({
                ...current,
                mcpName: event.target.value,
              }))
            }
            required
            value={app.mcpForm.mcpName}
          />
        </label>
        <label>
          唯一编码
          <input
            maxLength={64}
            onChange={(event) =>
              app.setMcpForm((current) => ({
                ...current,
                mcpCode: event.target.value,
              }))
            }
            placeholder="留空自动生成"
            value={app.mcpForm.mcpCode}
          />
        </label>
        <div className="field-grid">
          <label>
            传输类型
            <select
              onChange={(event) =>
                app.setMcpForm((current) => ({
                  ...current,
                  transportType: event.target.value as McpTransportType,
                }))
              }
              value={app.mcpForm.transportType}
            >
              <option value="stdio">stdio</option>
              <option value="sse">SSE</option>
              <option value="http">HTTP</option>
            </select>
          </label>
          <label>
            状态
            <select
              onChange={(event) =>
                app.setMcpForm((current) => ({
                  ...current,
                  status: event.target.value as McpStatus,
                }))
              }
              value={app.mcpForm.status}
            >
              <option value="enabled">启用</option>
              <option value="disabled">禁用</option>
            </select>
          </label>
        </div>
        <label>
          Endpoint / 启动命令
          <input
            maxLength={512}
            onChange={(event) =>
              app.setMcpForm((current) => ({
                ...current,
                endpoint: event.target.value,
              }))
            }
            value={app.mcpForm.endpoint}
          />
        </label>
        <label>
          描述
          <textarea
            maxLength={2000}
            onChange={(event) =>
              app.setMcpForm((current) => ({
                ...current,
                mcpDesc: event.target.value,
              }))
            }
            value={app.mcpForm.mcpDesc}
          />
        </label>
        <label>
          工具列表 JSON
          <textarea
            maxLength={12000}
            onChange={(event) =>
              app.setMcpForm((current) => ({
                ...current,
                toolList: event.target.value,
              }))
            }
            value={app.mcpForm.toolList}
          />
        </label>
        <div className="form-actions">
          <button className="primary-action">
            {app.editingMcpId ? '保存 MCP' : '创建 MCP'}
          </button>
          {app.editingMcpId ? (
            <button
              type="button"
              className="ghost-action"
              onClick={() => {
                app.setEditingMcpId('');
                app.setMcpForm(emptyMcpForm);
              }}
            >
              取消
            </button>
          ) : null}
        </div>
        <StatusMessage message={app.mcpMessage} />
      </form>

      <section className="binding-panel">
        <form className="inline-form" onSubmit={app.handleMcpBind}>
          <h2>挂载到 Agent</h2>
          <AgentSelector app={app} />
          <label>
            MCP 服务
            <select
              onChange={(event) =>
                app.setMcpBindingForm((current) => ({
                  ...current,
                  mcpId: event.target.value,
                }))
              }
              required
              value={app.mcpBindingForm.mcpId}
            >
              <option value="">选择 MCP</option>
              {app.mcpServers.map((mcp) => (
                <option key={mcp.id} value={mcp.id}>
                  {mcp.mcpName}
                </option>
              ))}
            </select>
          </label>
          <label>
            允许工具
            <input
              maxLength={4000}
              onChange={(event) =>
                app.setMcpBindingForm((current) => ({
                  ...current,
                  allowTools: event.target.value,
                }))
              }
              placeholder="留空表示全部允许"
              value={app.mcpBindingForm.allowTools}
            />
          </label>
          <button
            className="primary-action compact"
            disabled={!app.selectedAgentId}
          >
            挂载 MCP
          </button>
        </form>

        <section className="resource-list" aria-label="MCP 列表">
          {app.mcpServers.length === 0 ? (
            <EmptyState>暂无 MCP</EmptyState>
          ) : null}
          {app.mcpServers.map((mcp) => (
            <article key={mcp.id} className="agent-card">
              <div className="agent-card-header">
                <StatusPill label={statusLabels[mcp.status]} status={mcp.status} />
                <small>{mcp.mcpCode}</small>
              </div>
              <h3>{mcp.mcpName}</h3>
              <p>{mcp.mcpDesc || mcp.endpoint || '未配置 endpoint'}</p>
              <dl>
                <div>
                  <dt>传输</dt>
                  <dd>{mcpTransportLabels[mcp.transportType]}</dd>
                </div>
              </dl>
              <div className="row-actions">
                <button type="button" onClick={() => app.handleMcpEdit(mcp)}>
                  编辑
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => void app.handleMcpDelete(mcp.id)}
                >
                  删除
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="compact-list" aria-label="MCP 挂载列表">
          {app.mcpBindings.length === 0 ? (
            <EmptyState>当前 Agent 暂无 MCP 挂载</EmptyState>
          ) : null}
          {app.mcpBindings.map((binding) => (
            <article key={binding.id} className="project-row">
              <div>
                <StatusPill
                  label={binding.enableFlag ? '启用' : '停用'}
                  status={binding.enableFlag ? 'enabled' : 'disabled'}
                />
                <h3>{binding.mcp?.mcpName ?? binding.mcpId}</h3>
                <p>{binding.allowTools || '允许全部工具'}</p>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  className="danger"
                  onClick={() => void app.handleMcpUnbind(binding.id)}
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
