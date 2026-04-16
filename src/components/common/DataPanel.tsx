import type { ReactNode } from 'react'

function DataPanel({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="h-full min-w-0 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.02rem] font-semibold text-[var(--text-primary)]">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default DataPanel
