import type { ComponentType, ReactNode } from 'react'
import {
  Bell,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  Receipt,
  UserCircle2,
  Workflow,
} from 'lucide-react'
import type { CustomerDashboardTab } from './types'

type SidebarProps = {
  activeTab: CustomerDashboardTab
  onTabChange: (tab: CustomerDashboardTab) => void
  counts: {
    complaints: number
    open: number
    notifications: number
    pendingInvoices: number
  }
}

const tabItems: Array<{
  tab: CustomerDashboardTab
  title: string
  subtitle: string
  icon: ComponentType<{ className?: string }>
}> = [
  { tab: 'overview', title: 'Overview', subtitle: 'KPI and quick actions', icon: LayoutDashboard },
  { tab: 'raise', title: 'Raise Complaint', subtitle: 'Create new ticket', icon: FilePlus2 },
  { tab: 'tracker', title: 'Complaint Tracker', subtitle: 'Filters and status view', icon: ClipboardList },
  { tab: 'workspace', title: 'Complaint Workspace', subtitle: 'Timeline and evidence', icon: Workflow },
  { tab: 'billing', title: 'Billing', subtitle: 'Invoices and payment status', icon: Receipt },
  {
    tab: 'notifications',
    title: 'Notifications',
    subtitle: 'Alerts and reminders',
    icon: Bell,
  },
  { tab: 'profile', title: 'My Profile', subtitle: 'Account and preferences', icon: UserCircle2 },
]

function CounterPill({ value }: { value: number }) {
  return (
    <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--color-text-secondary))]">
      {value}
    </span>
  )
}

function CustomerSidebar({ activeTab, onTabChange, counts }: SidebarProps) {
  return (
    <aside className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.75)] lg:sticky lg:top-6 lg:h-fit">
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[linear-gradient(145deg,rgb(var(--color-primary)/0.12),rgb(var(--color-card)/0.95))] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--color-primary))]">
          Customer Console
        </p>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Modern service dashboard with focused workflows.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-2.5">
          <p className="text-[rgb(var(--color-text-secondary))]">Complaints</p>
          <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{counts.complaints}</p>
        </div>
        <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-2.5">
          <p className="text-[rgb(var(--color-text-secondary))]">Open</p>
          <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-danger))]">{counts.open}</p>
        </div>
      </div>

      <nav className="mt-4 space-y-1.5">
        {tabItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.tab

          let countNode: ReactNode = null
          if (item.tab === 'tracker') {
            countNode = <CounterPill value={counts.complaints} />
          } else if (item.tab === 'notifications') {
            countNode = <CounterPill value={counts.notifications} />
          } else if (item.tab === 'billing') {
            countNode = <CounterPill value={counts.pendingInvoices} />
          }

          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onTabChange(item.tab)}
              className={[
                'group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition',
                isActive
                  ? 'border-[rgb(var(--color-primary))/0.5] bg-[rgb(var(--color-primary))/0.11]'
                  : 'border-transparent hover:border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg))]',
              ].join(' ')}
            >
              <span
                className={[
                  'rounded-xl p-2 transition',
                  isActive
                    ? 'bg-[rgb(var(--color-primary))/0.2] text-[rgb(var(--color-primary))]'
                    : 'bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-primary))]',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</span>
                <span className="block text-xs text-[rgb(var(--color-text-secondary))]">{item.subtitle}</span>
              </span>
              {countNode}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default CustomerSidebar
