interface SummaryCardProps {
  label: string
  value: number
  hint?: string
  accent?: 'default' | 'warning' | 'success' | 'info'
}

export function SummaryCard({ label, value, hint, accent = 'default' }: SummaryCardProps) {
  return (
    <div className={`summary-card summary-card--${accent}`}>
      <span className="summary-card__value">{value}</span>
      <span className="summary-card__label">{label}</span>
      {hint && <span className="summary-card__hint">{hint}</span>}
    </div>
  )
}
