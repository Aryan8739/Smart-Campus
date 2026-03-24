import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  action?: string
  children: ReactNode
}

function Panel({ title, action, children }: PanelProps) {
  return (
    <section className="rounded-[1.5rem] bg-white p-7 shadow-[0_20px_45px_-30px_rgba(37,60,109,0.22)] ring-1 ring-[rgba(201,210,228,0.82)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-[0.15deg] hover:shadow-[0_30px_60px_-30px_rgba(37,60,109,0.28)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-slate-800">{title}</h2>
        {action ? (
          <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {action}
          </button>
        ) : null}
      </div>
      <div className="mt-6 border-t border-slate-200 pt-6">{children}</div>
    </section>
  )
}

export default Panel
