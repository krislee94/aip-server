import type { PlatformApp } from '../../hooks/usePlatformApp';
import { cx } from '../../lib/classNames';
import { BrandMark } from '../common/BrandMark';

interface AuthViewProps {
  app: PlatformApp;
}

export function AuthView({ app }: AuthViewProps) {
  const title = app.authMode === 'login' ? '登录控制台' : '创建账号';
  const submitLabel = app.authMode === 'login' ? '登录' : '注册';

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="AIP Developer">
        <BrandMark />

        <div className="auth-copy">
          <span>Agent knowledge workspace</span>
          <h1>AIP Developer</h1>
          <p>把项目、模型、Prompt、Skill 和 MCP 服务放进同一张配置图里管理。</p>
        </div>

        <div className="command-board" aria-hidden="true">
          <div className="command-line">
            <span>$</span>
            <code>agent graph inspect --project=current</code>
          </div>
          <div className="trace-grid">
            <span className="trace-node root" />
            <span className="trace-line horizontal" />
            <span className="trace-node warm" />
            <span className="trace-line vertical" />
            <span className="trace-node cool" />
            <span className="trace-line horizontal short" />
            <span className="trace-node quiet" />
          </div>
          <div className="command-meta">
            <span>projects</span>
            <span>models</span>
            <span>agents</span>
            <span>mcp</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mode-switch" role="tablist" aria-label="认证方式">
            <button
              type="button"
              className={cx(app.authMode === 'login' && 'active')}
              onClick={() => app.handleModeChange('login')}
            >
              登录
            </button>
            <button
              type="button"
              className={cx(app.authMode === 'register' && 'active')}
              onClick={() => app.handleModeChange('register')}
            >
              注册
            </button>
          </div>

          <header>
            <p>Workspace access</p>
            <h1>{title}</h1>
            <span>进入配置工作台，继续编排你的 Agent 运行资源。</span>
          </header>

          <form onSubmit={app.handleAuthSubmit}>
            {app.authMode === 'register' ? (
              <label>
                姓名
                <input
                  autoComplete="name"
                  maxLength={100}
                  minLength={2}
                  onChange={(event) => app.setName(event.target.value)}
                  required
                  value={app.name}
                />
              </label>
            ) : null}

            <label>
              邮箱
              <input
                autoComplete="email"
                onChange={(event) => app.setEmail(event.target.value)}
                required
                type="email"
                value={app.email}
              />
            </label>

            <label>
              密码
              <input
                autoComplete={
                  app.authMode === 'login'
                    ? 'current-password'
                    : 'new-password'
                }
                maxLength={100}
                minLength={8}
                onChange={(event) => app.setPassword(event.target.value)}
                required
                type="password"
                value={app.password}
              />
            </label>

            <button className="primary-action" disabled={app.isSubmitting}>
              {app.isSubmitting ? '处理中' : submitLabel}
            </button>
          </form>

          <div className="status-bar" aria-live="polite">
            <span className={cx('status-dot', app.message && 'online')} />
            <span>{app.message || '等待认证'}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
