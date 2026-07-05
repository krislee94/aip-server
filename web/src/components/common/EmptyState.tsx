interface EmptyStateProps {
  children: string;
}

export function EmptyState({ children }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
