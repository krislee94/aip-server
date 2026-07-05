import { appNavItems } from '../../domain/constants';
import type { PlatformApp } from '../../hooks/usePlatformApp';
import { cx } from '../../lib/classNames';
import { AgentWorkspace } from '../agents/AgentWorkspace';
import { BrandMark } from '../common/BrandMark';
import { WorkspaceTopbar } from '../common/WorkspaceTopbar';
import { ModelsView } from '../models/ModelsView';
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
          {appNavItems.map((item) => (
            <button
              type="button"
              className={cx(app.view === item.view && 'active')}
              key={item.view}
              onClick={() => app.setView(item.view)}
            >
              <span aria-hidden="true">{item.code}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <span>{app.user?.name}</span>
          <small>{app.user?.email}</small>
          <button type="button" onClick={app.handleSignOut}>
            退出登录
          </button>
        </div>
      </aside>

      <section className="workspace-shell">
        <WorkspaceTopbar app={app} />
        <section className="workspace">
          {app.view === 'home' ? <HomeView app={app} /> : null}
          {app.view === 'projects' ? <ProjectsView app={app} /> : null}
          {app.view === 'models' ? <ModelsView app={app} /> : null}
          {app.view === 'agent' ? <AgentWorkspace app={app} /> : null}
        </section>
      </section>
    </main>
  );
}
