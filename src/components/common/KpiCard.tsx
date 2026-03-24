function KpiCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string | number
  subtitle: string
}) {
  return (
    <article className="rounded-2xl border border-[var(--border-color)] border-l-4 border-l-blue-500 bg-[var(--card-bg)] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <p className="text-[13px] font-medium text-[var(--text-secondary)]">{title}</p>
      <p className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">{value}</p>
      <p className="mt-2 text-[13px] text-[var(--text-secondary)]">{subtitle}</p>
    </article>
  )
}

export default KpiCard
