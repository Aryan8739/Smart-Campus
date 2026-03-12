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
    <article className="rounded-[1.15rem] border border-slate-200 bg-white p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <p className="text-[13px] font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-slate-900">{value}</p>
      <p className="mt-2 text-[13px] text-slate-500">{subtitle}</p>
    </article>
  )
}

export default KpiCard
