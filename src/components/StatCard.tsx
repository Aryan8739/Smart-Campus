interface StatCardProps {
  title: string
  value: string
  delta: string
  tone: 'amber' | 'green' | 'blue'
}

function StatCard({ title, value, delta, tone }: StatCardProps) {
  const toneClass =
    tone === 'amber'
      ? 'bg-[rgba(var(--color-warning),0.12)] text-[rgb(var(--color-warning))]'
      : tone === 'green'
        ? 'bg-[rgba(var(--color-success),0.12)] text-[rgb(var(--color-success))]'
        : 'bg-[rgba(var(--color-primary),0.12)] text-[rgb(var(--color-primary))]'

  return (
    <article className="rounded-[1.5rem] bg-white p-7 shadow-[0_20px_45px_-30px_rgba(37,60,109,0.25)] ring-1 ring-[rgba(201,210,228,0.8)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-[-0.35deg] hover:shadow-[0_28px_55px_-28px_rgba(37,60,109,0.34)]">
      <p className="text-[1.05rem] font-semibold text-slate-600">{title}</p>
      <div className="mt-5 flex items-end gap-2">
        <span className="text-[3.2rem] font-semibold leading-none tracking-[-0.04em] text-slate-900">
          {value}
        </span>
      </div>
      <div className={`mt-6 inline-flex rounded-xl px-3 py-1.5 text-sm font-semibold ${toneClass}`}>
        {delta}
      </div>
    </article>
  )
}

export default StatCard
