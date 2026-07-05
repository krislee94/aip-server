import type { PlatformApp } from '../../hooks/usePlatformApp';
import { cx } from '../../lib/classNames';
import { AgentWorkspace } from '../agents/AgentWorkspace';
import { BrandMark } from '../common/BrandMark';
import { HomeView } from '../projects/HomeView';
import { ProjectsView } from '../projects/ProjectsView';

interface AppShellProps {
  app: PlatformApp;
}

export function AppShell({ app }: AppShellProps) {
  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="主导航">
        <BrandMark />

        <nav className="side-menu">
          <button
            type="button"
            className={cx(app.view === 'home' && 'active')}
            onClick={() => app.setView('home')}
          >
            首页
          </button>
          <button
            type="button"
            className={cx(app.view === 'projects' && 'active')}
            onClick={() => app.setView('projects')}
          >
            项目
          </button>
        </nav>

        <div className="sidebar-user">
          <span>{app.user?.name}</span>
          <small>{app.user?.email}</small>
          <button type="button" onClick={app.handleSignOut}>
            退出登录
          </button>
        </div>
      </aside>

      <section className="workspace">
        {app.view === 'home' ? <HomeView app={app} /> : null}
        {app.view === 'projects' ? <ProjectsView app={app} /> : null}
        {app.view === 'agent' ? <AgentWorkspace app={app} /> : null}
      </section>
    </main>
  );
}
