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
    <article className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-4 text-[2.35rem] font-semibold tracking-[-0.04em] text-slate-900">{value}</p>
      <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
    </article>
  )
}

export default KpiCard
