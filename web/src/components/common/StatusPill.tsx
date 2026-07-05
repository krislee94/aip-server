import { cx } from '../../lib/classNames';

interface StatusPillProps {
  label: string;
  status?: string;
}

export function StatusPill({ label, status }: StatusPillProps) {
  return <span className={cx('status-pill', status)}>{label}</span>;
}
