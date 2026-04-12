import type { ComponentType } from 'react'
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  LogOut,
  ShieldCheck,
  UserCircle2,
  Users,
  Wallet,
} from 'lucide-react'
import type { DepartmentAdminTab } from './types'

type DepartmentAdminSidebarProps = {
  activeTab: DepartmentAdminTab
  onTabChange: (tab: DepartmentAdminTab) => void
  counters: {
    open: number
    escalated: number
    unread: number
    budgetAlerts: number
  }
  userInfo: {
    name: string
    department: string
  }
  onProfileClick: () => void
  onLogout: () => void
}

const menu: Array<{
  tab: DepartmentAdminTab
  title: string
  subtitle: string
  icon: ComponentType<{ className?: string }>
}> = [
  { tab: 'overview', title: 'Overview', subtitle: 'Department control room', icon: LayoutDashboard },
  { tab: 'intake', title: 'Complaint Intake', subtitle: 'Queue and assignment', icon: ClipboardList },
  { tab: 'teams', title: 'Team Desk', subtitle: 'Roster and shift loads', icon: Users },
  { tab: 'sla', title: 'SLA & Risk', subtitle: 'Breach prevention', icon: ShieldCheck },
  { tab: 'budget', title: 'Budget Control', subtitle: 'Ops spend tracking', icon: Wallet },
  { tab: 'reports', title: 'Reports', subtitle: 'Performance views', icon: LineChart },
  { tab: 'notifications', title: 'Alerts', subtitle: 'Action signals', icon: Bell },
  { tab: 'profile', title: 'Profile', subtitle: 'Preferences', icon: UserCircle2 },
]

function DepartmentAdminSidebar({
  activeTab,
  onTabChange,
  counters,
  userInfo,
  onProfileClick,
  onLogout,
}: DepartmentAdminSidebarProps) {
  return (
    <aside className="flex min-h-screen flex-col rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.75)] lg:sticky lg:top-4 lg:min-h-0 lg:h-[calc(100vh-2rem)] lg:overflow-hidden">
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[linear-gradient(145deg,rgb(var(--color-primary)/0.14),rgb(var(--color-card)/0.96))] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
          Department Admin Hub
        </p>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">Operations and Service Governance</p>
      </div>

      <nav className="mt-4 space-y-1.5">
        {menu.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.tab
          const extraCount =
            item.tab === 'intake'
              ? counters.open
              : item.tab === 'sla'
                ? counters.escalated
                : item.tab === 'notifications'
                  ? counters.unread
                  : item.tab === 'budget'
                    ? counters.budgetAlerts
                    : null

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
              {extraCount !== null ? (
                <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--color-text-secondary))]">
                  {extraCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
          <button
            type="button"
            onClick={onProfileClick}
            className="group flex min-w-0 items-center gap-2 rounded-xl px-1 py-1 text-left transition hover:bg-[rgb(var(--color-card))]"
          >
            <div className="rounded-full border border-indigo-100 bg-indigo-50 p-2.5">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[rgb(var(--color-text-primary))]">{userInfo.name}</span>
              <span className="block truncate text-[11px] text-[rgb(var(--color-text-secondary))]">{userInfo.department}</span>
            </span>
          </button>

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
    </aside>
  )
}

export default DepartmentAdminSidebar
