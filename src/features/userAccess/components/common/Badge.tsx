function Badge({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}) {
  const styles = {
    neutral: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-[rgba(var(--color-primary),0.12)] text-[rgb(var(--color-primary))]',
  }

  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[tone]}`}>{label}</span>
}

export default Badge
