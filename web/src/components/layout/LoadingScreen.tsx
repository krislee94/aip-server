import { BrandMark } from '../common/BrandMark';

export function LoadingScreen() {
  return (
    <main className="loading-page">
      <BrandMark />
      <div className="loading-line" aria-label="正在恢复会话" />
    </main>
  );
}
