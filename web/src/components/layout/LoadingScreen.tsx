import { BrandMark } from '../common/BrandMark';

export function LoadingScreen() {
  return (
    <main className="loading-page">
      <BrandMark />
      <div className="loading-line" aria-hidden="true" />
      <span>正在恢复工作台会话</span>
    </main>
  );
}
