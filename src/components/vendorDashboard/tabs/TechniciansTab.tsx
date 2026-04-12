import type { VendorTechnician } from '../types'

type TechniciansTabProps = {
  technicians: VendorTechnician[]
  onToggleActive: (id: string) => void
  onRebalance: () => void
}

function TechniciansTab({ technicians, onToggleActive, onRebalance }: TechniciansTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Technician Workforce</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Availability, workload balance, and field readiness.
        </p>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Technician Roster</h3>
          <button
            type="button"
            onClick={onRebalance}
            className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white"
          >
            Rebalance Workload
          </button>
        </div>

        <div className="mt-3 grid gap-2.5">
          {technicians.map((tech) => (
            <article
              key={tech.id}
              className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{tech.name}</p>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">{tech.specialization}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleActive(tech.id)}
                  className={[
                    'rounded-full px-2.5 py-1 text-[10px] font-semibold',
                    tech.active
                      ? 'bg-[rgb(var(--color-success))/0.15] text-[rgb(var(--color-success))]'
                      : 'bg-[rgb(var(--color-danger))/0.15] text-[rgb(var(--color-danger))]',
                  ].join(' ')}
                >
                  {tech.active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1.5">
                  Workload: <span className="font-semibold">{tech.workload}</span>
                </div>
                <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1.5">
                  FTF: <span className="font-semibold">{tech.firstTimeFixRate}%</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  )
}

export default TechniciansTab
