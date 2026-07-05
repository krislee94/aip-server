import { useMemo } from 'react';
import {
  emptyModelForm,
  modelStatusLabels,
  modelTypeLabels,
} from '../../domain/constants';
import type { ModelStatus, ModelType } from '../../domain/types';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { formatDateTime } from '../../lib/format';
import { EmptyState } from '../common/EmptyState';
import { MetricGrid } from '../common/MetricGrid';
import { PageHeader } from '../common/PageHeader';
import { StatusMessage } from '../common/StatusMessage';
import { StatusPill } from '../common/StatusPill';

interface ModelsViewProps {
  app: PlatformApp;
}

function modelStatusClass(status: ModelStatus): string {
  if (status === 1) {
    return 'enabled';
  }

  if (status === 2) {
    return 'pending_publish';
  }

  return 'disabled';
}

export function ModelsView({ app }: ModelsViewProps) {
  const vendorCount = useMemo(
    () => new Set(app.models.map((model) => model.vendor)).size,
    [app.models],
  );

  return (
    <>
      <PageHeader
        eyebrow="Models"
        title="模型中心"
        subtitle="统一维护厂商、密钥引用、默认参数和计费信息，再绑定给 Agent 使用。"
      />

      <MetricGrid
        metrics={[
          { label: '模型总数', value: app.models.length, tone: 'accent' },
          { label: '可用模型', value: app.enabledModelsCount, tone: 'success' },
          { label: '厂商数量', value: vendorCount, tone: 'warning' },
        ]}
      />

      <section className="management-layout section-gap">
        <form className="panel-form" onSubmit={app.handleModelSubmit}>
          <h2>{app.editingModelId ? '编辑模型' : '新增模型'}</h2>
          <label>
            模型名称
            <input
              maxLength={256}
              minLength={2}
              onChange={(event) =>
                app.setModelForm((current) => ({
                  ...current,
                  modelName: event.target.value,
                }))
              }
              required
              value={app.modelForm.modelName}
            />
          </label>
          <label>
            唯一编码
            <input
              maxLength={128}
              onChange={(event) =>
                app.setModelForm((current) => ({
                  ...current,
                  modelCode: event.target.value,
                }))
              }
              placeholder="留空自动生成"
              value={app.modelForm.modelCode}
            />
          </label>
          <div className="field-grid">
            <label>
              厂商
              <input
                maxLength={64}
                onChange={(event) =>
                  app.setModelForm((current) => ({
                    ...current,
                    vendor: event.target.value,
                  }))
                }
                required
                value={app.modelForm.vendor}
              />
            </label>
            <label>
              类型
              <select
                onChange={(event) =>
                  app.setModelForm((current) => ({
                    ...current,
                    modelType: Number(event.target.value) as ModelType,
                  }))
                }
                value={app.modelForm.modelType}
              >
                <option value={1}>对话 LLM</option>
                <option value={2}>向量 Embedding</option>
                <option value={3}>图像生成</option>
                <option value={4}>语音</option>
              </select>
            </label>
          </div>
          <div className="field-grid">
            <label>
              状态
              <select
                onChange={(event) =>
                  app.setModelForm((current) => ({
                    ...current,
                    status: Number(event.target.value) as ModelStatus,
                  }))
                }
                value={app.modelForm.status}
              >
                <option value={1}>正常</option>
                <option value={0}>禁用</option>
                <option value={2}>维护中</option>
              </select>
            </label>
            <label>
              上下文窗口
              <input
                max={2000000}
                min={1}
                onChange={(event) =>
                  app.setModelForm((current) => ({
                    ...current,
                    contextWindow: Number(event.target.value),
                  }))
                }
                type="number"
                value={app.modelForm.contextWindow}
              />
            </label>
          </div>
          <label>
            Base URL
            <input
              maxLength={512}
              onChange={(event) =>
                app.setModelForm((current) => ({
                  ...current,
                  baseUrl: event.target.value,
                }))
              }
              value={app.modelForm.baseUrl}
            />
          </label>
          <label>
            API Key 引用
            <input
              maxLength={256}
              onChange={(event) =>
                app.setModelForm((current) => ({
                  ...current,
                  apiKeyRef: event.target.value,
                }))
              }
              value={app.modelForm.apiKeyRef}
            />
          </label>
          <label>
            辅助密钥
            <input
              maxLength={512}
              onChange={(event) =>
                app.setModelForm((current) => ({
                  ...current,
                  secretKey: event.target.value,
                }))
              }
              placeholder={app.editingModelId ? '留空表示不修改辅助密钥' : undefined}
              type="password"
              value={app.modelForm.secretKey}
            />
          </label>
          <div className="field-grid">
            <label>
              输入单价/千 token
              <input
                min={0}
                onChange={(event) =>
                  app.setModelForm((current) => ({
                    ...current,
                    priceInput: event.target.value,
                  }))
                }
                step="0.000001"
                type="number"
                value={app.modelForm.priceInput}
              />
            </label>
            <label>
              输出单价/千 token
              <input
                min={0}
                onChange={(event) =>
                  app.setModelForm((current) => ({
                    ...current,
                    priceOutput: event.target.value,
                  }))
                }
                step="0.000001"
                type="number"
                value={app.modelForm.priceOutput}
              />
            </label>
          </div>
          <label>
            默认参数 JSON
            <textarea
              maxLength={12000}
              onChange={(event) =>
                app.setModelForm((current) => ({
                  ...current,
                  defaultParams: event.target.value,
                }))
              }
              value={app.modelForm.defaultParams}
            />
          </label>
          <div className="field-grid">
            <label className="checkbox-field">
              <input
                checked={app.modelForm.supportFunctionCall}
                onChange={(event) =>
                  app.setModelForm((current) => ({
                    ...current,
                    supportFunctionCall: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              支持工具调用
            </label>
            <label className="checkbox-field">
              <input
                checked={app.modelForm.supportStream}
                onChange={(event) =>
                  app.setModelForm((current) => ({
                    ...current,
                    supportStream: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              支持流式输出
            </label>
          </div>
          <div className="form-actions">
            <button className="primary-action">
              {app.editingModelId ? '保存模型' : '创建模型'}
            </button>
            {app.editingModelId ? (
              <button
                type="button"
                className="ghost-action"
                onClick={() => {
                  app.setEditingModelId('');
                  app.setModelForm(emptyModelForm);
                }}
              >
                取消
              </button>
            ) : null}
          </div>
          <StatusMessage message={app.modelMessage} />
        </form>

        <section className="resource-list" aria-label="模型列表">
          {app.isModelLoading ? <EmptyState>正在加载模型</EmptyState> : null}
          {!app.isModelLoading && app.models.length === 0 ? (
            <EmptyState>暂无模型，先新增一个可绑定的 LLM</EmptyState>
          ) : null}
          {app.models.map((model) => (
            <article key={model.id} className="agent-card model-card">
              <div className="agent-card-header">
                <StatusPill
                  label={modelStatusLabels[model.status]}
                  status={modelStatusClass(model.status)}
                />
                <small>{model.modelCode}</small>
              </div>
              <h3>{model.modelName}</h3>
              <p>
                {model.vendor} / {modelTypeLabels[model.modelType]}
              </p>
              <dl>
                <div>
                  <dt>上下文</dt>
                  <dd>{model.contextWindow}</dd>
                </div>
                <div>
                  <dt>单价</dt>
                  <dd>
                    {model.priceInput} / {model.priceOutput}
                  </dd>
                </div>
                <div>
                  <dt>更新</dt>
                  <dd>{formatDateTime(model.updatedAt)}</dd>
                </div>
              </dl>
              <div className="model-flags">
                <span>{model.supportStream ? '流式' : '非流式'}</span>
                <span>{model.supportFunctionCall ? '工具调用' : '无工具调用'}</span>
                <span>{model.hasSecretKey ? '已配置密钥' : '未配置密钥'}</span>
              </div>
              <div className="row-actions">
                <button type="button" onClick={() => app.handleModelEdit(model)}>
                  编辑
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => void app.handleModelDelete(model.id)}
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
