interface Metric {
  label: string;
  tone?: 'accent' | 'success' | 'warning';
  value: number | string;
}

interface MetricGridProps {
  metrics: Metric[];
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <section className="metric-grid" aria-label="关键指标">
      {metrics.map((metric) => (
        <article className={metric.tone ? `tone-${metric.tone}` : undefined} key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
        </article>
      ))}
    </section>
  );
}
