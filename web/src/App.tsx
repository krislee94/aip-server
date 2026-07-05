import './App.css';
import { AuthView } from './components/auth/AuthView';
import { AppShell } from './components/layout/AppShell';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { usePlatformApp } from './hooks/usePlatformApp';

function App() {
  const app = usePlatformApp();

  if (app.isCheckingSession) {
    return <LoadingScreen />;
  }

  if (!app.user) {
    return <AuthView app={app} />;
  }

  return <AppShell app={app} />;
}

export default App;
