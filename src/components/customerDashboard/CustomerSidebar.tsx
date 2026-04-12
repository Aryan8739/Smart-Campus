import type { ComponentType, ReactNode } from 'react'
import {
  Bell,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Receipt,
  Users,
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
  userInfo: {
    name: string
    profileImage?: string
  }
  onProfileClick?: () => void
  onLogout: () => void
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

function CustomerSidebar({
  activeTab,
  onTabChange,
  counts,
  userInfo,
  onProfileClick,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="flex min-h-screen flex-col rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.75)] lg:sticky lg:top-4 lg:min-h-0 lg:h-[calc(100vh-2rem)] lg:overflow-hidden">
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[linear-gradient(145deg,rgb(var(--color-primary)/0.12),rgb(var(--color-card)/0.95))] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--color-primary))]">
          Customer Console
        </p>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Modern service dashboard
        </p>
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

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
          <button
            type="button"
            onClick={() => {
              if (onProfileClick) onProfileClick()
            }}
            className="group flex min-w-0 items-center gap-2 rounded-xl px-1 py-1 text-left transition hover:bg-[rgb(var(--color-card))]"
            title="Open profile"
          >
            {userInfo.profileImage ? (
              <img
                src={userInfo.profileImage}
                alt={userInfo.name}
                className="h-9 w-9 shrink-0 rounded-full border border-slate-300 object-cover"
              />
            ) : (
              <div className="rounded-full border border-indigo-100 bg-indigo-50 p-2.5">
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
            )}

            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[rgb(var(--color-text-primary))]">{userInfo.name}</span>
              <span className="block text-[11px] text-[rgb(var(--color-text-secondary))]">Customer account</span>
            </span>
          </button>

          <div className="pl-2">
            <button
              type="button"
              onClick={onLogout}
              className="group rounded-full border border-slate-200 p-2.5 transition-colors hover:bg-rose-600"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-slate-500 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default CustomerSidebar
