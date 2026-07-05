interface StatusMessageProps {
  message: string;
}

export function StatusMessage({ message }: StatusMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="status-bar" aria-live="polite">
      <span className="status-dot online" />
      <span>{message}</span>
    </div>
  );
}
