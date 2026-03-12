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
    <section className="min-w-0 rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.02rem] font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default DataPanel
